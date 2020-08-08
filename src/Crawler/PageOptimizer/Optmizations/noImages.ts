import { Page } from 'puppeteer';

const noImages = (page: Page) => {
  page.on('request', (req) => {
    if(req.resourceType() === 'image'){
      req.abort();
    }
    else {
      req.continue();
    }
  });
}

export default noImages;
