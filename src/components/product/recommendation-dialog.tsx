
'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Product, Recommendation } from '@/lib/types';
import { findSustainableSwaps } from '@/ai/flows/find-sustainable-swaps';
import { Skeleton } from '../ui/skeleton';
import { Award, Leaf, Zap, ArrowRight, ShoppingCart, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { useCart } from '@/hooks/use-cart';

interface RecommendationDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RecommendationDialog({ product, isOpen, onClose }: RecommendationDialogProps) {
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load recommendations when dialog opens
  useEffect(() => {
    if (isOpen && product) {
      loadRecommendations();
    }
  }, [isOpen, product]);

  const loadRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      console.log('[Dialog] Loading recommendations for:', product?.name);
      const result = await findSustainableSwaps({ productId: product!.id });
      
      if (result?.recommendations?.length > 0) {
        setRecommendations(result.recommendations);
        console.log('[Dialog] Found recommendations:', result.recommendations.length);
      } else {
        setError("Great choice! This product is already one of the most sustainable options available.");
      }
    } catch (err) {
      console.error('[Dialog] Failed to load recommendations:', err);
      setError("We're having trouble loading recommendations right now. You can still add the original item to your cart.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOriginal = () => {
    if (product) {
      addToCart(product);
      toast({
        title: 'Added to Cart! 🛒',
        description: `${product.name} has been added to your cart.`,
      });
    }
    onClose();
  };

  const handleSwap = (swap: Recommendation) => {
    addToCart(swap, true);
    toast({
      title: `Swapped & Saved! 🌱 +${swap.ecoCreds} Eco Creds`,
      description: `${swap.name} has been added to your cart. You'll earn Eco Creds at checkout!`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader className="text-center shrink-0">
          <DialogTitle className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-green-500" />
            Consider a Greener Choice
            <Sparkles className="h-8 w-8 text-green-500" />
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            Swap to a more sustainable option and earn Eco Creds! 🌍
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-6 px-2">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}

          {error && !isLoading && (
            <div className="text-center py-12 px-6 rounded-xl bg-gradient-to-br from-green-50 to-blue-50 border-2 border-dashed border-green-200">
              <Leaf className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">No Swaps Needed!</h3>
              <p className="text-green-700">{error}</p>
            </div>
          )}

          {!isLoading && !error && recommendations.length > 0 && (
            <div className="space-y-4">
              {recommendations.map((swap) => (
                <div key={swap.id} className="group p-6 rounded-xl border-2 border-green-100 bg-gradient-to-r from-green-50 to-white hover:border-green-300 hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Product Image */}
                    <div className="relative h-32 w-32 rounded-lg overflow-hidden flex-shrink-0 border-2 border-green-200">
                      <Image src={swap.image} alt={swap.name} fill className="object-cover" />
                      {swap.isOrganic && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-green-600 text-white text-xs">
                            <Leaf className="h-3 w-3 mr-1" />
                            Organic
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                          {swap.name}
                        </h3>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">${swap.price.toFixed(2)}</p>
                          <Badge variant="outline" className="gap-1 mt-1">
                            <Zap className="h-3 w-3 text-orange-500" />
                            {swap.carbonIntensity} kg CO₂e/kg
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">{swap.comparison}</p>
                      
                      <div className="flex items-center gap-4">
                        <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2">
                          <Award className="h-4 w-4 mr-2" />
                          {swap.ecoCreds} Eco Creds
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {swap.category} • {swap.isOrganic ? 'Organic' : 'Conventional'}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      <Button 
                        onClick={() => handleSwap(swap)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <ArrowRight className="mr-2 h-5 w-5" />
                        Swap & Save
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-6 shrink-0">
          <Button 
            variant="outline" 
            onClick={handleAddOriginal}
            className="w-full sm:w-auto px-8 py-3 text-lg"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Keep Original Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
