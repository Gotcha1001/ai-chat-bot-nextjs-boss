"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import { use } from "react";

export default function ChatDetail({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const { user, isLoaded } = useUser();
    const chat = useQuery(api.chats.getChatById, { chatId: params.id });

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
                    <p className="text-lg mb-4">Please sign in to view chat details.</p>
                    <Link href="/sign-in">
                        <Button variant="default" className="bg-purple-500 hover:bg-purple-600">
                            Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (chat === undefined) {
        return (
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 min-h-screen flex items-center justify-center">
                <p className="text-white text-lg">Loading chat details...</p>
            </div>
        );
    }

    if (chat === null) {
        return notFound();
    }

    // Verify chat belongs to the user
    if (chat.userEmail !== user.primaryEmailAddress.emailAddress) {
        return (
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 min-h-screen flex items-center justify-center">
                <p className="text-white text-lg">Unauthorized access to this chat.</p>
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
                        {chat.personality.charAt(0).toUpperCase() + chat.personality.slice(1)} Chat
                    </h1>
                    <div className="text-center space-x-4">
                        <Link href="/">
                            <Button
                                variant="ghost"
                                className="text-white px-6 py-3 hover:bg-purple-600 transition duration-300"
                            >
                                Back to Home
                            </Button>
                        </Link>
                        <Link href="/chat/my-chats">
                            <Button
                                variant="ghost"
                                className="text-white px-6 py-3 hover:bg-purple-600 transition duration-300"
                            >
                                Back to History
                            </Button>
                        </Link>
                    </div>

                    <div
                        className="p-4 bg-white bg-opacity-90 rounded-2xl shadow-2xl max-h-96 overflow-y-auto"
                    >
                        {chat.messages.length === 0 ? (
                            <p className="text-gray-700 text-center">No messages in this chat.</p>
                        ) : (
                            chat.messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={
                                        msg.role === "user"
                                            ? "user-message ml-auto bg-gray-300 text-gray-800"
                                            : "ai-message bg-white text-gray-800"
                                    }
                                    style={{
                                        margin: "8px 12px",
                                        padding: "12px",
                                        borderRadius: "12px",
                                        maxWidth: "75%",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: msg.content.replace(/\n/g, "<br>"),
                                        }}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}