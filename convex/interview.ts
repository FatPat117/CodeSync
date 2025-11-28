import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllInterviews = query({
        handler: async (ctx) => {
                const identity = await ctx.auth.getUserIdentity();
                if (!identity) throw new Error("User is not authenticated");
                const interviews = await ctx.db.query("interviews").collect();
                return interviews;
        },
});

// Get Currently interviews
export const getMyInterviews = query({
        handler: async (ctx) => {
                const identity = await ctx.auth.getUserIdentity();
                if (!identity) throw new Error("User is not authenticated");
                const interviews = await ctx.db
                        .query("interviews")
                        .withIndex("by_candidate_id", (q) => q.eq("candidateId", identity.subject))
                        .collect();
                return interviews;
        },
});

// get interview by streamId

export const getInterviewByStreamId = query({
        args: {
                streamCallId: v.string(),
        },
        handler: async (ctx, args) => {
                const interview = await ctx.db
                        .query("interviews")
                        .withIndex("by_stream_call_id", (q) => q.eq("streamCallId", args.streamCallId))
                        .first();
                return interview;
        },
});

// Create a new interview
export const createInterview = mutation({
        args: {
                title: v.string(),
                description: v.optional(v.string()),
                startTime: v.number(),
                status: v.string(),
                streamCallId: v.string(),
                candidateId: v.string(),
                interviewerIds: v.array(v.string()),
        },
        handler: async (ctx, args) => {
                const identity = await ctx.auth.getUserIdentity();
                if (!identity) throw new Error("User is not authenticated");
                return await ctx.db.insert("interviews", {
                        ...args,
                });
        },
});

// Update Interview status
export const updateInterviewStatus = mutation({
        args: {
                interviewId: v.id("interviews"),
                status: v.string(),
        },
        handler: async (ctx, args) => {
                return await ctx.db.patch(args.interviewId, {
                        status: args.status,
                        ...(args.status == "completed" && { endTime: Date.now() }),
                });
        },
});
