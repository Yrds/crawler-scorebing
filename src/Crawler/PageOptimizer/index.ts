import { Page } from 'puppeteer';

interface PageOptmizerInterface {
  apply: (page: Page) => Promise<void> ;
}

const PageOptimizer = (page: Page) => {
  const apply = (options: any[]) => {
    page.setRequestInterception(true);
    options.forEach((option: any) => option(page));
  }

  return {
    apply
  }
}

export default PageOptimizer;
