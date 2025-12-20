'use server'

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

export const streamTokenProvider = async () => {
        const user = await currentUser();
        if(!user) throw new Error("User is not authenticated");
        const streamClient = new StreamClient(
                process.env.STREAM_API_KEY!,
              process.env.STREAM_SECRET_KEY!,
        );
        // Add buffer time to iat (issued at) to prevent clock skew issues
        // Subtract 60 seconds to account for potential time differences between server and Stream
        const now = Math.floor(Date.now() / 1000);
        const token = streamClient.generateUserToken({
                user_id: user.id,
                iat: now - 60, // Set iat 60 seconds in the past to prevent clock skew
                exp: now + 3600, // Token expires in 1 hour
        });
        return token;
}