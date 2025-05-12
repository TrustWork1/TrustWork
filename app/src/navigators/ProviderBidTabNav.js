import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AcceptedBids from '../screen/provider/AcceptedBids';
import CompletedBids from '../screen/provider/CompletedBids';
import PendingBids from '../screen/provider/PendingBids';
import {Colors, Fonts} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';

const Tab = createMaterialTopTabNavigator();

const CustomTabBar = ({state, descriptors, navigation}) => {
  const activeTabIndex = state.index;
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.themeGreen,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: normalize(10),
          borderRadius: 15,
          // height: normalize(60),
          marginBottom: normalize(15),
        }}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = index === activeTabIndex;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={{
                flex: 1,
                // height: normalize(30),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: normalize(18),
                // borderBottomWidth: isFocused ? 2 : 1,
                backgroundColor: isFocused ? Colors.themeYellow : '#FFFFFF1A',
                marginHorizontal: normalize(6),
                paddingVertical: normalize(10),
              }}>
              <Text
                style={{
                  fontSize: normalize(11),
                  fontFamily: Fonts.FustatSemiBold,
                  // textTransform: 'uppercase',
                  color: isFocused ? Colors.themeBlack : Colors.themeWhite,
                }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
};

const ProviderBidTabNav = props => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      // tabBarOptions={{
      //   indicatorStyle: {
      //     backgroundColor: Colors.themeGreen,
      //     height: '100%',
      //     borderRadius: 7,
      //   },
      // }}
      screenOptions={() => ({
        headerShown: false,
        labelStyle: {textTransform: 'uppercase'},
        tabBarStyle: {
          backgroundColor: 'red',
          width: '100%',
          justifyContent: 'center',
          alignSelf: 'center',
        },
        tabBarPressOpacity: 0.7,
      })}>
      <Tab.Screen
        name="Pending"
        children={() => <PendingBids />}
        options={{tabBarLabel: 'Pending'}}
      />
      <Tab.Screen
        name="Accepted"
        children={() => <AcceptedBids />}
        options={{tabBarLabel: 'Accepted'}}
      />
      <Tab.Screen
        name="Completed"
        children={() => <CompletedBids />}
        options={{tabBarLabel: 'Completed'}}
      />
    </Tab.Navigator>
  );
};

export default ProviderBidTabNav;
const styles = StyleSheet.create({
  searchMainContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  searchContainer: {
    width: '100%',
    height: normalize(45),
    backgroundColor: Colors.themeSearchBackground,
    borderColor: Colors.themeSearchBorder,
    borderWidth: 2,
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: normalize(18),
  },
  searchInputContainer: {
    width: '80%',
    fontSize: normalize(12),
    fontFamily: Fonts.FustatMedium,
    color: Colors.themeBlack,
    paddingHorizontal: normalize(10),
  },
});
