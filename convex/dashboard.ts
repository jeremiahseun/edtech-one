import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getDashboard = query({
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

    if (!user) {
      return null;
    }

    // 1. Get Courses & Progress
    const courses = await ctx.db
      .query("courses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const learningPath = await ctx.db
          .query("learningPaths")
          .withIndex("by_course", (q) => q.eq("courseId", course._id))
          .unique();

        let progress = 0;
        let totalModules = 0;
        let completedModules = 0;

        if (learningPath && learningPath.modules.length > 0) {
          totalModules = learningPath.modules.length;
          completedModules = learningPath.modules.filter(
            (m) => m.isCompleted
          ).length;
          progress = Math.round((completedModules / totalModules) * 100);
        }

        return {
          ...course,
          progress,
          totalModules,
          completedModules,
          lastActivity: "2h ago", // Placeholder, would need session calculation
        };
      })
    );

    // 2. Daily Goals
    const today = new Date().toISOString().split("T")[0];
    let dailyGoals = await ctx.db
      .query("dailyGoals")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", today)
      )
      .unique();

    // Note: We cannot create goals in a Query.
    // If they don't exist, we return a default structure for the UI to display
    // or the UI triggers a mutation to create them.
    // Ideally, we'd have a scheduled job or trigger, but for now:
    // We will just return the goals if they exist. If not, the UI will see empty
    // and we can have a mutation `checkDailyGoals` that the UI calls on mount.

    // 3. Continue Studying (Most recent course)
    // For now, pick the first course or the one with highest progress < 100
    // Real implementation would look at `sessions`.
    const activeCourse = coursesWithStats.length > 0 ? coursesWithStats[0] : null;

    return {
      user,
      courses: coursesWithStats,
      dailyGoals: dailyGoals ? dailyGoals.goals : [],
      activeCourse,
    };
  },
});

export const checkDailyGoals = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) throw new Error("User not found");

    const today = new Date().toISOString().split("T")[0];
    const existing = await ctx.db
      .query("dailyGoals")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", today)
      )
      .unique();

    if (!existing) {
      await ctx.db.insert("dailyGoals", {
        userId: user._id,
        date: today,
        goals: [
          {
            id: "1",
            title: "Review Flashcards",
            xpReward: 50,
            isCompleted: false,
            type: "review",
          },
          {
            id: "2",
            title: "Complete 1 Quiz",
            xpReward: 100,
            isCompleted: false,
            type: "quiz",
          },
          {
            id: "3",
            title: "Summarize a Note",
            xpReward: 30,
            isCompleted: false,
            type: "summary",
          },
        ],
      });
    }
  },
});

export const toggleGoal = mutation({
  args: { goalId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
            q.eq("tokenIdentifier", identity.tokenIdentifier)
        )
        .unique();
    if (!user) throw new Error("User not found");

    const today = new Date().toISOString().split("T")[0];
    const dailyGoals = await ctx.db
      .query("dailyGoals")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", today)
      )
      .unique();

    if (!dailyGoals) return;

    const newGoals = dailyGoals.goals.map(g => {
        if (g.id === args.goalId) {
            return { ...g, isCompleted: !g.isCompleted };
        }
        return g;
    });

    // Calculate XP difference
    const goal = dailyGoals.goals.find(g => g.id === args.goalId);
    if (goal) {
        const xpChange = goal.isCompleted ? -goal.xpReward : goal.xpReward; // If was completed (true), we are unchecking, so subtract.

        // Update User XP
        await ctx.db.patch(user._id, {
            totalXp: (user.totalXp || 0) + xpChange
        });
    }

    await ctx.db.patch(dailyGoals._id, { goals: newGoals });
  }
});
