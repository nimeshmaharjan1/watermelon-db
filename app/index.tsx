import { View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import Account from '@/lib/db/models/accounts.model';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getAllAccounts } from '@/lib/db/services/accounts.services';
import { useDatabase } from '@nozbe/watermelondb/react';
import AccountsList from '@/components/features/accounts/list';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
const IndexScreen = () => {
  const database = useDatabase();
  const accountsCollection = database.get<Account>('accounts');
  const onCreate = async () => {
    try {
      const newAccount = await database.write(async () => {
        return await accountsCollection.create((account) => {
          account.name = 'My Account';
          account.tap = 10.5;
          account.cap = 20;
        });
      });
      console.log(newAccount);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <SafeAreaView className="gap-6 p-4 pt-2">
      <Text variant={'h3'}>Accounts</Text>
      <AccountsList></AccountsList>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Text>Add Account</Text>
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-[365px]">
          <DialogHeader>
            <DialogTitle>Add Account</DialogTitle>
            <DialogDescription>Enter the account details below</DialogDescription>
          </DialogHeader>
          <View className="grid gap-4">
            <View className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" defaultValue="Pedro Duarte" />
            </View>
            <View className="grid gap-3">
              <Label htmlFor="username-1">Tap</Label>
              <Input id="username-1" defaultValue="@peduarte" />
            </View>
            <View className="grid gap-3">
              <Label htmlFor="username-1">Cap</Label>
              <Input id="username-1" defaultValue="@peduarte" />
            </View>
          </View>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">
                <Text>Cancel</Text>
              </Button>
            </DialogClose>
            <Button>
              <Text>Add</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SafeAreaView>
  );
};

export default IndexScreen;
