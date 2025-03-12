export const accountNames: string[] = [
    "Alpha Logistics Inc",
    "Beta Cargo Solutions",
    "Gamma Global Transit",
    "Delta Express Delivery",
    "Epsilon Freight Forwarders",
    "Zeta Shipping Agency",
    "Eta Worldwide Movement",
    "Theta International Haul",
    "Iota Coastal Transport",
    "Kappa Overland Routes",
    "Lambda Air Bridge",
    "Mu Ocean Lines",
    "Nu Rail Connect",
    "Xi Swift Shipments",
    "Omicron Secure Cargo",
    "Pi Rapid Transit",
    "Rho Inland Delivery",
    "Sigma Global Logistics",
    "Tau Freight Network",
    "Upsilon Fast Freight",
    "Phi Cargo Movers",
    "Chi Cross Country",
    "Psi International Trade",
    "Omega Transit Group",
    "Apex Shipping Corp",
    "Zenith Logistics Ltd",
    "Nexus Global Carriers",
    "Vector Freight Services",
    "Matrix Transport Hub",
    "Nova Express Logistics",
    "Polaris Shipping Lines",
    "Orion Cargo Network",
    "Sirius Transit Systems",
    "Vega International Ship",
    "Altair Freight Movement",
    "Deneb Global Transit",
    "Rigel Rapid Delivery",
    "Acrux Secure Cargo",
    "Mimosa Swift Shipments",
    "Spica Inland Delivery",
    "Antares Global Logistics",
    "Canopus Freight Network",
    "Bellatrix Fast Freight",
    "Aldebaran Cargo Movers",
    "Pollux Cross Country",
    "Castor International Trade",
    "Procyon Transit Group",
    "Achernar Shipping Corp",
    "Hadar Logistics Ltd",
    "Menkent Global Carriers",
    "Atria Freight Services",
    "Alnair Transport Hub",
    "Dubhe Express Logistics",
    "Merak Shipping Lines",
    "Phecda Cargo Network",
    "Megrez Transit Systems",
    "Alioth International Ship",
    "Mizar Freight Movement",
    "Alcor Global Transit",
    "Alkaid Rapid Delivery",
    "Thuban Secure Cargo",
    "Kochab Swift Shipments",
    "Pherkad Inland Delivery",
    "Ankaa Global Logistics",
    "Suhail Freight Network",
    "Avior Fast Freight",
    "Alsephina Cargo Movers",
    "Talitha Cross Country",
    "Yildun International Trade",
    "Rastaban Transit Group",
    "Etamin Shipping Corp",
    "Kaus Logistics Ltd",
    "Arkab Global Carriers",
    "Shaula Freight Services",
    "Lesath Transport Hub",
    "Giausar Express Logistics",
    "Ascella Shipping Lines",
    "Nunki Cargo Network",
    "Terebellum Transit Systems",
    "Facies International Ship",
    "Sargas Freight Movement",
    "Graffias Global Transit",
    "Zuben Rapid Delivery",
    "Acubens Secure Cargo",
    "Algenubi Swift Shipments",
    "Algieba Inland Delivery",
    "Adhafera Global Logistics",
    "Propus Freight Network",
    "Mebsuta Fast Freight",
    "Dirah Cargo Movers",
    "Wasat Cross Country",
    "Mekbuda International Trade",
    "Sadalsuud Transit Group",
    "Sadalmelik Shipping Corp",
    "Ancha Logistics Ltd",
    "Skat Global Carriers",
    "Nashira Freight Services",
    "Giedi Transport Hub",
    "DenebAlgedi Express Logistics",
    "Okab Shipping Lines",
    "Armus Cargo Network",
];


export interface Person {
  firstName: string;
  lastName: string;
  email: string;
}

