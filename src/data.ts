import { Account, Cargo, CityData, Contact, Route, Shipment } from "./types";
import { generateIncrementingId, generatePerson, generateRandomCityPair, generateRandomNumber, getRandomCity } from "./utils";

const MS_PER_HOUR = 60 * 60 * 1000;
const MAX_CONTACTS_PER_ACCOUNT = 3;
const MAX_SHIPMENTS_PER_ACCOUNT = 5;
const MAX_ROUTES_PER_SHIPMENT = 3;

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

const cityArray: CityData[] = [
  { cityName: "London", coordinates: { latitude: 51.5074, longitude: 0.1278 }, isSeaPort: true, continent: "Europe", country: "United Kingdom" },
  { cityName: "New York", coordinates: { latitude: 40.7128, longitude: -74.0060 }, isSeaPort: true, continent: "North America", country: "USA" },
  { cityName: "Sydney", coordinates: { latitude: -33.8688, longitude: 151.2093 }, isSeaPort: true, continent: "Australia", country: "Australia" },
  { cityName: "Paris", coordinates: { latitude: 48.8566, longitude: 2.3522 }, isSeaPort: false, continent: "Europe", country: "France" },
  { cityName: "Tokyo", coordinates: { latitude: 35.6895, longitude: 139.6917 }, isSeaPort: true, continent: "Asia", country: "Japan" },
  { cityName: "Rio de Janeiro", coordinates: { latitude: -22.9068, longitude: -43.1729 }, isSeaPort: true, continent: "South America", country: "Brazil" },
  { cityName: "Cairo", coordinates: { latitude: 30.0444, longitude: 31.2357 }, isSeaPort: false, continent: "Africa", country: "Egypt" },
  { cityName: "Moscow", coordinates: { latitude: 55.7558, longitude: 37.6173 }, isSeaPort: false, continent: "Europe", country: "Russia" },
  { cityName: "Dubai", coordinates: { latitude: 25.2048, longitude: 55.2708 }, isSeaPort: true, continent: "Asia", country: "United Arab Emirates" },
  { cityName: "Toronto", coordinates: { latitude: 43.6532, longitude: -79.3832 }, isSeaPort: false, continent: "North America", country: "Canada" },
  { cityName: "Berlin", coordinates: { latitude: 52.5200, longitude: 13.4050 }, isSeaPort: false, continent: "Europe", country: "Germany" },
  { cityName: "Mumbai", coordinates: { latitude: 19.0760, longitude: 72.8777 }, isSeaPort: true, continent: "Asia", country: "India" },
  { cityName: "Cape Town", coordinates: { latitude: -33.9249, longitude: 18.4241 }, isSeaPort: true, continent: "Africa", country: "South Africa" },
  { cityName: "Rome", coordinates: { latitude: 41.9028, longitude: 12.4964 }, isSeaPort: false, continent: "Europe", country: "Italy" },
  { cityName: "Shanghai", coordinates: { latitude: 31.2304, longitude: 121.4737 }, isSeaPort: true, continent: "Asia", country: "China" },
  { cityName: "Mexico City", coordinates: { latitude: 19.4326, longitude: -99.1332 }, isSeaPort: false, continent: "North America", country: "Mexico" },
  { cityName: "Amsterdam", coordinates: { latitude: 52.3702, longitude: 4.8952 }, isSeaPort: true, continent: "Europe", country: "Netherlands" },
  { cityName: "Seoul", coordinates: { latitude: 37.5665, longitude: 126.9780 }, isSeaPort: false, continent: "Asia", country: "South Korea" },
  { cityName: "Buenos Aires", coordinates: { latitude: -34.6037, longitude: -58.3816 }, isSeaPort: true, continent: "South America", country: "Argentina" },
  { cityName: "Nairobi", coordinates: { latitude: -1.2921, longitude: 36.8219 }, isSeaPort: false, continent: "Africa", country: "Kenya" },
  { cityName: "Vienna", coordinates: { latitude: 48.2082, longitude: 16.3738 }, isSeaPort: false, continent: "Europe", country: "Austria" },
  { cityName: "Singapore", coordinates: { latitude: 1.3521, longitude: 103.8198 }, isSeaPort: true, continent: "Asia", country: "Singapore" },
  { cityName: "Chicago", coordinates: { latitude: 41.8781, longitude: -87.6298 }, isSeaPort: false, continent: "North America", country: "USA" },
  { cityName: "Madrid", coordinates: { latitude: 40.4168, longitude: -3.7038 }, isSeaPort: false, continent: "Europe", country: "Spain" },
  { cityName: "Bangkok", coordinates: { latitude: 13.7563, longitude: 100.5018 }, isSeaPort: true, continent: "Asia", country: "Thailand" },
  { cityName: "Johannesburg", coordinates: { latitude: -26.2041, longitude: 28.0473 }, isSeaPort: false, continent: "Africa", country: "South Africa" },
  { cityName: "Stockholm", coordinates: { latitude: 59.3293, longitude: 18.0686 }, isSeaPort: true, continent: "Europe", country: "Sweden" },
  { cityName: "Jakarta", coordinates: { latitude: -6.2088, longitude: 106.8456 }, isSeaPort: true, continent: "Asia", country: "Indonesia" },
  { cityName: "Los Angeles", coordinates: { latitude: 34.0522, longitude: -118.2437 }, isSeaPort: true, continent: "North America", country: "USA" },
  { cityName: "Brussels", coordinates: { latitude: 50.8503, longitude: 4.3517 }, isSeaPort: false, continent: "Europe", country: "Belgium" },
  { cityName: "Kuala Lumpur", coordinates: { latitude: 3.1390, longitude: 101.6869 }, isSeaPort: true, continent: "Asia", country: "Malaysia" },
  { cityName: "Lima", coordinates: { latitude: -12.0464, longitude: -77.0428 }, isSeaPort: true, continent: "South America", country: "Peru" },
  { cityName: "Lagos", coordinates: { latitude: 6.5244, longitude: 3.3792 }, isSeaPort: true, continent: "Africa", country: "Nigeria" },
  { cityName: "Copenhagen", coordinates: { latitude: 55.6761, longitude: 12.5683 }, isSeaPort: true, continent: "Europe", country: "Denmark" },
  { cityName: "Ho Chi Minh City", coordinates: { latitude: 10.8231, longitude: 106.6297 }, isSeaPort: true, continent: "Asia", country: "Vietnam" },
  { cityName: "Houston", coordinates: { latitude: 29.7604, longitude: -95.3698 }, isSeaPort: true, continent: "North America", country: "USA" },
  { cityName: "Dublin", coordinates: { latitude: 53.3498, longitude: -6.2603 }, isSeaPort: true, continent: "Europe", country: "Ireland" },
  { cityName: "Manila", coordinates: { latitude: 14.5995, longitude: 120.9842 }, isSeaPort: true, continent: "Asia", country: "Philippines" },
  { cityName: "Bogota", coordinates: { latitude: 4.7110, longitude: -74.0721 }, isSeaPort: false, continent: "South America", country: "Colombia"}];


