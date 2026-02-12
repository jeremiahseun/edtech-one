import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();
        return user;
    },
});

export const syncUser = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called syncUser without authentication present");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        // User exists
        if (user !== null) {
            if (user.email !== identity.email || user.fullName !== identity.name) {
                await ctx.db.patch(user._id, {
                    email: identity.email || user.email,
                    fullName: identity.name || user.fullName,
                });
            }
            return user._id;
        }

        // If new user, create them
        const newUserId = await ctx.db.insert("users", {
            tokenIdentifier: identity.tokenIdentifier,
            email: identity.email || `user-${identity.tokenIdentifier.slice(0, 8)}@example.com`,
            fullName: identity.name || "Student",
            subscriptionStatus: "free",
            currentStreak: 0,
            totalXp: 0,
            onboardingCompleted: false,
        });

        return newUserId;
    },
});

export const updateOnboarding = mutation({
    args: {
        major: v.optional(v.string()),
        studyStruggle: v.optional(v.string()),
        onboardingCompleted: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        const updates: any = {};
        if (args.major !== undefined) updates.major = args.major;
        if (args.studyStruggle !== undefined) updates.studyStruggle = args.studyStruggle;
        if (args.onboardingCompleted !== undefined) updates.onboardingCompleted = args.onboardingCompleted;

        await ctx.db.patch(user._id, updates);
    },
});
