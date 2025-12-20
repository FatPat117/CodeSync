"use client";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const ConvexClerkProvider = ({ children }: { children: React.ReactNode }) => {
        // Clerk will automatically use NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY from env
        // No need to pass it explicitly, which reduces the warning
        return (
                <ClerkProvider>
                        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                                {children}
                        </ConvexProviderWithClerk>
                </ClerkProvider>
        );
};

export default ConvexClerkProvider;
