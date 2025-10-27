import { Alert, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import Account from '@/lib/db/models/accounts.model';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
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
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createAccountValidator,
  createAccountValidatorType,
} from '@/features/accounts/validators/create.validator';
import { cn } from '@/lib/utils';
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';
const IndexScreen = () => {
  const form = useForm({
    resolver: zodResolver(createAccountValidator),
    defaultValues: {
      name: '',
      cap: undefined,
      tap: undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: createAccountValidatorType) => {
      await database.write(async () => {
        return await accountsCollection.create((account) => {
          account.name = payload.name;
          account.tap = payload.tap;
          account.cap = payload.cap;
        });
      });
    },
    onSuccess: () => {
      Alert.alert('Account has been created.');
      form.reset();
    },
    onError: () => {
      Alert.alert('There was an error while creating the account');
    },
  });
  const database = useDatabase();
  const accountsCollection = database.get<Account>('accounts');

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
          {/* <KeyboardAwareScrollView className="gap-6" contentContainerClassName="gap-6"> */}
          <DialogHeader>
            <DialogTitle>Add Account</DialogTitle>
            <DialogDescription>Enter the account details below</DialogDescription>
          </DialogHeader>
          <View className="grid gap-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <View className="grid gap-3">
                    <Label htmlFor="name-1">Name</Label>
                    <Input returnKeyType="next" value={field.value} onChangeText={field.onChange} />
                  </View>
                );
              }}></Controller>
            <Controller
              name="tap"
              control={form.control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <View className="grid gap-3">
                    <Label htmlFor="tap">Tap</Label>
                    <Input
                      returnKeyType="next"
                      onChangeText={field.onChange}
                      keyboardType="numeric"
                      value={field.value ? field.value.toString() : ''}
                    />
                  </View>
                );
              }}></Controller>
            <Controller
              name="cap"
              control={form.control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <View className="grid gap-3">
                    <Label className={cn(error && 'text-destructive')} htmlFor="cap">
                      Cap
                    </Label>
                    <Input
                      returnKeyType="done"
                      onChangeText={field.onChange}
                      className={cn(error && 'border border-red-500')}
                      keyboardType="numeric"
                      value={field.value ? field.value.toString() : ''}
                    />
                    <Text className="text-sm text-destructive">{error?.message}</Text>
                  </View>
                );
              }}></Controller>
          </View>
          <DialogFooter>
            <DialogClose asChild>
              <Button onPress={() => form.reset()} variant="outline">
                <Text>Cancel</Text>
              </Button>
            </DialogClose>
            <Button onPress={form.handleSubmit((values) => createMutation.mutate(values))}>
              <Text>Add</Text>
            </Button>
          </DialogFooter>
          {/* </KeyboardAwareScrollView> */}
        </DialogContent>
      </Dialog>
    </SafeAreaView>
  );
};

export default IndexScreen;
