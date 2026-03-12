'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export function LocationProvider({ settings, children }) {
    const [location, setLocationState] = useState(null);
    const [locationLoading, setLocationLoading] = useState(true);
    const [deliveryAvailable, setDeliveryAvailable] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('fc_location');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setLocationState(parsed);
                if (parsed.lat && parsed.lng) {
                    checkDelivery(parsed.lat, parsed.lng, settings);
                }
            } catch { }
        }
        setLocationLoading(false);
    }, [settings]);

    const checkDelivery = (lat, lng, currentSettings) => {
        const s = currentSettings || {};
        const rLat = s.restaurantLat || 0;
        const rLng = s.restaurantLng || 0;
        const radius = s.deliveryRadius || 10;

        if (!rLat || !rLng) {
            setDeliveryAvailable(true);
            return;
        }

        const toRad = (x) => (x * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(lat - rLat);
        const dLon = toRad(lng - rLng);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(rLat)) * Math.cos(toRad(lat)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        setDeliveryAvailable(distance <= radius);
    };

    const setLocation = (loc) => {
        setLocationState(loc);
        if (loc) {
            localStorage.setItem('fc_location', JSON.stringify(loc));
            if (loc.lat && loc.lng) {
                checkDelivery(loc.lat, loc.lng, settings);
            } else {
                setDeliveryAvailable(null);
            }
        } else {
            localStorage.removeItem('fc_location');
            setDeliveryAvailable(null);
        }
    };

    const clearLocation = () => setLocation(null);

    return (
        <LocationContext.Provider value={{ location, locationLoading, deliveryAvailable, setLocation, clearLocation }}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocation() {
    return useContext(LocationContext);
}
