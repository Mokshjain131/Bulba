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

    async function validateIdea() {
        setMessages(prev => [
            ...prev,
            { type: 'user', content: `Validate Idea: ${businessIdea}` }
        ])

        const response = await fetch('https://pterodactyl-backend.onrender.com/validate_idea/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idea: businessIdea,
                market: searchQuery, 
                target_audience: 'General' 
            })
        })
        const data = await response.json()
        const cleanedAnalysis = data.analysis.replace(/\*/g, ''); 
        setMessages(prev => [
            ...prev,
            { type: 'assistant', content: cleanedAnalysis }
        ])
        setBusinessIdea('') 
    }

    async function getStrategicAdvice() {
        setMessages(prev => [
            ...prev,
            { type: 'user', content: `Strategic Advice for Idea: ${businessIdea}` }
        ])

        const response = await fetch('https://pterodactyl-backend.onrender.com/strategic_advice/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                business_stage: 'N/A',
                current_challenges: 'N/A', 
                goals: 'N/A', 
                business_idea: businessIdea
            })
        })
        const data = await response.json()
        const cleanedAdvice = data.advice.replace(/\*/g, ''); 
        setMessages(prev => [
            ...prev,
            { type: 'assistant', content: cleanedAdvice }
        ])
        setBusinessIdea('') 
    }

    async function getScalingAdvice() {
        setMessages(prev => [
            ...prev,
            { type: 'user', content: `Scaling Advice for Idea: ${businessIdea}` }
        ])

        const response = await fetch('https://pterodactyl-backend.onrender.com/scaling/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                current_operations: 'N/A',
                growth_targets: 'N/A', 
                resources: 'N/A',
                business_idea: businessIdea
            })
        })
        const data = await response.json()
        const cleanedScalingPlan = data.scaling_plan.replace(/\*/g, ''); 
        setMessages(prev => [
            ...prev,
            { type: 'assistant', content: cleanedScalingPlan }
        ])
        setBusinessIdea('') 
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

                    <div className="input-container">
                        <div id="GeneralPurposeFlex">
                        <h3>Business Idea Input:</h3>
                        </div>
                        <input
                            type="text"
                            value={businessIdea}
                            onChange={(e) => setBusinessIdea(e.target.value)}
                            placeholder="Enter your business idea..."
                        />
                        <button
                            onClick={validateIdea}
                            disabled={!businessIdea.trim()}
                        >
                            Validate Idea
                        </button>
                        <button
                            onClick={getStrategicAdvice}
                            disabled={!businessIdea.trim()}
                        >
                            Get Strategic Advice
                        </button>
                        <button
                            onClick={getScalingAdvice}
                            disabled={!businessIdea.trim()}
                        >
                            Get Scaling Advice
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




