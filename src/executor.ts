import "dotenv/config";

import { createPrompt } from "./prompts";
import { crawl } from "./crawler";
import type { CrawlArgs } from "./crawler";
import { z } from "zod";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";

export interface ChatConfig<T> {
  schema: T;
  taskInstructions?: string;
  systemMessage?: string;
}

// TODO: Find some useful default system message.
const DEFAULT_SYSTEM_MESSAGE = "";

export class Executor<T extends z.AnyZodObject> {
  _schema: T;
  _taskInstructions: string | undefined;
  _systemMessage: string;
  model: ChatOpenAI;

  constructor(chatConfig: ChatConfig<T>) {
    this._schema = chatConfig.schema;
    this._taskInstructions = chatConfig.taskInstructions;
    this._systemMessage = chatConfig.systemMessage || DEFAULT_SYSTEM_MESSAGE;
    this.model = new ChatOpenAI({
      temperature: 0.1,
      modelName: "gpt-3.5-turbo",
      maxTokens: -1,
    });
  }

  async run(crawlArgs: CrawlArgs): Promise<z.output<T>> {
    const data = await crawl(crawlArgs);
    const text = data.map(({ body }) => body).join("\n\n***\n\n");
    const { prompt, parser } = await createPrompt(
      this._schema,
      this._systemMessage
    );

    const chain = new LLMChain({
      llm: this.model,
      prompt,
    });

    const response = await chain.call({
      text,
      formatInstructions: parser.getFormatInstructions(),
      taskInstructions: this._taskInstructions,
    });

    return parser.parse(response.text);
  }
}
