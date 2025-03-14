import {CityData, CityPair, Coordinates, Person} from "./types";


const toRadians = (c: Coordinates) : {lonRad: number, latRad: number} => {
    return {lonRad: (Math.PI * c.longitude) / 180, latRad: (Math.PI * c.latitude) / 180};
}

export function approximateFlightTime(coord1: Coordinates, coord2: Coordinates): number {
    const earthRadiusKm = 6371; // Earth's radius in kilometers

    // Convert latitude and longitude from degrees to radians
    const {lonRad : lon1Rad, latRad: lat1Rad} = toRadians(coord1);
    const {lonRad : lon2Rad, latRad : lat2Rad} = toRadians(coord2);

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

export function approximateRailTime(startCoordinates: Coordinates, endCoordinates: Coordinates): number {
    const earthRadiusKm = 6371; // Earth's radius in kilometers

    const { lonRad: lon1Rad, latRad: lat1Rad } = toRadians(startCoordinates);
    const { lonRad: lon2Rad, latRad: lat2Rad } = toRadians(endCoordinates);
    
    const deltaLat = lat2Rad - lat1Rad;
    const deltaLon = lon2Rad - lon1Rad;

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceKm = earthRadiusKm * c;

    // Simplified estimation: Assume an average train speed of 100 km/h.
    const averageTrainSpeedKmH = 100;

    const travelTimeHours = distanceKm / averageTrainSpeedKmH;

    return travelTimeHours;
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

export const generateIncrementingId = (prefix: string, i: number) => {
    const id = `0000000${i + 1}`;
    const truncatedId = id.substring(id.length - 6);
    const generatedId = `${prefix.toUpperCase()}-${truncatedId}`;
    return generatedId;
};

export const generateRandomNumber = (min: number, max: number) : number => {
     const length = Math.floor(Math.random() * Math.max(min,max)) + Math.min(min, max);
     return length;
}

function generateRandomName(): string {
    const characters = "abcdefghijklmnopqrstuvwxyz";
    let name = "";
    const length = generateRandomNumber(3, 8);
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        name += characters[randomIndex];
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
}

export const generatePerson = () : Person => {
    const firstName = generateRandomName();
    const lastName = generateRandomName();
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    return {
        firstName, lastName, email
    }
}
export function generateRandomCityPair(cities: Array<CityData>): CityPair {
    let city1 = getRandomCity(cities);
    let city2 = getRandomCity(cities);
    while (city1.cityName === city2.cityName) {
        city2 = getRandomCity(cities);
    }
    return {
        city1: city1,
        city2: city2,
    };
}

export const getRandomCity = (cities: Array<CityData>) : CityData => {
    return cities[generateRandomNumber(0, cities.length-1)];
}

export function generateRandomContainerNumber(): string {
    const ownerCode = generateRandomLetters(3).toUpperCase();
    const equipmentCategoryIdentifier = getRandomElement(["U", "J", "Z"]); // U for freight containers, J for detachable freight container-related equipment, Z for trailers and chassis
    const serialNumber = generateRandomNumbers(6);
    const checkDigit = calculateCheckDigit(ownerCode + equipmentCategoryIdentifier + serialNumber);

    return `${ownerCode}${equipmentCategoryIdentifier}${serialNumber}${checkDigit}`;
}

function generateRandomLetters(length: number): string {
    let result = "";
    const characters = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function generateRandomNumbers(length: number): string {
    let result = "";
    const characters = "0123456789";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function calculateCheckDigit(containerCode: string): number {
    const charValues: { [key: string]: number } = {
        A: 10,
        B: 12,
        C: 13,
        D: 14,
        E: 15,
        F: 16,
        G: 17,
        H: 18,
        I: 19,
        J: 20,
        K: 21,
        L: 23,
        M: 24,
        N: 25,
        O: 26,
        P: 27,
        Q: 28,
        R: 29,
        S: 30,
        T: 31,
        U: 32,
        V: 34,
        W: 35,
        X: 36,
        Y: 37,
        Z: 38,
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
    };

    let sum = 0;
    for (let i = 0; i < containerCode.length; i++) {
        const char = containerCode[i];
        const charValue = charValues[char];
        if (charValue === undefined) {
            return -1; // Invalid character
        }
        sum += charValue * Math.pow(2, i);
    }

    const remainder = sum % 11;
    const checkDigit = remainder === 10 ? 0 : remainder; // 10 is replaced with 0

    return checkDigit;
}