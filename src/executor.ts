import "dotenv/config";

import { createPrompt } from "./prompts";
import { crawl } from "./crawler";
import { z } from "zod";
import { OpenAI } from "langchain/llms/openai";

const model = new OpenAI({ temperature: 0 });

export async function run(urls: string[], schema: z.AnyZodObject) {
  const { prompt, parser } = createPrompt(schema);

  const data = await crawl(urls);

  return Promise.all(
    data.map(async ({ body }) => {
      const input = await prompt.format({ text: body });
      const response = await model.call(input);

      return parser.parse(response);
    })
  );
}
