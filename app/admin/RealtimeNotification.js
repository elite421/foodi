'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function RealtimeNotification() {
    const lastSeenOrderIds = useRef(new Set());
    const isInitialLoad = useRef(true);
    const router = useRouter();

    const playSound = () => {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.5);
        } catch (e) { console.error("Audio playback error", e); }
    };

    const showNotification = (title, body) => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification(title, { body });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification(title, { body });
                    }
                });
            }
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }

        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/admin/orders');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.orders) {
                        const currentIds = data.orders.map(o => o.id);

                        if (isInitialLoad.current) {
                            currentIds.forEach(id => lastSeenOrderIds.current.add(id));
                            isInitialLoad.current = false;
                        } else {
                            const newOrders = currentIds.filter(id => !lastSeenOrderIds.current.has(id));
                            if (newOrders.length > 0) {
                                playSound();
                                showNotification("New Order Received!", `You have ${newOrders.length} new order(s).`);
                                // Add new ids to tracking set
                                newOrders.forEach(id => lastSeenOrderIds.current.add(id));
                                // Refresh current route to reflect new data automatically if they are on a relevant page
                                router.refresh();
                            }
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch orders realtime", err);
            }
        };

        fetchOrders(); // Initial fetch
        const interval = setInterval(fetchOrders, 10000); // Poll every 10s

        return () => clearInterval(interval);
    }, [router]);

    return null; // Invisible component
}
