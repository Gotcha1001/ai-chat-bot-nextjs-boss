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

//                     {!isPersonalityConfirmed && (
//                         <div className="input-container flex items-center bg-white bg-opacity-90 rounded-xl shadow-md p-2">
//                             <input
//                                 type="text"
//                                 value={personality}
//                                 onChange={(e) => setPersonality(e.target.value)}
//                                 disabled={isPersonalityConfirmed}
//                                 className="flex-grow p-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                 placeholder="Enter AI personality (e.g., Witty, Sarcastic, Friendly)..."
//                             />
//                             <Button
//                                 onClick={confirmPersonality}
//                                 variant="default"
//                                 className="bg-purple-500 text-white p-3 rounded-r-lg hover:bg-purple-600 transition duration-300 ml-5"
//                             >
//                                 Confirm
//                             </Button>
//                         </div>
//                     )}

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
//                                     className="flex-grow p-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                     placeholder="Type your message..."
//                                 />
//                                 <Button
//                                     onClick={sendMessage}
//                                     variant="default"
//                                     className="bg-purple-500 text-white p-3 rounded-r-lg hover:bg-purple-600 transition duration-300 ml-5"
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



// "use client";

// import { useState, useEffect, useRef } from "react";
// import { UserButton, useUser } from "@clerk/nextjs";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { Input } from "@/components/ui/input";

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

//     cleanedText = lines.join("\n").replace(/\n\s*\n+/g, "\n\n");
//     return cleanedText.trim();
// };

// export default function DefineChatMood() {
//     const { user } = useUser();
//     const [personality, setPersonality] = useState("");
//     const [input, setInput] = useState("");
//     const [isPersonalityConfirmed, setIsPersonalityConfirmed] = useState(false);
//     const [messages, setMessages] = useState([
//         { role: "system", content: "Define your AI's personality to start chatting!" },
//     ]);
//     const [isLoading, setIsLoading] = useState(false);
//     const chatContainerRef = useRef(null);
//     const saveChat = useMutation(api.chats.saveChat);

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
//                 const updatedMessages = [
//                     ...newMessages,
//                     { role: "assistant", content: cleanedText },
//                 ];
//                 setMessages(updatedMessages);

//                 if (user?.primaryEmailAddress?.emailAddress) {
//                     try {
//                         await saveChat({
//                             userEmail: user.primaryEmailAddress.emailAddress,
//                             personality,
//                             messages: updatedMessages.filter((msg) => msg.role !== "system"),
//                         });
//                     } catch (saveError) {
//                         console.error("Failed to save chat to Convex:", saveError);
//                         setMessages([
//                             ...updatedMessages,
//                             { role: "assistant", content: "Message saved locally, but failed to sync with server. Try again later." },
//                         ]);
//                     }
//                 } else {
//                     console.warn("User not authenticated, skipping chat save.");
//                 }
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

//     const displayTitle = isPersonalityConfirmed
//         ? `${personality.charAt(0).toUpperCase() + personality.slice(1)} Chat`
//         : "Define Your Chat Mood";

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
//                         {displayTitle}
//                     </h1>
//                     <div className="text-center">
//                         <Link href="/">
//                             <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
//                                 Back to Home
//                             </Button>
//                         </Link>
//                     </div>

//                     {!isPersonalityConfirmed && (
//                         <div className="input-container flex items-center bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-md p-2 w-full border border-white/20">
//                             <Input
//                                 type="text"
//                                 value={personality}
//                                 onChange={(e) => setPersonality(e.target.value)}
//                                 disabled={isPersonalityConfirmed}
//                                 className="flex-grow bg-transparent text-gray-800 placeholder-gray-400 border-none focus:ring-2 focus:ring-purple-500"
//                                 placeholder="Enter AI personality (e.g., Witty, Sarcastic, Friendly)..."
//                             />
//                             <Button
//                                 onClick={confirmPersonality}
//                                 className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
//                             >
//                                 Confirm
//                             </Button>
//                         </div>
//                     )}

//                     {isPersonalityConfirmed && (
//                         <div className="text-center">
//                             <Button
//                                 onClick={resetPersonality}
//                                 className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-xl shadow-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105"
//                             >
//                                 Change Personality
//                             </Button>
//                         </div>
//                     )}

//                     <div
//                         id="chat-container"
//                         ref={chatContainerRef}
//                         className="p-4 bg-purple-900  bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl max-h-96 overflow-y-auto border border-white/20"
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
//                                 <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-pink-500"></div>
//                                 <p className="ml-2 text-white font-medium">
//                                     Loading, please wait (may take up to 30 seconds)...
//                                 </p>
//                             </div>

