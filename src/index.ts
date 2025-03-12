import { config as config_dotenv } from "dotenv";
config_dotenv();

import "reflect-metadata";
import { json } from "body-parser";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";
import { expressMiddleware } from "@apollo/server/express4";
import { Arg, buildSchema, Ctx, Field, FieldResolver, Float, ObjectType, Query, Resolver, Root } from "type-graphql";
import { randomUUID } from "crypto";
import { accountNames, randomPeople, generateRandomCityPair, CityData, CityPair } from "./data";
import { approximateFlightTime, generateRandomDateTimes } from "./utils";

const DEFAULT_PORT = 8080;

type GraphQLResolverContext = {};

@ObjectType()
class Account {
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
export class City {
    @Field(() => String)
    city;

    @Field(() => Float)
    latitude: number;

    @Field(() => Float)
    longitude: number;

    constructor(c: CityData) {
        this.city = c.name;
        this.latitude = c.latitude;
        this.longitude = c.longitude;
    }
}

@ObjectType()
class Shipment {
    @Field(() => String)
    shipmentId: string;

    @Field(() => String)
    accountId: string;

    @Field(() => City)
    start: City;

    @Field(() => City)
    end: City;

    @Field(() => String)
    type: string;

    @Field(() => Float)
    flightHours: number;

    @Field(() => String)
    startdt: string;

    @Field(() => String)
    enddt: string;

    constructor(id: string, accountId: string, cities: CityPair) {
        this.shipmentId = id;
        this.accountId = accountId;
        this.start = new City(cities.city1);
        this.end = new City(cities.city2);
        this.type = "air";
        this.flightHours = approximateFlightTime(
            {
                latitude: cities.city1.latitude,
                longitude: cities.city1.longitude,
            },
            {
                latitude: cities.city2.latitude,
                longitude: cities.city2.longitude,
            }
        );
        const dates = generateRandomDateTimes(this.flightHours);
        this.startdt = dates[0].toISOString();
        this.enddt = dates[1].toISOString();
    }
}

@ObjectType()
class Contact {
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

@ObjectType()
class Order {
    @Field(() => String)
    orderId: string;

    @Field(() => Number)
    amount: number;

    @Field(() => String)
    customerId: string;

    constructor(orderId: string, amount: number, customer: Contact) {
        this.orderId = orderId;
        this.amount = amount;
        this.customerId = customer.contactId;
    }
}

@Resolver((_of) => Shipment)
class ShipmentResolver {
    @Query((_returns) => [Shipment], { nullable: false })
    shipments(@Ctx() _ctx: GraphQLResolverContext) {
        return Array.from(shipments.keys()).reduce((prev, key) => {
            prev.push(...shipments.get(key)!);
            return prev;
        }, new Array<Shipment>())
    }

    @Query((_returns) => Shipment, { nullable: true })
    shipmentById(@Arg("id", () => String, {nullable: false}) id: string, @Ctx() _ctx: GraphQLResolverContext) {
        let result: Shipment|undefined = undefined;

        Array.from(shipments.keys()).forEach(accountId => {
            if (result) return;
            const r = shipments.get(accountId)?.find(s => {
                if (s.shipmentId === id) return s;
            });
            result = r || result;
        });
        return result;
    }

    @FieldResolver((_type) => Account)
    async account(@Root() shipment: Shipment, @Ctx() ctx: GraphQLResolverContext) {
        return accounts.get(shipment.accountId);
    }
}

@Resolver((_of) => Account)
class AccountResolver {@Query((_returns) => [Account], { nullable: false })
    accounts(@Ctx() _ctx: GraphQLResolverContext) {
        return Array.from(accounts.values());
    }
    @Query((_returns) => Account, { nullable: true })
    accountById(@Arg("id", () => String, { nullable: false }) id: string, @Ctx() _ctx: GraphQLResolverContext) {
        return accounts.get(id);
    }

    @FieldResolver((_type) => [Contact])
    async contacts(@Root() account: Account, @Ctx() _ctx: GraphQLResolverContext) {
        return contacts.get(account.accountId);
    }

    @FieldResolver((_type) => [Shipment])
    async shipments(@Root() account: Account, @Ctx() ctx: GraphQLResolverContext) {
        return shipments.get(account.accountId);
    }
}

@Resolver((_of) => Contact)
class ContactResolver {
    @Query((_returns) => [Contact], { nullable: false })
    async contacts(@Ctx() _ctx: GraphQLResolverContext) {
        return contacts;
    }

