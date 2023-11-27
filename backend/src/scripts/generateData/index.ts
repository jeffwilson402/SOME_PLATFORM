import { MongoClient } from "mongodb";
import { exit } from "process";
import { generate } from "./generate";
import { config } from "dotenv";

config();

export const environment = {
  mongoUri: process.env.MONGO_URI,
  database: process.env.DATABASE,
};

async function main() {
  if (!environment.mongoUri) {
    console.error("no `MONGO_URI` environment variable set");
    exit(1);
  }
  const mongoClient = new MongoClient(environment.mongoUri);
  const db = mongoClient.db(environment.database);
  await generate(db);
}
main();
