import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const upsertUser = mutation({
        args: {
                email: v.string(),
                name: v.string(),
                image: v.optional(v.string()),
                clerkId: v.string(),
                role: v.union(v.literal("candidate"), v.literal("interviewer")),
        },
        handler: async (ctx, args) => {
                const existedUser = await ctx.db
                        .query("users")
                        .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
                        .first();
                if (existedUser) {
                        await ctx.db.patch(existedUser._id, {
                                email: args.email,
                                name: args.name,
                                image: args.image,
                                role: args.role,
                        });
                } else {
                        await ctx.db.insert("users", {
                                email: args.email,
                                name: args.name,
                                image: args.image,
                                role: "candidate",
                                clerkId: args.clerkId,
                        });
                }
        },
});
