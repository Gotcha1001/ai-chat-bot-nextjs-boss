import React from 'react'
import ChatspaceProvider from './provider'

// keep this on the server side

function ChatLayout({ children }) {
    return (
        <div>
            <ChatspaceProvider>
                {children}
            </ChatspaceProvider>

        </div>
    )
}

export default ChatLayout