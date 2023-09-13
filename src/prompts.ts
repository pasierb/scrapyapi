import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";
import { SystemMessage } from "langchain/schema";

const promptTemplate = `
TASK:

Extract following data from the given source text.

{taskInstructions}

FORMAT INSTRUCTIONS:

{formatInstructions}

SOURCE TEXT:

{text}
`;

function getParser(schema: z.AnyZodObject) {
  return StructuredOutputParser.fromZodSchema(schema);
}

export async function createPrompt(
  schema: z.AnyZodObject,
  systemMessage: string
) {
  const parser = getParser(schema);

  const taskPrompt = HumanMessagePromptTemplate.fromTemplate(promptTemplate);
  const prompt = ChatPromptTemplate.fromPromptMessages([
    new SystemMessage(systemMessage),
    taskPrompt,
  ]);

  return {
    prompt,
    parser,
  };
}
