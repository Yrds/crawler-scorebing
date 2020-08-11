import crawler from "./Crawler";
import {buildWorksheetBuffer} from './Worksheet';
import fs from 'fs';

const saveBuffer = (path: string, buffer: any) => {
  const file = fs.openSync(path, 'w');
  fs.writeFileSync(file, buffer);
}

crawler().init({maxResults: 100}).then(results => {
  const buffer = buildWorksheetBuffer(results);
  saveBuffer('planilha.xlsx', buffer);
})
