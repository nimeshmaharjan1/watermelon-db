import { appSchema, tableSchema } from '@nozbe/watermelondb';
import { accountsSchema } from './accounts.schema';
export default appSchema({
  version: 1,
  tables: [accountsSchema],
});
