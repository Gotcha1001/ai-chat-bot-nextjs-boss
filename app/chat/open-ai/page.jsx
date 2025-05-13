// "use client";

// import { useState, useEffect, useRef } from "react";
// import { UserButton } from "@clerk/nextjs";
// import Link from "next/link";

// const cleanMarkdown = (text) => {
//     let cleanedText = text
//         .replace(/^#{1,4}\s*/gm, "")
//         .replace(/\*\*(.*?)\*\*/g, "$1")
//         .replace(/__(.*?)__/g, "$1")
//         .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "$1")
//         .replace(/_(.*?)_/g, "$1");

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

//     cleanedText = cleanedLines.join("\n").replace(/\n\s*\n+/g, "\n\n");
//     return cleanedText.trim();
// };

// export default function DefineChatMood() {
//     const [personality, setPersonality] = useState("");
//     const [input, setInput] = useState("");
//     const [isPersonalityConfirmed, setIsPersonalityConfirmed] = useState(false);
//     const [messages, setMessages] = useState([
//         { role: "system", content: "Define your AI's personality to start chatting!" },
//     ]);
//     const [isLoading, setIsLoading] = useState(false);
//     const chatContainerRef = useRef(null);

//     const confirmPersonality = () => {
//         if (!personality.trim()) {
//             setMessages([
//                 ...messages,
//                 { role: "assistant", content: "Please enter a personality! 😊" },
//             ]);
//             return;
//         }
//         setIsPersonalityConfirmed(true);
//         setMessages([
//             ...messages,
//             { role: "assistant", content: `Personality set to "${personality}"! Let's chat! 🎉` },
//         ]);
//     };

//     const resetPersonality = () => {
//         setIsPersonalityConfirmed(false);
//         setMessages([
//             { role: "system", content: "Define your AI's personality to start chatting!" },
//         ]);
//         setPersonality("");
//     };

//     const sendMessage = async () => {
//         if (!input.trim()) {
//             setMessages([
//                 ...messages,
//                 { role: "assistant", content: "Please type a message! 😅" },
//             ]);
//             return;
//         }

//         const newMessages = [...messages, { role: "user", content: input }];
//         setMessages(newMessages);
//         setInput("");
//         setIsLoading(true);

