import { PuppeteerCrawler, Dataset } from "crawlee";

function createCrawler() {
  return new PuppeteerCrawler({
    launchContext: {
      launchOptions: {
        headless: true,
      },
    },
    async requestHandler(context) {
      const { log, request, pushData } = context;
      const body = await context.page.$("body");
      log.info(`Processing ${request.url}...`);

      await pushData({
        url: request.url,
        body: await (await body?.getProperty("textContent"))?.jsonValue(),
      });
    },
  });
}

export async function crawl(urls: string[]) {
  const crawler = createCrawler();
  await crawler.addRequests(urls);
  await crawler.run();

  const dataset = await crawler.getDataset();
  return (await dataset.getData()).items as { url: string; body: string }[];
}
