import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    credits: v.number(),
  }).index("by_email", ["email"]),
  chats: defineTable({
    userEmail: v.string(),
    personality: v.string(),
    messages: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
      })
    ),
    timestamp: v.number(),
  }).index("by_userEmail", ["userEmail"]),
});
