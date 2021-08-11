import React from 'react';
import { View, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Bars from './AppBars';
import Scanner from './AppScan';
import Editor from './Components/Editor';

const Tab = createBottomTabNavigator();

const ScanStack = createStackNavigator();
const BarsStack = createStackNavigator();

function ScanStackScreen() {
  return (
    <ScanStack.Navigator>
      <ScanStack.Screen name="Scanner" component={Scanner} />
      <ScanStack.Screen name="Editor" component={Editor} />
    </ScanStack.Navigator>
  );
}

function BarsStackScreen() {
  return (
    <BarsStack.Navigator>
      <BarsStack.Screen 
        name="Home" 
        component={Bars} 
        initialParams={{}}
      />
    </BarsStack.Navigator>
  );
}


function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Bar") {
              iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';            
            } else if (route.name === "Scan") {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            }
            return <Ionicons name={iconName} size={size+10} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Bar" component={BarsStackScreen}/>
        <Tab.Screen name="Scan" component={ScanStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;