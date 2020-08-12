import { ElementHandle } from 'puppeteer';

export enum ColumnIndex {
  LEAGUE,
  KICKOFF_TIME,
  HOME,
  RESULT,
  AWAY,
  HALF,
  INITIAL_H_G_C,
  EVENTS
}

export interface RowValues {
  league: string;
  kickOffTime: string;
  homeTeam: string;
  result: string;
  awayTeam: string;
  halfResult: string;
  initialHGC: string;
  events: Event[];
}

const genericParse = async (handle: ElementHandle): Promise<string> => {
  return await handle.evaluate((element: any) => Promise.resolve(element.textContent.trim()));
}

const parseTeam = async (handle: ElementHandle): Promise<string> => {
  return await handle.$eval('a', (anchor: any) => Promise.resolve(anchor.textContent.trim()));
}

//TODO eventsinterface

export interface Event {
  type: string;
  time: number;
  description: string;
}

const parseEvents = async (handle: ElementHandle | null): Promise<Event[]> => {
  try {
    const raceTimeLine: ElementHandle | null | undefined = await handle?.$('#race_timeLine');

    if(!raceTimeLine) return [];
    return await Promise.all((await raceTimeLine?.$$('span[aria-haspopup="true"]')).map(async (span: ElementHandle): Promise<Event> => {

      const eventInfo: Event = await span.evaluate((spanElement: any) => {

        const getTime = (titleString: string): number => {
          return Number(eval(titleString.split("'")[0]));
        }

        const getDescription = (titleString: string): string => {
          return titleString.split("'")[1];
        }

        return Promise.resolve({ type: spanElement.className.toString(), time: getTime(spanElement.title), description: getDescription(spanElement.title)})

      });

      return eventInfo;
    }));
  }
  catch(err){
    throw Error(err);
  }
}

const readRow = async (tableRow: ElementHandle): Promise<RowValues> => {
  const columns: ElementHandle[] = await tableRow.$$('td');

  const league = await genericParse(columns[ColumnIndex.LEAGUE]);
  const kickOffTime = await genericParse(columns[ColumnIndex.KICKOFF_TIME]);
  const homeTeam = await parseTeam(columns[ColumnIndex.HOME]);
  const result = await genericParse(columns[ColumnIndex.RESULT]);
  const awayTeam = await parseTeam(columns[ColumnIndex.AWAY]);
  const halfResult = await genericParse(columns[ColumnIndex.HALF]);
  const initialHGC = await genericParse(columns[ColumnIndex.INITIAL_H_G_C]);
  const events = await parseEvents(columns[ColumnIndex.EVENTS]);

  return {
    league,
    kickOffTime,
    homeTeam,
    result,
    awayTeam,
    halfResult,
    initialHGC,
    events
  }
}

const parseTableValue = async (tableBody: ElementHandle): Promise<RowValues[]> => {
  const rows: ElementHandle[] = await tableBody.$$('tr');

  return await Promise.all(await rows.map(async (row: ElementHandle) => await readRow(row)));
}

export default parseTableValue;