interface ContainerCargo {
    contents: string;
    isPerishable: boolean;
    isCommodity: boolean;
    needsElectricity: boolean;
}

const containerContentsArray: ContainerCargo[] = [
    { contents: "Frozen Fish", isPerishable: true, isCommodity: true, needsElectricity: true },
    { contents: "Electronics (Laptops)", isPerishable: false, isCommodity: false, needsElectricity: false },
    { contents: "Steel Coils", isPerishable: false, isCommodity: true, needsElectricity: false },
    { contents: "Bananas", isPerishable: true, isCommodity: true, needsElectricity: true },
    { contents: "Automotive Parts", isPerishable: false, isCommodity: false, needsElectricity: false },
    { contents: "Wine Bottles", isPerishable: false, isCommodity: true, needsElectricity: false },
    { contents: "Pharmaceuticals (Vaccines)", isPerishable: true, isCommodity: false, needsElectricity: true },
    { contents: "Grains (Wheat)", isPerishable: false, isCommodity: true, needsElectricity: false },
    { contents: "Refrigerated Meat", isPerishable: true, isCommodity: true, needsElectricity: true },
    { contents: "Furniture (Flat-Pack)", isPerishable: false, isCommodity: false, needsElectricity: false },
    { contents: "Plastic Pellets", isPerishable: false, isCommodity: true, needsElectricity: false },
    { contents: "Fresh Flowers", isPerishable: true, isCommodity: false, needsElectricity: true },
    { contents: "Canned Goods", isPerishable: false, isCommodity: true, needsElectricity: false },
    { contents: "Medical Equipment", isPerishable: false, isCommodity: false, needsElectricity: false },
    { contents: "Dairy Products (Cheese)", isPerishable: true, isCommodity: true, needsElectricity: true },
    { contents: "Paper Rolls", isPerishable: false, isCommodity: true, needsElectricity: false },
    { contents: "Fruit Juice (Refrigerated)", isPerishable: true, isCommodity: true, needsElectricity: true },
    { contents: "Textiles (Clothing)", isPerishable: false, isCommodity: false, needsElectricity: false },
    { contents: "Coffee Beans", isPerishable: false, isCommodity: true, needsElectricity: false },
    { contents: "Chemicals (Non-Hazardous)", isPerishable: false, isCommodity: false, needsElectricity: false },
    { contents: "Potatoes", isPerishable: true, isCommodity: true, needsElectricity: false },
    { contents: "Solar Panels", isPerishable: false, isCommodity: false, needsElectricity: false },
    { contents: "Frozen Vegetables", isPerishable: true, isCommodity: true, needsElectricity: true },
    { contents: "Construction Materials (Tiles)", isPerishable: false, isCommodity: true, needsElectricity: false },
    { contents: "Batteries", isPerishable: false, isCommodity: false, needsElectricity: false },
    { contents: "Apples", isPerishable: true, isCommodity: true, needsElectricity: true },
    { contents: "Machinery Parts", isPerishable: false, isCommodity: false, needsElectricity: false },
    { contents: "Sugar", isPerishable: false, isCommodity: true, needsElectricity: false },
    { contents: "Seafood (Shellfish)", isPerishable: true, isCommodity: true, needsElectricity: true },
    { contents: "Toys", isPerishable: false, isCommodity: false, needsElectricity: false },
    { contents: "Cement", isPerishable: false, isCommodity: true, needsElectricity: false },
    { contents: "Berries", isPerishable: true, isCommodity: true, needsElectricity: true },
    { contents: "Sports Equipment", isPerishable: false, isCommodity: false, needsElectricity: false },
    { contents: "Rice", isPerishable: false, isCommodity: true, needsElectricity: false },
    { contents: "Chocolate", isPerishable: false, isCommodity: true, needsElectricity: false },
    { contents: "Live Plants", isPerishable: true, isCommodity: false, needsElectricity: true },
    { contents: "Household Appliances", isPerishable: false, isCommodity: false, needsElectricity: false },
    { contents: "Salt", isPerishable: false, isCommodity: true, needsElectricity: false },
    { contents: "Yogurt", isPerishable: true, isCommodity: true, needsElectricity: true },
    { contents: "Books", isPerishable: false, isCommodity: false, needsElectricity: false },
    { contents: "Coal", isPerishable: false, isCommodity: true, needsElectricity: false },
    { contents: "Oranges", isPerishable: true, isCommodity: true, needsElectricity: true },
    { contents: "Musical Instruments", isPerishable: false, isCommodity: false, needsElectricity: false },
    { contents: "Cooking Oil", isPerishable: false, isCommodity: true, needsElectricity: false },
    { contents: "Ice Cream", isPerishable: true, isCommodity: true, needsElectricity: true },
    { contents: "Art Supplies", isPerishable: false, isCommodity: false, needsElectricity: false },
    { contents: "Fertilizer", isPerishable: false, isCommodity: true, needsElectricity: false },
    { contents: "Asparagus", isPerishable: true, isCommodity: true, needsElectricity: true },
    { contents: "Watches", isPerishable: false, isCommodity: false, needsElectricity: false },
    { contents: "Flour", isPerishable: false, isCommodity: true, needsElectricity: false },
];

