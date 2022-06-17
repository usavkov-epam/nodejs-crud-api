import { ServerResponse } from "http";

import { ERRORS, USER_REQUIRED_FIELDS } from "../constants";

import {
  ResponceData,
  ResponseManager,
} from "../types";

export const sendResponse = ({
  res,
  statusCode,
  data,
}: ResponseManager): void => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};
export const send = (res: ServerResponse, data: ResponceData) => sendResponse({ res, statusCode: 200, data });
export const sendClientError = (res: ServerResponse, data: ResponceData) => sendResponse({ res, statusCode: 400, data });
export const sendServerError = (res: ServerResponse, data: ResponceData) => sendResponse({ res, statusCode: 500, data });

export const validateFieldsRequired = (fields: { [key: string]: any }) => {
  const missedRequiredFields = Object.keys(USER_REQUIRED_FIELDS).filter(field => !fields[field]);

  return missedRequiredFields.length
    ? { message: `${ERRORS.missRequiredFields}: ${missedRequiredFields.join(', ')}` }
    : null;
};

export const validateFieldsTypes = (fields: { [key: string]: any }) => {
  const rules = {
    [USER_REQUIRED_FIELDS.username]: typeof fields[USER_REQUIRED_FIELDS.username] === 'string',
    [USER_REQUIRED_FIELDS.age]: typeof fields[USER_REQUIRED_FIELDS.age] === 'number',
    [USER_REQUIRED_FIELDS.hobbies]: Array.isArray(fields[USER_REQUIRED_FIELDS.hobbies]) && fields[USER_REQUIRED_FIELDS.hobbies].every((hobby: unknown) => typeof hobby === 'string'),
  };

  const invalidFields = Object.entries(rules).filter(([, isValid]) => isValid === false);

  return invalidFields.length
    ? { message: `${ERRORS.invalidFieldType}: ${invalidFields.map(([field]) => field).join(', ')}` }
    : null;
}

const validatorsMap: { [key: string]: any } = {
  requiredFields: validateFieldsRequired,
  types: validateFieldsTypes,
}

export const validate = (rules: string[]) => (fields: { [key: string]: any }) => {
  return rules.map((rule) => (typeof validatorsMap[rule] === 'function') && validatorsMap[rule](fields)).filter(Boolean);
}
