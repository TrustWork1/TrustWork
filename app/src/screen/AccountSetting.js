import {useIsFocused} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../components/Header';
import ProfileDataCard from '../components/Micro/ProfileDataCard';
import NavigationService from '../navigators/NavigationService';
import {ProfileRequest} from '../redux/reducer/AuthReducer';
import {notificationStatusChangeRequest} from '../redux/reducer/ProfileReducer';
import {Colors, Icons} from '../themes/Themes';
import css from '../themes/css';
let status = '';

const AccountSetting = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const ProfileReducer = useSelector(state => state.ProfileReducer);
  const AuthReducer = useSelector(state => state.AuthReducer);

  const onChangeStatus = data => {
    let obj = {
      status: data,
      sender: AuthReducer?.ProfileResponse?.data?.id,
    };
    console.log(obj);
    dispatch(notificationStatusChangeRequest(obj));
  };

  useEffect(() => {
    dispatch(ProfileRequest());
  }, [
    isFocused,
    ProfileReducer.status == 'Profile/notificationStatusChangeSuccess',
  ]);

  // if (status == '' || ProfileReducer.status != status) {
  //   switch (ProfileReducer.status) {
  //     case 'Profile/notificationStatusChangeRequest':
  //       status = ProfileReducer.status;
  //       break;
  //     case 'Profile/notificationStatusChangeSuccess':
  //       status = ProfileReducer.status;

  //       break;
  //     case 'Profile/notificationStatusChangeFailure':
  //       status = ProfileReducer.status;
  //       break;
  //   }
  // }

  return (
    <View style={styles.mainContainer}>
      <Header backIcon={Icons.BackIcon} headerTitle={'Account Settings'} />
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={{paddingBottom: normalize(10)}}
          style={styles.container}>
          <View style={[css.px3]}>
            <ProfileDataCard
              disabled={true}
              logo={Icons.about}
              title={'Notification'}
              hasSwitch={true}
              onChangeStatus={onChangeStatus}
            />
            <ProfileDataCard
              logo={Icons.settings}
              title={'Change Password'}
              onPress={() => {
                NavigationService?.navigate('ChangePass');
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default AccountSetting;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    height: '100%',
    width: '100%',
  },
});