// generate accounts
export const accounts : Map<string, Account> = accountNames.reduce((prev, name, i) => {
    const accountId = generateIncrementingId("ACC", i);
    prev.set(accountId, new Account(accountId, name));
    return prev;
}, new Map<string,Account>());

export const getAllAccounts = () => Array.from(accounts.keys()).reduce((prev, accountId) => {
    prev.push(accounts.get(accountId)!);
    return prev;
}, new Array<Account>());

// generate contacts
let contactIdx = 0;
export const contacts : Map<string, Array<Contact>> = accountNames.reduce((prev, name, i) => {
    const accountId = generateIncrementingId("ACC", i);
    const contacts = new Array<Contact>();
    prev.set(accountId, contacts);
    for (let j=0, k=generateRandomNumber(1, MAX_CONTACTS_PER_ACCOUNT); j<k; j++) {
        const contactId = generateIncrementingId("CONT", contactIdx++);
        const p = generatePerson();
        contacts.push(new Contact(accountId, contactId, p.email, p.firstName, p.lastName));
    }
    return prev;
}, new Map<string, Array<Contact>>());

export const getAllContacts = () => {
    return getAll<Contact>(contacts);
}

// generate shipments for accounts
let shipmentIdx=0;
export const shipments : Map<string, Shipment> = accountNames.reduce((prev, name, i) => {
    const accountId = generateIncrementingId("ACC", i);
    for (let j=0, k=generateRandomNumber(1, MAX_SHIPMENTS_PER_ACCOUNT); j<k; j++) {
        const shipmentId = generateIncrementingId("SHIP", shipmentIdx++);
        const cities = generateRandomCityPair(cityArray);
        prev.set(shipmentId, new Shipment(shipmentId, accountId, cities));
    }
    return prev;

}, new Map<string, Shipment>());

