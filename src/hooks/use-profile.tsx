
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User as UserData } from '@/lib/types';
import { useAuth } from './use-auth';
import { db } from '@/lib/firebase/client';
import { doc, onSnapshot, setDoc, increment } from 'firebase/firestore';

interface ProfileContextType {
    currentUser: UserData | undefined;
    addPoints: (userId: string, points: number) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const { user: authUser } = useAuth();
    const [currentUser, setCurrentUser] = useState<UserData | undefined>(undefined);

    useEffect(() => {
        if (!authUser) {
            setCurrentUser(undefined);
            return;
        }

        const userRef = doc(db, 'users', authUser.uid);
        const unsubscribe = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                setCurrentUser({ id: doc.id, ...doc.data() } as UserData);
            } else {
                // This might happen briefly if the document hasn't been created yet
                // after signup. We can set a default state or leave it undefined.
                setCurrentUser(undefined);
            }
        }, (error) => {
            console.error("Firestore snapshot error:", error);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [authUser]);

    const addPoints = async (userId: string, points: number) => {
        if (!userId) {
            console.error("User ID is required to add points.");
            return;
        }
        const userRef = doc(db, 'users', userId);
        try {
            await setDoc(userRef, {
                points: increment(points)
            }, { merge: true });
        } catch (error) {
            console.error("Error updating points:", error);
        }
    };

    return (
        <ProfileContext.Provider value={{ currentUser, addPoints }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};
