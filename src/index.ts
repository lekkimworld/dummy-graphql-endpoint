import { config as config_dotenv } from "dotenv";
config_dotenv();

import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";
import { json } from "body-parser";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import { Arg, buildSchema, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { accounts, cargo, contacts, getAllAccounts, getAllShipments, routes, shipments } from "./data";
import { Account, Cargo, Contact, Route, Shipment } from "./types";

const DEFAULT_PORT = 8080;

type GraphQLResolverContext = {};

@Resolver((_of) => Shipment)
class ShipmentResolver {
    @Query((_returns) => [Shipment], { nullable: false })
    shipments(@Ctx() _ctx: GraphQLResolverContext) {
        return getAllShipments();
    }

    @Query((_returns) => Shipment, { nullable: true })
    shipmentById(@Arg("id", () => String, { nullable: false }) id: string, @Ctx() _ctx: GraphQLResolverContext) {
        return shipments.get(id);
    }

    @FieldResolver((_type) => Account)
    async account(@Root() shipment: Shipment, @Ctx() ctx: GraphQLResolverContext) {
        return accounts.get(shipment.accountId);
    }

    @FieldResolver((_type) => [Route])
    async routes(@Root() shipment: Shipment) {
        return routes.get(shipment.shipmentId);
    }

    @FieldResolver((_type) => [Cargo])
    async cargo(@Root() shipment: Shipment) {
        return cargo.get(shipment.shipmentId);
    }
}

@Resolver((_of) => Account)
class AccountResolver {@Query((_returns) => [Account], { nullable: false })
    accounts(@Ctx() _ctx: GraphQLResolverContext) {
        return getAllAccounts();
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
    
    @FieldResolver((_type) => Account)
    async account(@Root() contact: Contact, @Ctx() ctx: GraphQLResolverContext) {
        const a = accounts.get(contact.accountId);
        return a;
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
