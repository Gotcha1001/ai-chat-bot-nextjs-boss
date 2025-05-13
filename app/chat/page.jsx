// "use client";

// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { UserButton, useUser } from "@clerk/nextjs";
// import { useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// const cleanMarkdown = (text) => {
//     let cleanedText = text;
//     cleanedText = cleanedText.replace(/^#{1,4}\s*/gm, "");
//     cleanedText = cleanedText.replace(/\*\*(.*?)\*\*/g, "$1");
//     cleanedText = cleanedText.replace(/__(.*?)__/g, "$1");
//     cleanedText = cleanedText.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "$1");
//     cleanedText = cleanedText.replace(/_(.*?)_/g, "$1");

//     const lines = cleanedText.split("\n");
//     const cleanedLines = [];
//     let listCounter = 0;
//     let inList = false;

//     for (const line of lines) {
//         const strippedLine = line.trim();
//         if (/^[\*\-]\s+/.test(strippedLine)) {
//             listCounter++;
//             inList = true;
//             const cleanedLine = line.replace(/^[\*\-]\s+/, `${listCounter}. `);
//             cleanedLines.push(cleanedLine);
//         } else if (inList && strippedLine && !/^\d+\.\s+/.test(strippedLine)) {
//             inList = false;
//             listCounter = 0;
//             cleanedLines.push(line);
//         } else {
//             cleanedLines.push(line);
//         }
//     }

//     cleanedText = cleanedLines.join("\n");
//     cleanedText = cleanedText.replace(/\n\s*\n+/g, "\n\n");
//     return cleanedText.trim();
// };

// export default function Chat() {
//     const { user, isLoaded } = useUser();
//     const [messages, setMessages] = useState([
//         { role: "system", content: "You are a helpful assistant" },
//     ]);
//     const [input, setInput] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const chatContainerRef = useRef(null);
//     const saveChat = useMutation(api.chats.saveChat);

//     const sendMessage = async () => {
//         if (!input.trim()) return;

//         const newMessages = [...messages, { role: "user", content: input }];
//         setMessages(newMessages);
//         setInput("");
//         setIsLoading(true);

//         try {
//             const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
//             const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

//             const systemPrompt =
//                 "You are a helpful assistant. Answer clearly and appropriately. Keep answers concise for simple questions; provide detailed information for recipes or any instructions. Please answer in a light hearted way with jokes in between your information as a final ending note, make use of emojis";
//             const formattedMessages = [
//                 { role: "user", parts: [{ text: systemPrompt }] },
//                 { role: "model", parts: [{ text: "I understand and will follow these guidelines." }] },
//                 ...newMessages.map((msg) => ({
//                     role: msg.role === "user" ? "user" : "model",
//                     parts: [{ text: msg.content }],
//                 })),
//             ];

//             const maxTokens = /recipe|how to|instructions|guide|steps/i.test(input) ? 1000 : 200;
//             const result = await model.generateContent({
//                 contents: formattedMessages,
//                 generationConfig: {
//                     maxOutputTokens: maxTokens,
//                     temperature: 0.7,
//                     topK: 40,
//                     topP: 0.9,
//                 },
//             });

//             const responseText = result.response.text();
//             const cleanedText = cleanMarkdown(responseText);
//             const updatedMessages = [...newMessages, { role: "assistant", content: cleanedText }];
//             setMessages(updatedMessages);

