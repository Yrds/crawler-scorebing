import { RowValues, ColumnIndex, Event } from '../Crawler/Actions/parseTableValue';
import exceljs from 'exceljs';

const mountResultsData = (rowValue: RowValues) =>{
  const eventsToArray = (event: Event[]) => {
    const eventsArray: string[] = [];


    event.forEach((event: Event) => {
      eventsArray[event.time] = event.description;
    })

    return eventsArray;
  }

  return Object.values(rowValue).reduce((acc: any, value: any, index: ColumnIndex) => {
    if(index === ColumnIndex.EVENTS){
      acc.push(...eventsToArray(value as Event[]));
    } else {
      acc.push(value);
    }

    return acc;
  }, [])
}

export const createHeader = (): string[] => {
  const header: string[] = [
    'Liga',
    'KickOff',
    'Casa',
    'Resultado',
    'Visitante',
    'Meio jogo',
    'Saldo de gols',
    ...Array.from({length: 130}, (x, i) => i.toString() + "'")
  ];

  return header;
}

export const buildWorkbookBuffer = (path: string): any => {
  const workbook = new exceljs.stream.xlsx.WorkbookWriter({
    filename: path
  });

  return workbook;
}

export const createWorksheet = (workbook: any) => {
  return workbook.addWorksheet('resultados');
}

export const addDataToWorksheet = (worksheet: any, values: any[], raw: boolean = false) => {
  if(raw){
    worksheet.addRow(values).commit();
  }
  else{
    const resultsData = values.map(rowValue => mountResultsData(rowValue));
    for(const results of resultsData){
      worksheet.addRow(results).commit();
    }
  }
}

export const saveWorkbook = (workbook: any) => {
  workbook.commit().then( () => {
    console.log('xlsx file created');
  })

}
