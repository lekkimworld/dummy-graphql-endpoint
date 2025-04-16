import { Account, Cargo, CityData, CityPair, Contact, Route, Shipment } from "./types";
import { generate10DigitId, generateIncrementingId, generatePerson, generateRandomDateTime, generateRandomNumber, getRandomCity } from "./utils";

const MS_PER_HOUR = 60 * 60 * 1000;
const MAX_CONTACTS_PER_ACCOUNT = 3;
const MAX_SHIPMENTS_PER_ACCOUNT = 25;

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

const cityShanghai = {
    cityName: "Shanghai",
    coordinates: { latitude: 31.2304, longitude: 121.4737 },
    isSeaPort: true,
    continent: "Asia",
    country: "China",
    portCode: "CNSHG",
};
const cityRotterdam = {
    cityName: "Rotterdam",
    coordinates: { latitude: 51.9496, longitude: 4.1453 },
    isSeaPort: true,
    continent: "Europe",
    country: "Netherlands",
    portCode: "NLRTM",
};
const citySingapore = {
    cityName: "Singapore",
    coordinates: { latitude: 1.3521, longitude: 103.8198 },
    isSeaPort: true,
    continent: "Asia",
    country: "Singapore",
    portCode: "SGSCT",
};
const cityLosAngeles = {
    cityName: "Los Angeles",
    coordinates: { latitude: 34.0522, longitude: -118.2437 },
    isSeaPort: true,
    continent: "North America",
    country: "USA",
    portCode: "USLAX",
};
const cityHongKong = {
    cityName: "Hong Kong",
    coordinates: { latitude: 22.3333, longitude: 114.1167 },
    isSeaPort: true,
    continent: "Asia",
    country: "China",
    portCode: "HKHKG",
};
const cityAarhus = {
    cityName: "Aarhus",
    coordinates: { latitude: 56.1629, longitude: 10.2039 },
    isSeaPort: true,
    continent: "Europe",
    country: "Denmark",
    portCode: "DKAAR",
};

const cityArray: CityData[] = [cityShanghai, citySingapore, cityRotterdam, cityLosAngeles, cityHongKong, cityAarhus];

const aarhusRotterdam: CityPair = {
    city1: cityAarhus,
    city2: cityRotterdam,
    hours: 3 * 24 + 5,
    service: "AR37",
};
const rotterdamSingapore: CityPair = {
    city1: cityRotterdam,
    city2: citySingapore,
    hours: 30 * 24,
    service: "AS37",
};
const rotterdamAarhus: CityPair = {
    city1: cityRotterdam,
    city2: cityAarhus,
    hours: 3 * 24 + 5,
    service: "RA12",
};
const singaporeHongkong: CityPair = {
    city1: citySingapore,
    city2: cityHongKong,
    hours: 3 * 24 + 10,
    service: "SH91",
};
const hongkongShanghai: CityPair = {
    city1: cityHongKong,
    city2: cityShanghai,
    hours: 2 * 24,
    service: "HS65",
};
const losAngelesRotterdam: CityPair = {
    city1: cityLosAngeles,
    city2: cityRotterdam,
    hours: 50 * 24,
    service: "LR17",
};
type KnownRoute = {
    legs: Array<CityPair>;
    startdt: Date;
};
const knownRoutes: Array<KnownRoute> = [
    {
        legs: [aarhusRotterdam, rotterdamSingapore],
        startdt: generateRandomDateTime(),
    },
    {
        legs: [rotterdamAarhus],
        startdt: generateRandomDateTime(),
    },
    {
        legs: [singaporeHongkong],
        startdt: generateRandomDateTime(),
    },
    {
        legs: [hongkongShanghai],
        startdt: generateRandomDateTime(),
    },
    {
        legs: [losAngelesRotterdam, rotterdamAarhus],
        startdt: generateRandomDateTime(),
    },
];

interface ContainerCargo {
    contents: string;
    isPerishable: boolean;
    needsElectricity: boolean;
}

