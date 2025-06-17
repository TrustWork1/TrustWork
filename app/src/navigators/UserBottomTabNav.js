import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image, Platform, StyleSheet, View} from 'react-native';
import Home from '../screen/user/Home';
import Message from '../screen/user/Message';
import PaymentTab from '../screen/user/PaymentTab';
import Project from '../screen/user/Project';
import ServiceProvider from '../screen/user/ServiceProvider';
import Images from '../themes/Images';
import {Colors} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';

const Tab = createBottomTabNavigator();

const UserBottomTabNav = () => {
  return (
    <Tab.Navigator
      initialRouteName="UserBottomTab"
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
        name="Home"
        component={Home}
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
        name="ServiceProvider"
        component={ServiceProvider}
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
                    focused ? Images.Profile_Clicked : Images.Profile_UnClicked
                  }
                  resizeMode="contain"
                />
              </View>
            );
          },
        }}
      />

      <Tab.Screen
        name="Project"
        component={Project}
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
        name="PaymentTab"
        component={PaymentTab}
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
                    focused ? Images.activePayment : Images.inactivePayment
                  }
                  resizeMode="contain"
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Message"
        component={Message}
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

export default UserBottomTabNav;

const styles = StyleSheet.create({
  tabBarIconConatiner: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    top: Platform.OS === 'ios' ? normalize(12) : null,
  },
});
