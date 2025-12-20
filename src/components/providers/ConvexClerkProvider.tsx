"use client";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
        throw new Error("Missing NEXT_PUBLIC_CONVEX_URL environment variable");
}

const convex = new ConvexReactClient(convexUrl);

const ConvexClerkProvider = ({ children }: { children: React.ReactNode }) => {
        // Clerk automatically detects NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY from environment
        // The development keys warning is expected in development mode
        // For production, ensure you use production keys (pk_live_*) in your environment variables
        return (
                <ClerkProvider>
                        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                                {children}
                        </ConvexProviderWithClerk>
                </ClerkProvider>
        );
};

export default ConvexClerkProvider;
