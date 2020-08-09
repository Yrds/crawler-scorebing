import { ElementHandle } from 'puppeteer';

enum ColumnIndex {
  LEAGUE,
  KICKOFF_TIME,
  HOME_VS_AWAY,
  HALF,
  INITIAL_H_G_C,
  EVENTS
}

const readRow = async (tableRow: ElementHandle): Promise<void> => {
  const columns: ElementHandle[] = await tableRow.$$('td');

  await columns[ColumnIndex.LEAGUE].evaluate(column  => console.log('column', column.innerHTML));
}

const parseTableValue = async (tableBody: ElementHandle): Promise<void> => {
  const rows: ElementHandle[] = await tableBody.$$('tr');


  await readRow(rows[0]);
}

export default parseTableValue;
