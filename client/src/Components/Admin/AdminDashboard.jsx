import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalEvents: 0, totalRegistrations: 0, totalUsers: 0, pendingPayments: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://iiuc-eventera.onrender.com/stats')
            .then(r => r.json())
            .then(data => { setStats(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const statCards = [
        { icon: '📅', label: 'Total Events', value: stats.totalEvents, color: 'var(--accent)', bg: 'rgba(255,190,145,0.08)', border: 'rgba(255,190,145,0.15)' },
        { icon: '👥', label: 'Total Users', value: stats.totalUsers, color: 'var(--accent-2)', bg: 'rgba(207,235,255,0.08)', border: 'rgba(207,235,255,0.15)' },
        { icon: '🎟️', label: 'Registrations', value: stats.totalRegistrations, color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.15)' },
        { icon: '💳', label: 'Pending Payments', value: stats.pendingPayments, color: stats.pendingPayments > 0 ? '#FFDDB0' : '#4ade80', bg: stats.pendingPayments > 0 ? 'rgba(255,221,176,0.08)' : 'rgba(74,222,128,0.08)', border: stats.pendingPayments > 0 ? 'rgba(255,221,176,0.2)' : 'rgba(74,222,128,0.15)' },
    ];

    const adminActions = [
        { title: 'Manage Events', icon: '📅', desc: 'View, update, or delete existing university events.', link: '/admin/events', color: 'var(--accent)', bg: 'rgba(255,190,145,0.07)', border: 'rgba(255,190,145,0.2)' },
        { title: 'Add New Event', icon: '➕', desc: 'Create and publish a new university event.', link: '/admin/add-event', color: '#4ade80', bg: 'rgba(74,222,128,0.07)', border: 'rgba(74,222,128,0.2)' },
        { title: 'Manage Registrations', icon: '🎟️', desc: 'View event bookings and verify payment submissions.', link: '/admin/registrations', color: 'var(--accent-2)', bg: 'rgba(207,235,255,0.07)', border: 'rgba(207,235,255,0.2)' },
        { title: 'Scan QR Code Pass', icon: '📷', desc: 'Use device camera to check-in registered students.', link: '/admin/qr-scanner', color: '#FFDDB0', bg: 'rgba(255,221,176,0.07)', border: 'rgba(255,221,176,0.2)' },
        { title: 'Payment Numbers', icon: '💳', desc: 'Configure bKash and Nagad admin numbers.', link: '/admin/payments', color: '#a78bfa', bg: 'rgba(167,139,250,0.07)', border: 'rgba(167,139,250,0.2)' },
        { title: 'Contact Messages', icon: '✉️', desc: 'Read and manage submitted contact messages.', link: '/admin/messages', color: '#f87171', bg: 'rgba(248,113,113,0.07)', border: 'rgba(248,113,113,0.2)' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 animate-spin"
                        style={{ borderColor: 'var(--border-strong)', borderTopColor: 'var(--accent)' }} />
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading dashboard…</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="page-fade">

            {/* Header strip — paddingTop keeps it below the sticky navbar */}
            <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                <div className="section-container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-extrabold"
                                style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                                Admin Control Panel
                            </h1>
                            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                                Manage events, users, billing approvals, and ticketing scanners.
                            </p>
                        </div>
                        <span className="section-badge self-start">⚙ Admin</span>
                    </div>
                </div>
            </div>

            <div className="section-container py-10 flex flex-col gap-10">

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {statCards.map(({ icon, label, value, color, bg, border }) => (
                        <div key={label} className="stat-card" style={{ background: bg, borderColor: border }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4"
                                style={{ background: 'rgba(255,255,255,0.06)' }}>
                                {icon}
                            </div>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                                {label}
                            </p>
                            <h3 className="text-3xl font-extrabold" style={{ color, fontFamily: 'Space Grotesk, sans-serif' }}>
                                {value}
                            </h3>
                        </div>
                    ))}
                </div>

                {/* Action Cards */}
                <div>
                    <h2 className="text-xl font-extrabold mb-6"
                        style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        Management Functions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {adminActions.map((a, i) => (
                            <Link key={i} to={a.link}
                                className="rounded-2xl p-6 flex flex-col gap-3 transition-all duration-250 hover:-translate-y-1 hover:shadow-lg"
                                style={{
                                    background: a.bg,
                                    border: `1px solid ${a.border}`,
                                    textDecoration: 'none',
                                }}>
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl">{a.icon}</span>
                                    <span className="text-lg font-bold" style={{ color: a.color }}>→</span>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                                        {a.title}
                                    </h3>
                                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        {a.desc}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
