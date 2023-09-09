import { z } from "zod";
import { run } from "../src/executor";

async function main() {
  // zod schema for the data we want to extract.
  const schema = z.object({
    title: z.string().describe("Title of the article"),
    summary: z.string().describe("Summary of the article").max(500),
  });

  // URLs to crawl.
  const urls = ["https://familyfunmap.ch/spots/schongiland/"];

  const data = await run(urls, schema);
  console.log(data);
}

main();
