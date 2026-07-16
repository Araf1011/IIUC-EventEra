import React from 'react';
import { Link } from 'react-router';

const EventCard = ({ event }) => {
    const { _id, name, image, price, date, category, venue, seatsTotal, seatsBooked } = event;

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    const isFull = seatsBooked >= seatsTotal;
    const isFree = !price || parseFloat(price) === 0;
    const remaining = seatsTotal - seatsBooked;
    const pct = Math.min((seatsBooked / seatsTotal) * 100, 100);

    return (
        <div className="surface-card overflow-hidden flex flex-col h-full" style={{ borderRadius: '1.25rem' }}>
            {/* Image */}
            <div className="relative overflow-hidden" style={{ height: '200px' }}>
                <img
                    src={image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600'}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600';
                    }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: 'var(--gradient-accent)' }}>
                        {category}
                    </span>
                    {isFull && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                            style={{ background: 'linear-gradient(135deg,#dc2626,#ef4444)' }}>
                            Full
                        </span>
                    )}
                </div>

                {/* Date chip */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold text-white"
                    style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
                    📅 {formattedDate}
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-5">
                <h3 className="font-bold text-base mb-2 line-clamp-2 leading-snug"
                    style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {name}
                </h3>

                <div className="flex flex-col gap-1.5 mb-4">
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span>📍</span><span className="truncate">{venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span>👥</span><span>{remaining} of {seatsTotal} seats left</span>
                    </div>
                </div>

                {/* Seat progress */}
                <div className="progress-bar-track mb-4">
                    <div className={`progress-bar-fill ${isFull ? 'full' : ''}`} style={{ width: `${pct}%` }} />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-3"
                    style={{ borderTop: '1px solid var(--border-color)' }}>
                    <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>
                            Fee
                        </div>
                        <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                            {isFree
                                ? <span style={{ color: '#059669' }}>FREE</span>
                                : `৳ ${price}`
                            }
                        </div>
                    </div>
                    <Link to={`/events/${_id}`} className="btn-premium px-4 py-2 text-xs rounded-lg">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
