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
        ]);

        try {
            const response = await fetch('http://localhost:8000/ai/', { // Changed to http://
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: searchQuery,
                    // k: 2 Removed unnecessary parameter
                }),
            });

            if (!response.ok) { //check if the response status is okay
                const errorData = await response.json()
                throw new Error(`Server returned ${response.status}: ${errorData.detail}`); //throw and error
            }

            const data = await response.json();

            const cleanedResponse = data.response.replace(/\*/g, '');
            setMessages(prev => [
                ...prev,
                { type: 'assistant', content: cleanedResponse }
            ]);
        } catch (error) {
            console.error("Error in fetchLinks:", error);
            setMessages(prev => [
                ...prev,
                { type: 'assistant', content: `An error occurred while fetching the response: ${error.message}` } //more specific error message
            ]);
        } finally {
            setSearchQuery('');
        }
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




