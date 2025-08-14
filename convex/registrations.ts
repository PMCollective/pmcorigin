import { mutation ,action} from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { query } from "./_generated/server";



export const registerForEvent = mutation({
  args: {
    eventId: v.id("events"),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Step 1: Check for existing registration
    const existing = await ctx.db
      .query("registrations")
      .withIndex("by_event_email", (q) =>
        q.eq("eventId", args.eventId).eq("email", args.email)
      )
      .unique();

    // Step 2: Prevent duplicate registration
    if (existing) {
      throw new Error("This email is already registered for the event.");
    }

    // Step 3: Insert new registration
    await ctx.db.insert("registrations", {
      ...args,
      registeredAt: new Date().toISOString(),
    });

    // TODO: Trigger email if needed
  },
});


export const sendEventRegistrationemail = action({
  args: {
    to: v.string(),
    eventTitle: v.string(),
    gmeetLink: v.string(),
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
        from: "PMC <no-reply@PMcollective.tech>",
        to: args.to,
        subject: `Registration Confirmed: ${args.eventTitle}`,
        text: `Thank you for registering for "${args.eventTitle}"!\n\nHere is your meeting link: ${args.gmeetLink}\n\nSee you there!\n\nBest,\nThe PM Collective Team`,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("❌ Error sending registration email:", result);
      return { success: false, error: result.error || "Unknown error" };
    }

    
    return { success: true, result };
  },
});

export const getRegistrationsByEvent = query({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
  },
});
