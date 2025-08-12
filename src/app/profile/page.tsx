
"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import withAuth from "@/hooks/with-auth";
import { useProfile } from "@/hooks/use-profile";
import { Award } from "lucide-react";

function ProfilePage() {
    const { user: authUser } = useAuth();
    const { currentUser } = useProfile();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center text-center">
                <Avatar className="h-28 w-28 border-4 border-primary mb-4">
                    <AvatarImage src={currentUser?.avatar} alt="User Avatar" />
                    <AvatarFallback>{currentUser?.name?.charAt(0) ?? 'U'}</AvatarFallback>
                </Avatar>
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                    {currentUser?.name ?? authUser?.email}
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Keep up the great work for our planet!
                </p>

                <Card className="mt-8 w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                            <Award className="h-6 w-6 text-primary" />
                            Your Eco Creds
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-6xl font-bold text-center font-mono text-primary">
                            {currentUser?.points.toLocaleString() ?? 0}
                        </div>
                        <p className="text-center text-muted-foreground mt-2">
                            Lifetime Points
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default withAuth(ProfilePage);
