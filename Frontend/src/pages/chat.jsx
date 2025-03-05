import React, { useState } from 'react'
import '../styles/chat.css'
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function Chat() {
    const [searchQuery, setSearchQuery] = useState('')
    const [messages, setMessages] = useState([])

    async function fetchLinks() {
        setMessages(prev => [
            ...prev,
            { type: 'user', content: searchQuery }
        ])

        const response = await fetch('http://localhost:8000/ai/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: searchQuery
            })
        })
        const data = await response.json()
        
        if (data.success) {
            let displayContent = data.response;
            
            // If the response is a JSON string, try to parse it and get just the response value
            if (typeof displayContent === 'string' && displayContent.includes('"response"')) {
                try {
                    const parsedJson = JSON.parse(displayContent);
                    displayContent = parsedJson.response || parsedJson.content || displayContent;
                } catch {
                    // If parsing fails, use the original content
                }
            }

            setMessages(prev => [
                ...prev,
                { type: 'assistant', content: displayContent } 
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
                                    <div style={{ whiteSpace: 'pre-line' }}>
                                        {message.content}
                                    </div>
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




