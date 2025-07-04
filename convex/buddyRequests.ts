import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const sendBuddyRequest = mutation({
  args: {
    senderClerkId: v.string(),
    receiverId: v.id("users"),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const sender = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.senderClerkId))
      .unique();

    if (!sender) {
      throw new Error("Sender not found");
    }

    // Check if request already exists
    const existingRequest = await ctx.db
      .query("buddyRequests")
      .withIndex("by_sender_and_receiver", (q) => 
        q.eq("senderId", sender._id).eq("receiverId", args.receiverId)
      )
      .unique();

    if (existingRequest) {
      throw new Error("Request already sent");
    }

    return await ctx.db.insert("buddyRequests", {
      senderId: sender._id,
      receiverId: args.receiverId,
      status: "pending",
      message: args.message,
    });
  },
});

export const getIncomingRequests = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      return [];
    }

    const requests = await ctx.db
      .query("buddyRequests")
      .withIndex("by_receiver", (q) => q.eq("receiverId", user._id))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    const requestsWithSender = await Promise.all(
      requests.map(async (request) => {
        const sender = await ctx.db.get(request.senderId);
        return {
          ...request,
          sender: sender ? {
            _id: sender._id,
            name: sender.name,
            experienceLevel: sender.experienceLevel,
            preparednessLevel: sender.preparednessLevel,
            linkedinUrl: sender.linkedinUrl,
          } : null,
        };
      })
    );

    return requestsWithSender.filter(req => req.sender !== null);
  },
});

export const getSentRequests = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      return [];
    }

    const requests = await ctx.db
      .query("buddyRequests")
      .withIndex("by_sender", (q) => q.eq("senderId", user._id))
      .collect();

    const requestsWithReceiver = await Promise.all(
      requests.map(async (request) => {
        const receiver = await ctx.db.get(request.receiverId);
        return {
          ...request,
          receiver: receiver ? {
            _id: receiver._id,
            name: receiver.name,
            experienceLevel: receiver.experienceLevel,
            preparednessLevel: receiver.preparednessLevel,
            linkedinUrl: receiver.linkedinUrl,
          } : null,
        };
      })
    );

    return requestsWithReceiver.filter(req => req.receiver !== null);
  },
});

export const getAcceptedBuddies = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      return [];
    }

    const sentRequests = await ctx.db
      .query("buddyRequests")
      .withIndex("by_sender", (q) => q.eq("senderId", user._id))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    const receivedRequests = await ctx.db
      .query("buddyRequests")
      .withIndex("by_receiver", (q) => q.eq("receiverId", user._id))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    const allAcceptedRequests = [...sentRequests, ...receivedRequests];

    const buddiesWithDetails = await Promise.all(
      allAcceptedRequests.map(async (request) => {
        const buddyId = request.senderId === user._id ? request.receiverId : request.senderId;
        const buddy = await ctx.db.get(buddyId);
        return {
          ...request,
          buddy: buddy ? {
            _id: buddy._id,
            name: buddy.name,
            experienceLevel: buddy.experienceLevel,
            preparednessLevel: buddy.preparednessLevel,
            linkedinUrl: buddy.linkedinUrl,
            phoneNumber: buddy.phoneNumber, // Phone number visible after match
          } : null,
        };
      })
    );

    return buddiesWithDetails.filter(req => req.buddy !== null);
  },
});

export const respondToBuddyRequest = mutation({
  args: {
    requestId: v.id("buddyRequests"),
    response: v.string(), // "accepted" or "rejected"
  },
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new Error("Request not found");
    }

    if (request.status !== "pending") {
      throw new Error("Request already responded to");
    }

    await ctx.db.patch(args.requestId, {
      status: args.response,
    });

    return args.requestId;
  },
});

export const withdrawBuddyRequest = mutation({
  args: {
    requestId: v.id("buddyRequests"),
    senderClerkId: v.string(),
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

    if (request.senderId !== sender._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.requestId);
    return args.requestId;
  },
});