//                             <div className="input-container flex items-center bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-md p-2 w-full border border-white/20">
//                                 <Input
//                                     type="text"
//                                     value={input}
//                                     onChange={(e) => setInput(e.target.value)}
//                                     onKeyPress={(e) =>
//                                         e.key === "Enter" && sendMessage()
//                                     }
//                                     className="flex-grow bg-transparent text-gray-800 placeholder-gray-400 border-none focus:ring-2 focus:ring-purple-500"
//                                     placeholder="Type your message..."
//                                 />
//                                 <Button
//                                     onClick={sendMessage}
//                                     className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
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


// for mobile devices

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { UserButton, useUser } from "@clerk/nextjs";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { Input } from "@/components/ui/input";

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

//     cleanedText = lines.join("\n").replace(/\n\s*\n+/g, "\n\n");
//     return cleanedText.trim();
// };

// export default function DefineChatMood() {
//     const { user } = useUser();
//     const [personality, setPersonality] = useState("");
//     const [input, setInput] = useState("");
//     const [isPersonalityConfirmed, setIsPersonalityConfirmed] = useState(false);
//     const [messages, setMessages] = useState([
//         { role: "system", content: "Define your AI's personality to start chatting!" },
//     ]);
//     const [isLoading, setIsLoading] = useState(false);
//     const chatContainerRef = useRef(null);
//     const saveChat = useMutation(api.chats.saveChat);

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
//                 const updatedMessages = [
//                     ...newMessages,
//                     { role: "assistant", content: cleanedText },
//                 ];
//                 setMessages(updatedMessages);

//                 if (user?.primaryEmailAddress?.emailAddress) {
//                     try {
//                         await saveChat({
//                             userEmail: user.primaryEmailAddress.emailAddress,
//                             personality,
//                             messages: updatedMessages.filter((msg) => msg.role !== "system"),
//                         });
//                     } catch (saveError) {
//                         console.error("Failed to save chat to Convex:", saveError);
//                         setMessages([
//                             ...updatedMessages,
//                             { role: "assistant", content: "Message saved locally, but failed to sync with server. Try again later." },
//                         ]);
//                     }
//                 } else {
//                     console.warn("User not authenticated, skipping chat save.");
//                 }
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

//     const displayTitle = isPersonalityConfirmed
//         ? `${personality.charAt(0).toUpperCase() + personality.slice(1)} Chat`
//         : "Define Your Chat Mood";

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
//                         {displayTitle}
//                     </h1>
//                     <div className="text-center">
//                         <Link href="/">
//                             <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
//                                 Back to Home
//                             </Button>
//                         </Link>
//                     </div>

//                     {!isPersonalityConfirmed && (
//                         <div className="input-container flex items-center bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-md p-1.5 sm:p-2 w-full border border-white/20">
//                             <Input
//                                 type="text"
//                                 value={personality}
//                                 onChange={(e) => setPersonality(e.target.value)}
//                                 disabled={isPersonalityConfirmed}
//                                 className="flex-grow min-w-0 bg-transparent text-gray-800 placeholder-gray-400 border-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
//                                 placeholder="Enter AI personality (e.g., Witty, Sarcastic, Friendly)..."
//                             />
//                             <Button
//                                 onClick={confirmPersonality}
//                                 className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
//                             >
//                                 Confirm
//                             </Button>
//                         </div>
//                     )}

//                     {isPersonalityConfirmed && (
//                         <div className="text-center">
//                             <Button
//                                 onClick={resetPersonality}
//                                 className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-xl shadow-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105"
//                             >
//                                 Change Personality
//                             </Button>
//                         </div>
//                     )}

//                     <div
//                         id="chat-container"
//                         ref={chatContainerRef}
//                         className="p-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl max-h-96 overflow-y-auto border border-white/20"
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
//                                         ? "flex flex-col sm:flex-row justify-center items-center"
//                                         : "hidden"
//                                 }
//                             >
//                                 <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-pink-500"></div>
//                                 <p className="ml-0 sm:ml-2 mt-2 sm:mt-0 text-white font-medium text-sm sm:text-base">
//                                     Loading, please wait (may take up to 30 seconds)...
//                                 </p>
//                             </div>

