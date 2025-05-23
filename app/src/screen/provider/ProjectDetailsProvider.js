import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../components/Header';
import WithTitle from '../../components/Micro/WithTitle';
import NextBtn from '../../components/NextBtn';
import NavigationService from '../../navigators/NavigationService';
import {projectDetailsByLocationRequest} from '../../redux/reducer/ProjectReducer';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import constants from '../../utils/helpers/constants';
import connectionrequest from '../../utils/helpers/NetInfo';
import normalize from '../../utils/helpers/normalize';
import showErrorAlert from '../../utils/helpers/Toast';
import css from '../../themes/css';

let status = '';

const ProjectDetailsProvider = props => {
  const {item} = props.route.params;

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const ProjectReducer = useSelector(state => state.ProjectReducer);

  const [providerDetails, setProviderDetails] = useState({});

  useEffect(() => {
    if (isFocused) {
      getAddress();
    }
  }, [isFocused]);

  const getAddress = () => {
    AsyncStorage.getItem(constants.TRUSTWORKTKNADDRESS)
      .then(res => {
        getServiceProviderList(
          JSON.parse(res)?.latitude,
          JSON.parse(res)?.longitude,
        );
        // setAddress(JSON.parse(res)?.address);
        // setLat(JSON.parse(res)?.latitude);
        // setLong(JSON.parse(res)?.longitude);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getServiceProviderList = (lat, long) => {
    let obj = {
      id:
        props?.route?.params?.id == undefined
          ? item?.id
          : props?.route?.params?.id,
      lat: lat,
      long: long,
      radius: 10,
      // page: page,
      // total: 10,
    };

    connectionrequest()
      .then(() => {
        dispatch(projectDetailsByLocationRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  if (status == '' || ProjectReducer.status != status) {
    switch (ProjectReducer.status) {
      case 'Project/projectDetailsByLocationRequest':
        status = ProjectReducer.status;
        break;
      case 'Project/projectDetailsByLocationSuccess':
        status = ProjectReducer.status;
        setProviderDetails(
          ProjectReducer?.projectDetailsByLocationResponse?.data,
        );
        break;
      case 'Project/projectDetailsByLocationFailure':
        status = ProjectReducer.status;
        break;
    }
  }

  const isValidCoordinate = coord => typeof coord === 'number' && !isNaN(coord);

  return (
    <View style={styles.mainContainer}>
      {/* <Loader
        visible={
          ProjectReducer?.status == 'Auth/projectDetailsByLocationRequest'
        }
      /> */}
      <Header backIcon={Icons.BackIcon} headerTitle={'Project Details'} />
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={{paddingBottom: normalize(70)}}
          style={styles.container}>
          <View style={{paddingHorizontal: normalize(10)}}>
            <View>
              <View style={{flexDirection: 'row', marginTop: normalize(15)}}>
                <Image
                  source={
                    providerDetails?.client_profile_pic
                      ? {
                          uri: `${constants.IMAGE_URL}${providerDetails?.client_profile_pic}`,
                        }
                      : Icons.UserPro
                  }
                  style={styles.recentImg}
                  resizeMode="stretch"
                />
                <View style={{paddingHorizontal: normalize(15)}}>
                  <Text style={styles.featuredNameTxt}>
                    {providerDetails?.project_title}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingVertical: normalize(3),
                    }}>
                    {providerDetails?.project_category && (
                      <View style={styles.commonConatiner}>
                        <Image
                          source={Icons.WorkType}
                          style={styles.smallIcon}
                          resizeMode="contain"
                        />
                        <Text style={styles.featuredSubTxt}>
                          {providerDetails?.project_category?.title}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              <Text style={styles.descTxt}>
                {providerDetails?.project_description}
              </Text>
              <View style={styles.commonMainConatiner}>
                <View style={styles.commonWhiteConatiner}>
                  <WithTitle
                    darkTxt={'Project Budget'}
                    lightTxt={`$${providerDetails?.project_budget || 0}`}
                  />
                </View>
                <View style={styles.commonWhiteConatiner}>
                  <WithTitle
                    darkTxt={'Project Timeline'}
                    lightTxt={`${providerDetails?.project_timeline} ${providerDetails?.project_hrs_week}`}
                  />
                </View>
              </View>
            </View>

            <View>
              <Text style={styles.loactionTxt}>Document</Text>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('DocView', {
                    link: providerDetails?.document,
                  });
                }}
                style={[css.row, css.aic]}>
                <Image source={Icons.fileDoc} style={[styles.fileIcon]} />
                <View style={[css.w80]}>
                  <Text style={[styles.featuredSubTxt, css.ml2]}>
                    {providerDetails?.document?.split('/')?.pop()}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.loactionTxt}>Location</Text>

            <View style={{flex: 1, paddingVertical: normalize(15)}}>
              {isValidCoordinate(parseFloat(providerDetails?.latitude)) &&
              isValidCoordinate(parseFloat(providerDetails?.longitude)) ? (
                <View pointerEvents="none" style={{flex: 1}}>
                  <MapView
                    provider="google"
                    style={styles.mapStyle}
                    initialRegion={{
                      latitude:
                        parseFloat(providerDetails?.latitude) || 40.7128,
                      longitude:
                        parseFloat(providerDetails?.longitude) || -74.006,
                      latitudeDelta: 0.1,
                      longitudeDelta: 0.1,
                    }}>
                    <Marker
                      coordinate={{
                        latitude: parseFloat(providerDetails?.latitude),
                        longitude: parseFloat(providerDetails?.longitude),
                      }}
                      title={providerDetails?.project_address}>
                      <Image
                        source={Icons.LocationPin}
                        style={styles.featuredLocationImg}
                        resizeMode="contain"
                      />
                    </Marker>
                  </MapView>
                </View>
              ) : (
                <ActivityIndicator size={'large'} color={Colors.themeGreen} />
              )}
              <View style={styles.locationMainConatiner}>
                <Image
                  source={Icons.LocationPin}
                  style={styles.featuredLocationImg}
                  resizeMode="contain"
                />
                <Text style={styles.locationTxt}>
                  {providerDetails?.project_address}
                </Text>
              </View>
            </View>
            {providerDetails?.can__send_bid && (
              <NextBtn
                height={normalize(43)}
                title={'send bid'}
                borderColor={Colors.themeGreen}
                color={Colors.themeWhite}
                backgroundColor={Colors.themeGreen}
                onPress={() => {
                  providerDetails?.can_send_bid
                    ? showErrorAlert(
                        'You have already sent a bid for this project. Please wait for the client to accept your bid.',
                      )
                    : NavigationService.navigate('SendBid', {
                        item: ProjectReducer?.projectDetailsByLocationResponse?.data,
                      });
                }}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ProjectDetailsProvider;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    height: '100%',
    width: '100%',
  },
  recentImg: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(8),
  },
  smallIcon: {
    width: normalize(11),
    height: normalize(11),
    marginRight: normalize(3),
    tintColor: Colors.themeGreen,
  },
  featuredSubTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(11),
    color: Colors.themeInactiveTxt,
    // lineHeight: normalize(22),
  },
  featuredNameTxt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(12),
    color: Colors.themeBlack,
    lineHeight: normalize(16),
  },
  commonWhiteConatiner: {
    padding: normalize(10),
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(8),
    marginBottom: normalize(10),
    width: '48%',
  },
  locationTxt: {
    flex: 1,
    fontFamily: Fonts.FustatRegular,
    fontSize: normalize(11),
    color: Colors.themeInactiveTxt,
    marginLeft: normalize(6),
  },
  mapStyle: {
    height: normalize(200),
    width: '100%',
    borderRadius: normalize(10),
  },
  locationIcon: {
    width: normalize(16),
    height: normalize(16),
    resizeMode: 'contain',
  },
  featuredLocationImg: {
    width: normalize(20),
    height: normalize(20),
  },
  commonConatiner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  descTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(11),
    color: Colors.themeInactiveTxt,
    lineHeight: normalize(16),
    marginTop: normalize(6),
  },
  commonMainConatiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: normalize(8),
  },
  loactionTxt: {
    fontFamily: Fonts.FustatBold,
    fontSize: normalize(14),
    color: Colors.themeBlack,
    lineHeight: normalize(16),
  },
  locationMainConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(10),
  },
  fileIcon: {
    height: normalize(40),
    width: normalize(40),
    resizeMode: 'contain',
    tintColor: Colors.themeGreen,
    marginVertical: normalize(12),
  },
});
