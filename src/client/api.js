import { GASClient } from 'gas-client';
const { serverFunctions } = new GASClient();

const isDev = false;

export const fetchTemplatesUsingApi = async () => {
  if (isDev) {
    const templates = await fetch('http://localhost:3000/data').then((res) => res.json());

    return { data: templates, error: undefined };
  }
  return serverFunctions.getTemplatesFromProperties();
};

export const updateTemplatesUsingApi = async (templates) => {
  if (isDev) {
    return fetch('http://localhost:3000/data', {
      method: 'POST',
      body: JSON.stringify(templates)
    });
  }
  const { error } = await serverFunctions.setTemplatesToScriptProperties(templates);
  if (error) {
    console.error(error);
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
  return serverFunctions.getSpreadsheetInfo(inputValue);
}

export const useTemplateUsingApi = async (template, fieldValues) => {
  if (isDev) {
    return { data: true, error: undefined };
  }
  return serverFunctions.useTemplate(template, fieldValues);
}