//             if (user?.primaryEmailAddress?.emailAddress) {
//                 try {
//                     await saveChat({
//                         userEmail: user.primaryEmailAddress.emailAddress,
//                         personality: "Default",
//                         messages: updatedMessages.filter((msg) => msg.role !== "system"),
//                     });
//                 } catch (saveError) {
//                     console.error("Failed to save chat to Convex:", saveError);
//                     setMessages([
//                         ...updatedMessages,
//                         {
//                             role: "assistant",
//                             content: "Message saved locally, but failed to sync with server. Try again later. 😅",
//                         },
//                     ]);
//                 }
//             } else {
//                 console.warn("User not authenticated, skipping chat save.");
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             setMessages([
//                 ...newMessages,
//                 { role: "assistant", content: "An error occurred. Please try again. 😅" },
//             ]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (chatContainerRef.current) {
//             chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//         }
//     }, [messages]);

//     if (!isLoaded) {
//         return (
//             <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-700 min-h-screen flex items-center justify-center">
//                 <p className="text-white text-lg font-semibold">Loading...</p>
//             </div>
//         );
//     }

//     if (!user) {
//         return (
//             <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-700 min-h-screen flex items-center justify-center">
//                 <div className="text-center text-white">
//                     <p className="text-lg font-semibold mb-4">Please sign in to start chatting.</p>
//                     <Link href="/sign-in">
//                         <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
//                             Sign In
//                         </Button>
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-700 min-h-screen flex flex-col relative">
//             <div className="absolute top-4 right-4">
//                 <div className="transform scale-125">
//                     <UserButton />
//                 </div>
//             </div>

//             <div className="flex-grow flex items-center justify-center py-6">
//                 <div className="container mx-auto px-4 sm:px-6 max-w-full sm:max-w-md md:max-w-lg lg:max-w-3xl flex flex-col space-y-6">
//                     <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-white drop-shadow-lg">
//                         Chat with AI
//                     </h1>
//                     <div className="text-center">
//                         <Link href="/">
//                             <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
//                                 Back to Home
//                             </Button>
//                         </Link>
//                     </div>
//                     <div
//                         id="chat-container"
//                         ref={chatContainerRef}
//                         className="p-4 bg-purple-900 bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl max-h-96 overflow-y-auto border border-white/20"
//                     >
//                         {messages.slice(1).map((msg, index) => (
//                             <div
//                                 key={index}
//                                 className={`${msg.role === "user"
//                                     ? "ml-auto bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800"
//                                     : "bg-white bg-opacity-20 text-black"
//                                     } animate-fade-in m-2 p-3 rounded-xl max-w-[75%] shadow-md transition-all duration-300`}
//                             >
//                                 <div
//                                     dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, "<br>") }}
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                     <div className={isLoading ? "flex justify-center items-center" : "hidden"}>
//                         <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-pink-500"></div>
//                         <p className="ml-2 text-white font-medium">
//                             Loading, please wait (may take up to 30 seconds)...
//                         </p>
//                     </div>
//                     <div className="input-container flex items-center bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-md p-2 w-full border border-white/20">
//                         <Input
//                             type="text"
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//                             className="flex-grow bg-transparent text-gray-800 placeholder-gray-400 border-none focus:ring-2 focus:ring-purple-500"
//                             placeholder="Type your message..."
//                         />
//                         <Button
//                             onClick={sendMessage}
//                             className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
//                         >
//                             Send
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }





// for mobile devices better 

// "use client";

// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { UserButton, useUser } from "@clerk/nextjs";
// import { useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// const cleanMarkdown = (text) => {
//     let cleanedText = text;
//     cleanedText = cleanedText.replace(/^#{1,4}\s*/gm, "");
//     cleanedText = cleanedText.replace(/\*\*(.*?)\*\*/g, "$1");
//     cleanedText = cleanedText.replace(/__(.*?)__/g, "$1");
//     cleanedText = cleanedText.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "$1");
//     cleanedText = cleanedText.replace(/_(.*?)_/g, "$1");

//     const lines = cleanedText.split("\n");
//     const cleanedLines = [];
//     let listCounter = 0;
//     let inList = false;

//     for (const line of lines) {
//         const strippedLine = line.trim();
//         if (/^[\*\-]\s+/.test(strippedLine)) {
//             listCounter++;
//             inList = true;
//             const cleanedLine = line.replace(/^[\*\-]\s+/, `${listCounter}. `);
//             cleanedLines.push(cleanedLine);
//         } else if (inList && strippedLine && !/^\d+\.\s+/.test(strippedLine)) {
//             inList = false;
//             listCounter = 0;
//             cleanedLines.push(line);
//         } else {
//             cleanedLines.push(line);
//         }
//     }

//     cleanedText = cleanedLines.join("\n");
//     cleanedText = cleanedText.replace(/\n\s*\n+/g, "\n\n");
//     return cleanedText.trim();
// };

// export default function Chat() {
//     const { user, isLoaded } = useUser();
//     const [messages, setMessages] = useState([
//         { role: "system", content: "You are a helpful assistant" },
//     ]);
//     const [input, setInput] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const chatContainerRef = useRef(null);
//     const saveChat = useMutation(api.chats.saveChat);

//     const sendMessage = async () => {
//         if (!input.trim()) return;

//         const newMessages = [...messages, { role: "user", content: input }];
//         setMessages(newMessages);
//         setInput("");
//         setIsLoading(true);

//         try {
//             const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
//             const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

//             const systemPrompt =
//                 "You are a helpful assistant. Answer clearly and appropriately. Keep answers concise for simple questions; provide detailed information for recipes or any instructions. Please answer in a light hearted way with jokes in between your information as a final ending note, make use of emojis";
//             const formattedMessages = [
//                 { role: "user", parts: [{ text: systemPrompt }] },
//                 { role: "model", parts: [{ text: "I understand and will follow these guidelines." }] },
//                 ...newMessages.map((msg) => ({
//                     role: msg.role === "user" ? "user" : "model",
//                     parts: [{ text: msg.content }],
//                 })),
//             ];

//             const maxTokens = /recipe|how to|instructions|guide|steps/i.test(input) ? 1000 : 200;
//             const result = await model.generateContent({
//                 contents: formattedMessages,
//                 generationConfig: {
//                     maxOutputTokens: maxTokens,
//                     temperature: 0.7,
//                     topK: 40,
//                     topP: 0.9,
//                 },
//             });

//             const responseText = result.response.text();
//             const cleanedText = cleanMarkdown(responseText);
//             const updatedMessages = [...newMessages, { role: "assistant", content: cleanedText }];
//             setMessages(updatedMessages);

//             if (user?.primaryEmailAddress?.emailAddress) {
//                 try {
//                     await saveChat({
//                         userEmail: user.primaryEmailAddress.emailAddress,
//                         personality: "Default",
//                         messages: updatedMessages.filter((msg) => msg.role !== "system"),
//                     });
//                 } catch (saveError) {
//                     console.error("Failed to save chat to Convex:", saveError);
//                     setMessages([
//                         ...updatedMessages,
//                         {
//                             role: "assistant",
//                             content: "Message saved locally, but failed to sync with server. Try again later. 😅",
//                         },
//                     ]);
//                 }
//             } else {
//                 console.warn("User not authenticated, skipping chat save.");
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             setMessages([
//                 ...newMessages,
//                 { role: "assistant", content: "An error occurred. Please try again. 😅" },
//             ]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (chatContainerRef.current) {
//             chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//         }
//     }, [messages]);

//     if (!isLoaded) {
//         return (
//             <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-700 min-h-screen flex items-center justify-center">
//                 <p className="text-white text-lg font-semibold">Loading...</p>
//             </div>
//         );
//     }

//     if (!user) {
//         return (
//             <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-700 min-h-screen flex items-center justify-center">
//                 <div className="text-center text-white">
//                     <p className="text-lg font-semibold mb-4">Please sign in to start chatting.</p>
//                     <Link href="/sign-in">
//                         <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
//                             Sign In
//                         </Button>
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-700 min-h-screen flex flex-col relative">
//             <div className="absolute top-4 right-4">
//                 <div className="transform scale-125">
//                     <UserButton />
//                 </div>
//             </div>

//             <div className="flex-grow flex items-center justify-center py-4 sm:py-6">
//                 <div className="container mx-auto px-4 sm:px-6 max-w-full sm:max-w-md md:max-w-lg lg:max-w-3xl flex flex-col space-y-4 sm:space-y-6">
//                     <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-white drop-shadow-lg">
//                         Chat with AI
//                     </h1>
//                     <div className="text-center">
//                         <Link href="/">
//                             <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
//                                 Back to Home
//                             </Button>
//                         </Link>
//                     </div>
//                     <div
//                         id="chat-container"
//                         ref={chatContainerRef}
//                         className="p-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl max-h-96 overflow-y-auto border border-white/20"
//                     >
//                         {messages.slice(1).map((msg, index) => (
//                             <div
//                                 key={index}
//                                 className={`${msg.role === "user"
//                                         ? "ml-auto bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800"
//                                         : "bg-white bg-opacity-20 text-white"
//                                     } animate-fade-in m-2 p-3 rounded-xl max-w-[75%] shadow-md transition-all duration-300`}
//                             >
//                                 <div
//                                     dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, "<br>") }}
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                     <div className={isLoading ? "flex flex-col sm:flex-row justify-center items-center" : "hidden"}>
//                         <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-pink-500"></div>
//                         <p className="ml-0 sm:ml-2 mt-2 sm:mt-0 text-white font-medium text-sm sm:text-base">
//                             Loading, please wait (may take up to 30 seconds)...
//                         </p>
//                     </div>
//                     <div className="input-container flex items-center bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-md p-1.5 sm:p-2 w-full border border-white/20">
//                         <Input
//                             type="text"
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//                             className="flex-grow min-w-0 bg-transparent text-gray-800 placeholder-gray-400 border-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
//                             placeholder="Type your message..."
//                         />
//                         <Button
//                             onClick={sendMessage}
//                             className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
//                         >
//                             Send
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }




"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const cleanMarkdown = (text) => {
    let cleanedText = text;
    cleanedText = cleanedText.replace(/^#{1,4}\s*/gm, "");
    cleanedText = cleanedText.replace(/\*\*(.*?)\*\*/g, "$1");
    cleanedText = cleanedText.replace(/__(.*?)__/g, "$1");
    cleanedText = cleanedText.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "$1");
    cleanedText = cleanedText.replace(/_(.*?)_/g, "$1");

    const lines = cleanedText.split("\n");
    const cleanedLines = [];
    let listCounter = 0;
    let inList = false;

    for (const line of lines) {
        const strippedLine = line.trim();
        if (/^[\*\-]\s+/.test(strippedLine)) {
            listCounter++;
            inList = true;
            const cleanedLine = line.replace(/^[\*\-]\s+/, `${listCounter}. `);
            cleanedLines.push(cleanedLine);
        } else if (inList && strippedLine && !/^\d+\.\s+/.test(strippedLine)) {
            inList = false;
            listCounter = 0;
            cleanedLines.push(line);
        } else {
            cleanedLines.push(line);
        }
    }

    cleanedText = cleanedLines.join("\n");
    cleanedText = cleanedText.replace(/\n\s*\n+/g, "\n\n");
    return cleanedText.trim();
};

export default function Chat() {
    const { user, isLoaded } = useUser();
    const [messages, setMessages] = useState([
        { role: "system", content: "You are a helpful assistant" },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);
    const saveChat = useMutation(api.chats.saveChat);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

            const systemPrompt =
                "You are a helpful assistant. Answer clearly and appropriately. Keep answers concise for simple questions; provide detailed information for recipes or any instructions. Please answer in a light hearted way with jokes in between your information as a final ending note, make use of emojis";
            const formattedMessages = [
                { role: "user", parts: [{ text: systemPrompt }] },
                { role: "model", parts: [{ text: "I understand and will follow these guidelines." }] },
                ...newMessages.map((msg) => ({
                    role: msg.role === "user" ? "user" : "model",
                    parts: [{ text: msg.content }],
                })),
            ];

            const maxTokens = /recipe|how to|instructions|guide|steps/i.test(input) ? 1000 : 200;
            const result = await model.generateContent({
                contents: formattedMessages,
                generationConfig: {
                    maxOutputTokens: maxTokens,
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.9,
                },
            });

            const responseText = result.response.text();
            const cleanedText = cleanMarkdown(responseText);
            const updatedMessages = [...newMessages, { role: "assistant", content: cleanedText }];
            setMessages(updatedMessages);

            if (user?.primaryEmailAddress?.emailAddress) {
                try {
                    await saveChat({
                        userEmail: user.primaryEmailAddress.emailAddress,
                        personality: "Default",
                        messages: updatedMessages.filter((msg) => msg.role !== "system"),
                    });
                } catch (saveError) {
                    console.error("Failed to save chat to Convex:", saveError);
                    setMessages([
                        ...updatedMessages,
                        {
                            role: "assistant",
                            content: "Message saved locally, but failed to sync with server. Try again later. 😅",
                        },
                    ]);
                }
            } else {
                console.warn("User not authenticated, skipping chat save.");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessages([
                ...newMessages,
                { role: "assistant", content: "An error occurred. Please try again. 😅" },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    if (!isLoaded) {
        return (
            <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-700 min-h-screen flex items-center justify-center">
                <p className="text-white text-lg font-semibold">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-700 min-h-screen flex items-center justify-center">
                <div className="text-center text-white">
                    <p className="text-lg font-semibold mb-4">Please sign in to start chatting.</p>
                    <Link href="/sign-in">
                        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
                            Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-700 min-h-screen flex flex-col relative">
            <div className="absolute top-4 right-4">
                <div className="transform scale-125">
                    <UserButton />
                </div>
            </div>

            <div className="flex-grow flex items-center justify-center py-4 sm:py-6">
                <div className="w-full px-4 sm:px-6 flex flex-col space-y-4 sm:space-y-6">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-white drop-shadow-lg">
                        Chat with AI
                    </h1>
                    <div className="text-center">
                        <Link href="/">
                            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                    <div
                        id="chat-container"
                        ref={chatContainerRef}
                        className="w-full p-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl max-h-96 overflow-y-auto border border-white/20"
                    >
                        {messages.slice(1).map((msg, index) => (
                            <div
                                key={index}
                                className={`${msg.role === "user"
                                    ? "ml-auto bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800"
                                    : "bg-white bg-opacity-20 text-white"
                                    } animate-fade-in m-2 p-3 rounded-xl max-w-[90%] sm:max-w-[75%] shadow-md transition-all duration-300`}
                            >
                                <div
                                    dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, "<br>") }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className={isLoading ? "flex flex-col sm:flex-row justify-center items-center" : "hidden"}>
                        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-pink-500"></div>
                        <p className="ml-0 sm:ml-2 mt-2 sm:mt-0 text-white font-medium text-sm sm:text-base">
                            Loading, please wait (may take up to 30 seconds)...
                        </p>
                    </div>
                    <div className="input-container flex items-center bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-md p-1.5 sm:p-2 w-full border border-white/20">
                        <Input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                            className="flex-grow min-w-0 bg-transparent text-gray-800 placeholder-gray-400 border-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                            placeholder="Type your message..."
                        />
                        <Button
                            onClick={sendMessage}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 ml-2"
                        >
                            Send
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
