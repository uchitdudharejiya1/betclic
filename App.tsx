import React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {I18nextProvider} from 'react-i18next';

import i18n from './src/Translation';
import {useTheme} from './src/hooks/useTheme';
import {RootNavigator} from './src/navigation/RootNavigator';
import {AppProviders} from './src/providers/AppProviders';

const ThemedStatusBar: React.FC = () => {
  const {colors} = useTheme();
  return (
    <StatusBar
      barStyle="light-content"
      backgroundColor="transparent"
      translucent={true}
    />
  );
};

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <AppProviders>
            <ThemedStatusBar />
            <RootNavigator />
          </AppProviders>
        </I18nextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
