import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = () => {
    const [scanResult, setScanResult] = useState('');
    const [verificationData, setVerificationData] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', { qrbox: { width: 260, height: 260 }, fps: 5 });

        function onScanSuccess(result) {
            scanner.clear();
            setScanResult(result);
            verifyTicket(result);
        }

        scanner.render(onScanSuccess, () => {});

        return () => { scanner.clear().catch(() => {}); };
    }, []);

    const verifyTicket = (registrationId) => {
        setVerifying(true); setError(''); setVerificationData(null);
        fetch('https://iiuc-eventera.onrender.com/registrations/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ registrationId })
        })
            .then(r => r.json())
            .then(data => {
                setVerifying(false);
                if (data.success) setVerificationData(data.registration);
                else setError(data.message || 'Ticket verification failed. Invalid code.');
            })
            .catch(() => { setVerifying(false); setError('Network error. Failed to contact verification server.'); });
    };

    const handleResetScanner = () => {
        setScanResult(''); setVerificationData(null); setError('');
        const scanner = new Html5QrcodeScanner('reader', { qrbox: { width: 260, height: 260 }, fps: 5 });
        scanner.render(
            (result) => { scanner.clear(); setScanResult(result); verifyTicket(result); },
            () => {}
        );
    };

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="page-fade">
            {/* Header */}
            <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                <div className="section-container py-6">
                    <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                        <Link to="/admin" style={{ color: 'var(--accent)' }}>Dashboard</Link> / QR Pass Scanner
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold"
                        style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        Entry Gate Scanner
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                        Scan the attendee's QR ticket to verify their registration.
                    </p>
                </div>
            </div>

            <div className="section-container py-10">
                <div className="max-w-xl mx-auto">
                    <div className="rounded-3xl p-6 md:p-8"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>

                        {!scanResult ? (
                            <div className="flex flex-col items-center gap-4">
                                {/* Scanner frame with glow border */}
                                <div className="w-full overflow-hidden rounded-2xl"
                                    style={{
                                        border: '2px solid var(--accent)',
                                        boxShadow: '0 0 20px rgba(124,58,237,0.15), inset 0 0 20px rgba(0,0,0,0.1)',
                                        background: '#000'
                                    }}>
                                    <div id="reader" className="w-full" />
                                </div>
                                <div className="text-center px-4">
                                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                                        📸 Camera Active
                                    </p>
                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                        Allow camera access and hold the student's mobile QR ticket in front of the lens.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-5 text-center">
                                {verifying ? (
                                    <div className="py-12 flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
                                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                            Contacting Entry Database...
                                        </p>
                                    </div>
                                ) : error ? (
                                    <div className="w-full flex flex-col items-center gap-4 py-6">
                                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                                            style={{ background: '#fee2e2', border: '3px solid #fca5a5' }}>
                                            ❌
                                        </div>
                                        <h3 className="text-xl font-extrabold" style={{ color: '#dc2626', fontFamily: 'Space Grotesk, sans-serif' }}>
                                            Access Denied
                                        </h3>
                                        <div className="rounded-xl px-4 py-3 w-full"
                                            style={{ background: '#fee2e2', border: '1px solid #fca5a5' }}>
                                            <p className="text-sm" style={{ color: '#dc2626' }}>{error}</p>
                                            <p className="text-xs mt-1 font-mono" style={{ color: '#b91c1c' }}>Code: {scanResult}</p>
                                        </div>
                                        <button onClick={handleResetScanner} className="btn-premium px-8 py-2.5 rounded-xl text-sm font-semibold">
                                            🔄 Scan Next Ticket
                                        </button>
                                    </div>
                                ) : verificationData ? (
                                    <div className="w-full flex flex-col items-center gap-4">
                                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                                            style={{ background: '#d1fae5', border: '3px solid #6ee7b7' }}>
                                            ✅
                                        </div>
                                        <h3 className="text-2xl font-extrabold" style={{ color: '#059669', fontFamily: 'Space Grotesk, sans-serif' }}>
                                            Verified Admission
                                        </h3>

                                        <div className="w-full rounded-2xl text-left flex flex-col gap-4 p-5"
                                            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                                            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                                                <p className="text-[9px] uppercase tracking-wider font-bold mb-0.5" style={{ color: 'var(--text-muted)' }}>
                                                    Attendee Name
                                                </p>
                                                <p className="font-extrabold text-base" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                                                    {verificationData.userName}
                                                </p>
                                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{verificationData.userEmail}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                                                {[
                                                    { l: 'Department', v: verificationData.department },
                                                    { l: 'Roll ID', v: verificationData.roll },
                                                ].map(({ l, v }) => (
                                                    <div key={l}>
                                                        <p className="text-[9px] uppercase tracking-wider font-bold mb-0.5" style={{ color: 'var(--text-muted)' }}>{l}</p>
                                                        <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{v}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div>
                                                <p className="text-[9px] uppercase tracking-wider font-bold mb-0.5" style={{ color: 'var(--text-muted)' }}>
                                                    Registered Event
                                                </p>
                                                <p className="font-bold text-sm" style={{ color: 'var(--accent)' }}>
                                                    {verificationData.eventName}
                                                </p>
                                            </div>
                                        </div>

                                        <button onClick={handleResetScanner} className="btn-premium w-full py-3 rounded-xl text-sm font-semibold">
                                            🔄 Scan Next Ticket
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRScanner;
