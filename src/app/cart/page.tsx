
"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingCart, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import withAuth from "@/hooks/with-auth";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/hooks/use-auth";

function CartPage() {
  const { cart, removeFromCart, clearCart, totalItems } = useCart();
  const { addPoints } = useProfile();
  const { user } = useAuth();
  const { toast } = useToast();

  const pointsEarned = cart.reduce((sum, item) => sum + (item.ecoCreds || 0), 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if(cart.length === 0) {
      toast({
        variant: "destructive",
        title: "Your cart is empty",
        description: "Add some products to your cart before checking out.",
      });
      return;
    }
    
    // Add points to profile in Firestore
    if (pointsEarned > 0 && user) {
      await addPoints(user.uid, pointsEarned);
    }

    toast({
      title: "Checkout Successful!",
      description: `Thank you for your purchase! You earned ${pointsEarned} Eco Creds.`,
    });
    clearCart();
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Your Shopping Cart</h1>
        <p className="mt-2 text-lg text-muted-foreground">You have {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart.</p>
      </header>

      {cart.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Cart Items</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6">
                        {cart.map((item) => (
                            <div key={item.id} className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
                            <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                />
                                {item.isSustainableSwap && (
                                    <div className="absolute top-0 right-0 bg-primary/80 text-primary-foreground p-1 rounded-bl-md">
                                        <Award className="h-4 w-4" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                Carbon Intensity: {item.carbonIntensity} kg CO₂e/kg
                                </p>
                                <p className="font-mono font-semibold text-primary">${item.price.toFixed(2)}</p>
                                {item.isSustainableSwap && <p className="text-xs text-accent font-medium">Sustainable Swap (+{item.ecoCreds} Creds)</p>}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(item.id)}
                                className="text-muted-foreground hover:text-destructive"
                            >
                                <Trash2 className="h-5 w-5" />
                                <span className="sr-only">Remove item</span>
                            </Button>
                            </div>
                        ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1">
                <Card className="sticky top-20">
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between text-muted-foreground">
                            <span>Eco Creds Earned</span>
                            <span className="text-primary font-semibold">{pointsEarned}</span>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                         <Button onClick={handleCheckout} size="lg" className="w-full mt-6">
                            Proceed to Checkout
                        </Button>
                    </CardContent>
                    <CardFooter>
                         <Button variant="outline" className="w-full" onClick={() => clearCart()}>Clear Cart</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-muted rounded-lg">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">Your cart is empty</h3>
            <p className="text-muted-foreground mt-2">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Button asChild className="mt-6">
              <Link href="/">Start Shopping</Link>
            </Button>
        </div>
      )}
    </div>
  );
}


export default withAuth(CartPage);
