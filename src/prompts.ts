import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";

const promptTemplate = `
    TASK:
    Extract following data from the given text.

    TEXT:
    ---
    {text}
    ---

    {formatInstructions}
`;

function getParser(schema: z.AnyZodObject) {
  return StructuredOutputParser.fromZodSchema(schema);
}

export function createPrompt(schema: z.AnyZodObject) {
  const parser = getParser(schema);

  const prompt = new PromptTemplate({
    template: promptTemplate,
    inputVariables: ["text"],
    partialVariables: {
      formatInstructions: parser.getFormatInstructions(),
    },
  });

  return {
    prompt,
    parser,
  };
}
