
'use server';

import type { Product, Recommendation } from '@/lib/types';
import { db } from '@/lib/firebase/admin';
import { performSemanticSearch, generatePersuasiveComparison } from '../services/gemini-service';

/**
 * Find sustainable alternatives for a given product using Firestore data
 * 1. Get all products in same category from Firestore
 * 2. Use Gemini API for semantic search to find top 4 similar products
 * 3. Select top 2 most sustainable from those 4
 * 4. Generate persuasive comparisons using Gemini API
 */
export async function findSustainableSwaps(input: { productId: string }): Promise<{ recommendations: Recommendation[] }> {
  try {
    console.log('[Swaps] Starting search for product ID:', input.productId);
    
    // Step 1: Get the original product from Firestore
    const originalProduct = await getProductFromFirestore(input.productId);
    if (!originalProduct) {
      console.log('[Swaps] Product not found in Firestore:', input.productId);
      return { recommendations: [] };
    }
    
    console.log('[Swaps] Found original product:', originalProduct.name, 'Category:', originalProduct.category);
    
    // Step 2: Get all products in the same category from Firestore
    const categoryProducts = await getProductsByCategory(originalProduct.category);
    if (categoryProducts.length === 0) {
      console.log('[Swaps] No products found in category:', originalProduct.category);
      return { recommendations: [] };
    }
    
    console.log('[Swaps] Found', categoryProducts.length, 'products in category:', originalProduct.category);
    
    // Step 3: Use Gemini API for semantic search to find top 5 similar products
    const similarProducts = await performSemanticSearch(originalProduct, categoryProducts);
    console.log('[Swaps] Top 5 semantically similar products:', similarProducts.map(p => p.name));
    
    // Safety check: ensure original product is not in recommendations
    const filteredSimilarProducts = similarProducts.filter(p => p.id !== originalProduct.id);
    if (filteredSimilarProducts.length === 0) {
      console.log('[Swaps] No similar products found after filtering');
      return { recommendations: [] };
    }
    
    // Step 4: Among the top 5 similar products, select top 2 most sustainable
    const sustainableAlternatives = selectMostSustainable(filteredSimilarProducts, originalProduct);
    console.log('[Swaps] Top 2 sustainable alternatives from similar products:', sustainableAlternatives.map(p => p.name));
    
    if (sustainableAlternatives.length === 0) {
      return { recommendations: [] };
    }
    
    // Step 5: Generate persuasive comparisons using Gemini API
    const recommendations = await Promise.all(
      sustainableAlternatives.map(async (alternative) => {
        const comparison = await generatePersuasiveComparison(originalProduct, alternative);
        const ecoCreds = calculateEcoCreds(alternative, originalProduct);
        
        return {
          ...alternative,
          comparison,
          ecoCreds,
        };
      })
    );
    
    console.log(`[Swaps] ✅ 2-STEP PROCESS COMPLETED:`);
    console.log(`[Swaps] Step 1 - Semantic Search: Found ${similarProducts.length} similar products`);
    console.log(`[Swaps] Step 2 - Sustainability: Selected top 2 from similar products`);
    console.log(`[Swaps] Final recommendations:`, recommendations.map(r => r.name));
    return { recommendations };
    
  } catch (error) {
    console.error('[Swaps] Error finding sustainable swaps:', error);
    return { recommendations: [] };
  }
}

/**
 * Get product from Firestore by ID
 */
async function getProductFromFirestore(productId: string): Promise<Product | null> {
  try {
    const productSnap = await db.collection('products').doc(productId).get();
    if (!productSnap.exists) {
      console.log('[Swaps] Product document does not exist:', productId);
      return null;
    }
    const productData = productSnap.data() as any;
    return {
      id: productSnap.id,
      ...productData,
    } as Product;
  } catch (error) {
    console.error('[Swaps] Error fetching product from Firestore:', error);
    return null;
  }
}

