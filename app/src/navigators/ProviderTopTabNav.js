import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import MyOffer from '../screen/provider/MyOffer';
import ProviderActiveProject from '../screen/provider/ProviderActiveProject';
import ProviderCompleteProject from '../screen/provider/ProviderCompleteProject';
import {Colors, Fonts} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';

const Tab = createMaterialTopTabNavigator();

const CustomTabBar = ({state, descriptors, navigation}) => {
  const activeTabIndex = state.index;

  return (
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
        marginTop: normalize(10),
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
              borderRadius: 6,
              // borderBottomWidth: isFocused ? 2 : 1,
              backgroundColor: isFocused
                ? Colors.themeWhite
                : Colors.themeSearchBackground,
              marginHorizontal: normalize(5),
              paddingVertical: normalize(6),
            }}>
            <Text
              style={{
                fontSize: normalize(11),
                fontFamily: Fonts.FustatSemiBold,
                textTransform: 'uppercase',
                color: isFocused ? Colors.themeBlack : Colors.themeBlack,
              }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const ProviderTopTabNav = props => {
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
        name="ProviderActive"
        children={() => <ProviderActiveProject />}
        options={{tabBarLabel: 'Active'}}
      />
      <Tab.Screen
        name="ProviderCompleted"
        children={() => <ProviderCompleteProject />}
        options={{tabBarLabel: 'Completed'}}
      />
      <Tab.Screen
        name="ProviderMyOffer"
        children={() => <MyOffer />}
        options={{tabBarLabel: 'My Offer'}}
      />
    </Tab.Navigator>
  );
};

export default ProviderTopTabNav;
