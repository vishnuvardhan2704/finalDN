
'use server';

/**
 * @fileOverview A flow for finding and comparing sustainable product alternatives.
 * - findSustainableSwaps - The main exported function that will be called from the frontend.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { db } from '@/lib/firebase/admin';
import type { Product, Recommendation } from '@/lib/types';
import { Document, retrieve } from '@genkit-ai/ai/retriever';
import { SustainableSwapsInputSchema, SustainableSwapsOutputSchema } from '@/ai/schemas';
import type { SustainableSwapsInput, SustainableSwapsOutput } from '@/ai/schemas';
import { z } from 'zod';


// The main exported function that will be called from the frontend.
export async function findSustainableSwaps(input: SustainableSwapsInput): Promise<SustainableSwapsOutput> {
  return await findSustainableSwapsFlow(input);
}


// Internal prompt for generating the comparison text.
const comparisonPrompt = ai.definePrompt({
    name: 'comparisonPrompt',
    input: {
      schema: z.object({
        originalProduct: z.object({
            name: z.string(),
            carbonIntensity: z.number(),
        }),
        candidateProduct: z.object({
            name: z.string(),
            carbonIntensity: z.number(),
            description: z.string(),
        })
      })
    },
    output: {
        schema: z.object({
            comparison: z.string(),
        })
    },
    prompt: `You are an expert in persuasive, concise writing for an e-commerce app focused on sustainability.

    Your task is to write a short, compelling paragraph (max 120 words) that convinces a user to swap the original product for a more sustainable alternative.
    
    - Original Product Name: {{{originalProduct.name}}}
    - Original Product Carbon Intensity: {{{originalProduct.carbonIntensity}}} kg CO₂e/kg
    
    - Candidate Product Name: {{{candidateProduct.name}}}
    - Candidate Product Carbon Intensity: {{{candidateProduct.carbonIntensity}}} kg CO₂e/kg
    - Candidate Product Description: {{{candidateProduct.description}}}
    
    Focus on the positive impact of the swap. Highlight the lower carbon footprint as the primary benefit. You can also draw from the candidate's description to mention other qualities (e.g., materials, features) but keep it brief and focused on the sustainability angle.
    
    Generate only the comparison paragraph.
    `,
    model: googleAI.model('gemini-1.5-pro'),
});


const findSustainableSwapsFlow = ai.defineFlow(
  {
    name: 'findSustainableSwapsFlow',
    inputSchema: SustainableSwapsInputSchema,
    outputSchema: SustainableSwapsOutputSchema,
  },
  async ({ productId }) => {
    console.log('[Flow] Starting: findSustainableSwapsFlow for productId:', productId);

    // 1. Fetch the original product from Firestore.
    const originalProductDoc = await db.collection('products').doc(productId).get();
    if (!originalProductDoc.exists) {
      console.error('[Flow] Original product not found:', productId);
      throw new Error('Original product not found.');
    }
    const originalProduct = { id: originalProductDoc.id, ...originalProductDoc.data() } as Product;
    console.log('[Flow] Fetched original product:', originalProduct.name);

    // 2. Fetch all other products in the same category.
    const candidatesSnapshot = await db.collection('products').where('category', '==', originalProduct.category).get();
    const allCategoryProducts: Product[] = candidatesSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Product))
      .filter(p => p.id !== originalProduct.id); // Exclude the original product
    console.log(`[Flow] Fetched ${allCategoryProducts.length} candidate products from category: ${originalProduct.category}`);

    if (allCategoryProducts.length === 0) {
        console.log('[Flow] No other products in this category to compare.');
        return [];
    }

    // 3. Use an embedding model to find the most similar products.
    const documents = allCategoryProducts.map(p => Document.fromText(p.description, p));
    
    const similarDocs = await retrieve({
      documents,
      options: {
        query: originalProduct.description,
        embedder: { embedder: googleAI.model('text-embedding-004') },
        k: 4,
      }
    });
    
    const similarProducts = similarDocs.map(doc => doc.metadata as Product);
    console.log(`[Flow] Found ${similarProducts.length} similar products via embeddings.`);

    // 4. Filter for swaps that are more sustainable (lower carbon intensity).
    const sustainableSwaps = similarProducts.filter(p => p.carbonIntensity < originalProduct.carbonIntensity);
    console.log(`[Flow] Filtered down to ${sustainableSwaps.length} sustainable swaps.`);
    
    if (sustainableSwaps.length === 0) {
        return [];
    }
    
    // 5. Generate comparisons for the sustainable swaps.
    const recommendations: Recommendation[] = [];

    for (const swap of sustainableSwaps) {
        try {
            const { output } = await comparisonPrompt({
                originalProduct: { name: originalProduct.name, carbonIntensity: originalProduct.carbonIntensity },
                candidateProduct: { name: swap.name, carbonIntensity: swap.carbonIntensity, description: swap.description },
            });

            if (output) {
                 // Calculate Eco Creds (1-5 points)
                const carbonDiff = originalProduct.carbonIntensity - swap.carbonIntensity;
                const percentageImprovement = (carbonDiff / originalProduct.carbonIntensity) * 100;
                let ecoCreds = 1;
                if (percentageImprovement > 50) ecoCreds = 5;
                else if (percentageImprovement > 30) ecoCreds = 4;
                else if (percentageImprovement > 20) ecoCreds = 3;
                else if (percentageImprovement > 10) ecoCreds = 2;


                recommendations.push({
                    ...swap,
                    comparison: output.comparison,
                    ecoCreds: ecoCreds,
                });
            }
        } catch(e) {
            console.error(`[Flow] Failed to generate comparison for ${swap.name}`, e);
            // Continue to the next swap
        }
    }
    
    // 6. Sort by sustainability (lowest carbon intensity first) and return.
    recommendations.sort((a, b) => a.carbonIntensity - b.carbonIntensity);
    console.log('[Flow] Completed successfully. Returning recommendations:', recommendations.length);
    return recommendations;
  }
);