function generateRandomName(): string {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  let name = "";
  const length = Math.floor(Math.random() * 8) + 3; // Random length between 3 and 10
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    name += characters[randomIndex];
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export const randomPeople: Person[] = [];
for (let i = 0; i < 1000; i++) {
  const firstName = generateRandomName();
  const lastName = generateRandomName();
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

  randomPeople.push({
    firstName: firstName,
    lastName: lastName,
    email: email,
  });
}

export interface CityData {
    name: string;
    latitude: number;
    longitude: number;
}

export interface CityPair {
  city1: CityData;
city2: CityData;
}

const realCities: { name: string; latitude: number; longitude: number }[] = [
    { name: "Tokyo", latitude: 35.6895, longitude: 139.6917 },
    { name: "Delhi", latitude: 28.6139, longitude: 77.209 },
    { name: "Shanghai", latitude: 31.2304, longitude: 121.4737 },
    { name: "Sao Paulo", latitude: -23.5505, longitude: -46.6333 },
    { name: "Mexico City", latitude: 19.4326, longitude: -99.1332 },
    { name: "Cairo", latitude: 30.0444, longitude: 31.2357 },
    { name: "Mumbai", latitude: 19.076, longitude: 72.8777 },
    { name: "Beijing", latitude: 39.9042, longitude: 116.4074 },
    { name: "Dhaka", latitude: 23.8103, longitude: 90.4125 },
    { name: "Osaka", latitude: 34.6937, longitude: 135.5023 },
    { name: "New York", latitude: 40.7128, longitude: -74.006 },
    { name: "Los Angeles", latitude: 34.0522, longitude: -118.2437 },
    { name: "London", latitude: 51.5074, longitude: -0.1278 },
    { name: "Paris", latitude: 48.8566, longitude: 2.3522 },
    { name: "Istanbul", latitude: 41.0082, longitude: 28.9784 },
    { name: "Jakarta", latitude: -6.2088, longitude: 106.8456 },
    { name: "Seoul", latitude: 37.5665, longitude: 126.978 },
    { name: "Bangkok", latitude: 13.7563, longitude: 100.5018 },
    { name: "Toronto", latitude: 43.6532, longitude: -79.3832 },
    { name: "Sydney", latitude: -33.8688, longitude: 151.2093 },
    { name: "Berlin", latitude: 52.52, longitude: 13.405 },
    { name: "Rome", latitude: 41.9028, longitude: 12.4964 },
    { name: "Madrid", latitude: 40.4168, longitude: -3.7038 },
    { name: "Amsterdam", latitude: 52.3702, longitude: 4.8952 },
    { name: "Dubai", latitude: 25.2048, longitude: 55.2708 },
    { name: "Singapore", latitude: 1.3521, longitude: 103.8198 },
    { name: "Hong Kong", latitude: 22.3193, longitude: 114.1694 },
    { name: "Rio de Janeiro", latitude: -22.9068, longitude: -43.1729 },
    { name: "Buenos Aires", latitude: -34.6037, longitude: -58.3816 },
    { name: "Cape Town", latitude: -33.9249, longitude: 18.4241 },
    { name: "Moscow", latitude: 55.7558, longitude: 37.6173 },
    { name: "St. Petersburg", latitude: 59.9343, longitude: 30.3376 },
    { name: "Chicago", latitude: 41.8781, longitude: -87.6298 },
    { name: "Houston", latitude: 29.7604, longitude: -95.3698 },
    { name: "Miami", latitude: 25.7617, longitude: -80.1918 },
    { name: "Seattle", latitude: 47.6062, longitude: -122.3321 },
    { name: "San Francisco", latitude: 37.7749, longitude: -122.4194 },
    { name: "Boston", latitude: 42.3601, longitude: -71.0589 },
    { name: "Philadelphia", latitude: 39.9526, longitude: -75.1652 },
    { name: "Atlanta", latitude: 33.749, longitude: -84.388 },
    { name: "Dallas", latitude: 32.7767, longitude: -96.797 },
    { name: "Washington", latitude: 38.8951, longitude: -77.0364 },
    { name: "Vienna", latitude: 48.2082, longitude: 16.3738 },
    { name: "Zurich", latitude: 47.3769, longitude: 8.5417 },
    { name: "Stockholm", latitude: 59.3293, longitude: 18.0686 },
    { name: "Copenhagen", latitude: 55.6761, longitude: 12.5683 },
    { name: "Dublin", latitude: 53.3498, longitude: -6.2603 },
    { name: "Edinburgh", latitude: 55.9533, longitude: -3.1883 },
    { name: "Lisbon", latitude: 38.7223, longitude: -9.1393 },
    { name: "Athens", latitude: 37.9838, longitude: 23.7275 },
    { name: "Warsaw", latitude: 52.2297, longitude: 21.0122 },
    { name: "Prague", latitude: 50.0755, longitude: 14.4378 },
    { name: "Budapest", latitude: 47.4979, longitude: 19.0402 },
    { name: "Kyiv", latitude: 50.4501, longitude: 30.5234 },
    { name: "Minsk", latitude: 53.9045, longitude: 27.5615 },
    { name: "Algiers", latitude: 36.7525, longitude: 3.042 },
    { name: "Nairobi", latitude: -1.2921, longitude: 36.8219 },
    { name: "Lagos", latitude: 6.5244, longitude: 3.3792 },
    { name: "Accra", latitude: 5.6037, longitude: -0.187 },
    { name: "Addis Ababa", latitude: 9.0227, longitude: 38.7469 },
    { name: "Riyadh", latitude: 24.7136, longitude: 46.6753 },
    { name: "Jeddah", latitude: 21.5433, longitude: 39.1728 },
    { name: "Tehran", latitude: 35.6892, longitude: 51.389 },
    { name: "Karachi", latitude: 24.8607, longitude: 67.0011 },
    { name: "Lahore", latitude: 31.5204, longitude: 74.3587 },
    { name: "Kolkata", latitude: 22.5726, longitude: 88.3639 },
    { name: "Chennai", latitude: 13.0827, longitude: 80.2707 },
    { name: "Bangalore", latitude: 12.9716, longitude: 77.5946 },
    { name: "Hanoi", latitude: 21.0278, longitude: 105.8342 },
    { name: "Ho Chi Minh City", latitude: 10.8231, longitude: 106.6297 },
    { name: "Manila", latitude: 14.5995, longitude: 120.9842 },
    { name: "Kuala Lumpur", latitude: 3.139, longitude: 101.6869 },
    { name: "Wellington", latitude: -41.2865, longitude: 174.7762 },
    { name: "Auckland", latitude: -36.8485, longitude: 174.7633 },
    { name: "Vancouver", latitude: 49.2827, longitude: -123.1207 },
    { name: "Montreal", latitude: 45.5017, longitude: -73.5673 },
    { name: "Johannesburg", latitude: -26.2041, longitude: 28.0473 },
    { name: "Durban", latitude: -29.8587, longitude: 31.0218 },
    { name: "Perth", latitude: -31.9505, longitude: 115.8605 },
    { name: "Adelaide", latitude: -34.9285, longitude: 138.6007 },
    { name: "Brisbane", latitude: -27.4698, longitude: 153.0251 },
    { name: "Hamburg", latitude: 53.5511, longitude: 9.9937 },
    { name: "Munich", latitude: 48.1351, longitude: 11.582 },
    { name: "Milan", latitude: 45.4654, longitude: 9.1859 },
    { name: "Naples", latitude: 40.8522, longitude: 14.2681 },
    { name: "Barcelona", latitude: 41.3851, longitude: 2.1734 },
    { name: "Valencia", latitude: 39.4699, longitude: -0.3774 },
    { name: "Seville", latitude: 37.3891, longitude: -5.9845 },
    { name: "Lyon", latitude: 45.764, longitude: 4.8357 },
    { name: "Marseille", latitude: 43.2965, longitude: 5.3698 },
];

function getRandomCity(): { name: string; latitude: number; longitude: number } {
    return realCities[Math.floor(Math.random() * realCities.length)];
}

export function generateRandomCityPair(): CityPair {
    let city1 = getRandomCity();
    let city2 = getRandomCity();
    while (city1.name === city2.name) {
        city2 = getRandomCity();
    }
    return {
        city1: city1,
        city2: city2,
    };
}
