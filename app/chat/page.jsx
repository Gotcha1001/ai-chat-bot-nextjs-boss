'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserButton } from '@clerk/nextjs';

const cleanMarkdown = (text) => {
    let cleanedText = text;
    cleanedText = cleanedText.replace(/^#{1,4}\s*/gm, '');
    cleanedText = cleanedText.replace(/\*\*(.*?)\*\*/g, '$1');
    cleanedText = cleanedText.replace(/__(.*?)__/g, '$1');
    cleanedText = cleanedText.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '$1');
    cleanedText = cleanedText.replace(/_(.*?)_/g, '$1');

    const lines = cleanedText.split('\n');
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

    cleanedText = cleanedLines.join('\n');
    cleanedText = cleanedText.replace(/\n\s*\n+/g, '\n\n');
    return cleanedText.trim();
};

export default function Chat() {
    const [messages, setMessages] = useState([
        { role: 'system', content: 'You are a helpful assistant' },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });

            const systemPrompt = 'You are a helpful assistant. Answer clearly and appropriately. Keep answers concise for simple questions; provide detailed information for recipes or any instructions. Please answer in a light hearted way with jokes in between your information as a final ending note, make use of emojis';
            const formattedMessages = [
                { role: 'user', parts: [{ text: systemPrompt }] },
                { role: 'model', parts: [{ text: 'I understand and will follow these guidelines.' }] },
                ...newMessages.map((msg) => ({
                    role: msg.role === 'user' ? 'user' : 'model',
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
            setMessages([...newMessages, { role: 'assistant', content: cleanedText }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages([...newMessages, { role: 'assistant', content: 'An error occurred. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 min-h-screen flex flex-col relative">
            {/* UserButton positioned in the top-right corner */}
            <div className="absolute top-4 right-4">
                <div className="transform scale-125">
                    <UserButton />
                </div>
            </div>

            {/* Main content centered */}
            <div className="flex-grow flex items-center justify-center">

                <div className="container mx-auto p-6 max-w-3xl flex flex-col space-y-6">
                    <h1 className="text-4xl font-extrabold text-center text-white">Chat with AI</h1>
                    <div className="text-center">
                        <Link href="/">
                            <button className="inline-block bg-purple-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-600 transition duration-300">
                                Back to Home
                            </button>
                        </Link>
                    </div>
                    <div id="chat-container" ref={chatContainerRef} className="p-4 bg-white bg-opacity-90 rounded-2xl shadow-2xl">
                        {messages.slice(1).map((msg, index) => (
                            <div
                                key={index}
                                className={
                                    msg.role === 'user'
                                        ? 'user-message ml-auto bg-gray-300 text-gray-800'
                                        : 'ai-message bg-white text-gray-800'
                                }
                                style={{ margin: '8px 12px', padding: '12px', borderRadius: '12px', maxWidth: '75%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                            >
                                <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br>') }} />
                            </div>
                        ))}
                    </div>
                    <div className={isLoading ? 'flex justify-center items-center' : 'hidden'}>
                        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-purple-500"></div>
                        <p className="ml-2 text-white font-medium">Loading, please wait (may take up to 30 seconds)...</p>
                    </div>
                    <div className="input-container flex items-center bg-white bg-opacity-90 rounded-xl shadow-md p-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            className="flex-grow p-3 rounded-l-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Type your message..."
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-purple-500 text-white p-3 rounded-r-lg hover:bg-purple-600 transition duration-300"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}