import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const getUsers = query({
        handler: async (ctx) => {
                const identity = await ctx.auth.getUserIdentity();
                if (!identity) throw new Error("User is not authenticated");

                const users = await ctx.db.query("users").collect();
                return users;
        },
});

export const getUserByClerkId = query({
        args: {
                clerkId: v.string(),
        },
        handler: async (ctx, args) => {
                const user = ctx.db
                        .query("users")
                        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
                        .first();

                if (!user) throw new Error("User not found");
                return user;
        },
});
