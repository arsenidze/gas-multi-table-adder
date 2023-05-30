import { GASClient } from 'gas-client';
const { serverFunctions } = new GASClient();

const isDev = false;

export const fetchTemplatesUsingApi = async () => {
  if (isDev) {
    const templates = await fetch('http://localhost:3000/data').then((res) => res.json());

    return { data: templates, error: undefined };
  }
  try {
    const result = await serverFunctions.getTemplatesFromProperties();
    
    return result;
  } catch (err) {
    console.error(err.message);

    return { data: undefined, error: err.message };
  }
};

export const updateTemplatesUsingApi = async (templates) => {
  if (isDev) {
    return fetch('http://localhost:3000/data', {
      method: 'POST',
      body: JSON.stringify(templates)
    });
  }
  try {
    const { error } = await serverFunctions.setTemplatesToScriptProperties(templates);
    if (error) {
      console.error(error);
      return;
    }
  } catch (err) {
    console.error(err.message);
    return;
  }
}

export const getSpreadsheetInfoUsingApi = async (inputValue) => {
  if (isDev) {
    return {
      data: {
        spreadsheetName: 'test',
        sheetName: 'test',
        spreadsheetId: '123',
        sheetId: '123',
        allowedColumnCharIndexes: ['A', 'B', 'C'],
      },
      error: undefined,
    };
  }
  try {
    const result = await serverFunctions.getSpreadsheetInfo(inputValue);
    
    return result;
  } catch (err) {
    console.error(err.message);

    return { data: undefined, error: err.message };
  }
}

export const useTemplateUsingApi = async (template, fieldValues) => {
  if (isDev) {
    return { data: true, error: undefined };
  }
  try {
    const result = await serverFunctions.useTemplate(template, fieldValues);
    
    return result;
  } catch (err) {
    console.error(err.message);

    return { data: undefined, error: err.message };
  }
}