/**
 * Get all products in a specific category from Firestore
 */
async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const snapshot = await db.collection('products').where('category', '==', category).get();
    const products = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...(doc.data() as any),
    } as Product));
    console.log(`[Swaps] Found ${products.length} products in category '${category}':`, products.map((p: Product) => p.name));
    return products;
  } catch (error) {
    console.error('[Swaps] Error fetching products by category:', error);
    return [];
  }
}

/**
 * Select top 2 most sustainable products from similar products
 * This function ONLY works on products that have already been filtered by semantic similarity
 */
function selectMostSustainable(similarProducts: Product[], originalProduct: Product): Product[] {
  console.log(`[Sustainability] Analyzing ${similarProducts.length} semantically similar products for sustainability`);
  console.log(`[Sustainability] Products to analyze:`, similarProducts.map(p => `${p.name} (${p.category})`));
  
  const scoredProducts = similarProducts.map(product => {
    let sustainabilityScore = 0;
    
    // Carbon intensity scoring (60% weight)
    if (product.carbonIntensity && originalProduct.carbonIntensity) {
      if (product.carbonIntensity < originalProduct.carbonIntensity) {
        const improvement = (originalProduct.carbonIntensity - product.carbonIntensity) / originalProduct.carbonIntensity;
        sustainabilityScore += improvement * 60;
        console.log(`[Sustainability] ${product.name}: +${(improvement * 60).toFixed(1)} (carbon reduction: ${originalProduct.carbonIntensity} → ${product.carbonIntensity})`);
      } else {
        console.log(`[Sustainability] ${product.name}: +0 (no carbon improvement: ${originalProduct.carbonIntensity} → ${product.carbonIntensity})`);
      }
    } else {
      console.log(`[Sustainability] ${product.name}: +0 (missing carbon data)`);
    }
    
    // Organic bonus (25% weight)
    if (product.isOrganic) {
      sustainabilityScore += 25;
      console.log(`[Sustainability] ${product.name}: +25 (organic bonus)`);
    } else {
      console.log(`[Sustainability] ${product.name}: +0 (not organic)`);
    }
    
    // Category-specific bonuses (15% weight)
    if (product.category === 'Produce' || product.category === 'Grains') {
      sustainabilityScore += 15;
      console.log(`[Sustainability] ${product.name}: +15 (produce/grains bonus)`);
    } else if (product.category === 'Home Goods' || product.category === 'Electronics') {
      sustainabilityScore += 10;
      console.log(`[Sustainability] ${product.name}: +10 (home/electronics bonus)`);
    } else {
      console.log(`[Sustainability] ${product.name}: +0 (no category bonus)`);
    }
    
    console.log(`[Sustainability] ${product.name}: TOTAL SUSTAINABILITY SCORE = ${sustainabilityScore.toFixed(1)}`);
    
    return { product, sustainabilityScore };
  });
  
  // Sort by sustainability score and take top 2
  scoredProducts.sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);
  const top2 = scoredProducts.slice(0, 2).map(item => item.product);
  
  console.log(`[Sustainability] Top 2 sustainable products:`, top2.map(p => p.name));
  return top2;
}

/**
 * Calculate eco creds based on sustainability improvement
 */
function calculateEcoCreds(alternative: Product, original: Product): number {
  let creds = 1;
  
  // Carbon reduction scoring
  if (alternative.carbonIntensity && original.carbonIntensity) {
    if (alternative.carbonIntensity < original.carbonIntensity) {
      const improvement = (original.carbonIntensity - alternative.carbonIntensity) / original.carbonIntensity;
      if (improvement >= 0.5) creds = 5;
      else if (improvement >= 0.3) creds = 4;
      else if (improvement >= 0.2) creds = 3;
      else if (improvement >= 0.1) creds = 2;
    }
  }
  
  // Organic bonus
  if (alternative.isOrganic) {
    creds = Math.min(creds + 1, 5);
  }
  
  return creds;
}
