import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    linkedinUrl: v.string(),
    experienceLevel: v.string(), // "0-3", "3-6", "6-9", "9+"
    preparednessLevel: v.string(), // "Initial", "Beginner", "Intermediate", "Advanced"
    isActive: v.boolean(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_experience", ["experienceLevel"])
    .index("by_preparedness", ["preparednessLevel"])
    .index("by_experience_and_preparedness", ["experienceLevel", "preparednessLevel"]),

  buddyRequests: defineTable({
    senderId: v.id("users"),
    receiverId: v.id("users"),
    status: v.string(), // "pending", "accepted", "rejected"
    message: v.optional(v.string()),
  })
    .index("by_sender", ["senderId"])
    .index("by_receiver", ["receiverId"])
    .index("by_status", ["status"])
    .index("by_sender_and_receiver", ["senderId", "receiverId"]),
    

  messages: defineTable({
    senderId: v.id("users"),
    receiverId: v.id("users"),
    content: v.string(),
    requestId: v.id("buddyRequests"),
  })
    .index("by_request", ["requestId"])
    .index("by_sender", ["senderId"])
    .index("by_receiver", ["receiverId"]),

  // ✅ Add this block for webinar event management
  events: defineTable({
    title: v.string(),
    description: v.string(),
    dateTime: v.string(), // ISO 8601 string
    host: v.string(),
    tags: v.array(v.string()),
    published: v.boolean(),
    createdAt: v.string(),
    gmeetLink: v.string(),
    
  }),

  registrations: defineTable({
    eventId: v.id("events"),
    name: v.string(),
    email: v.string(),
    registeredAt: v.string(),
  })
   .index("by_event_email", ["eventId", "email"])
  .index("by_event", ["eventId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
