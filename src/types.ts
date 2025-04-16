import { Field, Float, ObjectType } from "type-graphql";
import {
    approximateFlightTime,
    approximateRailTime,
    generateRandomContainerNumber,
    generateRandomDateTimes,
} from "./utils";

export interface CityPair {
    city1: CityData;
    city2: CityData;
    hours: number;
    service: string;
}

export interface Person {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
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
}

export interface CityData {
    cityName: string;
    portCode: string;
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

    @Field(() => Boolean)
    dangerousCargo: boolean = false;

    @Field(() => Boolean)
    allowPartial: boolean = false;

    @Field(() => Boolean)
    commodity: boolean = false;

    @Field(() => Boolean)
    activeReefer: boolean = false;

    @Field(() => String)
    businessUnit: string = "Some Business Unit";

    @Field(() => String)
    serviceMode: string = Math.random() < 0.5 ? "CY/CY" : "CY/SD";

    @Field(() => Contact)
    contact: Contact;

    constructor(id: string, accountId: string, bookedBy: Contact, start: City, end: City) {
        this.shipmentId = id;
        this.accountId = accountId;
        this.contact = bookedBy;
        this.start = start;
        this.end = end;
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
    needsElectricity: boolean;

    constructor(equipmentId: string, shipmentId: string, contents: string, perishable: boolean, elec: boolean) {
        this.equipmentId = equipmentId;
        this.shipmentId = shipmentId;
        this.containerNo = generateRandomContainerNumber();
        this.contents = contents;
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

    @Field(() => String)
    service: string;

    constructor(id: string, shipmentId: string, service: string, leg: CityPair, startdt: Date, enddt: Date) {
        this.shipmentId = shipmentId;
        this.routeId = id;
        this.start = leg.city1;
        this.end = leg.city2;
        this.service = service;

        this.type = "sea";
        this.hours = leg.hours;
        this.startdt = startdt.toISOString();
        this.enddt = enddt.toISOString();
    }

    public toString(): string {
        return `[ROUTE id <${this.routeId}> from <${this.start.cityName}> to <${this.end.cityName}> type <${this.type}> start <${this.startdt}> end <${this.enddt}>]`;
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
    phone: string;

    @Field(() => String)
    firstName: string;

    @Field(() => String)
    lastName: string;

    @Field(() => String)
    fullname: string;

    constructor(accountId: string, contactId: string, email: string, phone: string, fn: string, ln: string) {
        this.accountId = accountId;
        this.contactId = contactId;
        this.email = email;
        this.phone = phone;
        this.firstName = fn;
        this.lastName = ln;
        this.fullname = `${this.firstName} ${this.lastName}`;
    }
}
