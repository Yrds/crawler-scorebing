import { Page } from 'puppeteer';

const filterRequest = (page: Page) {
  page.on('request', (req) => {
  }
}
