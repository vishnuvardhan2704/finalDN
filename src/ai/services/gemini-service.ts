import { GoogleGenerativeAI } from '@google/generative-ai';

// Dual Gemini API keys for load balancing
const GEMINI_API_KEY_SEARCH = process.env.GEMINI_API_KEY_SEARCH;
const GEMINI_API_KEY_COMPARE = process.env.GEMINI_API_KEY_COMPARE;
const GEMINI_API_KEY_FALLBACK = process.env.GEMINI_API_KEY;

// Initialize Gemini instances
const genAI_Search = new GoogleGenerativeAI(GEMINI_API_KEY_SEARCH || GEMINI_API_KEY_FALLBACK || '');
const genAI_Compare = new GoogleGenerativeAI(GEMINI_API_KEY_COMPARE || GEMINI_API_KEY_FALLBACK || '');

// Models
const SEARCH_MODEL = 'text-embedding-004'; // For semantic search
const COMPARE_MODEL = 'gemini-1.5-pro'; // For persuasive comparisons

/**
 * Generate persuasive comparison using Gemini API
 * Uses the second Gemini API key for gemini-1.5-pro model
 * Implements the exact prompt structure requested by the user
 */
export async function generatePersuasiveComparison(
  originalProduct: any,
  alternativeProduct: any
): Promise<string> {
  try {
    if (!GEMINI_API_KEY_COMPARE && !GEMINI_API_KEY_FALLBACK) {
      throw new Error('No Gemini API key configured for persuasive comparisons');
    }

    const model = genAI_Compare.getGenerativeModel({ model: COMPARE_MODEL });

    // Build the prompt based on available data
    let prompt = buildComparisonPrompt(originalProduct, alternativeProduct);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const comparison = response.text();

    return comparison || generateFallbackComparison(originalProduct, alternativeProduct);
  } catch (error) {
    console.error('[Gemini] Error generating persuasive comparison:', error);
    return generateFallbackComparison(originalProduct, alternativeProduct);
  }
}

/**
 * Build the comparison prompt based on available data
 * Implements the exact structure requested by the user
 */
function buildComparisonPrompt(original: any, alternative: any): string {
  const hasCarbonData = original.carbonIntensity && alternative.carbonIntensity;
  
  if (hasCarbonData) {
    // SCENARIO 1: Carbon intensity and description available in DB
    return `You are an expert in persuasive, simple writing for an e-commerce app focused on sustainability.

TASK: Write a small paragraph (max 80 words) explaining in simpler words why the alternative product is better than the original product. Use the carbon intensity data and descriptions available in the database.

ORIGINAL PRODUCT:
- Name: ${original.name}
- Description: ${original.description}
- Carbon Intensity: ${original.carbonIntensity} kg CO₂e/kg
- Price: $${original.price}
- Category: ${original.category}
- Organic: ${original.isOrganic ? 'Yes' : 'No'}

SUSTAINABLE ALTERNATIVE:
- Name: ${alternative.name}
- Description: ${alternative.description}
- Carbon Intensity: ${alternative.carbonIntensity} kg CO₂e/kg
- Price: $${alternative.price}
- Category: ${alternative.category}
- Organic: ${alternative.isOrganic ? 'Yes' : 'No'}

REQUIREMENTS:
1. Use the carbon intensity data to show the environmental improvement
2. Explain in simple, everyday language why the alternative is better
3. Focus on the main benefits (carbon reduction, organic status, etc.)
4. Keep it concise and easy to understand
5. Make it persuasive but not overly technical

Generate only the comparison paragraph.`;
  } else {
    // SCENARIO 2: Carbon intensity not available - Use LCA methodology
    return `You are a life-cycle-assessment specialist and persuasive writer for a sustainable e-commerce platform.

TASK: Estimate Product Carbon Footprint (PCF) and generate a compelling comparison for two products using the 3-bucket LCA methodology.

METHODOLOGY (follow exactly):
1. Search open sources (academic LCAs, ecoinvent factors, ADEME, FAO, etc.) for typical emission factors that match the ingredients, packaging and energy types shown. Cite the factor source briefly.
2. Build a simplified inventory table: Activity × Emission-factor = Stage kg CO₂e.
3. Sum stages → Total PCF and divide by net weight to get carbon intensity.
4. If data for any ingredient, energy or end-of-life step are missing, substitute a reasonable industry average and flag it in "Key data gaps".
5. Calculate an uncertainty range (± 30 % if ≥ 2 assumptions made, ± 15 % otherwise).
6. Compare the resulting intensity with the peer-group median for similar products you can find (instant noodles, quick-cook pasta, soup sachets, etc.).

PRODUCTS TO COMPARE:
ORIGINAL: ${original.name} (${original.category})
Description: ${original.description}

ALTERNATIVE: ${alternative.name} (${original.category})
Description: ${alternative.description}

REQUIREMENTS:
1. Research and estimate carbon intensities for both products using the LCA methodology above
2. Generate a persuasive paragraph (max 80 words) encouraging the swap
3. Focus on environmental benefits and sustainability impact
4. Include specific carbon reduction percentages if possible
5. Mention any additional benefits (organic, local, etc.)
6. Use simple, everyday language that's easy to understand

OUTPUT FORMAT:
- comparison: Persuasive paragraph for the user
- carbonIntensityOriginal: Estimated kg CO₂e/kg
- carbonIntensityAlternative: Estimated kg CO₂e/kg
- methodology: Brief summary of research approach

Generate only the comparison paragraph.`;
  }
}

