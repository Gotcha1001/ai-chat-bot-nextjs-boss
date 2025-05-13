"use client";

import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Trash2 } from "lucide-react";

export default function ChatHistory() {
    const { user, isLoaded } = useUser();
    const [deletingChatId, setDeletingChatId] = useState(null);
    const chats = useQuery(
        api.chats.getUserChats,
        user?.primaryEmailAddress?.emailAddress
            ? { userEmail: user.primaryEmailAddress.emailAddress }
            : undefined
    );
    const deleteChat = useMutation(api.chats.deleteChat);

    const handleDelete = async (chatId) => {
        setDeletingChatId(chatId);
        try {
            await deleteChat({ chatId });
        } catch (error) {
            console.error("Error deleting chat:", error);
        } finally {
            setDeletingChatId(null);
        }
    };

    if (!isLoaded) {
        return (
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 min-h-screen flex items-center justify-center">
                <p className="text-white text-lg">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 min-h-screen flex items-center justify-center">
                <div className="text-center text-white">
                    <p className="text-lg mb-4">Please sign in to view your chat history.</p>
                    <Link href="/sign-in">
                        <Button variant="default" className="bg-purple-500 hover:bg-purple-600">
                            Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 min-h-screen flex flex-col relative">
            <div className="absolute top-4 right-4">
                <div className="transform scale-125">
                    <UserButton />
                </div>
            </div>

            <div className="flex-grow flex items-center justify-center">
                <div className="container mx-auto p-6 max-w-3xl flex flex-col space-y-6">
                    <h1 className="text-4xl font-extrabold text-center text-white">
                        My Chats History
                    </h1>
                    <div className="text-center">
                        <Link href="/">
                            <Button
                                variant="ghost"
                                className="text-white px-6 py-3 hover:bg-purple-600 transition duration-300"
                            >
                                Back to Home
                            </Button>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {chats === undefined && (
                            <p className="text-white text-center">Loading chat history...</p>
                        )}
                        {chats?.length === 0 && (
                            <p className="text-white text-center">
                                No chat history yet. Start a chat in{" "}
                                <Link
                                    href="/chat/open-ai"
                                    className="underline hover:text-purple-300"
                                >
                                    Chosen AI Mood
                                </Link>
                                !
                            </p>
                        )}
                        {chats?.map((chat) => (
                            <Card
                                key={chat._id}
                                className="bg-white bg-opacity-90 shadow-md"
                            >
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-gray-800">
                                        {chat.personality.charAt(0).toUpperCase() +
                                            chat.personality.slice(1)}{" "}
                                        Chat
                                    </CardTitle>
                                    <p className="text-sm text-gray-500">
                                        {new Date(chat.timestamp).toLocaleString()}
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 truncate">
                                        {chat.messages[chat.messages.length - 1]?.content ||
                                            "No messages"}
                                    </p>
                                    <Button
                                        variant="destructive"
                                        className="mt-2"
                                        onClick={() => handleDelete(chat._id)}
                                        disabled={deletingChatId === chat._id}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        {deletingChatId === chat._id ? "Deleting..." : "Delete"}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}