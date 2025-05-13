import Image from 'next/image';
import Link from 'next/link';
import MotionWrapperDelay from './components/FramerMotion/MotionWrapperDelay';
import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 min-h-screen flex items-center justify-center">
      <div className="container mx-auto p-6 max-w-2xl gradient-background2 bg-opacity-90 rounded-2xl shadow-2xl">
        <UserButton />
        <MotionWrapperDelay
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          variants={{
            hidden: { opacity: 0, y: 100 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <h1 className="text-4xl font-extrabold text-center gradient-title mb-4">Welcome to AI Chat</h1>
        </MotionWrapperDelay>

        <Image
          src="/landing.jpg"
          alt="AI Chat Illustration"
          width={600}
          height={400}
          className="my-6 mx-auto max-w-full h-auto rounded-lg shadow-md"
        />
        <p className="text-center text-lg text-gray-600 mb-6">
          Engage with our AI assistant to explore any topic, ask questions, or enjoy a meaningful conversation.
          Powered by cutting-edge language models for insightful responses.
        </p>
        <div className="text-center">
          <Link href="/chat">
            <button className="inline-block bg-purple-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-600 transition duration-300">
              Start Chatting
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}