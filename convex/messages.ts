import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const sendMessage = mutation({
  args: {
    senderClerkId: v.string(),
    requestId: v.id("buddyRequests"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const sender = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.senderClerkId))
      .unique();

    if (!sender) {
      throw new Error("Sender not found");
    }

    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new Error("Request not found");
    }

    if (request.status !== "accepted") {
      throw new Error("Can only message accepted buddies");
    }

    const receiverId = request.senderId === sender._id ? request.receiverId : request.senderId;

    return await ctx.db.insert("messages", {
      senderId: sender._id,
      receiverId,
      content: args.content,
      requestId: args.requestId,
    });
  },
});

export const getMessages = query({
  args: {
    clerkId: v.string(),
    requestId: v.id("buddyRequests"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      return [];
    }

    const request = await ctx.db.get(args.requestId);
    if (!request) {
      return [];
    }

    // Verify user is part of this conversation
    if (request.senderId !== user._id && request.receiverId !== user._id) {
      return [];
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_request", (q) => q.eq("requestId", args.requestId))
      .order("asc")
      .collect();

    const messagesWithSender = await Promise.all(
      messages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);
        return {
          ...message,
          senderName: sender?.name || "Unknown",
          isCurrentUser: message.senderId === user._id,
        };
      })
    );

    return messagesWithSender;
  },
});
