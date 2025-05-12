import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../components/Header';
import WithTitle from '../../components/Micro/WithTitle';
import NextBtn from '../../components/NextBtn';
import NavigationService from '../../navigators/NavigationService';
import {providerDetailsRequest} from '../../redux/reducer/AuthReducer';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import constants from '../../utils/helpers/constants';
import connectionrequest from '../../utils/helpers/NetInfo';
import normalize from '../../utils/helpers/normalize';
import showErrorAlert from '../../utils/helpers/Toast';
import {deleteGalleryItemRequest} from '../../redux/reducer/ProfileReducer';
import css from '../../themes/css';
import Loader from '../../utils/helpers/Loader';

let status = '';

const ServiceProvidersDetails = props => {
  const {item} = props.route.params;

  console.log(props.route.params);

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

  const [providerDetails, setProviderDetails] = useState({});

  useEffect(() => {
    if (isFocused) {
      getAddress();
    }
  }, [isFocused]);

  const getAddress = () => {
    AsyncStorage.getItem(constants.TRUSTWORKTKNADDRESS)
      .then(res => {
        // setAddress(JSON.parse(res)?.address);
        getProviderDetails(
          JSON.parse(res)?.latitude,
          JSON.parse(res)?.longitude,
        );
        // setLat(JSON.parse(res)?.latitude);
        // setLong(JSON.parse(res)?.longitude);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getProviderDetails = (lat, long) => {
    let obj = {
      id: item.id,
      lat: lat,
      long: long,
    };
    connectionrequest()
      .then(() => {
        dispatch(providerDetailsRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/providerDetailsRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/providerDetailsSuccess':
        status = AuthReducer.status;
        setProviderDetails(AuthReducer?.providerDetailsResponse?.data);
        break;
      case 'Auth/providerDetailsFailure':
        status = AuthReducer.status;
        break;
    }
  }

  const listHeaderComponent = () => {
    return (
      <View style={styles.headerMainConatiner}>
        <View style={styles.headerConatiner}>
          <Image
            source={
              providerDetails?.profile_picture
                ? {
                    uri: `${constants.IMAGE_URL}${providerDetails?.profile_picture}`,
                  }
                : Icons.UserPro
            }
            style={styles.profileImg}
            resizeMode="stretch"
          />
          <View
            style={{
              paddingLeft: normalize(10),
            }}>
            <Text style={styles.featuredNameTxt}>
              {providerDetails?.full_name}
            </Text>
            <View style={styles.mainCommonContainer}>
              <View style={styles.commonContainer}>
                <Image
                  source={Icons.Star}
                  style={styles.recentStarRating}
                  resizeMode="contain"
                />
                <Text
                  style={
                    styles.featuredSubTxt
                  }>{`${providerDetails?.profile_rating}/5`}</Text>
              </View>
              {providerDetails?.job_category?.length > 0 && (
                <View
                  style={[
                    styles.commonContainer,
                    {
                      paddingLeft: normalize(10),
                    },
                  ]}>
                  <Image
                    source={Icons.WorkType}
                    style={styles.recentStarRating}
                    resizeMode="contain"
                  />
                  <Text style={styles.featuredSubTxt}>
                    {providerDetails?.job_category[0]?.job_category__title}
                  </Text>
                </View>
              )}
              <View
                style={[
                  styles.commonContainer,
                  {
                    paddingLeft: normalize(10),
                  },
                ]}>
                <Image
                  source={Icons.Experience}
                  style={styles.recentStarRating}
                  resizeMode="contain"
                />
                <Text
                  style={
                    styles.featuredSubTxt
                  }>{`${providerDetails?.year_of_experiance} Year`}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{marginTop: normalize(8)}}>
          <View
            style={{
              flexDirection: 'row',
              paddingTop: normalize(5),
              // justifyContent: 'center',
              // alignItems: 'center',
            }}>
            <Image
              source={Icons.LocationPin}
              style={styles.recentStarRating}
              resizeMode="contain"
            />
            <Text
              style={
                styles.featuredSubTxt
              }>{`${providerDetails?.address}`}</Text>
          </View>
        </View>
        {providerDetails?.job_category?.length > 0 && (
          <Text style={[styles.featuredNameTxt, {paddingTop: normalize(20)}]}>
            {providerDetails?.job_category[0]?.job_category__title}
          </Text>
        )}
        <Text style={styles.bioTxt}>{providerDetails?.profile_bio}</Text>
        <View style={styles.mainProjectConatiner}>
          <View style={styles.experienceConatiner}>
            <WithTitle
              darkTxt={'Year of Experience'}
              lightTxt={`${providerDetails?.year_of_experiance || 0} Year`}
            />
          </View>
          <View style={styles.experienceConatiner}>
            <WithTitle
              darkTxt={'Completed Projects'}
              lightTxt={`${providerDetails?.completed_project || 0}+`}
            />
          </View>
        </View>
        {AuthReducer?.providerDetailsResponse?.data?.previous_work?.length >
          0 && (
          <View
            style={[
              {backgroundColor: Colors.themeWhite},
              css.mt2,
              css.br6,
              css.py2,
            ]}>
            <Text
              style={[
                styles.featuredNameTxt,
                {marginHorizontal: normalize(10)},
              ]}>
              {'Previous Work'}
            </Text>
            <GalleryList />
          </View>
        )}

        {providerDetails?.job_category?.length > 0 && (
          <View style={{marginTop: normalize(15)}}>
            <NextBtn
              height={normalize(50)}
              title={'Send Offer'}
              borderColor={Colors.themeGreen}
              color={Colors.themeWhite}
              backgroundColor={Colors.themeGreen}
              onPress={() =>
                NavigationService?.navigate('CreateProject', {
                  providerId: providerDetails?.id,
                })
              }
            />
          </View>
        )}
        <Text style={[styles.featuredNameTxt, {paddingTop: normalize(20)}]}>
          {'Services'}
        </Text>
      </View>
    );
  };

  const renderServices = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() =>
          NavigationService.navigate('ServiceDetails', {
            item: item,
            id: providerDetails.id,
          })
        }
        style={styles.recentContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={Icons.Plumber}
            style={styles.recentImg}
            resizeMode="contain"
          />
          <View style={styles.titleConatiner}>
            <Text style={styles.featuredNameTxt}>
              {item?.job_category__title}
            </Text>
          </View>
        </View>
        <View style={styles.featuredStarRatingContainer}>
          <Image
            source={Icons.Star}
            style={styles.featuredStarImg}
            resizeMode="contain"
          />

          <Text
            style={styles.featuredStarRatingTxt}>{`${item?.rating}/5`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const GalleryList = () => {
    let data = AuthReducer?.providerDetailsResponse?.data?.previous_work || [];
    let numColumns = 1;
    const rows = data.reduce((acc, _, i) => {
      if (i % numColumns === 0) {
        acc.push(data.slice(i, i + numColumns));
      }
      return acc;
    }, []);
    console.log(rows);
    return (
      <FlatList
        style={{marginTop: normalize(5), marginLeft: normalize(10)}}
        data={rows}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <View style={styles.row}>
            {item.map((subItem, subIndex) => {
              console.log(subItem);
              return (
                <View
                  key={subIndex}
                  style={{
                    marginRight: normalize(8),
                    marginBottom: subIndex < item.length - 1 ? normalize(8) : 0,
                    borderRadius: normalize(6),
                    overflow: 'hidden',
                  }}>
                  <Image
                    style={styles.galleryImg}
                    source={
                      subItem?.image
                        ? {
                            uri: `${constants?.IMAGE_URL}${subItem?.image}`,
                          }
                        : Icons.dummyImage
                    }
                  />
                </View>
              );
            })}
          </View>
        )}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Loader visible={AuthReducer?.status == 'Auth/providerDetailsRequest'} />
      <Header
        backIcon={Icons.BackIcon}
        headerTitle={'Service Providers Details'}
      />

      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          <View style={styles.listMainConatiner}>
            <View>
              <FlatList
                data={providerDetails?.job_category}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => (
                  <View style={{height: normalize(8)}} />
                )}
                ListHeaderComponent={() => listHeaderComponent()}
                ListEmptyComponent={() => {
                  return (
                    <View
                      style={{alignItems: 'center', marginTop: normalize(30)}}>
                      <Text style={styles.projectTitle}>
                        No Services Found !!
                      </Text>
                    </View>
                  );
                }}
                renderItem={({item, index}) => renderServices(item, index)}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ServiceProvidersDetails;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    height: '100%',
    width: '100%',
  },
  featuredNameTxt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(14),
    color: Colors.themeBlack,
    lineHeight: normalize(16),
    textTransform: 'capitalize',
  },
  featuredSubTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(11),
    color: Colors.themeInactiveTxt,
    // lineHeight: normalize(22),
  },

  featuredStarImg: {
    width: normalize(11),
    height: normalize(11),
    marginRight: normalize(3),
    tintColor: Colors.themeStarColor,
  },
  featuredStarRatingTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    color: Colors.themeBlack,
    lineHeight: normalize(16),
  },
  featuredStarRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(24),
    width: normalize(60),
    backgroundColor: Colors.themeStarRatingBackground,
    borderRadius: normalize(30),
  },

  recentContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(12),
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(8),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recentImg: {
    width: normalize(42),
    height: normalize(42),
    borderRadius: normalize(8),
  },
  recentStarRating: {
    width: normalize(11),
    height: normalize(11),
    marginRight: normalize(3),
    tintColor: Colors.themeGreen,
  },
  projectTitle: {
    color: Colors.themeBlack,
    fontSize: normalize(13),
    fontFamily: Fonts.FustatSemiBold,
  },
  listMainConatiner: {
    paddingHorizontal: normalize(10),
    marginTop: normalize(15),
  },
  headerMainConatiner: {
    paddingTop: normalize(12),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(15),
  },
  headerConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImg: {
    width: normalize(48),
    height: normalize(48),
    borderRadius: normalize(8),
  },
  mainCommonContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: normalize(3),
    flexWrap: 'wrap',
  },
  commonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bioTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    color: Colors.themeInactiveTxt,
    lineHeight: normalize(16),
    textTransform: 'capitalize',
  },
  mainProjectConatiner: {
    flex: 1,
    flexDirection: 'row',
    marginTop: normalize(20),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  experienceConatiner: {
    flex: 0.48,
    backgroundColor: Colors.themeProviderBackground,
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(10),
    borderRadius: normalize(8),
  },
  titleConatiner: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: normalize(10),
  },
  galleryImg: {
    height: normalize(150),
    width: normalize(150),
    resizeMode: 'cover',
  },
});
