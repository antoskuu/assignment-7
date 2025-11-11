import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/home.jsx';
import MapScreen from './screens/map.jsx';
import MemoryDetailScreen from './screens/detailofmemory.jsx';
import Create from './screens/create.jsx';
import Settings from './screens/settings.jsx';
import { MyLightTheme, MyDarkTheme } from './styles/themes.js';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

type AppThemeName = 'light' | 'dark';
type ThemeContextType = {
  themeName: AppThemeName;
  setThemeName: (t: AppThemeName) => void;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  themeName: 'light',
  setThemeName: () => {},
  toggleTheme: () => {},
});

const THEME_KEY = 'app.theme';

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MemoryDetail" component={MemoryDetailScreen} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
}

function MapStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [themeName, setThemeName] = useState<AppThemeName>('light');

  // Charger le thème sauvegardé
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark') setThemeName(saved);
      } catch {
        // ignore
      }
    })();
  }, []);

  // Sauvegarder à chaque changement
  useEffect(() => {
    AsyncStorage.setItem(THEME_KEY, themeName).catch(() => {});
  }, [themeName]);

  const toggleTheme = useCallback(
    () => setThemeName((t) => (t === 'light' ? 'dark' : 'light')),
    []
  );

  const ctx = useMemo(
    () => ({ themeName, setThemeName, toggleTheme }),
    [themeName, toggleTheme]
  );

  const navTheme = themeName === 'dark' ? MyDarkTheme : MyLightTheme;

  return (
    <ThemeContext.Provider value={ctx}>
      <SafeAreaView style={{ flex: 1, backgroundColor: navTheme.colors.background }}>
        <StatusBar barStyle={themeName === 'dark' ? 'light-content' : 'dark-content'} />
        <NavigationContainer theme={navTheme}>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: navTheme.colors.primary,
            }}
          >
            <Tab.Screen
              name="HomeTab"
              component={HomeStack}
              options={{
                tabBarIcon: ({ color, size, focused }) => (
                  <Image
                    source={require('./assets/app/home.png')}
                    style={{ width: size, height: size, tintColor: color, opacity: focused ? 1 : 0.6 }}
                    resizeMode="contain"
                  />
                ),
                tabBarLabel: 'Home',
              }}
            />
            <Tab.Screen
              name="MapPage"
              component={MapStack}
              options={{
                tabBarIcon: ({ color, size, focused }) => (
                  <Image
                    source={require('./assets/app/map.png')}
                    style={{ width: size, height: size, tintColor: color, opacity: focused ? 1 : 0.6 }}
                    resizeMode="contain"
                  />
                ),
                tabBarLabel: 'Map',
              }}
            />
            <Tab.Screen
              name="CreatePage"
              component={Create}
              options={{
                tabBarIcon: ({ color, size, focused }) => (
                  <Image
                    source={require('./assets/app/plus.png')}
                    style={{ width: size, height: size, tintColor: color, opacity: focused ? 1 : 0.6 }}
                    resizeMode="contain"
                  />
                ),
                tabBarLabel: 'Create',
              }}
            />
            <Tab.Screen
              name="SettingsPage"
              component={SettingsStack}
              options={{
                tabBarIcon: ({ color, size, focused }) => (
                  <Image
                    source={require('./assets/app/profile.png')}
                    style={{ width: size, height: size, tintColor: color, opacity: focused ? 1 : 0.6 }}
                    resizeMode="contain"
                  />
                ),
                tabBarLabel: 'Settings',
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </ThemeContext.Provider>
  );
}