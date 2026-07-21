import React, { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../../Providers/AuthProvider';
import './Chatbot.css';

/* ──────────────────────────────────────────
   Knowledge Base — curated FAQ answers
────────────────────────────────────────── */
const knowledgeBase = [
    {
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'assalamualaikum', 'salam', 'greetings'],
        answer: "Hello! 👋 Welcome to IIUC EventEra. I'm your virtual assistant. How can I help you today? You can ask me about events, registration, payments, or anything else!",
    },
    {
        keywords: ['what is', 'about', 'iiuc eventera', 'this website', 'this site', 'platform', 'what does'],
        answer: "**IIUC EventEra** is the official event management platform of International Islamic University Chittagong (IIUC). Here you can discover upcoming events, register online, pay via bKash/Nagad, download QR passes, and more — all in one place! 🎓",
    },
    {
        keywords: ['register', 'sign up', 'create account', 'join', 'how to register', 'registration'],
        answer: "To register for an event:\n1️⃣ Browse the **Events** page\n2️⃣ Click on an event to see details\n3️⃣ Click **\"Register to Attend\"**\n4️⃣ Fill in your details (name, department, roll, phone)\n5️⃣ Submit — you'll get instant confirmation!\n\nFor paid events, you'll be redirected to the payment page after registration.",
    },
    {
        keywords: ['pay', 'payment', 'bkash', 'nagad', 'fee', 'ticket price', 'how to pay', 'money', 'cost'],
        answer: "For paid events, we accept **bKash** and **Nagad**:\n1️⃣ After registering, go to the payment page\n2️⃣ Send the fee to our admin number shown on screen\n3️⃣ Enter your **Transaction ID (TrxID)** and sender number\n4️⃣ Submit — the admin will verify and approve your payment\n\n💡 Free events don't require any payment!",
    },
    {
        keywords: ['qr', 'ticket', 'pass', 'download', 'qr code', 'entry', 'gate'],
        answer: "Once your registration is approved:\n1️⃣ Go to your **Dashboard**\n2️⃣ Find the event under \"My Registrations\"\n3️⃣ Click **\"Download Ticket\"** to get your QR Pass (PDF)\n4️⃣ Show the QR code at the event gate for entry\n\n📱 The QR code is scanned by organizers for contactless check-in!",
    },
    {
        keywords: ['event', 'upcoming', 'activities', 'schedule', 'what events', 'find event', 'browse'],
        answer: "You can explore all events on the **Events** page! 📅\n\n• Filter by category (Seminar, Workshop, Cultural, Sports, Competition)\n• Search by name or venue\n• View event details, dates, venues, and seat availability\n\nJust click **\"Explore Events\"** in the navbar or visit /events.",
    },
    {
        keywords: ['club', 'clubs', 'student club', 'organizations', 'societies'],
        answer: "IIUC has **8+ active student clubs** across various interests! 🏛️\n\n• ICPS (Programming)\n• IDC (Debate)\n• ISC (Science)\n• ICC (Cultural)\n• Sports, Photography, Robotics, Business clubs\n\nVisit the **Clubs** page to explore them all and see their events!",
    },
    {
        keywords: ['contact', 'reach', 'email', 'phone', 'support', 'help me', 'assistance'],
        answer: "You can reach us through:\n📧 **Email:** c241143@ugrad.iiuc.ac.bd\n📞 **Phone:** +8801887789982\n🕐 **Office Hours:** Sat – Thu, 11 AM – 3 PM\n\nOr use the **Contact** page to send us a message directly. We respond within one business day! ✉️",
    },
    {
        keywords: ['dashboard', 'my events', 'my tickets', 'my registrations', 'profile'],
        answer: "Your **Dashboard** is your personal hub! 🎯\n\nHere you can:\n• View all events you've registered for\n• Check payment status (Pending / Approved / Rejected)\n• Download QR tickets for approved registrations\n• See event details and dates\n\nLog in and click **Dashboard** in the navbar!",
    },
    {
        keywords: ['admin', 'manage', 'organizer', 'panel'],
        answer: "The **Admin Panel** is for event organizers and administrators. It allows:\n• Creating and managing events\n• Reviewing registrations and payments\n• QR ticket scanning at event gates\n• Configuring payment numbers\n• Reading contact messages\n\n🔒 Admin access is restricted to authorized personnel.",
    },
    {
        keywords: ['free', 'no cost', 'free event'],
        answer: "Yes! Many events on IIUC EventEra are completely **FREE** 🎉\n\nFree events don't require any payment. After registration, your pass is automatically approved and you can download your QR ticket right away!",
    },
    {
        keywords: ['seat', 'availability', 'full', 'sold out', 'capacity'],
        answer: "Each event has a limited number of seats. You can see the seat availability on the **Event Details** page with a visual progress bar.\n\n• 🟢 Seats available — register now!\n• 🔴 Sold Out — no more spots available\n\nRegister early to secure your spot!",
    },
    {
        keywords: ['location', 'venue', 'where', 'address', 'map', 'direction'],
        answer: "IIUC EventEra is based at **International Islamic University Chittagong** 🏛️\n\nEach event has its specific venue mentioned on the event details page (e.g., Auditorium 1, Lab 305, Central Playground).\n\nYou can also find our campus location on the **Contact** page map!",
    },
    {
        keywords: ['login', 'log in', 'sign in', 'account', 'google login', 'github'],
        answer: "You can log in using:\n• **Email & Password** — create an account on the Register page\n• **Google** — one-click sign-in with your Google account\n\nOnce logged in, you can register for events, view your dashboard, and download tickets! 🔐",
    },
    {
        keywords: ['thank', 'thanks', 'thank you', 'appreciate'],
        answer: "You're welcome! 😊 If you have any other questions about IIUC EventEra, feel free to ask anytime. Enjoy campus life! 🎓✨",
    },
    {
        keywords: ['bye', 'goodbye', 'see you', 'take care'],
        answer: "Goodbye! 👋 Thanks for chatting with me. Have a great day and enjoy your campus events! 🌟",
    },
];

