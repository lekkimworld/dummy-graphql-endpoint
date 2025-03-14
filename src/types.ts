import { Field, Float, ObjectType } from "type-graphql";
import { approximateFlightTime, approximateRailTime, generateRandomContainerNumber, generateRandomDateTimes } from "./utils";

export interface CityPair {
    city1: CityData;
    city2: CityData;
}

export interface Person {
    firstName: string;
    lastName: string;
    email: string;
}

@ObjectType()
export class Account {
    @Field(() => String)
    accountId: string;

    @Field(() => String)
    name: string;

    constructor(id: string, name: string) {
        this.accountId = id;
        this.name = name;
    }
}

@ObjectType()
export class Coordinates {
    @Field(() => Float)
    latitude: number;
    @Field(() => Float)
    longitude: number;

    constructor(latitude: number, longitude: number) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
};

export interface CityData {
    cityName: string;
    coordinates: Coordinates;
    isSeaPort: boolean;
    continent: string;
    country: string;
}

@ObjectType()
export class City {
    @Field(() => String)
    cityName;

    @Field(() => Coordinates)
    coordinates: Coordinates;

    @Field(() => Boolean)
    isSeaPort: boolean;

    @Field(() => String)
    continent: string;

    @Field(() => String)
    country: string;

    constructor(c: CityData) {
        this.cityName = c.cityName;
        this.coordinates = c.coordinates;
        this.isSeaPort = c.isSeaPort;
        this.continent = c.continent;
        this.country = c.country;
    }

    public toString(): string {
        return `[CITY <${this.cityName}>]`;
    }
}

@ObjectType()
export class Shipment {
    @Field(() => String)
    shipmentId: string;

    @Field(() => String)
    accountId: string;

    @Field(() => City)
    start: City;

    @Field(() => City)
    end: City;

    constructor(id: string, accountId: string, cities: CityPair) {
        const start = cities.city1;
        const end = cities.city2;

        this.shipmentId = id;
        this.accountId = accountId;
        this.start = new City(start);
        this.end = new City(end);
    }
}

@ObjectType()
export class Cargo {
    @Field(() => String)
    equipmentId: string;

    @Field(() => String)
    shipmentId: string;

    @Field(() => String)
    containerNo: string;

    @Field(() => String)
    contents: string;

    @Field(() => Boolean)
    isPerishable: boolean;

    @Field(() => Boolean)
    isCommodity: boolean;

    @Field(() => Boolean)
    needsElectricity: boolean;

    constructor(equipmentId: string, shipmentId: string, contents: string, perishable: boolean, commodity: boolean, elec: boolean) {
        this.equipmentId = equipmentId;
        this.shipmentId = shipmentId;
        this.containerNo = generateRandomContainerNumber();
        this.contents = contents;
        this.isCommodity = commodity;
        this.isPerishable = perishable;
        this.needsElectricity = elec;
    }
}

@ObjectType()
export class Route {
    @Field(() => String)
    shipmentId: string;

    @Field(() => String)
    routeId: string;

    @Field(() => String)
    type: string;

    @Field(() => City)
    start: City;

    @Field(() => City)
    end: City;

    @Field(() => Float)
    hours: number = -1;

    @Field(() => String)
    startdt: string;

    @Field(() => String)
    enddt: string;

    constructor(id: string, shipmentId: string, cities: CityPair) {
        const start = cities.city1;
        const end = cities.city2;

        this.shipmentId = shipmentId;
        this.routeId = id;
        this.start = new City(start);
        this.end = new City(end);

        if (start.country == end.country) {
            this.type = "rail";
            this.hours = approximateRailTime(start.coordinates, end.coordinates);
        } else if (start.isSeaPort && end.isSeaPort) {
            this.type = "sea";
        } else {
            this.type = "air";
            this.hours = approximateFlightTime(start.coordinates, end.coordinates);
        }

        const dates = generateRandomDateTimes(this.hours);
        this.startdt = dates[0].toISOString();
        this.enddt = dates[1].toISOString();
    }

    public toString() : string {
        return `[ROUTE id <${this.routeId}> from <${this.start}> to <${this.end}> type <${this.type}>]`;
    }
}

@ObjectType()
export class Contact {
    @Field(() => String)
    accountId: string;

    @Field(() => String)
    contactId: string;

    @Field(() => String)
    email: string;

    @Field(() => String)
    firstName: string;

    @Field(() => String)
    lastName: string;

    constructor(accountId: string, contactId: string, email: string, fn: string, ln: string) {
        this.accountId = accountId;
        this.contactId = contactId;
        this.email = email;
        this.firstName = fn;
        this.lastName = ln;
    }
}