const containerContentsArray: ContainerCargo[] = [
    { contents: "Frozen Fish", isPerishable: true, needsElectricity: true },
    {
        contents: "Electronics (Laptops)",
        isPerishable: false,

        needsElectricity: false,
    },
    { contents: "Steel Coils", isPerishable: false, needsElectricity: false },
    { contents: "Bananas", isPerishable: true, needsElectricity: true },
    {
        contents: "Automotive Parts",
        isPerishable: false,

        needsElectricity: false,
    },
    {
        contents: "Wine Bottles",
        isPerishable: false,

        needsElectricity: false,
    },
    {
        contents: "Pharmaceuticals (Vaccines)",
        isPerishable: true,

        needsElectricity: true,
    },
    {
        contents: "Grains (Wheat)",
        isPerishable: false,

        needsElectricity: false,
    },
    {
        contents: "Refrigerated Meat",
        isPerishable: true,

        needsElectricity: true,
    },
    {
        contents: "Furniture (Flat-Pack)",
        isPerishable: false,

        needsElectricity: false,
    },
    {
        contents: "Plastic Pellets",
        isPerishable: false,

        needsElectricity: false,
    },
    {
        contents: "Fresh Flowers",
        isPerishable: true,

        needsElectricity: true,
    },
    {
        contents: "Canned Goods",
        isPerishable: false,

        needsElectricity: false,
    },
    {
        contents: "Medical Equipment",
        isPerishable: false,

        needsElectricity: false,
    },
    {
        contents: "Dairy Products (Cheese)",
        isPerishable: true,

        needsElectricity: true,
    },
    { contents: "Paper Rolls", isPerishable: false, needsElectricity: false },
    {
        contents: "Fruit Juice (Refrigerated)",
        isPerishable: true,

        needsElectricity: true,
    },
    {
        contents: "Textiles (Clothing)",
        isPerishable: false,

        needsElectricity: false,
    },
    {
        contents: "Coffee Beans",
        isPerishable: false,

        needsElectricity: false,
    },
    {
        contents: "Chemicals (Non-Hazardous)",
        isPerishable: false,

        needsElectricity: false,
    },
    {
        contents: "Chemicals (Hazardous)",
        isPerishable: false,

        needsElectricity: false,
    },
    { contents: "Potatoes", isPerishable: true, needsElectricity: false },
    {
        contents: "Solar Panels",
        isPerishable: false,

        needsElectricity: false,
    },
    {
        contents: "Frozen Vegetables",
        isPerishable: true,

        needsElectricity: true,
    },
    {
        contents: "Construction Materials (Tiles)",
        isPerishable: false,

        needsElectricity: false,
    },
    { contents: "Batteries", isPerishable: false, needsElectricity: false },
    { contents: "Apples", isPerishable: true, needsElectricity: true },
    {
        contents: "Machinery Parts",
        isPerishable: false,

        needsElectricity: false,
    },
    { contents: "Sugar", isPerishable: false, needsElectricity: false },
    {
        contents: "Seafood (Shellfish)",
        isPerishable: true,

        needsElectricity: true,
    },
    { contents: "Toys", isPerishable: false, needsElectricity: false },
    { contents: "Cement", isPerishable: false, needsElectricity: false },
    { contents: "Berries", isPerishable: true, needsElectricity: true },
    {
        contents: "Sports Equipment",
        isPerishable: false,

        needsElectricity: false,
    },
    { contents: "Rice", isPerishable: false, needsElectricity: false },
    { contents: "Chocolate", isPerishable: false, needsElectricity: false },
    { contents: "Live Plants", isPerishable: true, needsElectricity: true },
    {
        contents: "Household Appliances",
        isPerishable: false,

        needsElectricity: false,
    },
    { contents: "Salt", isPerishable: false, needsElectricity: false },
    { contents: "Yogurt", isPerishable: true, needsElectricity: true },
    { contents: "Books", isPerishable: false, needsElectricity: false },
    { contents: "Coal", isPerishable: false, needsElectricity: false },
    { contents: "Oranges", isPerishable: true, needsElectricity: true },
    {
        contents: "Musical Instruments",
        isPerishable: false,

        needsElectricity: false,
    },
    { contents: "Cooking Oil", isPerishable: false, needsElectricity: false },
    { contents: "Ice Cream", isPerishable: true, needsElectricity: true },
    {
        contents: "Art Supplies",
        isPerishable: false,

        needsElectricity: false,
    },
    { contents: "Fertilizer", isPerishable: false, needsElectricity: false },
    { contents: "Asparagus", isPerishable: true, needsElectricity: true },
    { contents: "Watches", isPerishable: false, needsElectricity: false },
    { contents: "Flour", isPerishable: false, needsElectricity: false },
];

