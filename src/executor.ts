import "dotenv/config";

import { createPrompt } from "./prompts";
import { crawl } from "./crawler";
import type { CrawlArgs } from "./crawler";
import { z } from "zod";
import { ChatOpenAI } from "langchain/chat_models/openai";

import { LLMChain } from "langchain/chains";

const model = new ChatOpenAI({ temperature: 0 });

interface ExecutorConfig {
  dryRun?: boolean;
  verbose?: boolean;
}

interface ChatConfig {
  schema: z.AnyZodObject;
  taskInstructions?: string;
}

export async function run(
  crawlArgs: CrawlArgs,
  chatConfig: ChatConfig,
  config: ExecutorConfig = {}
) {
  const data = await crawl(crawlArgs);
  const text = data.map(({ body }) => body).join("\n\n***\n\n");

  const { schema, taskInstructions = "" } = chatConfig;
  const { prompt, parser } = await createPrompt(schema);
  const chain = new LLMChain({ llm: model, prompt });

  const response = await chain.call({
    text,
    formatInstructions: parser.getFormatInstructions(),
    taskInstructions,
  });

  return parser.parse(response.text);
}
