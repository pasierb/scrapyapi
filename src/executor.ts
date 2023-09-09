import "dotenv/config";

import { createPrompt } from "./prompts";
import { crawl } from "./crawler";
import { z } from "zod";
import { OpenAI } from "langchain/llms/openai";

const model = new OpenAI({ temperature: 0 });

export async function run() {
  const schema = z.object({
    title: z.string().describe("Title of the article"),
    summary: z.string().describe("Summary of the article").max(500),
  });
  const urls = ["https://familyfunmap.ch/spots/schongiland/"];
  const { prompt, parser } = createPrompt(schema);

  const data = await crawl(urls);
  for await (const { url, body } of data) {
    const text = body as string;
    const input = await prompt.format({ text });

    console.log(input);

    const response = await model.call(input);

    console.log(response);

    const { title, summary } = await parser.parse(response);
    console.log({ title, summary });
  }
}

run();
