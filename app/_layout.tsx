import QueryProvider from '@/components/providers/query-provider';
import ThemeToggle from '@/components/ui/theme-toggle';
import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { database } from '@/lib/db';
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <DatabaseProvider database={database}>
        <QueryProvider>
          <RootNavigator />
        </QueryProvider>
      </DatabaseProvider>
      <PortalHost />
    </ThemeProvider>
  );
}

const RootNavigator = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="index"></Stack.Screen>
    </Stack>
  );
};
