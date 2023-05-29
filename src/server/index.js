const config = {
  CUSTOM_MENU_NAME: 'Помічник 🐱',
  MULTI_TABLE_ADDER_MENU_ITEM_NAME: 'Додати дані в декілька таблиць',
  MULTI_TABLE_ADDER_MODAL_WIDTH: 780,
  MULTI_TABLE_ADDER_MODAL_HEIGHT: 440,
  MULTI_TABLE_ADDER_HTML_PAGE_NAME: 'index',
  MULTI_TABLE_ADDER_TEMPLATES_KEY: 'MULTI_TABLE_ADDER_TEMPLATES_KEY'
};

function onOpen() {
  SpreadsheetApp.getUi().createMenu(config.CUSTOM_MENU_NAME)
    .addItem(config.MULTI_TABLE_ADDER_MENU_ITEM_NAME, 'openMultiTableAdder')
    .addToUi();
}

function openMultiTableAdder() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile(config.MULTI_TABLE_ADDER_HTML_PAGE_NAME)
    .setWidth(config.MULTI_TABLE_ADDER_MODAL_WIDTH)
    .setHeight(config.MULTI_TABLE_ADDER_MODAL_HEIGHT);
  SpreadsheetApp.getUi()
    .showModalDialog(htmlOutput, config.MULTI_TABLE_ADDER_MENU_ITEM_NAME);
}

function getTemplatesFromProperties() {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    const templates = JSON.parse(scriptProperties.getProperty(config.MULTI_TABLE_ADDER_TEMPLATES_KEY) || '[]');
  
    return { data: templates, error: undefined };
  } catch (err) {
    Logger.log(`Error in getTemplatesFromProperties: ${err.message}`)
    return { data: undefined, error: err };
  }
}

function setTemplatesToScriptProperties(templates = []) {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty(config.MULTI_TABLE_ADDER_TEMPLATES_KEY, JSON.stringify(templates));
  
    return { data: true, error: undefined };
  } catch (err) {
    Logger.log(`Error in setTemplatesToScriptProperties: ${err.message}`)
    return { data: undefined, error: err };
  }
}

function convertNumToCharIndex(num) {
  return String.fromCharCode((num % 26 + 'A'.charCodeAt(0)));
}

function getSheetById(ss, sheetId) {
  const sheets = ss.getSheets();
  const sheet = sheets.find((s) => s.getSheetId() === sheetId);
  if (!sheet) {
    return { data: undefined, error: 'Sheet в таблиці за таким URL не знайдено' };
  }
  return { data: sheet, error: undefined };
}

function getSpreadsheetInfo(url) {
  const regex = /\/d\/([a-zA-Z0-9-_]+)\/.*gid=([0-9]+)/;
  const match = regex.exec(url);
  if (match && match[1] && match[2]) {
    const spreadsheetId = match[1];
    const sheetId = parseInt(match[2]);
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      if (!spreadsheet) {
        return { data: undefined, error: 'Spreadsheet за таким URL не знайдено' };
      }
    } catch (err) {
      Logger.log(err.message);
      return { data: undefined, error: 'Spreadsheet за таким URL не знайдено' };
    }
    
    const { data: sheet, error } = getSheetById(spreadsheet, sheetId);
    if (error) {
      return { data: undefined, error };
    }

    const numOfCols = sheet.getLastColumn();
    const allowedColumnCharIndexes = new Array(numOfCols)
      .fill(0).map((_, idx) => convertNumToCharIndex(idx));

    return {
      data: {
        spreadsheetName: spreadsheet.getName(),
        sheetName: sheet.getName(),
        spreadsheetId,
        sheetId,
        allowedColumnCharIndexes
      },
      error: undefined,
    }
  } else {
    return { data: undefined, error: 'Невірний формат URL. Формат: https://docs.google.com/spreadsheets/d/.../edit#gid=...' };
  }
}

function createLinkToRow(rowIndex, ssUrl) {
  return `${ssUrl}&range=${rowIndex}:${rowIndex}`;
}

function useTemplate(template, fieldValues) {
  try {
    const insertedRowLinks = [];
    for (let index = 0; index < template.spreadSheets.length; index++) {
      const spreadSheetInfo = template.spreadSheets[index];
      const mapping = template.mapping[index];
      const charIndexToValueDict = mapping.reduce((acc, curr, idx) => {
        acc[curr] = fieldValues[idx];
  
        return acc;
      }, {});
      const ss = SpreadsheetApp.openByUrl(spreadSheetInfo.url);
      const { data: sheet, error } = getSheetById(ss, spreadSheetInfo.sheetId);
      if (error) {
        return { data: undefined, error };
      }
      const numOfCols = sheet.getLastColumn();
  
      const newValues = new Array(numOfCols)
        .fill(0).map((_, idx) => convertNumToCharIndex(idx)) // A, B, C, ...
        .map((charIdx) => charIndexToValueDict[charIdx] || '')
  
      Logger.log(newValues);

      sheet.appendRow(newValues);
      insertedRowLinks.push(createLinkToRow(sheet.getLastRow(), spreadSheetInfo.url))
    }
  
    return { data: insertedRowLinks, error: undefined };
  } catch (err) {
    Logger.log(err.message);
    return { data: undefined, error: err.message };
  }
}
// export {
//   onOpen,
//   openMappingsSidebar,
// };
