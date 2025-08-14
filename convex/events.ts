import { mutation, query,action } from "./_generated/server";
import { v } from "convex/values";

// Admin creates a new event
export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    dateTime: v.string(),
    host: v.string(),
    tags: v.array(v.string()),
    published: v.boolean(),
    gmeetLink: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("events", {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});

export const getAllEvents = query({
  handler: async (ctx) => {
    return await ctx.db.query("events").collect();
  },
});

export const deleteEvent = mutation({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, args) => {
    // Delete the event itself
    await ctx.db.delete(args.id);

    // Find all registrations linked to this event
    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.id))
      .collect();

    // Delete all related registrations
    for (const reg of registrations) {
      await ctx.db.delete(reg._id);
    }
  },
});



export const getEventById = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});


export const updateEvent = mutation({
  args: {
    id: v.id("events"),
    title: v.string(),
    description: v.string(),
    dateTime: v.string(),
    host: v.string(),
    tags: v.array(v.string()),
    published: v.boolean(),
    gmeetLink: v.string()
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});




// Fetch all published events
export const getPublishedEvents = query({
  handler: async (ctx) => {
    const events = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("published"), true))
      .collect();

    return events.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  },
});
