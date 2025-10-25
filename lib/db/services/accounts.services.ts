import { database } from '..';

export const getAllAccounts = async () => {
  const response = await database.get('accounts').query();
  return response;
};
