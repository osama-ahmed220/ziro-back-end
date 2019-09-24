import "reflect-metadata";
import { ApolloServer, Config } from "apollo-server-express";
import connectRedis from "connect-redis";
import Express from "express";
import session from "express-session";
import cors from "cors";
// import { formatArgumentValidationError } from "type-graphql";
import * as path from "path";
import {
  createConnection,
  getConnectionOptions,
  ConnectionOptions
} from "typeorm";
import { redis } from "./redis";
import { createSchema } from "./utils/createSchema";

const main = async () => {
  const connectionOptions: ConnectionOptions = await getConnectionOptions(
    process.env.NODE_ENV === "production" ? "production" : "default"
  );
  await createConnection({
    ...connectionOptions,
    name: "default"
  });
  const apolloServerOptions: Config = {
    schema: await createSchema(),
    // formatError: formatArgumentValidationError,
    playground: true,
    context: ({ req, res }: any) => ({ req, res })
  };
  if (process.env.NODE_ENV === "production") {
    apolloServerOptions.introspection = true;
  }
  const apolloServer = new ApolloServer(apolloServerOptions);
  const app = Express();
  const RedisStore = connectRedis(session);
  app.use(Express.static("assets"));
  app.get("/", (_, res) => {
    res.send("Working");
  });
  app.use(
    cors({
      credentials: true,
      origin: process.env.FRONTEND_URL as string
    })
  );
  app.use(
    session({
      store: new RedisStore({
        client: redis as any
      }),
      name: "qid",
      secret: "aslkdfjoiq12312",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
      }
    })
  );
  const port = process.env.PORT || 8080;
  app.use(Express.static(path.join(__dirname, "assets")));
  apolloServer.applyMiddleware({
    app,
    cors: false
  });
  app.listen(port, () => {
    console.log(
      `server is running on post ${port} http://localhost:8080/graphql`
    );
  });
};
main();
