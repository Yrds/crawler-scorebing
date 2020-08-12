import puppeteer, { Browser, ElementHandle, Page } from 'puppeteer';
import PageOptimizer from './PageOptimizer';
import { noCSS, noImages } from './PageOptimizer/Optmizations';
import parseTableValue, { RowValues } from './Actions/parseTableValue';
import waitForXhr from './Actions/waitForXhr';
import goToFixture from './Actions/goToFixture';
import fs, { WriteStream } from 'fs';

interface InitOptions {
  maxResults: number;
}

interface CrawlerInterface {
  init: (options: InitOptions) => Promise<RowValues[]>;
}

const Crawler = (): CrawlerInterface => {

  const getFixtureDate = async (page: Page): Promise<Date> => {
    const pageUrl = await page.url();
    const urlParts = pageUrl.split('/');
    const fixtureString = urlParts[urlParts.length-1];
    const year: number = Number(fixtureString.substring(0, 4));
    const month: number = Number(fixtureString.substring(4, 6));
    const day: number = Number(fixtureString.substring(6, 8));

    const fixtureDate: Date = new Date(year, month, day);

    console.log('year', year);
    console.log('month', month);
    console.log('day', day);

    return fixtureDate;
  }

  const clickTodayButton  = async (page: Page) => {
    const todayButton = await page.waitForXPath('//li/a[. = "Today"]');
    await Promise.all([
      page.waitForNavigation(),
      todayButton.click()
    ]);
  }


  const scrollUntilLoadEverything = async (page: Page) => {
    const requests: number = 0;

    const scrollDown = async () => {
      await page.evaluate(() => window.scrollTo(0,document.body.scrollHeight));
    }
    const interval = setInterval(scrollDown, 100);
    await waitForXhr(page, 2000);
    clearInterval(interval);
  }

  const fixtureToString = (fixture: Date): string => {
    console.log('parsing fixture to string', fixture);
    return fixture.getFullYear().toString().padStart(4, '0')
    + fixture.getMonth().toString().padStart(2, '0')
    + fixture.getDate().toString().padStart(2, '0');
  }


  const thereIsTable = async (page: Page): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      console.log('waiting for table');
      page.waitForSelector('.live-list-table.diary-table > tbody', {timeout: 5000})
        .then((result: ElementHandle | null) => {
          resolve(true)
        })
        .catch(err => resolve(false));
    });
  }

  const init = async (options: InitOptions): Promise<RowValues[]> => {
    try {
      const browser = await getBrowser();
      const page = await browser.newPage();
      const resultsArray: RowValues[] = [];
      console.log('go fixture...');
      await goToFixture(page, '');
      console.log('clicking today button...');
      await clickTodayButton(page);
      while(resultsArray.length < options.maxResults){
        const fixtureDate: Date = await getFixtureDate(page);
        console.log('scrolling until load everything...')
        if(await thereIsTable(page)){
          await scrollUntilLoadEverything(page);
          console.log('hovering page')
          //TODO Exception when there is no games to scrap
          await page.hover('.live-list-table.diary-table > tbody');
          console.log('getting table element');
          const table: ElementHandle = await page.waitForSelector('.live-list-table.diary-table > tbody');
          console.log('parsing table values');
          const tableValue = await parseTableValue(table);
          resultsArray.push(...tableValue);
          console.log(`${resultsArray.length}/${options.maxResults}`);
        }
        const backFixture = new Date(fixtureDate.getTime());
        backFixture.setDate(backFixture.getDate() - 1);
        await goToFixture(page, fixtureToString(backFixture));

      }

      console.log('closing browser');
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
