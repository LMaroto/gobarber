import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// components
import SignIn from '~/pages/SignIn';
import Dashboard from '~/pages/Dashboard';
import SignUp from '~/pages/SignUp';

const Stack = createStackNavigator();

const isSigned = false;

const Routes = () => {
  return (
    <NavigationContainer>
      {isSigned ? (
        <Stack.Navigator>
          <Stack.Screen name="Dashboard" component={Dashboard} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Routes;
