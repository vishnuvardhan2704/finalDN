
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Leaf, Zap, ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { RecommendationDialog } from './recommendation-dialog';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // Helper to extract keywords from product name for the hint
  const generateHint = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 2)
      .join(' ');
  };

  return (
    <>
      <div className="group relative">
        <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-primary/20 group-hover:shadow-lg group-hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary/50 to-accent/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-border-pulse" />
          <div className="relative">
            <CardHeader className="p-0 relative overflow-hidden rounded-t-lg">
                <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={400}
                className="object-cover w-full h-48 transition-transform duration-300 ease-in-out group-hover:scale-105"
                data-ai-hint={generateHint(product.name)}
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Badge variant="secondary" className="gap-1.5 pl-1.5 pr-2.5 py-1 backdrop-blur-sm bg-background/60 border-border/50">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                    {product.carbonIntensity} kg CO2e/kg
                    </Badge>
                    {product.isOrganic && (
                    <Badge variant="secondary" className="gap-1.5 pl-1.5 pr-2.5 py-1 bg-accent/90 text-accent-foreground backdrop-blur-sm">
                        <Leaf className="h-3.5 w-3.5" />
                        Organic
                    </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow flex flex-col">
                <div className='flex justify-between items-start mb-3'>
                  <Badge variant="outline">{product.category}</Badge>
                  <p className="text-xl font-semibold font-mono text-primary">${product.price.toFixed(2)}</p>
                </div>
                <CardTitle className="text-lg leading-snug mb-2 flex-grow">{product.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground line-clamp-3">{product.description}</CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0 mt-auto">
                <Button className="w-full" onClick={() => setIsDialogOpen(true)}>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
            </CardFooter>
          </div>
        </Card>
      </div>
      <RecommendationDialog 
        product={product}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
