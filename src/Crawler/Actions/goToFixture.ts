import { Page } from 'puppeteer';

const goToFixure = async (page: Page, fixture: string) => {
  await page.goto('https://www.scorebing.com/fixtures/' + fixture);
}

export default goToFixure;
