import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveChat = mutation({
  args: {
    userEmail: v.string(),
    personality: v.string(),
    messages: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existingChats = await ctx.db
      .query("chats")
      .filter((q) =>
        q.and(
          q.eq(q.field("userEmail"), args.userEmail),
          q.eq(q.field("personality"), args.personality)
        )
      )
      .collect();

    const chatData = {
      userEmail: args.userEmail,
      personality: args.personality,
      messages: args.messages,
      timestamp: Date.now(),
    };

    if (existingChats.length > 0) {
      await ctx.db.patch(existingChats[0]._id, chatData);
      return { ...chatData, _id: existingChats[0]._id };
    } else {
      const chatId = await ctx.db.insert("chats", chatData);
      return { ...chatData, _id: chatId };
    }
  },
});

export const getUserChats = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chats")
      .withIndex("by_userEmail", (q) => q.eq("userEmail", args.userEmail))
      .order("desc", "timestamp")
      .collect();
  },
});

export const deleteChat = mutation({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.chatId);
    return { success: true };
  },
});

export const getChatById = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.chatId);
  },
});
