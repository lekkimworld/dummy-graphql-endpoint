import { config as config_dotenv } from "dotenv";
config_dotenv();

import "reflect-metadata";
import { json } from "body-parser";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema, Ctx, Field, FieldResolver, ObjectType, Query, Resolver, Root } from "type-graphql";
import { randomUUID } from "crypto";

type GraphQLResolverContext = {};

@ObjectType()
class Customer {
    @Field(() => String)
    externalId: string;

    @Field(() => String)
    email: string;

    @Field(() => String)
    firstName: string;

    @Field(() => String)
    lastName: string;

    constructor(externalId: string, email: string, fn: string, ln: string) {
        this.externalId = externalId;
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

    constructor(orderId: string, amount: number, customer: Customer) {
        this.orderId = orderId;
        this.amount = amount;
        this.customerId = customer.externalId;
    }
}

@Resolver((_of) => Customer)
class CustomerResolver {
    @Query((_returns) => [Customer], { nullable: false })
    async customers(@Ctx() _ctx: GraphQLResolverContext) {
        const customers: Array<Customer> = [
            new Customer("9cfba3ee-a096-4f0f-8895-dfc29fb8beb7", "rasmus.nielsen@example.com", "Rasmus", "Nielsen"),
            new Customer("4c37ffd2-d32d-4bbc-92e9-d898df9b95b0", "sofie.madsen@example.com", "Sofie", "Madsen"),
            new Customer("787ff214-93a0-4050-b904-0689ce333ce6", "louise.iversen@example.com", "Louise", "Iversen"),
            new Customer(
                "45ef0ab0-20fa-49e5-8032-42cac5d6368b",
                "sebastian.rasmussen@example.com",
                "Sebastian",
                "Rasmussen"
            ),
            new Customer("b3272743-50bc-494c-8d03-37026b1e12ab", "signe.johansen@example.com", "Signe", "Johansen"),
            new Customer("b8b3e520-0844-47d2-9d58-5787def6c61c", "anton.andreasen@example.com", "Anton", "Andreasen"),
            new Customer("e3fec75e-d651-4795-a0a8-886ab9ecb2ab", "lucas.bech@example.com", "Lucas", "Bech"),
            new Customer("fd225a46-c63b-46b5-a7b9-3ea18012a9f9", "mikkel.iversen@example.com", "Mikkel", "Iversen"),
            new Customer(
                "2717323e-9542-4428-8af1-3defa6a5adf1",
                "rasmus.christensen@example.com",
                "Rasmus",
                "Christensen"
            ),
            new Customer("749fee6f-8342-4135-bb55-d8db8be2a2a9", "maja.knudsen@example.com", "Maja", "Knudsen"),
        ];

        return customers;
    }

    @FieldResolver((_type) => [Order])
    async orders(
        @Root() cust: Customer,
        @Ctx() ctx: GraphQLResolverContext
    ) {
        const count = Math.floor(Math.random() * 5);
        const orders : Array<Order> = [];
        for (let i=0; i<count; i++) {
            const o = new Order(randomUUID(), Math.round(Math.random() * 5000 * 100) / 100, cust);
            orders.push(o);
        }
        return orders;
    }
}

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
        resolvers: [CustomerResolver],
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
    app.listen(process.env.PORT || 8080, () => {
        console.log(`Server is listening on port ${process.env.PORT || 8080}`);
    });
};

start();