/**
 * Generate fallback comparison when Gemini API fails
 */
function generateFallbackComparison(original: any, alternative: any): string {
  const benefits = [];
  
  // Carbon reduction benefit
  if (alternative.carbonIntensity && original.carbonIntensity) {
    if (alternative.carbonIntensity < original.carbonIntensity) {
      const reduction = ((original.carbonIntensity - alternative.carbonIntensity) / original.carbonIntensity * 100).toFixed(0);
      benefits.push(`reduce your carbon footprint by ${reduction}%`);
    }
  }
  
  // Organic benefit
  if (alternative.isOrganic) {
    benefits.push('enjoy organic quality');
  }
  
  // Price benefit
  if (alternative.price < original.price) {
    benefits.push('save money');
  }
  
  const benefitsText = benefits.join(', ');
  
  return `Swap to ${alternative.name} and ${benefitsText}! This sustainable choice has a carbon intensity of ${alternative.carbonIntensity || 'estimated'} kg CO₂e/kg compared to ${original.carbonIntensity || 'estimated'} kg CO₂e/kg for ${original.name}. ${alternative.isOrganic ? 'Plus, it\'s organic!' : ''} Make a positive impact on the environment with this greener alternative.`;
}

/**
 * Perform semantic search using intelligent text analysis
 * Returns top 4 most similar products (excluding the original product)
 */
export async function performSemanticSearch(
  queryProduct: any,
  candidateProducts: any[]
): Promise<any[]> {
  try {
    // Filter out the original product first
    const otherProducts = candidateProducts.filter(p => p.id !== queryProduct.id);
    
    if (otherProducts.length === 0) {
      return [];
    }
    
    console.log('[Semantic Search] Query product:', queryProduct.name, 'Category:', queryProduct.category);
    console.log('[Semantic Search] Available products:', otherProducts.map(p => `${p.name} (${p.category})`));
    
    // Calculate semantic similarity scores using multiple factors
    const scoredProducts = otherProducts.map(product => {
      let totalScore = 0;
      
      // 1. CATEGORY MATCHING (40% weight) - Most important!
      if (product.category === queryProduct.category) {
        totalScore += 40;
        console.log(`[Semantic] ${product.name}: +40 (same category)`);
      } else {
        console.log(`[Semantic] ${product.name}: +0 (different category: ${product.category})`);
      }
      
      // 2. DESCRIPTION KEYWORD OVERLAP (35% weight)
      const keywordScore = calculateKeywordOverlap(
        queryProduct.description || '', 
        product.description || ''
      ) * 35;
      totalScore += keywordScore;
      console.log(`[Semantic] ${product.name}: +${keywordScore.toFixed(1)} (keyword overlap)`);
      
      // 3. NAME SIMILARITY (15% weight)
      const nameScore = calculateTextSimilarity(
        queryProduct.name || '', 
        product.name || ''
      ) * 15;
      totalScore += nameScore;
      console.log(`[Semantic] ${product.name}: +${nameScore.toFixed(1)} (name similarity)`);
      
      // 4. SEMANTIC RELATIONSHIP BONUS (10% weight)
      const semanticBonus = calculateSemanticRelationship(
        queryProduct.name || '',
        queryProduct.description || '',
        product.name || '',
        product.description || ''
      ) * 10;
      totalScore += semanticBonus;
      console.log(`[Semantic] ${product.name}: +${semanticBonus.toFixed(1)} (semantic bonus)`);
      
      console.log(`[Semantic] ${product.name}: TOTAL SCORE = ${totalScore.toFixed(1)}`);
      
      return { product, score: totalScore };
    });
    
    // Sort by total score (highest first)
    scoredProducts.sort((a, b) => b.score - a.score);
    
    // Only return products with meaningful similarity (above threshold)
    const meaningfulProducts = scoredProducts.filter(item => item.score > 15); // Minimum 15% similarity
    
    console.log('[Semantic Search] Final scores:', scoredProducts.map(item => 
      `${item.product.name}: ${item.score.toFixed(1)}%`
    ));
    
    console.log('[Semantic Search] Meaningful products:', meaningfulProducts.map(item => 
      `${item.product.name} (${item.score.toFixed(1)}%)`
    ));
    
    console.log('[Semantic Search] Returning top 5 most similar products for sustainability analysis');
    return meaningfulProducts.slice(0, 5).map(item => item.product);
    
  } catch (error) {
    console.error('[Gemini] Error in semantic search:', error);
    // Fallback: filter out original product and return first 4
    return candidateProducts.filter(p => p.id !== queryProduct.id).slice(0, 4);
  }
}

