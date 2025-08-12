
"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"; 
import { auth, db } from "@/lib/firebase/client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


export default function SignupPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        name: fullName,
        email: user.email,
        points: 0,
        avatar: `https://i.pravatar.cc/150?u=${user.uid}` // Simple unique avatar
      });

      router.push("/")
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center p-4">
       <div className="absolute inset-0 -z-10 h-full w-full bg-background">
        <div className="absolute inset-0 bg-grid-zinc-700/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" />
         <div 
            className="absolute -top-1/2 left-0 right-0 h-[200%] w-full animate-aurora rounded-full"
            style={{
              backgroundImage: 'radial-gradient(100% 100% at 50% 0%, hsl(var(--primary)/.15) 0%, hsl(var(--accent)/.1) 50%, transparent 100%)'
            }}
          />
       </div>

      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">Get Started Now</CardTitle>
          <CardDescription className="text-muted-foreground">
            Create your account to start your sustainable journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full-name">Name</Label>
              <Input
                id="full-name"
                placeholder="Max Robinson"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
                I agree to the EcoSwap <Link href="#" className="underline">terms & policy</Link>.
              </Label>
            </div>
            <Button type="submit" className="w-full !mt-8" size="lg" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Signup'}
            </Button>
          </form>
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-border/50"></div>
            <span className="mx-4 text-xs text-muted-foreground">Or</span>
            <div className="flex-grow border-t border-border/50"></div>
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
