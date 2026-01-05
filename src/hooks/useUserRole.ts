import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
export const useUserRole = () => {
        const { user, isLoaded } = useUser();
        // Query will return null if user is not authenticated (handled in Convex function)
        // Use empty string as fallback to satisfy TypeScript - Convex function will handle it
        const userData = useQuery(
                api.users.getUserByClerkId,
                isLoaded && user?.id ? { clerkId: user.id } : { clerkId: "" }
        );
        const isLoading = !isLoaded || (isLoaded && user && userData === undefined);
        return {
                isLoading,
                isInterviewer: userData?.role === "interviewer",
                isCandidate: userData?.role === "candidate",
        };
};
