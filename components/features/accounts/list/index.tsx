import React from 'react';
import { View, FlatList, ScrollView, Pressable, Alert } from 'react-native';
// Core WatermelonDB HOCs
import { useDatabase, withDatabase, withObservables } from '@nozbe/watermelondb/react';
import { Database, Query } from '@nozbe/watermelondb';
import Account from '@/lib/db/models/accounts.model';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

// --- Types ---

// Props the component that renders the UI expects
type ListProps = {
  accounts: Account[];
};

// Props injected by withDatabase HOC
type DatabaseProp = {
  database: Database;
};

// Props returned by withObservables HOC (reactive queries)
type ObservableProps = {
  accounts: Query<Account>;
};

// --- Base Component: The UI component that renders accounts ---
// This is the “pure” component that only cares about props, not database or observables.
const AccountList: React.FC<ListProps> = ({ accounts }) => {
  const database = useDatabase();
  const showAlert = (account: Account) =>
    Alert.alert(
      `Delete account ${account.name}?`,
      'Are you sure you want to delete this account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          onPress: () => Alert.alert('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            database.write(async () => {
              return await account.destroyPermanently();
            });
          },
          style: 'destructive',
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert('This alert was dismissed by tapping outside of the alert dialog.'),
      }
    );
  return (
    <ScrollView horizontal contentContainerClassName="pb-6 flex-col">
      <View className="flex-row gap-3 rounded bg-gray-800 p-4">
        <Text className="min-w-48 font-bold text-white">Name</Text>
        <Text className="min-w-48 font-bold text-white">Tap</Text>
        <Text className="min-w-48 font-bold text-white">Cap</Text>
      </View>
      <FlatList
        data={accounts}
        renderItem={({ item: account }) => {
          return (
            <Pressable onLongPress={() => showAlert(account)}>
              {({ pressed }) => {
                return (
                  <View className={cn('flex-row gap-3 p-4', pressed && 'bg-gray-100')}>
                    <Text className="min-w-48">{account.name}</Text>
                    <Text className="min-w-48">{account.tap}</Text>
                    <Text className="min-w-48">{account.cap}</Text>
                  </View>
                );
              }}
            </Pressable>
          );
        }}></FlatList>
    </ScrollView>
  );
};

// --- HOC Enhancement ---

// Step 1: withObservables
// Receives database (DatabaseProp) and maps it to reactive queries (ObservableProps)
// Passes live accounts query to AccountList
const withAccounts = withObservables<DatabaseProp, ObservableProps>(
  ['database'], // dependencies (props to watch for changes)
  ({ database }: DatabaseProp) => ({
    accounts: database.get<Account>('accounts').query(),
  })
)(AccountList);

// Step 2: withDatabase
// Injects the database instance into withAccounts
// Now EnhancedList has everything it needs and TypeScript knows all prop types
const EnhancedAccountList = withDatabase(withAccounts);

// --- Export ---
export default EnhancedAccountList;
