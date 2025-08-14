import { v } from "convex/values";
import { query, mutation , action } from "./_generated/server";
import { Resend } from "resend"; // Adjust the import path as necessary
import { internalMutation } from "./_generated/server";
import { api } from "./_generated/api";
type Action = ReturnType<typeof action>;


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
            email: sender.email, // Assuming email is stored in the user document
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

    const buddiesWithDetPMls = await Promise.all(
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
            
          } : null,
        };
      })
    );

    return buddiesWithDetPMls.filter(req => req.buddy !== null);
  },
});





export const sendemail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("❌ RESEND_API_KEY is not set in environment variables.");
      throw new Error("RESEND_API_KEY is not set.");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PMC <no-reply@PMcollective.tech>", // Use your verified domPMn
        to: args.to,
        subject: args.subject,
        text: args.text,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("❌ Error sending email:", result);
      return { success: false, error: result.error || "Unknown error" };
    }

   
    return { success: true, result };
  },
});





export const respondToBuddyRequest = mutation({
  args: {
    requestId: v.id("buddyRequests"),
    response: v.string(), // "accepted" or "rejected"
  },
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Request not found");
    if (request.status !== "pending") throw new Error("Request already handled");

    await ctx.db.patch(args.requestId, { status: args.response });

    return {
      senderId: request.senderId,
      receiverId: request.receiverId,
      response: args.response,
    };
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






// Query: get all pending buddy requests
export const getPendingBuddyRequests = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("buddyRequests")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
  },
});

// Query: get users by array of IDs
export const getUsersByIds = query({
  args: { ids: v.array(v.id("users")) },
  handler: async (ctx, { ids }) => {
    const users = await Promise.all(ids.map(id => ctx.db.get(id)));
    return users.filter((u): u is NonNullable<typeof u> => u !== null);
  },
});

// Action: send weekly pending request emails
export const sendWeeklyPendingRequestEmails: Action = action({
  handler: async (ctx) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not set.");
    }

    // Fetch all pending buddy requests
    const pendingRequests = await ctx.runQuery(api.buddyRequests.getPendingBuddyRequests, {});

    // Extract unique receiver IDs
    const uniqueReceiverIds = Array.from(
      new Set(pendingRequests.map(req => req.receiverId))
    );

    if (uniqueReceiverIds.length === 0) {
      return { success: true, message: "No pending requests found." };
    }

    // Fetch user details for receivers
    const receivers = await ctx.runQuery(api.buddyRequests.getUsersByIds, {
      ids: uniqueReceiverIds,
    });

    // Map receiver ID to user info
    const receiversMap = new Map(
      receivers.map(user => [user._id.toString(), user])
    );

    // Count pending requests per receiver
    const counts = new Map<string, number>();
    for (const req of pendingRequests) {
      const rid = req.receiverId.toString();
      counts.set(rid, (counts.get(rid) ?? 0) + 1);
    }

    // Prepare emails for active receivers
    const emailsBatch = [];
    for (const [receiverId, count] of counts.entries()) {
      const receiver = receiversMap.get(receiverId);
      if (receiver && receiver.isActive) {
        emailsBatch.push({
          from: "PMC <no-reply@pmcollective.tech>",
          to: receiver.email,
          subject: "You have pending buddy requests!",
          text: `Hi ${receiver.name},\n\nYou have ${count} pending buddy request${count > 1 ? "s" : ""} waiting for your response.\n\nPlease log in to your dashboard to view and respond to them.\n\nBest regards,\nYour Buddy System Team`,
        });
      }
    }

    if (emailsBatch.length === 0) {
      return { success: true, message: "No active receivers with pending requests." };
    }

    // Send batch email request to Resend
    try {
      const response = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailsBatch),

      });

      if (!response.ok) {
        const errorResult = await response.json();
        console.error("Batch email send failed:", errorResult);
        return { success: false, error: errorResult };
      }
    } catch (error) {
      console.error("Error sending batch emails:", error);
      return { success: false, error };
    }

    return { success: true, emailedUsersCount: emailsBatch.length };
  },
});
