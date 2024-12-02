import { config as config_dotenv } from "dotenv";
config_dotenv();

import "reflect-metadata";
import {json} from "body-parser";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema, Ctx, Field, ObjectType, Query, Resolver } from "type-graphql";

type GraphQLResolverContext = {};

@ObjectType()
class Customer {
    @Field(() => String)
    firstName: string;

    @Field(() => String)
    lastName: string;

    constructor(fn: string, ln: string) {
        this.firstName = fn;
        this.lastName = ln;
    }
}

@Resolver((_of) => Customer)
class CustomerResolver {
    @Query((_returns) => [Customer], { nullable: false })
    async customers(@Ctx() _ctx: GraphQLResolverContext) {
        return [new Customer("Mikkel", "Heisterberg"), new Customer("Mette", "Heisterberg")];
    }
}

const configureExpress = async (): Promise<Express> => {
    const app: Express = express();

    app.enable("trust proxy");
    app.use(json());
    app.use((req: Request, res: Response, next: NextFunction) => {
        const ignoreAuth = process.env.IGNORE_AUTH;
        if (ignoreAuth) return next();
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).send("Missing Authorization header").end();
        if (!authHeader.startsWith("Bearer "))
            return res.status(401).send("No bearer token in Authorization header").end();
        const bearerToken = authHeader.substring(7);
        if (bearerToken !== process.env.BEARER_TOKEN)
            return res.status(401).send("Invalid bearer token in Authorization header").end();

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
