import { tableSchema, TableSchema } from '@nozbe/watermelondb';
import { database } from '..';
import Account from '../models/accounts.model';

export const accountsSchema = tableSchema({
  name: 'accounts',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'tap', type: 'number' },
    { name: 'cap', type: 'number' },
  ],
});
