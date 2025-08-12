
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product, Recommendation } from '@/lib/types';

// Define a new type for items in the cart, which includes the swap flag and eco-creds
interface CartItem extends Product {
  isSustainableSwap?: boolean;
  ecoCreds?: number;
}

interface CartContextType {
  cart: CartItem[];
  totalItems: number;
  addToCart: (product: Product | Recommendation, isSustainableSwap?: boolean) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage on initial render
    try {
        const savedCart = localStorage.getItem('ecoswap_cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        setCart([]); // Reset to empty array on error
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    if (typeof window !== 'undefined') {
        localStorage.setItem('ecoswap_cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product: Product | Recommendation, isSustainableSwap: boolean = false) => {
    setCart((prevCart) => {
        // Prevent adding duplicates
        if (prevCart.find(item => item.id === product.id)) {
            return prevCart;
        }
        
        const newCartItem: CartItem = { 
            ...product, 
            isSustainableSwap,
            ecoCreds: (product as Recommendation).ecoCreds || 0
        };

        return [...prevCart, newCartItem];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (productId: string) => {
    return cart.some(item => item.id === productId);
  };

  return (
    <CartContext.Provider value={{ cart, totalItems: cart.length, addToCart, removeFromCart, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
