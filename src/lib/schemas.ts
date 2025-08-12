
/**
 * @fileOverview This file contains all Zod schemas for the application's AI flows.
 * Consolidating schemas here allows for easier management and reuse across different parts of the app.
 */

import { z } from 'zod';

/**
 * Zod schema for the input of the `findSustainableSwaps` flow.
 */
export const SustainableSwapsInputSchema = z.object({
  productId: z.string().describe('The ID of the product to find swaps for.'),
});

// Infer the TypeScript type from the Zod schema.
export type SustainableSwapsInput = z.infer<typeof SustainableSwapsInputSchema>;

/**
 * Zod schema for the output of the `findSustainableSwaps` flow.
 * This defines the shape of the recommendation objects that the AI will generate.
 */
export const SustainableSwapsOutputSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    image: z.string(),
    carbonIntensity: z.number(),
    isOrganic: z.boolean(),
    category: z.enum(['Clothing', 'Electronics', 'Groceries', 'Home Goods']),
    price: z.number(),
    comparison: z.string().describe('A short, compelling paragraph (<= 120 words) comparing this product to the original, highlighting its sustainable advantages.'),
    ecoCreds: z.number().describe('The number of eco credits awarded for swapping, from 1 to 5.'),
  })
);

// Infer the TypeScript type from the Zod schema.
export type SustainableSwapsOutput = z.infer<typeof SustainableSwapsOutputSchema>;
