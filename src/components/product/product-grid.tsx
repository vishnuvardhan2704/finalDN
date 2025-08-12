
'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Product } from '@/lib/types';
import { ProductCard } from './product-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '../ui/label';

export default function ProductGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Try to fetch from Firebase first
        console.log('[ProductGrid] Attempting to fetch from Firebase...');
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data(),
          } as Product
        });
        
        if (productsData.length > 0) {
          console.log('[ProductGrid] Successfully fetched', productsData.length, 'products from Firebase');
          setProducts(productsData);
        } else {
          console.warn('[ProductGrid] Firebase returned no products');
          setProducts([]);
        }
      } catch (error) {
        console.warn('Firebase fetch failed:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Search filter
    if (searchQuery) {
        filtered = filtered.filter(
            (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Sorting
    switch (sortOrder) {
      case 'co2_asc':
        return [...filtered].sort((a, b) => a.carbonIntensity - b.carbonIntensity);
      case 'price_asc':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price_desc':
        return [...filtered].sort((a, b) => b.price - a.price);
      default:
        // Default sort by name for consistency
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [products, searchQuery, categoryFilter, sortOrder]);

  // Get unique categories from products for the filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    return uniqueCategories.sort();
  }, [products]);
  
  if (isLoading) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-[23rem] w-full" />
            ))}
        </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/50 p-4 rounded-lg border">
        <div className="relative w-full sm:max-w-xs">
            <Label htmlFor="search-input" className="sr-only">Search</Label>
            <Input
                id="search-input"
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-base bg-background"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
            <div className="grid gap-1.5 w-full">
                <Label htmlFor="category-filter">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger id='category-filter' className="w-full sm:w-[180px] bg-background">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-1.5 w-full">
                <Label htmlFor="sort-order">Sort By</Label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger id='sort-order' className="w-full sm:w-[180px] bg-background">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="co2_asc">CO₂ Intensity (Low-High)</SelectItem>
                        <SelectItem value="price_asc">Price (Low-High)</SelectItem>
                        <SelectItem value="price_desc">Price (High-Low)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
      </div>

      {filteredAndSortedProducts.length > 0 ? (
        <div 
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredAndSortedProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
          <p className="text-sm text-muted-foreground/70">Try adjusting your filters or search term.</p>
        </div>
      )}
    </div>
  );
}
