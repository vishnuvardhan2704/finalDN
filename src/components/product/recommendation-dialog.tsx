
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
import { Award, Leaf, Zap, ArrowRight, ShoppingCart } from 'lucide-react';
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

  useEffect(() => {
    if (isOpen && product) {
      const fetchRecommendations = async () => {
        setIsLoading(true);
        setError(null);
        setRecommendations([]);
        try {
          console.log('[Dialog] Fetching recommendations for:', product.id);
          const result = await findSustainableSwaps({ productId: product.id });
          if (result && result.length > 0) {
            setRecommendations(result);
          } else {
            setError("We couldn't find a more sustainable swap for this item. You've already picked a great option!");
          }
        } catch (err: any) {
          console.error('[Dialog] Could not fetch recommendations:', err);
          setError("We couldn't load recommendations right now. This may be a temporary issue with the AI service. Please feel free to add the original item to your cart.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecommendations();
    }
  }, [isOpen, product]);

  const handleContinue = () => {
    if (product) {
      addToCart(product);
      toast({
        title: 'Added to Cart!',
        description: `${product.name} has been added to your cart.`,
      });
    }
    onClose();
  };

  const handleSwap = (swap: Recommendation) => {
    // Points are now awarded at checkout to prevent issues if the user clears their cart.
    addToCart(swap, true); 
    toast({
      title: `Swapped & Saved! (+${swap.ecoCreds} Creds)`,
      description: `${swap.name} has been added to your cart. You'll receive your Eco Creds upon checkout.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold tracking-tight text-center flex items-center justify-center gap-2">
            <Leaf className="h-7 w-7 text-primary" />
            Wait! Consider a Greener Choice
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            You can earn Eco Creds by swapping to a more sustainable product.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 max-h-[60vh] overflow-y-auto px-1">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}

          {error && !isLoading && (
            <div className="text-center py-8 px-4 rounded-lg bg-muted/50 border border-dashed">
                <p className="font-semibold text-lg">Could Not Load Swaps</p>
                <p className="text-muted-foreground mt-2">{error}</p>
            </div>
          )}

          {!isLoading && !error && recommendations.length > 0 && (
            <div className="space-y-4">
              {recommendations.map((swap) => (
                <div key={swap.id} className="p-4 rounded-lg border bg-background flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                        <Image src={swap.image} alt={swap.name} fill className="object-cover" />
                    </div>
                    <div className="flex-grow">
                        <h4 className="font-bold text-lg">{swap.name}</h4>
                        <div className="flex gap-4 text-xs text-muted-foreground my-1">
                            <Badge variant="secondary" className="gap-1"><Zap className="h-3 w-3 text-primary" />{swap.carbonIntensity} kg CO₂e/kg</Badge>
                            {swap.isOrganic && <Badge variant="secondary" className="gap-1"><Leaf className="h-3 w-3 text-accent" />Organic</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{swap.comparison}</p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                         <Button onClick={() => handleSwap(swap)}>
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Swap & Earn
                        </Button>
                        <Badge variant="default" className="gap-1.5 pl-2 pr-2.5 py-1">
                            <Award className="h-3.5 w-3.5" />
                            {swap.ecoCreds} Eco Creds
                        </Badge>
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleContinue} className="w-full sm:w-auto">
            <ShoppingCart className="mr-2 h-4 w-4" />
            No Thanks, Add Original Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
