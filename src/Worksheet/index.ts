import { RowValues, ColumnIndex, Event } from '../Crawler/Actions/parseTableValue';
import xlsx from 'node-xlsx';

export const buildWorksheetBuffer = (values: RowValues[]) => {
  const eventsToArray = (event: Event[]) => {
    const eventsArray: string[] = [];

    event.forEach((event: Event) => {
      eventsArray[event.time] = event.type;
    })

    return eventsArray;
  }

  const parseValues = (rowValue: RowValues) => {
    return Object.values(rowValue).reduce((acc: any, value: any, index: ColumnIndex) => {
      if(index === ColumnIndex.EVENTS){
        acc.push(...eventsToArray(value as Event[]));
      } else {
        acc.push(value);
      }

      return acc;
    }, [])
  }

  const resultsData = values.map(rowValue => parseValues(rowValue));

  const longerResults = resultsData.reduce((acc: number, value: any[]) => {
    if(value.length > acc) acc = value.length
    return acc;
  }, 0);

  const header: string[] = [
    'Liga',
    'KickOff',
    'Casa',
    'Resultado',
    'Visitante',
    'Meio jogo',
    'Saldo de gols',
    ...Array.from({length: longerResults}, (x, i) => i.toString() + "'")
  ];

  return xlsx.build([{
    name: 'scorebing_results',
    data: [header, ...resultsData]
  }]);
}