//                             <div className="input-container flex items-center bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-md p-1.5 sm:p-2 w-full border border-white/20">
//                                 <Input
//                                     type="text"
//                                     value={input}
//                                     onChange={(e) => setInput(e.target.value)}
//                                     onKeyPress={(e) =>
//                                         e.key === "Enter" && sendMessage()
//                                     }
//                                     className="flex-grow min-w-0 bg-transparent text-gray-800 placeholder-gray-400 border-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
//                                     placeholder="Type your message..."
//                                 />
//                                 <Button
//                                     onClick={sendMessage}
//                                     className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
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
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import MotionWrapperDelay from "@/app/components/FramerMotion/MotionWrapperDelay";
import FeatureMotionWrapper from "@/app/components/FramerMotion/FeatureMotionWrapperMap";

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

    cleanedText = lines.join("\n").replace(/\n\s*\n+/g, "\n\n");
    return cleanedText.trim();
};

export default function DefineChatMood() {
    const { user } = useUser();
    const [personality, setPersonality] = useState("");
    const [input, setInput] = useState("");
    const [isPersonalityConfirmed, setIsPersonalityConfirmed] = useState(false);
    const [messages, setMessages] = useState([
        { role: "system", content: "Define your AI's personality to start chatting!" },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);
    const saveChat = useMutation(api.chats.saveChat);

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
                const updatedMessages = [
                    ...newMessages,
                    { role: "assistant", content: cleanedText },
                ];
                setMessages(updatedMessages);

                if (user?.primaryEmailAddress?.emailAddress) {
                    try {
                        await saveChat({
                            userEmail: user.primaryEmailAddress.emailAddress,
                            personality,
                            messages: updatedMessages.filter((msg) => msg.role !== "system"),
                        });
                    } catch (saveError) {
                        console.error("Failed to save chat to Convex:", saveError);
                        setMessages([
                            ...updatedMessages,
                            { role: "assistant", content: "Message saved locally, but failed to sync with server. Try again later." },
                        ]);
                    }
                } else {
                    console.warn("User not authenticated, skipping chat save.");
                }
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

    const displayTitle = isPersonalityConfirmed
        ? `${personality.charAt(0).toUpperCase() + personality.slice(1)} Chat`
        : "Define Your Chat Mood";

    return (
        <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-700 min-h-screen flex flex-col relative">
            <div className="absolute top-4 right-4">
                <div className="transform scale-125">
                    <UserButton />
                </div>
            </div>

            <div className="flex-grow flex items-center justify-center py-4 sm:py-6">
                <div className="w-full px-4 sm:px-6 flex flex-col space-y-4 sm:space-y-6">
                    <MotionWrapperDelay
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        variants={{
                            hidden: { opacity: 0, y: -100 },
                            visible: { opacity: 1, y: 0 },
                        }}
                    >     <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-white drop-shadow-lg">
                            {displayTitle}
                        </h1>    </MotionWrapperDelay>

                    <div className="text-center">
                        <Link href="/">
                            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
                                Back to Home
                            </Button>
                        </Link>
                    </div>

                    {!isPersonalityConfirmed && (
                        <div className="input-container flex items-center bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-md p-1.5 sm:p-2 w-full border border-white/20">
                            <Input
                                type="text"
                                value={personality}
                                onChange={(e) => setPersonality(e.target.value)}
                                disabled={isPersonalityConfirmed}
                                className="flex-grow min-w-0 bg-transparent text-gray-800 placeholder-gray-400 border-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                                placeholder="Enter AI personality (e.g., Witty, Sarcastic, Friendly)..."
                            />
                            <Button
                                onClick={confirmPersonality}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 ml-2"
                            >
                                Confirm
                            </Button>
                        </div>
                    )}

                    {isPersonalityConfirmed && (
                        <div className="text-center">
                            <Button
                                onClick={resetPersonality}
                                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-xl shadow-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105"
                            >
                                Change Personality
                            </Button>
                        </div>
                    )}

                    <div
                        id="chat-container"
                        ref={chatContainerRef}
                        className="w-full p-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl max-h-96 overflow-y-auto border border-white/20"
                    >
                        {messages.slice(1).map((msg, index) => (
                            <FeatureMotionWrapper key={index} index={index}>
                                <div

                                    className={`${msg.role === "user"
                                        ? "ml-auto bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800"
                                        : "bg-white bg-opacity-20 text-black"
                                        } animate-fade-in m-2 p-3 rounded-xl max-w-[90%] sm:max-w-[75%] shadow-md transition-all duration-300`}
                                >
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: msg.content.replace(/\n/g, "<br>"),
                                        }}
                                    />
                                </div>

                            </FeatureMotionWrapper>

                        ))}
                    </div>

                    {isPersonalityConfirmed && (
                        <>
                            <div
                                className={
                                    isLoading
                                        ? "flex flex-col sm:flex-row justify-center items-center"
                                        : "hidden"
                                }
                            >
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
                                    onKeyPress={(e) =>
                                        e.key === "Enter" && sendMessage()
                                    }
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}