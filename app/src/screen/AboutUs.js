import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../components/Header';
import HTMLTextComponent from '../components/HTMLTextComponent';
import {cmsRequest} from '../redux/reducer/ProfileReducer';
import {Colors, Fonts, Icons} from '../themes/Themes';
import connectionrequest from '../utils/helpers/NetInfo';
import normalize from '../utils/helpers/normalize';
import showErrorAlert from '../utils/helpers/Toast';

let status = '';

const AboutUs = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const ProfileReducer = useSelector(state => state.ProfileReducer);

  const [cmsData, setCmsData] = useState('');

  useEffect(() => {
    if (isFocused) {
      getCmsData('terms-conditions');
    }
  }, [isFocused]);

  const getCmsData = () => {
    connectionrequest()
      .then(() => {
        dispatch(cmsRequest());
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  if (status == '' || ProfileReducer.status != status) {
    switch (ProfileReducer.status) {
      case 'Profile/cmsRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/cmsSuccess':
        status = ProfileReducer.status;
        setCmsData(ProfileReducer?.cmsResponse?.data[3]);
        break;
      case 'Profile/cmsFailure':
        status = ProfileReducer.status;
        // showErrorAlert(ProfileReducer?.error?.message);
        break;
    }
  }

  return (
    <View style={styles.mainContainer}>
      {/* <Loader visible={ProfileReducer.status == 'Profile/cmsRequest'} /> */}
      <Header backIcon={Icons.BackIcon} headerTitle={'About Us'} />
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={{paddingBottom: normalize(10)}}
          style={styles.container}>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: normalize(15),
              paddingTop: normalize(10),
              paddingBottom: normalize(10),
            }}>
            <Text style={styles.headerTxt}>{cmsData?.title}</Text>
            <View style={styles.txtConatiner}>
              <HTMLTextComponent htmlContent={cmsData?.content} />
            </View>
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    height: '100%',
    width: '100%',
  },
  headerTxt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(16),
    color: Colors.themeBlack,
    lineHeight: normalize(22),
    paddingBottom: normalize(10),
  },
});
