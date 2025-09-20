"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth } from './firebase';
// Remove direct database import from client-side context

interface AuthContextType {
    currentUser: User | null;
    signup: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    function signup(email: string, password: string) {
        return createUserWithEmailAndPassword(auth, email, password).then(() => {
            // User creation is handled by onAuthStateChanged
        });
    }

    function login(email: string, password: string) {
        return signInWithEmailAndPassword(auth, email, password).then(() => {
            // User login is handled by onAuthStateChanged
        });
    }

    function logout() {
        return signOut(auth);
    }

    function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider).then(() => {
            // User login is handled by onAuthStateChanged
        });
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                // Sync user with database via API
                try {
                    await fetch('/api/users/sync', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            firebaseUid: user.uid,
                            email: user.email,
                            displayName: user.displayName,
                            photoURL: user.photoURL
                        }),
                    });
                } catch (error) {
                    console.error('Error syncing user with database:', error);
                }
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value: AuthContextType = {
        currentUser,
        signup,
        login,
        logout,
        signInWithGoogle,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
