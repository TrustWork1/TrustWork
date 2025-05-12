import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import UserBottomTabNav from '../navigators/UserBottomTabNav';
import {storeRoletype} from '../redux/reducer/AuthReducer';
import AboutUs from '../screen/AboutUs';
import DocView from '../screen/DocView';
import AccountSetting from '../screen/AccountSetting';
import BufferSplash from '../screen/BufferSplash';
import ChangePass from '../screen/ChangePass';
import Demo from '../screen/Demo';
import GetActualLocation from '../screen/GetActualLocation';
import HelpSupport from '../screen/HelpSupport';
import Notification from '../screen/Notification';
import Payment from '../screen/Payment';
import Chat from '../screen/provider/Chat';
import ManageService from '../screen/provider/ManageService';
import PaymentHistory from '../screen/provider/PaymentHistory';
import PaymentMethods from '../screen/provider/PaymentMethods';
import ProfileProvider from '../screen/provider/ProfileProvider';
import ProjectDetailsProvider from '../screen/provider/ProjectDetailsProvider';
import ProviderProjectDetails from '../screen/provider/ProviderProjectDetails';
import ProviderUpdateProfile from '../screen/provider/ProviderUpdateProfile';
import SendBid from '../screen/provider/SendBid';
import Referal from '../screen/Referal';
import SignIn from '../screen/SignIn';
import SignUp from '../screen/SignUp';
import Splash from '../screen/Splash';
import SubscriptionPayment from '../screen/SubscriptionPayment';
import ClientChat from '../screen/user/ClientChat';
import CreateProject from '../screen/user/CreateProject';
import EditProfile from '../screen/user/EditProfile';
import EditProject from '../screen/user/EditProject';
import Profile from '../screen/user/Profile';
import ProjectDetails from '../screen/user/ProjectDetails';
import ServiceDetails from '../screen/user/ServiceDetails';
import ServiceProvidersDetails from '../screen/user/ServiceProvidersDetails';
import UserMembershipPlan from '../screen/user/UserMembershipPlan';
import UserUpdateProfile from '../screen/user/UserUpdateProfile';
import WithdrawMoney from '../screen/WithdrawMoney';
import constants from '../utils/helpers/constants';
import {navigationRef} from './NavigationService';
import ProviderBottomTabNav from './ProviderBottomTabNav';

const Stack = createNativeStackNavigator();

const StackNav = props => {
  const AuthReducer = useSelector(state => state.AuthReducer);
  const dispatch = useDispatch();
  async function getUserType() {
    return AsyncStorage.getItem(constants.roleType);
  }
  useEffect(() => {
    getUserType().then(a => {
      dispatch(storeRoletype(a));
    });
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {AuthReducer?.getTokenResponse == null ? (
          Object.entries({
            Splash,
            GetActualLocation,
            SignIn,
            SignUp,
          }).map(([name, component]) => {
            return (
              <Stack.Screen key={name} name={name} component={component} />
            );
          })
        ) : AuthReducer?.roleType === 'provider' ? (
          AuthReducer?.isPaymentVerified ? (
            Object.entries({
              ProviderBottomTabNav,
              ProfileProvider,
              Notification,
              ServiceProvidersDetails,
              ServiceDetails,
              CreateProject,
              ProjectDetails,
              ProjectDetailsProvider,
              DocView,
              ProviderProjectDetails,
              SendBid,
              AccountSetting,
              EditProfile,
              HelpSupport,
              Chat,
              WithdrawMoney,
              PaymentHistory,
              PaymentMethods,
              ManageService,
              ChangePass,
              AboutUs,
              Referal,
              Payment,
              Demo,
            }).map(([name, component]) => {
              return (
                <Stack.Screen key={name} name={name} component={component} />
              );
            })
          ) : AuthReducer?.isProfileVerified ? (
            Object.entries({
              UserMembershipPlan,
              SubscriptionPayment,
              ProviderBottomTabNav,
              ProfileProvider,
              Notification,
              ServiceProvidersDetails,
              ServiceDetails,
              CreateProject,
              ProjectDetails,
              ProjectDetailsProvider,
              ProviderProjectDetails,
              SendBid,
              AccountSetting,
              EditProfile,
              HelpSupport,
              Chat,
              WithdrawMoney,
              PaymentHistory,
              PaymentMethods,
              ManageService,
              ChangePass,
              AboutUs,
              Referal,
              DocView,
            }).map(([name, component]) => {
              return (
                <Stack.Screen key={name} name={name} component={component} />
              );
            })
          ) : (
            Object.entries({
              ProviderUpdateProfile,
              UserMembershipPlan,
              SubscriptionPayment,
              ProviderBottomTabNav,
              ProfileProvider,
              Notification,
              ServiceProvidersDetails,
              ServiceDetails,
              CreateProject,
              ProjectDetails,
              ProjectDetailsProvider,
              ProviderProjectDetails,
              SendBid,
              AccountSetting,
              EditProfile,
              HelpSupport,
              Chat,
              WithdrawMoney,
              PaymentHistory,
              PaymentMethods,
              ManageService,
              ChangePass,
              AboutUs,
              Referal,
              DocView,
            }).map(([name, component]) => {
              return (
                <Stack.Screen key={name} name={name} component={component} />
              );
            })
          )
        ) : AuthReducer?.roleType === 'client' ? (
          AuthReducer?.isPaymentVerified ? (
            Object.entries({
              UserBottomTabNav,
              Profile,
              Notification,
              ServiceProvidersDetails,
              ServiceDetails,
              CreateProject,
              EditProject,
              ProjectDetails,
              ProjectDetailsProvider,
              ProviderProjectDetails,
              SendBid,
              AccountSetting,
              EditProfile,
              HelpSupport,
              ClientChat,
              WithdrawMoney,
              PaymentHistory,
              PaymentMethods,
              ManageService,
              ChangePass,
              AboutUs,
              Referal,
              Payment,
              DocView,
            }).map(([name, component]) => {
              return (
                <Stack.Screen key={name} name={name} component={component} />
              );
            })
          ) : AuthReducer?.isProfileVerified ? (
            Object.entries({
              UserMembershipPlan,
              SubscriptionPayment,
              UserBottomTabNav,
              Profile,
              Notification,
              ServiceProvidersDetails,
              ServiceDetails,
              CreateProject,
              EditProject,
              ProjectDetails,
              DocView,
              ProjectDetailsProvider,
              ProviderProjectDetails,
              SendBid,
              AccountSetting,
              EditProfile,
              HelpSupport,
              ClientChat,
              WithdrawMoney,
              PaymentHistory,
              PaymentMethods,
              ManageService,
              ChangePass,
              AboutUs,
              Referal,
            }).map(([name, component]) => {
              return (
                <Stack.Screen key={name} name={name} component={component} />
              );
            })
          ) : (
            Object.entries({
              UserUpdateProfile,
              UserMembershipPlan,
              SubscriptionPayment,
              UserBottomTabNav,
              Profile,
              Notification,
              ServiceProvidersDetails,
              ServiceDetails,
              CreateProject,
              EditProject,
              ProjectDetails,
              DocView,
              ProjectDetailsProvider,
              ProviderProjectDetails,
              SendBid,
              AccountSetting,
              EditProfile,
              HelpSupport,
              ClientChat,
              WithdrawMoney,
              PaymentHistory,
              PaymentMethods,
              ManageService,
              ChangePass,
              AboutUs,
              Referal,
            }).map(([name, component]) => {
              return (
                <Stack.Screen key={name} name={name} component={component} />
              );
            })
          )
        ) : (
          <Stack.Screen name={'BufferSplash'} component={BufferSplash} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNav;
