import { Page } from 'puppeteer';

const noCSS = (page: Page) => {
  page.on('request', (req) => {
    if(req.resourceType() === 'stylesheet' || req.resourceType() === 'font'){
      req.abort();
    }
    else {
      req.continue();
    }
  });
}

export default noCSS;