// generate accounts
export const accounts: Map<string, Account> = accountNames.reduce((prev, name, i) => {
    const accountId = generateIncrementingId("ACC", i);
    prev.set(accountId, new Account(accountId, name));
    return prev;
}, new Map<string, Account>());

export const getAllAccounts = () =>
    Array.from(accounts.keys()).reduce((prev, accountId) => {
        prev.push(accounts.get(accountId)!);
        return prev;
    }, new Array<Account>());

// generate contacts
let contactIdx = 0;
export const contacts: Map<string, Array<Contact>> = accountNames.reduce((prev, name, i) => {
    const accountId = generateIncrementingId("ACC", i);
    const contacts = new Array<Contact>();
    prev.set(accountId, contacts);
    for (let j = 0, k = generateRandomNumber(1, MAX_CONTACTS_PER_ACCOUNT); j < k; j++) {
        const contactId = generateIncrementingId("CONT", contactIdx++);
        const p = generatePerson();
        contacts.push(new Contact(accountId, contactId, p.email, p.phone, p.firstName, p.lastName));
    }
    return prev;
}, new Map<string, Array<Contact>>());

export const getAllContacts = () => {
    return getAll<Contact>(contacts);
};

// loop the routes to ensure we have shipments across all routes
let routeIdx = 0;
let equipmentIdx = 0;
export const routes = new Map<string, Array<Route>>();
export const shipments = new Map<string, Shipment>();
export const cargo = new Map<string, Array<Cargo>>();
knownRoutes.forEach((knownRoute) => {
    const dates: Array<Array<Date>> = [];
    let startdt = generateRandomDateTime();
    knownRoute.legs.forEach((l) => {
        const enddt = new Date(startdt.getTime() + l.hours * 60 * 60 * 1000);
        dates.push([startdt, enddt]);
        startdt = new Date(enddt.getTime() + 10 * 60 * 60 * 1000);
    });

    accounts.forEach((a) => {
        // loop accounts and see if they have a shipment on this route
        if (Math.random() < 0.4) return;

        // account has shipment
        const shipmentId = generate10DigitId(10);
        const accountContacts = contacts.get(a.accountId)!;
        const contact = accountContacts[generateRandomNumber(0, accountContacts.length-1)];
        const shipment = new Shipment(shipmentId, a.accountId, contact, knownRoute.legs[0].city1, knownRoute.legs[knownRoute.legs.length - 1].city2);
        shipment.dangerousCargo = Math.random() < 0.3;
        shipment.allowPartial = Math.random() < 0.3;
        shipment.commodity = Math.random() > 0.3;
        shipment.activeReefer = Math.random() < 0.5;
        shipments.set(shipmentId, shipment);

        // add route(s) for shipment
        routes.set(
            shipmentId,
            knownRoute.legs.map((cp, idx) => {
                return new Route(generateIncrementingId("ROUT", routeIdx++), shipmentId, cp.service, cp, dates[idx][0], dates[idx][1]);
            })
        );

        // generate some cargo for the shipment
        const pieces = generateRandomNumber(1, 5);
        const cargos: Array<Cargo> = [];
        for (let i = 0; i < pieces; i++) {
            const equipmentId = generateIncrementingId("EQUIP", equipmentIdx++);
            const cd = containerContentsArray[generateRandomNumber(0, containerContentsArray.length - 1)];
            cargos.push(new Cargo(equipmentId, shipmentId, cd.contents, cd.isPerishable, cd.needsElectricity));
        }
        cargo.set(shipmentId, cargos);
    });
});
export const getAllShipments = () => Array.from(shipments.values());
export const getAllRoutes = () =>
    Array.from(routes.values()).reduce((prev, rs) => {
        prev.push(...rs);
        return prev;
    }, []);

const getAll = <T>(data: Map<string, Array<T>>) => {
    return Array.from(data.keys()).reduce((prev, id) => {
        prev.push(...data.get(id)!);
        return prev;
    }, new Array<T>());
};
export const getAllCargo = () => {
    return getAll<Cargo>(cargo);
};
