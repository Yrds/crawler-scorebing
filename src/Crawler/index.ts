import puppeteer, { Browser, ElementHandle } from 'puppeteer';
import PageOptimizer from './PageOptimizer';
import { noCSS, noImages } from './PageOptimizer/Optmizations';
import parseTableValue from './Actions/parseTableValue';

interface CrawlerInterface {
  init: () => Promise<void>;
}

const Crawler = (): CrawlerInterface => {
  const init = async (): Promise<void> => {
    try {
      const browser = await getBrowser();
      const page = await browser.newPage();
      PageOptimizer(page).apply([noCSS]);
      await page.goto('https://www.scorebing.com/fixtures');
      await page.hover('.diary-table > tbody');
      const table: ElementHandle = await page.waitForSelector('.diary-table tbody');
      await table.evaluate((node: any) => node.style.border = "solid red 1px");
      await parseTableValue(table);
      await page.screenshot({path: 'screenshot.png'});
      await browser.close();
    } catch(err) {
      console.error(err.message);
    }
  }

  const getBrowser = async (): Promise<Browser> => {
    try {
      return await puppeteer.launch({
        defaultViewport: {width: 1600, height: 1600}
      });
    } catch(err) {
      throw Error(err.message);
    }
  }

  return {
    init
  };
}


export default Crawler;