    @FieldResolver((_type) => Account)
    async account(@Root() contact: Contact, @Ctx() ctx: GraphQLResolverContext) {
        const a = accounts.get(contact.accountId);
        return a;
    }

    @FieldResolver((_type) => [Order])
    async orders(@Root() cust: Contact, @Ctx() ctx: GraphQLResolverContext) {
        const count = Math.floor(Math.random() * 5);
        const orders: Array<Order> = [];
        for (let i = 0; i < count; i++) {
            const o = new Order(randomUUID(), Math.round(Math.random() * 5000 * 100) / 100, cust);
            orders.push(o);
        }
        return orders;
    }
}

let shipmentIdx = 0;
const generateIncrementingId = (prefix: string, i: number) => {
    const id = `0000000${i + 1}`;
    const truncatedId = id.substring(id.length - 6);
    const generatedId = `${prefix.toUpperCase()}-${truncatedId}`;
    return generatedId;
}
const shipments = new Map<string, Array<Shipment>>();
const accounts = Array.apply(null, Array(accountNames.length))
    .map(function (_x, i) {
        return i;
    })
    .reduce((prev: Map<string, Account>, i: number) => {
        const accountId = generateIncrementingId("CUST", i);
        const accountName = accountNames[i];
        const a = new Account(accountId, accountName);
        prev.set(accountId, a);

        const shipmentCount = Math.floor(Math.random() * 3);
        const s = new Array<Shipment>();
        for (let i=0; i<shipmentCount; i++) {
            s.push(new Shipment(generateIncrementingId("SHIP", shipmentIdx++), accountId, generateRandomCityPair()));
        }
        shipments.set(accountId, s);

        return prev;
    }, new Map<string, Account>());

let contactIdx = 0;
const contacts = Array.apply(null, Array(accountNames.length))
    .map(function (_x, i) {
        return i;
    })
    .reduce((prev, i: number) => {
        const contactCount = Math.floor(Math.random() * 5);
        const accountId = generateIncrementingId("CUST", i);
        const contacts = new Array<Contact>();
        for (let i=0; i<contactCount; i++) {
            const contactId = generateIncrementingId("CONT", contactIdx);
            const p = randomPeople[contactIdx++];
            const c = new Contact(accountId, contactId, p.email, p.firstName, p.lastName);
            contacts.push(c);
        }
        prev.set(accountId, contacts);
        return prev;
    }, new Map<string, Array<Contact>>());

const configureExpress = async (): Promise<Express> => {
    const app: Express = express();

    app.enable("trust proxy");
    app.use(json());
    app.use((req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).send("Missing Authorization header").end();
        if (authHeader.startsWith("Bearer ")) {
            const bearerToken = authHeader.substring(7);
            if (bearerToken !== process.env.BEARER_TOKEN) {
                return res.status(401).send("Invalid bearer token in Authorization header").end();
            }
        } else if (authHeader.startsWith("Basic ")) {
            const authActual = authHeader.substring(6);
            const authExpected = Buffer.from(`${process.env.BEARER_TOKEN}:${process.env.BEARER_TOKEN}`).toString("base64");
            if (authActual !== authExpected) {
                return res.status(401).send("Invalid basic credentials in Authorization header").end();
            }
        } else {
            return res.status(401).send("Invalid Authorization header").end();
        }

        // proceed
        next();
    });

    // build schema
    const schema = await buildSchema({
        resolvers: [AccountResolver, ContactResolver, ShipmentResolver],
    });

    // create server
    const apolloServer = new ApolloServer<GraphQLResolverContext>({
        schema,
        introspection: true,
        cache: new InMemoryLRUCache(),
    });
    await apolloServer.start();

    // attach middleware
    app.use(
        "/graphql",
        cors<cors.CorsRequest>(),
        expressMiddleware(apolloServer, {
            context: async ({ res }): Promise<GraphQLResolverContext> => {
                return {} as GraphQLResolverContext;
            },
        })
    );

    // return
    return app;
};

const start = async () => {
    const app = await configureExpress();

    app.get("/", (_req: Request, res: Response) => {
        res.status(200).send("OK");
    });

    // listen
    app.listen(process.env.PORT || DEFAULT_PORT, () => {
        console.log(`Server is listening on port ${process.env.PORT || DEFAULT_PORT}`);
    });
};

start();
