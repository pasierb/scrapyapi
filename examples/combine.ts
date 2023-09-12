import { z } from "zod";
import { run } from "../src/executor";

const hoelgrotten = [
  {
    url: "https://www.hoellgrotten.ch/en",
  },
  {
    url: "https://www.familyfunfactor.com/hollgrotten_caves",
    cssSelector: "article",
  },
  {
    url: "https://www.myswitzerland.com/en/experiences/hoellgrotten/",
    cssSelector: ".PageHeader",
  },
  {
    url: "https://www.zuerich.com/en/visit/nature/hoellgrotten-baar",
    cssSelector: "main",
  },
];

async function main() {
  // URLs to crawl.
  const urls = [
    {
      url: "https://www.familyfunfactor.com/attraction-ravensburger-spieleland",
      cssSelector: "article",
    },
    {
      url: "https://www.spieleland.de/uk/plan-your-visit/arrival/index.html",
      cssSelector: "main",
    },
    {
      url: "https://www.spieleland.de/uk/plan-your-visit/tickets/index.html",
      cssSelector: "main",
    },
    {
      url: "https://www.spieleland.de/uk/plan-your-visit/restaurants/index.html",
      cssSelector: "main",
    },
    {
      url: "https://www.spieleland.de/uk/attractions/index.html",
      cssSelector: "main",
    },
  ];

  const taskInstructions = `
Text is about a spot. Use active voice. Format string output as a markdown code block.

STEPS:

Step 1. 

Summarize following text in the topics:

1. "Overview" - Markdown formatted overview of the spot.
2. "Pricing" - Markdown formatted overview of pricing at the spot, admission, tickets, etc. Prefer a list format.
3. "Opening hours" - Markdown formatted overview of opening hours at the spot.
4. "Attractions" - Markdown formatted list of available attractions at the spot. Prefer a list format.
5. "Food" - Markdown formatted information about food options at the spot, restaurants, grill places, etc.
6. "Location" - Markdown formatted information about the location of the spot, commuting, parking availability etc.

Step 2.

Format each topics as markdown text

Step 3.

Adhere to format instructions below placing each topic under seperate key.
Make sure to escape double quotes in the text so the output is a valid JSON.
  `;

  // zod schema for the data we want to extract.
  const schema = z.object({
    overview: z
      .string()
      .describe("Overview of the spot in a markdown format.")
      .max(500),
    pricing: z
      .string()
      .describe(
        "Pricing at the spot, admission, tickets, etc. Prefer a Markdown unordered list format."
      )
      .max(500),
    openingHours: z
      .string()
      .describe("Opening hours of the spot. Prefer markdown list format.")
      .max(500),
    attractions: z
      .string()
      .describe(
        "List of available attractions at the spot. Prefer a Markdown unordered list format."
      )
      .max(500),
    food: z
      .string()
      .describe(
        "Information about food options at the spot, restaurants, grill places, etc. in a markdown format"
      )
      .max(500),
    location: z
      .string()
      .describe(
        "Information about the location of the spot, commuting, parking availability etc. in a markdown format"
      )
      .max(500),
  });

  const data = await run({ urls: hoelgrotten }, { schema, taskInstructions });

  console.log(data);
}

main();
