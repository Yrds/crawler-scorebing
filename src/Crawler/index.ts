import puppeteer, { Browser } from 'puppeteer';

const function crawler = (): any => {
  const init = async (): Promise<void> => {
    const browser = await getBrowser();
  }
  const getBrowser = async (): Promise<Browser> => {
    return await puppeteer.launch();
  }

  return init;
}


export default crawler;
