import React, { useState, useEffect } from 'react';
import { useLoaderData, useParams, Link } from 'react-router';
import CountdownTimer from '../Home/CountdownTimer';

const EventDetails = () => {
    const loadedEvent = useLoaderData();
    const { id } = useParams();
    const [event, setEvent] = useState(loadedEvent || null);
    const [loading, setLoading] = useState(!loadedEvent);

    useEffect(() => {
        if (!event) {
            fetch(`http://localhost:3000/events/${id}`)
                .then(r => r.json())
                .then(data => { setEvent(data); setLoading(false); })
                .catch(() => setLoading(false));
        }
    }, [event, id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
                <div className="w-10 h-10 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4"
                style={{ background: 'var(--bg-primary)' }}>
                <span className="text-6xl mb-4">⚠️</span>
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk,sans-serif' }}>
                    Event Not Found
                </h2>
                <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
                    This event doesn't exist or has been removed.
                </p>
                <Link to="/events" className="btn-premium px-6 py-2.5 text-sm rounded-xl">Back to Events</Link>
            </div>
        );
    }

    const { name, image, price, date, time, venue, category, description, seatsTotal, seatsBooked } = event;
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
    const isFull = seatsBooked >= seatsTotal;
    const isFree = !price || parseFloat(price) === 0;
    const isUpcoming = new Date(date) > new Date();
    const pct = Math.min((seatsBooked / seatsTotal) * 100, 100);

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="page-fade">

            {/* Hero image */}
            <div className="relative w-full" style={{ height: '320px', maxHeight: '420px' }}>
                <img
                    src={image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200';
                    }}
                />
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)' }} />
                <Link to="/events"
                    className="absolute top-4 left-4 flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:bg-white/20"
                    style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
                    ← Back
                </Link>
            </div>

            <div className="section-container py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main content */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 rounded-full text-sm font-bold text-white"
                                style={{ background: 'var(--gradient-accent)' }}>
                                {category}
                            </span>
                            {isFree
                                ? <span className="px-3 py-1 rounded-full text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#059669,#10b981)' }}>FREE ENTRY</span>
                                : <span className="px-3 py-1 rounded-full text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>Fee: ৳ {price}</span>
                            }
                            {!isUpcoming && (
                                <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                                    Completed
                                </span>
                            )}
                        </div>

                        <h1 className="text-2xl md:text-4xl font-extrabold leading-tight"
                            style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                            {name}
                        </h1>

                        {/* Countdown */}
                        {isUpcoming && (
                            <div className="rounded-2xl p-6 text-center"
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                                <p className="text-xs font-bold uppercase tracking-widest mb-4"
                                    style={{ color: 'var(--text-muted)' }}>
                                    Event Starts In
                                </p>
                                <div className="flex justify-center">
                                    <CountdownTimer targetDate={date} />
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="rounded-2xl p-6"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                            <h3 className="font-bold text-lg mb-4"
                                style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                                About the Event
                            </h3>
                            <p className="leading-relaxed text-sm md:text-base whitespace-pre-line"
                                style={{ color: 'var(--text-secondary)' }}>
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* Side panel */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl p-6 sticky top-24 flex flex-col gap-5"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
                            <h3 className="font-bold text-base pb-3"
                                style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', borderBottom: '1px solid var(--border-color)' }}>
                                Event Details
                            </h3>

                            {[
                                { icon: '📅', label: 'Date', val: formattedDate },
                                { icon: '⏰', label: 'Time', val: time || 'TBD' },
                                { icon: '📍', label: 'Venue', val: venue },
                            ].map(({ icon, label, val }) => (
                                <div key={label} className="flex items-start gap-3">
                                    <span className="text-xl mt-0.5">{icon}</span>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
                                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{val}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Seat info */}
                            <div className="pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                                <div className="flex items-center justify-between text-xs mb-2">
                                    <span style={{ color: 'var(--text-muted)' }}>👥 Seats Availability</span>
                                    <span className="font-semibold" style={{ color: isFull ? '#dc2626' : 'var(--accent)' }}>
                                        {isFull ? 'Full' : `${seatsTotal - seatsBooked} left`}
                                    </span>
                                </div>
                                <div className="progress-bar-track">
                                    <div className={`progress-bar-fill ${isFull ? 'full' : ''}`} style={{ width: `${pct}%` }} />
                                </div>
                                <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
                                    {seatsBooked} / {seatsTotal} registered
                                </p>
                            </div>

                            {/* CTA */}
                            <div className="mt-2">
                                {isFull ? (
                                    <button disabled className="w-full py-3 rounded-xl font-semibold text-sm cursor-not-allowed"
                                        style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}>
                                        Sold Out
                                    </button>
                                ) : !isUpcoming ? (
                                    <button disabled className="w-full py-3 rounded-xl font-semibold text-sm cursor-not-allowed"
                                        style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                                        Event Finished
                                    </button>
                                ) : (
                                    <Link to={`/register-event/${event._id}`}
                                        className="btn-premium w-full py-3 rounded-xl font-semibold text-sm text-center block"
                                        style={{ animation: 'pulseGlow 2.5s ease-in-out infinite' }}>
                                        🎟️ Register to Attend
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
