import { Page, Request } from 'puppeteer';

const waitForXhr = (page: Page, miliseconds: number): Promise<null> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => { 
      page.off('request', logRequest);
      resolve(null)
    }, miliseconds);

    const logRequest = (request: Request) => {
      if(request.resourceType() === 'xhr'){
        timeout.refresh();
        console.log('xhr detected');
      }
    }

    page.on('request', logRequest)

  });
}

export default waitForXhr;
