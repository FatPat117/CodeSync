import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { skipToken } from "convex/react";
import { api } from "../../convex/_generated/api";
export const useUserRole = () => {
        const { user, isLoaded } = useUser();
        const userData = useQuery(
                api.users.getUserByClerkId,
                isLoaded && user?.id ? { clerkId: user.id } : skipToken
        );
        const isLoading = !isLoaded || (isLoaded && user && userData === undefined);
        return {
                isLoading,
                isInterviewer: userData?.role === "interviewer",
                isCandidate: userData?.role === "candidate",
        };
};