const quickActions = [
    { label: '📅 Browse Events', query: 'How to find events?' },
    { label: '🎟️ Register', query: 'How to register for events?' },
    { label: '💳 Payment Help', query: 'How to pay for events?' },
    { label: '📱 QR Ticket', query: 'How to download QR ticket?' },
    { label: '🏛️ Clubs', query: 'Tell me about clubs' },
    { label: '✉️ Contact', query: 'How to contact support?' },
];

const fallbackResponses = [
    "I'm not sure about that, but I'd recommend checking the **Events** page or **Contact** page for more information. You can also ask me about registration, payments, or tickets! 😊",
    "Hmm, I don't have specific info on that topic. Try asking about events, registration, payments, QR tickets, or clubs! Or visit our **Contact** page to reach the team directly. ✉️",
    "That's a great question! Unfortunately, I don't have details on that right now. You can explore the website or contact our support team for more help. 🎓",
];

function getTime() {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function findAnswer(input) {
    const lower = input.toLowerCase().trim();

    // Check knowledge base
    let bestMatch = null;
    let bestScore = 0;

    for (const entry of knowledgeBase) {
        let score = 0;
        for (const keyword of entry.keywords) {
            if (lower.includes(keyword)) {
                score += keyword.split(' ').length; // multi-word keywords score higher
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestMatch = entry;
        }
    }

    if (bestMatch && bestScore > 0) {
        return bestMatch.answer;
    }

    // Fallback
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

/* ──────────────────────────────────────────
   Chatbot Component
────────────────────────────────────────── */
const Chatbot = () => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: "Hi there! 👋 I'm the **EventEra Assistant**. Ask me anything about events, registration, payments, or campus activities!",
            time: getTime(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showBadge, setShowBadge] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
            setShowBadge(false);
        }
    }, [isOpen]);

    const handleSend = (text) => {
        const userMsg = (text || input).trim();
        if (!userMsg) return;

        // Add user message
        const newMessages = [
            ...messages,
            { type: 'user', text: userMsg, time: getTime() },
        ];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        // Simulate typing delay (600-1200ms)
        const delay = 600 + Math.random() * 600;
        setTimeout(() => {
            const answer = findAnswer(userMsg);
            setMessages(prev => [
                ...prev,
                { type: 'bot', text: answer, time: getTime() },
            ]);
            setIsTyping(false);
        }, delay);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Render markdown-like bold text
    const renderText = (text) => {
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <strong key={i} style={{ color: '#FFBE91', fontWeight: 700 }}>
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            return <span key={i}>{part}</span>;
        });
    };

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window">
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <div className="chatbot-avatar">🤖</div>
                            <div className="chatbot-header-text">
                                <h4>EventEra Assistant</h4>
                                <p>
                                    <span className="chatbot-online-dot" />
                                    Online — Ready to help
                                </p>
                            </div>
                        </div>
                        <button
                            className="chatbot-close-btn"
                            onClick={() => setIsOpen(false)}
                            title="Close chat"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="chatbot-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`chatbot-msg ${msg.type}`}>
                                <div className="chatbot-msg-avatar" style={{ overflow: 'hidden' }}>
                                    {msg.type === 'bot' ? (
                                        '🤖'
                                    ) : user?.photoURL ? (
                                        <img src={user.photoURL} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        '👤'
                                    )}
                                </div>
                                <div>
                                    <div className="chatbot-msg-bubble" style={{ whiteSpace: 'pre-line' }}>
                                        {renderText(msg.text)}
                                    </div>
                                    <div className="chatbot-msg-time">{msg.time}</div>
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="chatbot-typing">
                                <div className="chatbot-msg-avatar" style={{
                                    width: 28, height: 28, borderRadius: 8,
                                    background: 'linear-gradient(135deg, #FFBE91, #FFDDB0)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.75rem',
                                }}>🤖</div>
                                <div className="chatbot-typing-dots">
                                    <span /><span /><span />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    <div className="chatbot-quick-actions">
                        {quickActions.map(({ label, query }) => (
                            <button
                                key={label}
                                className="chatbot-quick-btn"
                                onClick={() => handleSend(query)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="chatbot-input-area">
                        <input
                            ref={inputRef}
                            className="chatbot-input"
                            type="text"
                            placeholder="Ask anything about EventEra..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            className="chatbot-send-btn"
                            onClick={() => handleSend()}
                            disabled={!input.trim()}
                            title="Send message"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                className={`chatbot-fab ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title={isOpen ? 'Close chat' : 'Chat with us'}
            >
                {isOpen ? '✕' : '💬'}
                {!isOpen && showBadge && <span className="chatbot-badge">1</span>}
            </button>
        </>
    );
};

export default Chatbot;
