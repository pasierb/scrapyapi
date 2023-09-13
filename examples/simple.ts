import { z } from "zod";
import { Executor } from "../src/executor";

async function main() {
  // zod schema for the data we want to extract.
  const schema = z.object({
    title: z.string().describe("Title of the article"),
    summary: z.string().describe("Summary of the article").max(500),
  });

  // URLs to crawl.
  const urls = ["https://familyfunmap.ch/spots/schongiland/"];
  const executor = new Executor({ schema });

  const data = await executor.run({ urls });
  console.log(data);
}

main();
