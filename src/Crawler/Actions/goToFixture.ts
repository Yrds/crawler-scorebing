import { Page } from 'puppeteer';

const goToFixure = async (page: Page, fixture: string) => {
  const fixtureUrl: string = 'https://www.scorebing.com/fixtures/' + fixture;
  console.log('going to', fixtureUrl);
  await page.goto(fixtureUrl);
}

export default goToFixure;
