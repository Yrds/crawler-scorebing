import crawler from "./Crawler";
import {buildWorkbookBuffer, createWorksheet, addDataToWorksheet, saveWorkbook, createHeader} from './Worksheet';
import fs from 'fs';
import Database from './Database';
import Game from './Database/Models/Game';
import Event from './Database/Models/Event';

const saveBuffer = (path: string, buffer: any) => {
  buffer.toFileAsync(path);
}

//crawler().init({maxResults: 100000}).then(async (results) => {
//  console.log('creating database...');
//  const database = Database('./db.sqlite');
//  console.log('creating tables...');
//  await database.sync({force: true});
//  console.log('inserting into database...');
//  await Game.bulkCreate(
//    results,
//    {
//      include: {
//        association: Game.Events
//      }
//    }
//  );
//})

const getPlainResultDatabase = async (pageSize: number = 0, offset: number = 0) => {
  const database = Database('./db.sqlite');
  const results = await Game.findAll({
    include: Game.Events,
    attributes: ['league', 'kickOffTime', 'homeTeam', 'result', 'awayTeam', 'halfResult', 'initialHGC'],
    limit: pageSize,
    offset
  })

  return results.map(el => el.get({plain: true}));
}

const getPagination = async(pageSize: number): Promise<number> => {
  const database = Database('./db.sqlite');

  const amount = await Game.count();

  console.log('amount', amount);

  return amount/pageSize;
}

(async () => {
  const pageSize = 1000;
  const totalPages = await getPagination(pageSize);
  console.log(totalPages);

  const workbook = buildWorkbookBuffer('planilha_teste_100000.xlsx');
  const worksheet = createWorksheet(workbook);
  addDataToWorksheet(worksheet, createHeader(), true);

  for(let page = 0; page < totalPages; page++){
    const plainResults = await getPlainResultDatabase(pageSize, page*pageSize);
    addDataToWorksheet(worksheet, plainResults);

  }
  saveWorkbook(workbook);

})();