//         try {
//             const response = await fetch("/api/chat-personality", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ personality, message: input }),
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 const cleanedText = cleanMarkdown(data);
//                 setMessages([...newMessages, { role: "assistant", content: cleanedText }]);
//             } else {
//                 throw new Error(data.error || "Failed to get response");
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             setMessages([
//                 ...newMessages,
//                 { role: "assistant", content: "Oops, something went wrong! Try again. 😅" },
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

//     return (
//         <div className="bg-gradient-to-br from-purple-600 to-indigo-700 min-h-screen flex flex-col relative">
//             <div className="absolute top-4 right-4">
//                 <div className="transform scale-125">
//                     <UserButton />
//                 </div>
//             </div>

//             <div className="flex-grow flex items-center justify-center">
//                 <div className="container mx-auto p-6 max-w-3xl flex flex-col space-y-6">
//                     <h1 className="text-4xl font-extrabold text-center text-white">
//                         Define Your Chat Mood
//                     </h1>
//                     <div className="text-center">
//                         <Link href="/">
//                             <button className="inline-block bg-purple-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-600 transition duration-300">
//                                 Back to Home
//                             </button>
//                         </Link>
//                     </div>

//                     <div className="input-container flex items-center bg-white bg-opacity-90 rounded-xl shadow-md p-2">
//                         <input
//                             type="text"
//                             value={personality}
//                             onChange={(e) => setPersonality(e.target.value)}
//                             disabled={isPersonalityConfirmed}
//                             className="flex-grow p-3 rounded-l-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                             placeholder="Enter AI personality (e.g., Witty, Sarcastic, Friendly)..."
//                         />
//                         {!isPersonalityConfirmed && (
//                             <button
//                                 onClick={confirmPersonality}
//                                 className="bg-purple-500 text-white p-3 rounded-r-lg hover:bg-purple-600 transition duration-300"
//                             >
//                                 Confirm
//                             </button>
//                         )}
//                     </div>

//                     {isPersonalityConfirmed && (
//                         <div className="text-center">
//                             <button
//                                 onClick={resetPersonality}
//                                 className="inline-block bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
//                             >
//                                 Change Personality
//                             </button>
//                         </div>
//                     )}

//                     <div
//                         id="chat-container"
//                         ref={chatContainerRef}
//                         className="p-4 bg-white bg-opacity-90 rounded-2xl shadow-2xl max-h-96 overflow-y-auto"
//                     >
//                         {messages.slice(1).map((msg, index) => (
//                             <div
//                                 key={index}
//                                 className={
//                                     msg.role === "user"
//                                         ? "user-message ml-auto bg-gray-300 text-gray-800"
//                                         : "ai-message bg-white text-gray-800"
//                                 }
//                                 style={{
//                                     margin: "8px 12px",
//                                     padding: "12px",
//                                     borderRadius: "12px",
//                                     maxWidth: "75%",
//                                     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//                                 }}
//                             >
//                                 <div
//                                     dangerouslySetInnerHTML={{
//                                         __html: msg.content.replace(/\n/g, "<br>"),
//                                     }}
//                                 />
//                             </div>
//                         ))}
//                     </div>

//                     {isPersonalityConfirmed && (
//                         <>
//                             <div className={isLoading ? "flex justify-center items-center" : "hidden"}>
//                                 <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-purple-500"></div>
//                                 <p className="ml-2 text-white font-medium">
//                                     Loading, please wait (may take up to 30 seconds)...
//                                 </p>
//                             </div>

//                             <div className="input-container flex items-center bg-white bg-opacity-90 rounded-xl shadow-md p-2">
//                                 <input
//                                     type="text"
//                                     value={input}
//                                     onChange={(e) => setInput(e.target.value)}
//                                     onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//                                     className="flex-grow p-3 rounded-l-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                     placeholder="Type your message..."
//                                 />
//                                 <button
//                                     onClick={sendMessage}
//                                     className="bg-purple-500 text-white p-3 rounded-r-lg hover:bg-purple-600 transition duration-300"
//                                 >
//                                     Send
//                                 </button>
//                             </div>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }




// "use client";

// import { useState, useEffect, useRef } from "react";
// import { UserButton } from "@clerk/nextjs";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";

// const cleanMarkdown = (text) => {
//     let cleanedText = text
//         .replace(/^#{1,4}\s*/gm, "")
//         .replace(/\*\*(.*?)\*\*/g, "$1")
//         .replace(/__(.*?)__/g, "$1")
//         .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "$1")
//         .replace(/_(.*?)_/g, "$1");

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

//     cleanedText = cleanedLines.join("\n").replace(/\n\s*\n+/g, "\n\n");
//     return cleanedText.trim();
// };

// export default function DefineChatMood() {
//     const [personality, setPersonality] = useState("");
//     const [input, setInput] = useState("");
//     const [isPersonalityConfirmed, setIsPersonalityConfirmed] = useState(false);
//     const [messages, setMessages] = useState([
//         { role: "system", content: "Define your AI's personality to start chatting!" },
//     ]);
//     const [isLoading, setIsLoading] = useState(false);
//     const chatContainerRef = useRef(null);

//     const confirmPersonality = () => {
//         if (!personality.trim()) {
//             setMessages([
//                 ...messages,
//                 { role: "assistant", content: "Please enter a personality! 😊" },
//             ]);
//             return;
//         }
//         console.log(`New personality set: ${personality}`);
//         setIsPersonalityConfirmed(true);
//         setMessages([
//             ...messages,
//             { role: "assistant", content: `Personality set to "${personality}"! Let's chat! 🎉` },
//         ]);
//     };

//     const resetPersonality = () => {
//         setIsPersonalityConfirmed(false);
//         setMessages([
//             { role: "system", content: "Define your AI's personality to start chatting!" },
//         ]);
//         setPersonality("");
//     };

//     const sendMessage = async () => {
//         if (!input.trim()) {
//             setMessages([
//                 ...messages,
//                 { role: "assistant", content: "Please type a message! 😅" },
//             ]);
//             return;
//         }

//         const newMessages = [...messages, { role: "user", content: input }];
//         setMessages(newMessages);
//         setInput("");
//         setIsLoading(true);

//         try {
//             const response = await fetch("/api/chat-personality", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ personality, message: input }),
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 const cleanedText = cleanMarkdown(data);
//                 setMessages([...newMessages, { role: "assistant", content: cleanedText }]);
//             } else {
//                 throw new Error(data.error || "Failed to get response");
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             setMessages([
//                 ...newMessages,
//                 { role: "assistant", content: "Oops, something went wrong! Try again. 😅" },
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

//     // Capitalize the first letter of the personality for the title
//     const displayTitle = isPersonalityConfirmed
//         ? `${personality.charAt(0).toUpperCase() + personality.slice(1)} Chat`
//         : "Define Your Chat Mood";

//     return (
//         <div className="bg-gradient-to-br from-purple-600 to-indigo-700 min-h-screen flex flex-col relative">
//             <div className="absolute top-4 right-4">
//                 <div className="transform scale-125">
//                     <UserButton />
//                 </div>
//             </div>

//             <div className="flex-grow flex items-center justify-center">
//                 <div className="container mx-auto p-6 max-w-3xl flex flex-col space-y-6">
//                     <h1 className="text-4xl font-extrabold text-center text-white">
//                         {displayTitle}
//                     </h1>
//                     <div className="text-center">
//                         <Link href="/">
//                             <Button
//                                 variant="ghost"
//                                 className="text-white px-6 py-3 hover:bg-purple-600 transition duration-300"
//                             >
//                                 Back to Home
//                             </Button>
//                         </Link>
//                     </div>

//                     <div className="input-container flex items-center bg-white bg-opacity-90 rounded-xl shadow-md p-2">
//                         <input
//                             type="text"
//                             value={personality}
//                             onChange={(e) => setPersonality(e.target.value)}
//                             disabled={isPersonalityConfirmed}
//                             className="flex-grow p-3 rounded-l-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                             placeholder="Enter AI personality (e.g., Witty, Sarcastic, Friendly)..."
//                         />
//                         {!isPersonalityConfirmed && (
//                             <Button
//                                 onClick={confirmPersonality}
//                                 variant="default"
//                                 className="bg-purple-500 text-white p-3 rounded-r-lg hover:bg-purple-600 transition duration-300"
//                             >
//                                 Confirm
//                             </Button>
//                         )}
//                     </div>

//                     {isPersonalityConfirmed && (
//                         <div className="text-center">
//                             <Button
//                                 onClick={resetPersonality}
//                                 variant="secondary"
//                                 className="bg-gray-500 text-white px-4 py-2 hover:bg-gray-600 transition duration-300"
//                             >
//                                 Change Personality
//                             </Button>
//                         </div>
//                     )}

//                     <div
//                         id="chat-container"
//                         ref={chatContainerRef}
//                         className="p-4 bg-white bg-opacity-90 rounded-2xl shadow-2xl max-h-96 overflow-y-auto"
//                     >
//                         {messages.slice(1).map((msg, index) => (
//                             <div
//                                 key={index}
//                                 className={
//                                     msg.role === "user"
//                                         ? "user-message ml-auto bg-gray-300 text-gray-800"
//                                         : "ai-message bg-white text-gray-800"
//                                 }
//                                 style={{
//                                     margin: "8px 12px",
//                                     padding: "12px",
//                                     borderRadius: "12px",
//                                     maxWidth: "75%",
//                                     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//                                 }}
//                             >
//                                 <div
//                                     dangerouslySetInnerHTML={{
//                                         __html: msg.content.replace(/\n/g, "<br>"),
//                                     }}
//                                 />
//                             </div>
//                         ))}
//                     </div>

//                     {isPersonalityConfirmed && (
//                         <>
//                             <div
//                                 className={
//                                     isLoading
//                                         ? "flex justify-center items-center"
//                                         : "hidden"
//                                 }
//                             >
//                                 <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-purple-500"></div>
//                                 <p className="ml-2 text-white font-medium">
//                                     Loading, please wait (may take up to 30 seconds)...
//                                 </p>
//                             </div>

//                             <div className="input-container flex items-center bg-white bg-opacity-90 rounded-xl shadow-md p-2">
//                                 <input
//                                     type="text"
//                                     value={input}
//                                     onChange={(e) => setInput(e.target.value)}
//                                     onKeyPress={(e) =>
//                                         e.key === "Enter" && sendMessage()
//                                     }
//                                     className="flex-grow p-3 rounded-l-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                     placeholder="Type your message..."
//                                 />
//                                 <Button
//                                     onClick={sendMessage}
//                                     variant="default"
//                                     className="bg-purple-500 text-white p-3 rounded-r-lg hover:bg-purple-600 transition duration-300"
//                                 >
//                                     Send
//                                 </Button>
//                             </div>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }



"use client";

import { useState, useEffect, useRef } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const cleanMarkdown = (text) => {
    let cleanedText = text
        .replace(/^#{1,4}\s*/gm, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/__(.*?)__/g, "$1")
        .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "$1")
        .replace(/_(.*?)_/g, "$1");

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

    cleanedText = cleanedLines.join("\n").replace(/\n\s*\n+/g, "\n\n");
    return cleanedText.trim();
};

export default function DefineChatMood() {
    const [personality, setPersonality] = useState("");
    const [input, setInput] = useState("");
    const [isPersonalityConfirmed, setIsPersonalityConfirmed] = useState(false);
    const [messages, setMessages] = useState([
        { role: "system", content: "Define your AI's personality to start chatting!" },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);

    const confirmPersonality = () => {
        if (!personality.trim()) {
            setMessages([
                ...messages,
                { role: "assistant", content: "Please enter a personality! 😊" },
            ]);
            return;
        }
        console.log(`New personality set: ${personality}`);
        setIsPersonalityConfirmed(true);
        setMessages([
            ...messages,
            { role: "assistant", content: `Personality set to "${personality}"! Let's chat! 🎉` },
        ]);
    };

    const resetPersonality = () => {
        setIsPersonalityConfirmed(false);
        setMessages([
            { role: "system", content: "Define your AI's personality to start chatting!" },
        ]);
        setPersonality("");
    };

    const sendMessage = async () => {
        if (!input.trim()) {
            setMessages([
                ...messages,
                { role: "assistant", content: "Please type a message! 😅" },
            ]);
            return;
        }

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat-personality", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ personality, message: input }),
            });

            const data = await response.json();

            if (response.ok) {
                const cleanedText = cleanMarkdown(data);
                setMessages([...newMessages, { role: "assistant", content: cleanedText }]);
            } else {
                throw new Error(data.error || "Failed to get response");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessages([
                ...newMessages,
                { role: "assistant", content: "Oops, something went wrong! Try again. 😅" },
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

    // Capitalize the first letter of the personality for the title
    const displayTitle = isPersonalityConfirmed
        ? `${personality.charAt(0).toUpperCase() + personality.slice(1)} Chat`
        : "Define Your Chat Mood";

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
                        {displayTitle}
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

                    {!isPersonalityConfirmed && (
                        <div className="input-container flex items-center bg-white bg-opacity-90 rounded-xl shadow-md p-2">
                            <input
                                type="text"
                                value={personality}
                                onChange={(e) => setPersonality(e.target.value)}
                                disabled={isPersonalityConfirmed}
                                className="flex-grow p-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter AI personality (e.g., Witty, Sarcastic, Friendly)..."
                            />
                            <Button
                                onClick={confirmPersonality}
                                variant="default"
                                className="bg-purple-500 text-white p-3 rounded-r-lg hover:bg-purple-600 transition duration-300 ml-5"
                            >
                                Confirm
                            </Button>
                        </div>
                    )}

                    {isPersonalityConfirmed && (
                        <div className="text-center">
                            <Button
                                onClick={resetPersonality}
                                variant="secondary"
                                className="bg-gray-500 text-white px-4 py-2 hover:bg-gray-600 transition duration-300"
                            >
                                Change Personality
                            </Button>
                        </div>
                    )}

                    <div
                        id="chat-container"
                        ref={chatContainerRef}
                        className="p-4 bg-white bg-opacity-90 rounded-2xl shadow-2xl max-h-96 overflow-y-auto"
                    >
                        {messages.slice(1).map((msg, index) => (
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
                        ))}
                    </div>

                    {isPersonalityConfirmed && (
                        <>
                            <div
                                className={
                                    isLoading
                                        ? "flex justify-center items-center"
                                        : "hidden"
                                }
                            >
                                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-purple-500"></div>
                                <p className="ml-2 text-white font-medium">
                                    Loading, please wait (may take up to 30 seconds)...
                                </p>
                            </div>

                            <div className="input-container flex items-center bg-white bg-opacity-90 rounded-xl shadow-md p-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) =>
                                        e.key === "Enter" && sendMessage()
                                    }
                                    className="flex-grow p-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Type your message..."
                                />
                                <Button
                                    onClick={sendMessage}
                                    variant="default"
                                    className="bg-purple-500 text-white p-3 rounded-r-lg hover:bg-purple-600 transition duration-300 ml-5"
                                >
                                    Send
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}