/**
 * Calculate keyword overlap between two descriptions
 * Improved to focus on meaningful words and semantic relationships
 */
function calculateKeywordOverlap(desc1: string, desc2: string): number {
  // Clean and normalize descriptions
  const cleanDesc1 = desc1.toLowerCase().replace(/[^\w\s]/g, ' ');
  const cleanDesc2 = desc2.toLowerCase().replace(/[^\w\s]/g, ' ');
  
  // Split into words and filter meaningful ones
  const words1 = cleanDesc1.split(/\s+/).filter(w => w.length > 2);
  const words2 = cleanDesc2.split(/\s+/).filter(w => w.length > 2);
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  // Find common meaningful words
  const commonWords = words1.filter(word => words2.includes(word));
  
  // Calculate overlap percentage
  const overlap = commonWords.length / Math.max(words1.length, words2.length);
  
  console.log(`[Keyword] Common words: [${commonWords.join(', ')}]`);
  console.log(`[Keyword] Overlap: ${(overlap * 100).toFixed(1)}%`);
  
  return overlap;
}

/**
 * Calculate text similarity between two strings
 * Improved to handle product names better
 */
function calculateTextSimilarity(text1: string, text2: string): number {
  const cleanText1 = text1.toLowerCase().replace(/[^\w\s]/g, ' ');
  const cleanText2 = text2.toLowerCase().replace(/[^\w\s]/g, ' ');
  
  const words1 = cleanText1.split(/\s+/).filter(w => w.length > 1);
  const words2 = cleanText2.split(/\s+/).filter(w => w.length > 1);
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  const commonWords = words1.filter(word => words2.includes(word));
  const similarity = commonWords.length / Math.max(words1.length, words2.length);
  
  console.log(`[Name] Common words: [${commonWords.join(', ')}]`);
  console.log(`[Name] Similarity: ${(similarity * 100).toFixed(1)}%`);
  
  return similarity;
}

/**
 * Calculate semantic relationship bonus
 * Identifies related products even with different names
 */
function calculateSemanticRelationship(
  name1: string, desc1: string, 
  name2: string, desc2: string
): number {
  const text1 = `${name1} ${desc1}`.toLowerCase();
  const text2 = `${name2} ${desc2}`.toLowerCase();
  
  // Define semantic relationships (food groups, product types, etc.)
  const semanticGroups = {
    'tomato': ['tomato', 'tomatoes', 'paste', 'sauce', 'ketchup', 'juice'],
    'fruit': ['apple', 'banana', 'orange', 'grape', 'berry', 'citrus'],
    'vegetable': ['carrot', 'lettuce', 'spinach', 'kale', 'broccoli', 'cauliflower'],
    'dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'ice cream'],
    'meat': ['beef', 'chicken', 'pork', 'lamb', 'turkey', 'fish'],
    'beverage': ['water', 'juice', 'soda', 'tea', 'coffee', 'milk'],
    'container': ['bottle', 'jar', 'can', 'box', 'bag', 'container'],
    'sweetener': ['sugar', 'honey', 'syrup', 'agave', 'stevia', 'sweetener']
  };
  
  let maxScore = 0;
  
  // Check each semantic group
  for (const [group, keywords] of Object.entries(semanticGroups)) {
    const hasGroup1 = keywords.some(keyword => text1.includes(keyword));
    const hasGroup2 = keywords.some(keyword => text2.includes(keyword));
    
    if (hasGroup1 && hasGroup2) {
      // Both products belong to the same semantic group
      const score = 1.0;
      console.log(`[Semantic] Both products in "${group}" group: +${(score * 100).toFixed(1)}%`);
      maxScore = Math.max(maxScore, score);
    }
  }
  
  return maxScore;
}
