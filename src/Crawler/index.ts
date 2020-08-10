import puppeteer, { Browser, ElementHandle, Page } from 'puppeteer';
import PageOptimizer from './PageOptimizer';
import { noCSS, noImages } from './PageOptimizer/Optmizations';
import parseTableValue, { RowValues } from './Actions/parseTableValue';
import goToFixture from './Actions/goToFixture';
import fs, { WriteStream } from 'fs';

interface InitOptions {
  maxResults: number;
}

interface CrawlerInterface {
  init: (options: InitOptions) => Promise<RowValues[]>;
}

const Crawler = (): CrawlerInterface => {
  const resultsArray: RowValues[] = [];

  const saveStringToFile = (path:string, data: string) => {
    const file = fs.openSync(path, 'w');
    fs.writeFileSync(file, data);
  }

  const getFixtureDate = async (page: Page): Promise<string> => {
    const pageUrl = await page.url();
    const urlParts = pageUrl.split('/');
    return urlParts[urlParts.length-1];
  }

  //TODO finish this
  const getPages = async (page: Page): Promise<number> => {
    const pagination: ElementHandle | null = await page.$('ul.pagination');
    if(!pagination) return 1;
    return 1;
  }

  const clickTodayButton  = async (page: Page) => {
    const todayButton = await page.waitForXPath('//li/a[. = "Today"]');
    await Promise.all([
      page.waitForNavigation(),
      todayButton.click()
    ]);
  }

  const init = async (options: InitOptions): Promise<RowValues[]> => {
    try {
      const browser = await getBrowser();
      const page = await browser.newPage();
      PageOptimizer(page).apply([noCSS]);
      await goToFixture(page, '');
      await clickTodayButton(page);

      console.log('fixture', await getFixtureDate(page));
      await page.hover('.live-list-table.diary-table > tbody');
      const table: ElementHandle = await page.waitForSelector('.live-list-table.diary-table > tbody');
      const tableValue = await parseTableValue(table);

      resultsArray.push(...tableValue);
      console.log(tableValue);

      await browser.close();
      return resultsArray;
    } catch(err) {
      throw Error(err);
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
