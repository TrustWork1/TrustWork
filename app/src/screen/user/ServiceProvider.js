import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../components/Header';
import NavigationService from '../../navigators/NavigationService';
import {providerListByLocationRequest} from '../../redux/reducer/AuthReducer';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import connectionrequest from '../../utils/helpers/NetInfo';
import showErrorAlert from '../../utils/helpers/Toast';
import constants from '../../utils/helpers/constants';
import normalize from '../../utils/helpers/normalize';

let status = '';

const ServiceProvider = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

  const [search, setSearch] = useState('');
  const [providerList, setProviderList] = useState([]);
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState('');

  useEffect(() => {
    if (isFocused) {
      getAddress();
    }
  }, [isFocused]);

  const getAddress = () => {
    AsyncStorage.getItem(constants.TRUSTWORKTKNADDRESS)
      .then(res => {
        // setAddress(JSON.parse(res)?.address);
        getServiceProviderList({
          count: 1,
          lat: JSON.parse(res)?.latitude,
          long: JSON.parse(res)?.longitude,
        });
        setLat(JSON.parse(res)?.latitude);
        setLong(JSON.parse(res)?.longitude);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getServiceProviderList = data => {
    if (data?.count === 1) {
      setProviderList([]);
      setPage(1);
    }

    let obj = {
      lat: data?.lat,
      long: data?.long,
      radius: 10,
      // page: data?.count || page,
      page: 1,
      perpage: 50,
      keyword_search: data?.search || null,
    };
    connectionrequest()
      .then(() => {
        dispatch(providerListByLocationRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const renderRecentUpdate = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() =>
          NavigationService.navigate('ServiceProvidersDetails', {item: item})
        }
        style={styles.recentContainer}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={
              item?.profile_picture
                ? {
                    uri: `${constants.IMAGE_URL}${item?.profile_picture}`,
                  }
                : Icons.UserPro
            }
            style={styles.recentImg}
            resizeMode="stretch"
          />
          <View
            style={{
              // justifyContent: 'center',
              // alignItems: 'center',
              paddingLeft: normalize(8),
            }}>
            <Text style={styles.featuredNameTxt}>{item?.full_name}</Text>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                paddingVertical: normalize(3),
                flexWrap: 'wrap',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={Icons.LocationPin}
                  style={styles.featuredLocationImg}
                  resizeMode="contain"
                />
                <Text style={styles.featuredSubTxt}>
                  {item?.city?.slice(0, 12)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingLeft: normalize(6),
                }}>
                <Image
                  source={Icons.Star}
                  style={styles.recentStarRating}
                  resizeMode="contain"
                />
                <Text
                  style={
                    styles.featuredSubTxt
                  }>{`${item?.profile_rating}/5`}</Text>
              </View>
              {item?.job_category[0]?.title && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingLeft: normalize(6),
                  }}>
                  <Image
                    source={Icons.WorkType}
                    style={styles.recentStarRating}
                    resizeMode="contain"
                  />
                  <Text style={styles.featuredSubTxt}>
                    {item?.job_category[0]?.title}
                  </Text>
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingLeft: normalize(6),
                }}>
                <Image
                  source={Icons.Experience}
                  style={styles.recentStarRating}
                  resizeMode="contain"
                />
                <Text
                  style={
                    styles.featuredSubTxt
                  }>{`${item?.year_of_experiance} Year`}</Text>
              </View>
            </View>
          </View>
        </View>
        <Text
          style={{
            fontFamily: Fonts.FustatMedium,
            fontSize: normalize(12),
            color: Colors.themeInactiveTxt,
            lineHeight: normalize(16),
            marginTop: normalize(10),
          }}>
          {item?.profile_bio}
        </Text>
      </TouchableOpacity>
    );
  };

  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/providerListByLocationRequest':
        status = AuthReducer.status;

        break;
      case 'Auth/providerListByLocationSuccess':
        status = AuthReducer.status;

        setProviderList(AuthReducer?.providerListByLocationResponse?.data);

        // setProviderList(
        //   page === 1
        //     ? [...AuthReducer?.providerListByLocationResponse?.data]
        //     : [
        //         ...providerList,
        //         ...AuthReducer?.providerListByLocationResponse?.data,
        //       ],
        // );

        setTotalCount(AuthReducer?.providerListByLocationResponse?.total);
        break;
      case 'Auth/providerListByLocationFailure':
        status = AuthReducer.status;
        break;
    }
  }

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const fetchProviderData = () => {
    // if (totalCount !== providerList?.length) {
    //   setPage(page + 1);
    //   getServiceProviderList({count: page + 1, lat: lat, long: long});
    // }
  };

  const searchProvider = text => {
    if (text.length >= 0) {
      getServiceProviderList({search: text, count: 1, lat: lat, long: long});
      setSearch(text);
    } else {
      setSearch(text);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* <Loader
        visible={AuthReducer?.status == 'Auth/providerListByLocationRequest'}
      /> */}
      <Header
        onHeaderPress={() => NavigationService.navigate('Profile')}
        menuTxt={'Service Providers'}
      />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          <View
            style={{
              backgroundColor: Colors.themeGreen,
              // height: normalize(100),
              paddingHorizontal: normalize(10),
            }}>
            <View style={styles.searchMainContainer}>
              <View style={styles.searchContainer}>
                <TextInput
                  placeholder="Search..."
                  placeholderTextColor={Colors.themeBlack}
                  fontFamily={Fonts.FustatMedium}
                  textAlign="left"
                  autoCapitalize="none"
                  value={search}
                  onChangeText={text => searchProvider(text?.trimStart())}
                  style={styles.searchInputContainer}
                />

                {/* <TouchableOpacity
                  style={styles.searchIconContainer}
                  onPress={() => {}}>
                  <Image
                    source={Icons.Filter}
                    style={{
                      width: normalize(18),
                      height: normalize(18),
                      alignSelf: 'center',
                    }}
                  />
                </TouchableOpacity> */}
              </View>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: normalize(10),
              marginTop: normalize(15),
            }}>
            <View>
              <FlatList
                data={providerList}
                horizontal={false}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => (
                  <View style={{height: normalize(8)}} />
                )}
                // onEndReached={() => {
                //   if (
                //     AuthReducer?.providerListByLocationResponse?.pages > page
                //   ) {
                //     setPage(page + 1);
                //   }
                // }}
                scrollEventThrottle={16}
                onMomentumScrollEnd={e => {
                  if (isCloseToBottom(e.nativeEvent)) {
                    fetchProviderData();
                  }
                }}
                renderItem={({item, index}) => renderRecentUpdate(item, index)}
                contentContainerStyle={{paddingBottom: normalize(150)}}
                ListEmptyComponent={() => {
                  return (
                    <View
                      style={{alignItems: 'center', marginTop: normalize(30)}}>
                      <Text style={styles.projectTitle}>
                        No Providers Found !!
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ServiceProvider;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    height: '100%',
    width: '100%',
  },
  searchMainContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: normalize(7),
    flexDirection: 'row',
  },
  searchContainer: {
    width: '100%',
    height: normalize(50),
    backgroundColor: Colors.themeSearchBackground,
    borderColor: Colors.themeSearchBorder,
    borderWidth: 2,
    borderRadius: 8,
    flexDirection: 'row',
  },
  searchInputContainer: {
    width: '80%',
    fontSize: normalize(14),
    fontFamily: Fonts.FustatMedium,
    color: Colors.themeBlack,
    paddingHorizontal: normalize(10),
  },
  searchIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
    borderLeftWidth: 1,
    borderColor: Colors.themeSearchBorder,
  },
  headerTxt: {
    fontFamily: Fonts.FustatSemiBold,
    lineHeight: normalize(22),
    fontSize: normalize(16),
    color: Colors.themeWhite,
    paddingTop: normalize(10),
    paddingBottom: normalize(5),
  },
  featuredContainer: {
    width: normalize(110),
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(12),
    marginVertical: normalize(10),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(15),
  },

  featuredNameTxt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(14),
    color: Colors.themeBlack,
    lineHeight: normalize(16),
  },
  featuredSubTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(10),
    color: Colors.themeInactiveTxt,
    textTransform: 'capitalize',
    // lineHeight: normalize(22),
  },
  featuredImg: {
    width: normalize(56),
    height: normalize(56),
    borderRadius: normalize(56 / 2),
  },

  featuredImgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredTxtContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: normalize(10),
  },
  featuredLocationImg: {
    width: normalize(11),
    height: normalize(11),
    marginRight: normalize(2),
  },
  featuredStarImg: {
    width: normalize(13),
    height: normalize(13),
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
    marginTop: normalize(10),
  },

  recentContainer: {
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(12),
    paddingTop: normalize(12),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(15),
  },
  recentImg: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(8),
  },
  recentStarRating: {
    width: normalize(11),
    height: normalize(11),
    marginRight: normalize(2),
    tintColor: Colors.themeGreen,
  },
  projectTitle: {
    color: Colors.themeBlack,
    fontSize: normalize(13),
    fontFamily: Fonts.FustatSemiBold,
  },
});
