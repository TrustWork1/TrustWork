import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image, Platform, StyleSheet, View} from 'react-native';
import ExploreProject from '../screen/provider/ExploreProject';
import ProviderBids from '../screen/provider/ProviderBids';
import ProviderHome from '../screen/provider/ProviderHome';
import ProviderMessage from '../screen/provider/ProviderMessage';
import ProviderProjects from '../screen/provider/ProviderProjects';
import Images from '../themes/Images';
import {Colors} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';

const Tab = createBottomTabNavigator();

const ProviderBottomTabNav = () => {
  return (
    <Tab.Navigator
      initialRouteName="ProviderBottomTab"
      screenOptions={{
        // unmountOnBlur: true,
        keyboardHidesTabBar: true,
        tabBarHideOnKeyboard: true,
        showIcon: true,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          borderTopWidth: 0,
          borderTopColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.themeWhite,
          borderRadius: normalize(65 / 2),
          height: normalize(65),
          shadowColor: Colors.themeGray,
          shadowOffset: {
            width: 2,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 15,
          elevation: 5,
        },
      }}>
      <Tab.Screen
        name="ProviderHome"
        component={ProviderHome}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({focused}) => {
            return (
              <View style={styles.tabBarIconConatiner}>
                <Image
                  style={{
                    height: focused ? normalize(45) : normalize(24),
                    width: focused ? normalize(45) : normalize(24),
                  }}
                  source={focused ? Images.Home_Clicked : Images.Home_UnClicked}
                  resizeMode="contain"
                />
              </View>
            );
          },
        }}
      />

      <Tab.Screen
        name="ExploreProject"
        component={ExploreProject}
        listeners={({navigation}) => ({
          blur: () => navigation.setParams({screen: undefined}),
        })}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({focused}) => {
            return (
              <View style={styles.tabBarIconConatiner}>
                <Image
                  style={{
                    height: focused ? normalize(45) : normalize(20),
                    width: focused ? normalize(45) : normalize(20),
                  }}
                  source={
                    focused
                      ? Images.ProjectList_Clicked
                      : Images.ProjectList_Unclicked
                  }
                  resizeMode="contain"
                />
              </View>
            );
          },
        }}
      />

      <Tab.Screen
        name="ProviderProjects"
        component={ProviderProjects}
        listeners={({navigation}) => ({
          blur: () => navigation.setParams({screen: undefined}),
        })}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({focused}) => {
            return (
              <View style={styles.tabBarIconConatiner}>
                <Image
                  style={{
                    height: focused ? normalize(45) : normalize(20),
                    width: focused ? normalize(45) : normalize(20),
                  }}
                  source={
                    focused ? Images.Project_Clicked : Images.Project_UnClicked
                  }
                  resizeMode="contain"
                />
              </View>
            );
          },
        }}
      />

      <Tab.Screen
        name="ProviderBids"
        component={ProviderBids}
        listeners={({navigation}) => ({
          blur: () => navigation.setParams({screen: undefined}),
        })}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({focused}) => {
            return (
              <View style={styles.tabBarIconConatiner}>
                <Image
                  style={{
                    height: focused ? normalize(45) : normalize(20),
                    width: focused ? normalize(45) : normalize(20),
                  }}
                  source={focused ? Images.Bids_Clicked : Images.Bids_Unclicked}
                  resizeMode="contain"
                />
              </View>
            );
          },
        }}
      />

      <Tab.Screen
        name="ProviderMessage"
        component={ProviderMessage}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({focused}) => {
            return (
              <View style={styles.tabBarIconConatiner}>
                <Image
                  style={{
                    height: focused ? normalize(45) : normalize(20),
                    width: focused ? normalize(45) : normalize(20),
                  }}
                  source={
                    focused ? Images.Message_Clicked : Images.Message_UnClicked
                  }
                  resizeMode="contain"
                />
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default ProviderBottomTabNav;

const styles = StyleSheet.create({
  tabBarIconConatiner: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    top: Platform.OS === 'ios' ? normalize(12) : null,
  },
});
