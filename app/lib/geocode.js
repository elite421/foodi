/**
 * Build a detailed human-readable address from Nominatim reverse-geocode data.
 * Includes house number, road, sector/neighbourhood, suburb, city, state, and pincode.
 */
export function buildDetailedAddress(data) {
    const a = data.address || {};

    // Collect all meaningful parts in order of specificity
    const parts = [];

    // House number
    if (a.house_number) parts.push(a.house_number);

    // Road / Street
    if (a.road) parts.push(a.road);

    // Neighbourhood / Sector / Residential area
    const neighbourhood = a.neighbourhood || a.residential || '';
    if (neighbourhood && !parts.includes(neighbourhood)) parts.push(neighbourhood);

    // Suburb / Colony
    if (a.suburb && !parts.includes(a.suburb)) parts.push(a.suburb);

    // City district (like "South Delhi")
    if (a.city_district && !parts.includes(a.city_district)) parts.push(a.city_district);

    // City / Town / Village
    const city = a.city || a.town || a.village || '';
    if (city && !parts.includes(city)) parts.push(city);

    // State
    if (a.state && !parts.includes(a.state)) parts.push(a.state);

    // Postcode / Pincode
    if (a.postcode) parts.push(a.postcode);

    // Join all parts with ", "
    const detailed = parts.filter(Boolean).join(', ');

    return detailed || data.display_name || '';
}

/**
 * Reverse-geocode coordinates to a detailed address string.
 * Uses the free Nominatim (OpenStreetMap) API.
 * 
 * @param {number} lat
 * @param {number} lng
 * @returns {Promise<{ label: string, lat: number, lng: number }>}
 */
export async function reverseGeocode(lat, lng) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
        );
        const data = await res.json();
        const label = buildDetailedAddress(data);
        return {
            label: label || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            lat,
            lng,
        };
    } catch {
        return {
            label: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            lat,
            lng,
        };
    }
}
