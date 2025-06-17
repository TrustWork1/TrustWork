import {StackActions} from '@react-navigation/native';
import React from 'react';

export const navigationRef = React.createRef();

// function setTopLevelNavigator(navigatorRef) {
//   _navigator = navigatorRef;
// }

function navigate(routeName, params) {
  navigationRef.current && navigationRef.current.navigate(routeName, params);
}

function replace(routeName, params) {
  navigationRef.current &&
    navigationRef.current.dispatch(StackActions.replace(routeName, params));
}

function goBack(routeName, params) {
  navigationRef.current && navigationRef.current.goBack();
}

// add other navigation functions that you need and export them

export default {
  navigate,
  replace,
  goBack,
};
