"use client";

import ProductGrid from '@/components/product/product-grid';
import withAuth from '@/hooks/with-auth';

function Home() {
  return (
    <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-background">
          <div className="absolute inset-0 bg-grid-zinc-700/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"></div>
          <div 
            className="absolute -top-1/2 left-0 right-0 h-[200%] w-full animate-aurora rounded-full"
            style={{
              backgroundImage: 'radial-gradient(100% 100% at 50% 0%, hsl(var(--primary)/.15) 0%, hsl(var(--accent)/.1) 50%, transparent 100%)'
            }}
          />
        </div>
        <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                Find Your Sustainable Swap
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                Keep shopping and swapping for a better cause.
                </p>
            </header>
            <ProductGrid />
        </div>
    </div>
  );
}

export default withAuth(Home);
