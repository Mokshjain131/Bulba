import React, { useState } from 'react'
import '../styles/chat.css'
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function Chat() {
    const [searchQuery, setSearchQuery] = useState('')
    const [messages, setMessages] = useState([])
    const [businessIdea, setBusinessIdea] = useState('')

    async function fetchLinks() {
        setMessages(prev => [
            ...prev,
            { type: 'user', content: searchQuery }
        ])

        const response = await fetch('https://pterodactyl-backend.onrender.com/ai/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: searchQuery,
                k: 2
            })
        })
        const data = await response.json()
        
        if (data.success) {
            const cleanedResponse = data.response.replace(/\*/g, '');
            setMessages(prev => [
                ...prev,
                { type: 'assistant', content: cleanedResponse } 
            ])
        } else {
            setMessages(prev => [
                ...prev,
                { type: 'assistant', content: "An error occurred while fetching the response." }
            ])
        }
        setSearchQuery('') 
    }

    return (
        <div className="chat-container">
            <Navbar />
            <div className="chat-content">
                <div className="messages-container">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.type}`}>
                            <div className="message-content">
                                {message.type === 'user' ? (
                                    message.content
                                ) : (
                                    <pre>
                                        {typeof message.content === 'string' ? message.content : JSON.stringify(message.content, null, 2)}
                                    </pre>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div id="ColumnFlexer">
                    <div className="input-container">
                    <div id="GeneralPurposeFlex">
                    <h3>General-Utility:</h3>
                    </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && searchQuery.trim()) {
                                    fetchLinks();
                                }
                            }}
                            placeholder="Search..."
                        />
                        <button
                            onClick={fetchLinks}
                            disabled={!searchQuery.trim()}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
            <br />
            <Footer />
        </div>
    )
}

export default Chat




