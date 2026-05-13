import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {Tabbar} from '../components/Tabbar';
import {useTheme} from '../hooks/useTheme';
import {Home} from '../screens/home/Home';
import {MatchDetails} from '../screens/matchDetails/MatchDetails';
import {Programme} from '../screens/programme/Programme';
import {Sports} from '../screens/sports/Sports';

export type RootTabParamList = {
  Sports: undefined;
  Live: undefined;
  Programme: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  MatchDetails: {matchId: string; sport: string};
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const renderTabbar = (props: BottomTabBarProps) => <Tabbar {...props} />;

const Tabs: React.FC = () => (
  <Tab.Navigator
    initialRouteName="Live"
    tabBar={renderTabbar}
    screenOptions={{headerShown: false}}>
    <Tab.Screen name="Sports" component={Sports} />
    <Tab.Screen name="Live" component={Home} />
    <Tab.Screen name="Programme" component={Programme} />
  </Tab.Navigator>
);

export const RootNavigator: React.FC = () => {
  const {isDark, colors} = useTheme();

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.bg,
      card: colors.nav,
      border: colors.border,
      primary: colors.primary,
      text: colors.textPrimary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen
          name="MatchDetails"
          component={MatchDetails}
          options={{headerShown: true, title: 'Match details'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
