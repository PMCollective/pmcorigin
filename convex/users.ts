import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    linkedinUrl: v.string(),
    experienceLevel: v.string(),
    preparednessLevel: v.string(),
    
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existingUser) {
      return existingUser._id;
    }

    return await ctx.db.insert("users", {
      ...args,
      isActive: true,
    });
  },
});

export const getCurrentUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

export const updateUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    linkedinUrl: v.string(),
    experienceLevel: v.string(),
    preparednessLevel: v.string(),
    
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      name: args.name,
      email: args.email,
      linkedinUrl: args.linkedinUrl,
      experienceLevel: args.experienceLevel,
      preparednessLevel: args.preparednessLevel,
      
    });

    return user._id;
  },
});













export const searchBuddies = query({
  args: {
    currentUserClerkId: v.string(),
    experienceLevel: v.optional(v.string()),
    preparednessLevel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.currentUserClerkId))
      .unique();

    if (!currentUser) {
      return [];
    }

    let users;

    // Apply filters if provided
    if (args.experienceLevel && args.preparednessLevel) {
      users = await ctx.db
        .query("users")
        .withIndex("by_experience_and_preparedness", (q) =>
          q.eq("experienceLevel", args.experienceLevel!).eq("preparednessLevel", args.preparednessLevel!)
        )
        .collect();
    } else if (args.experienceLevel) {
      users = await ctx.db
        .query("users")
        .withIndex("by_experience", (q) => q.eq("experienceLevel", args.experienceLevel!))
        .collect();
    } else if (args.preparednessLevel) {
      users = await ctx.db
        .query("users")
        .withIndex("by_preparedness", (q) => q.eq("preparednessLevel", args.preparednessLevel!))
        .collect();
    } else {
      users = await ctx.db.query("users").collect();
    }

    // Filter out current user and inactive users
    return users.filter(user => 
      user._id !== currentUser._id && 
      user.isActive
    ).map(user => ({
      _id: user._id,
      name: user.name,
      experienceLevel: user.experienceLevel,
      preparednessLevel: user.preparednessLevel,
      linkedinUrl: user.linkedinUrl,
    }));
  },
});
