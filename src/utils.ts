
export type Coordinates = {
    latitude: number;
    longitude: number;
};

export function approximateFlightTime(coord1: Coordinates, coord2: Coordinates): number {
    const earthRadiusKm = 6371; // Earth's radius in kilometers

    // Convert latitude and longitude from degrees to radians
    const lat1Rad = (Math.PI * coord1.latitude) / 180;
    const lon1Rad = (Math.PI * coord1.longitude) / 180;
    const lat2Rad = (Math.PI * coord2.latitude) / 180;
    const lon2Rad = (Math.PI * coord2.longitude) / 180;

    // Haversine formula
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceKm = earthRadiusKm * c;

    // Approximate flight speed (e.g., 800 km/h for a commercial jet)
    const averageFlightSpeedKmH = 800;

    // Calculate flight time in hours
    const flightTimeHours = distanceKm / averageFlightSpeedKmH;

    return flightTimeHours;
}

export function generateRandomDateTimes(addHours: number): Date[] {
    const startYear = 2023;
    const endYear = 2025;

    const startMillis = new Date(startYear, 0, 1).getTime(); // Start of 2023
    const endMillis = new Date(endYear, 0, 1).getTime(); // Start of 2025

    const randomMillis = startMillis + Math.random() * (endMillis - startMillis);

    const d1 = new Date(randomMillis);
    d1.setSeconds(0);
    d1.setMilliseconds(0);
    const d2 = new Date(randomMillis + (addHours * 3600000));
    d2.setSeconds(0);
    d2.setMilliseconds(0);
    return [d1, d2];
}