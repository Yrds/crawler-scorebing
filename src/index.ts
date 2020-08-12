import crawler from "./Crawler";
import {buildWorksheetBuffer} from './Worksheet';
import fs from 'fs';

const saveBuffer = (path: string, buffer: any) => {
  const file = fs.openSync(path, 'w');
  fs.writeFileSync(file, buffer);
}

crawler().init({maxResults: 100000}).then(results => {
  console.log('building buffer...');
  const buffer = buildWorksheetBuffer(results);

  console.log('saving buffer...');
  saveBuffer('planilha.xlsx', buffer);
})