export const getAllShipments = () => {
    return Array.from(shipments.keys()).reduce((prev, shipmentId) => {
        prev.push(shipments.get(shipmentId)!);
        return prev;
    }, new Array<Shipment>());
}

// generate routes for shipments
let routeIdx=0;
export const routes : Map<string, Array<Route>> = getAllShipments().reduce((prev, shipment) => {
    const shipmentId = shipment.shipmentId;
    const legs = generateRandomNumber(1, MAX_ROUTES_PER_SHIPMENT);
    const routes : Array<Route> = [];
    for (let i=0; i<legs; i++) {
        const start = i === 0 ? shipment.start : routes[i-1].end;
        const end = i === (legs-1) ? shipment.end : getRandomCity(cityArray);
        routes.push(new Route(generateIncrementingId("ROUT", routeIdx++), shipmentId, {
            city1: start, city2: end
        }))
    }

    // ensure dates are contineous
    for (let i = 0; i < legs; i++) {
        const startdt = i === 0 ? new Date(routes[0].startdt) : new Date(new Date(routes[i-1].enddt).getTime() + generateRandomNumber(3 * MS_PER_HOUR, generateRandomNumber(8, 24) * MS_PER_HOUR));
        const hours = routes[i].hours < 0 ? 24 : routes[i].hours;
        const enddt = new Date(startdt.getTime() + (hours * MS_PER_HOUR));
        routes[i].startdt = startdt.toISOString();
        routes[i].enddt = enddt.toISOString();
    }

    console.log("--- ROUTES");
    console.log(`Shipment <${shipment.shipmentId}> from <${shipment.start}> to <${shipment.end}>`);
    routes.forEach(r => console.log(`\t<${r}>`));

    prev.set(shipmentId, routes);
    return prev;
}, new Map<string, Array<Route>>());

const getAll = <T>(data: Map<string, Array<T>>) => {
    return Array.from(data.keys()).reduce((prev, id) => {
        prev.push(...data.get(id)!);
        return prev;
    }, new Array<T>());
};
export const getAllRoutes = () => {
    return getAll<Route>(routes);
}

// generate cargo for shipments
let equipmentIdx = 0;
export const cargo: Map<string, Array<Cargo>> = getAllShipments().reduce((prev, shipment) => {
    const shipmentId = shipment.shipmentId;
    const pieces = generateRandomNumber(1, 5);
    const cargo: Array<Cargo> = [];
    for (let i = 0; i < pieces; i++) {
        const equipmentId = generateIncrementingId("EQUIP", equipmentIdx++);
        const cd = containerContentsArray[generateRandomNumber(0, containerContentsArray.length-1)];
        cargo.push(new Cargo(equipmentId, shipmentId, cd.contents, cd.isPerishable, cd.isCommodity, cd.needsElectricity));
    }
    prev.set(shipmentId, cargo);
    return prev;
}, new Map<string, Array<Cargo>>());


export const getAllCargo = () => {
    return getAll<Cargo>(cargo);
}
