import { PuppeteerCrawler } from "crawlee";
import sanitizeHtml from "sanitize-html";
import { parse } from "node-html-parser";
import TurndownService from "turndown";

interface CrawlSourceConfig {
  url: string;
  cssSelector?: string;
}

interface CrawlerConfig {
  [key: string]: CrawlSourceConfig;
}

const turndown = new TurndownService();
turndown.remove("style");
turndown.remove("img");

function createCrawler(config: CrawlerConfig = {}) {
  const crawler = new PuppeteerCrawler({
    launchContext: {
      launchOptions: {
        headless: true,
      },
    },
    async requestHandler(context) {
      const { log, request, pushData } = context;
      const { cssSelector = "body" } = config[request.url];

      log.info(`Processing ${request.url}...`);

      await context.page.waitForSelector(cssSelector);
      const body = await context.page.$(cssSelector);

      if (!body) {
        throw new Error(`Could not find body for ${request.url}`);
      }

      const htmlString = sanitizeHtml(
        await (await body.getProperty("innerHTML")).jsonValue(),
        {
          selfClosing: [],
          allowedAttributes: {},
          exclusiveFilter: (frame) => {
            return !!frame.attribs["id"]?.startsWith("trbo-");
          },
        }
      );

      const dom = parse(
        htmlString
          .replace(/(\r\n|\r|\n){2}/g, "$1")
          .replace(/(\r\n|\r|\n){3,}/g, "$1\n")
      );
      const text = turndown.turndown(dom.innerHTML);

      await pushData({
        url: request.url,
        body: text,
      });
    },
  });

  return crawler;
}

export interface CrawlArgs {
  urls: Array<string | CrawlSourceConfig>;
}

export async function crawl({ urls }: CrawlArgs) {
  const crawlerConfig = urls.reduce<CrawlerConfig>((acc, url) => {
    if (typeof url === "string") {
      acc[url] = { url };
    } else {
      acc[url.url] = url;
    }

    return acc;
  }, {});

  const crawler = createCrawler(crawlerConfig);
  await crawler.addRequests(Object.keys(crawlerConfig));
  await crawler.run();

  const dataset = await crawler.getDataset();
  return (await dataset.getData()).items as { url: string; body: string }[];
}
