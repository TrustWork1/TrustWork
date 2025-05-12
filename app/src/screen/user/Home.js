import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../components/Header';
import NavigationService from '../../navigators/NavigationService';
import {
  ProfileRequest,
  ProviderListRequest,
  recentUpdateClientRequest,
} from '../../redux/reducer/AuthReducer';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import constants from '../../utils/helpers/constants';
import connectionrequest from '../../utils/helpers/NetInfo';
import normalize from '../../utils/helpers/normalize';
import showErrorAlert from '../../utils/helpers/Toast';

let status = '';

const Home = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

  const [search, setSearch] = useState('');
  const [ProviderList, setProviderList] = useState([]);
  const [page, setPage] = useState(1);
  const [pageRecent, setPageRecent] = useState(1);
  const [totalCount, setTotalCount] = useState('');
  const [totalPages, setTotalpages] = useState('');
  const [totalRecentCount, setTotalRecentCount] = useState('');
  const [recentUpdatesList, setRecentUpdatesList] = useState([]);

  useEffect(() => {
    try {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('A new FCM notification arrived!', remoteMessage);

        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });

        // await notifee.cancelAllNotifications();

        // await notifee.displayNotification({
        //   title: remoteMessage?.notification?.title,
        //   body: remoteMessage?.notification?.body,
        //   android: Platform.OS == 'android' && {
        //     channelId,
        //   },
        //   data: remoteMessage,
        //   asForegroundService: true,
        // });

        return notifee.onForegroundEvent(({type, detail}) => {
          switch (type) {
            case EventType.DISMISSED:
              console.log('User dismissed notification 1', detail);
              break;
            case EventType.PRESS:
              console.log('User dismissed notification 2', detail);
              if (
                detail?.notification?.data?.data?.notification_type ==
                'bid_create'
              ) {
                NavigationService.navigate('Project');
              } else {
                // props?.navigation?.navigate('PostDetails', {
                //   data: detail?.notification?.data?.data,
                // });
              }

              break;
          }
        });
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.log('notificationListner.....', error);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      dispatch(ProfileRequest());
      getRecentUpdateClient({count: 1});
      getFeaturedProviders({count: 1});
    }
  }, [isFocused]);

  const getFeaturedProviders = data => {
    if (data?.count === 1) {
      setProviderList([]);
      setPage(1);
    }

    // let obj = {
    //   page: 1,
    //   perpage: 20,
    //   keyword_search: '',
    // };

    let obj = {
      page: data?.count || page,
      perpage: 5,
      keyword_search: '',
    };
    connectionrequest()
      .then(() => {
        dispatch(ProviderListRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const getRecentUpdateClient = data => {
    if (data?.count === 1) {
      setRecentUpdatesList([]);
      setPageRecent(1);
    }

    let obj = {
      page: data?.count || pageRecent,
      perpage: 10,
      keyword_search: data?.search || '',
    };

    connectionrequest()
      .then(() => {
        dispatch(recentUpdateClientRequest(obj));
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
                ? {uri: `${constants.IMAGE_URL}${item?.profile_picture}`}
                : Icons.UserPro
            }
            style={styles.recentImg}
            resizeMode="stretch"
          />
          <View
            style={{
              // justifyContent: 'center',
              // alignItems: 'center',
              paddingLeft: normalize(10),
            }}>
            <Text style={styles.featuredNameTxt}>{item?.full_name}</Text>
            <View style={styles.mainCommonContainer}>
              <View style={styles.commonContainer}>
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
                style={[
                  styles.commonContainer,
                  {
                    paddingLeft: normalize(10),
                  },
                ]}>
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
              {item?.job_category?.[0]?.job_category__title && (
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
                    {item?.job_category[0]?.job_category__title}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <Text style={styles.bioTxt}>{item?.profile_bio}</Text>
      </TouchableOpacity>
    );
  };

  const renderFeaturedServices = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() =>
          NavigationService.navigate('ServiceProvidersDetails', {item: item})
        }
        style={styles.featuredContainer}>
        <View style={styles.featuredImgContainer}>
          <View style={[styles.featuredImg, {backgroundColor: 'black'}]}>
            <Image
              source={
                item?.profile_picture
                  ? {
                      uri: `${constants.IMAGE_URL}${item?.profile_picture}`,
                    }
                  : Icons.UserPro
              }
              style={styles.featuredImg}
              resizeMode="stretch"
            />
          </View>
        </View>

        <View style={styles.featuredTxtContainer}>
          <Text style={styles.featuredNameTxt}>{item?.full_name}</Text>

          <View style={{flexGrow: 1, justifyContent: 'flex-end'}}>
            <View style={styles.commonContainer}>
              <Image
                source={Icons.LocationPin}
                style={styles.featuredLocationImg}
                resizeMode="contain"
              />
              <Text style={styles.featuredSubTxt}>
                {item?.city?.slice(0, 12)}
              </Text>
            </View>
            <View style={styles.featuredStarRatingContainer}>
              <Image
                source={Icons.Star}
                style={styles.featuredStarImg}
                resizeMode="contain"
              />
              <Text
                style={
                  styles.featuredStarRatingTxt
                }>{`${item?.profile_rating}/5`}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/ProviderListRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/ProviderListSuccess':
        status = AuthReducer.status;
        setProviderList(
          page === 1
            ? [...AuthReducer?.ProviderListResponse?.data]
            : [...ProviderList, ...AuthReducer?.ProviderListResponse?.data],
        );

        setTotalCount(AuthReducer?.ProviderListResponse?.total);
        setTotalpages(AuthReducer?.ProviderListResponse?.pages);

        break;
      case 'Auth/ProviderListFailure':
        status = AuthReducer.status;
        break;

      case 'Auth/recentUpdateClientRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/recentUpdateClientSuccess':
        status = AuthReducer.status;
        setRecentUpdatesList(AuthReducer?.recentUpdateClientResponse?.data);
        // setRecentUpdatesList(
        //   pageRecent === 1
        //     ? [...AuthReducer?.recentUpdateClientResponse?.data]
        //     : [
        //         ...recentUpdatesList,
        //         ...AuthReducer?.recentUpdateClientResponse?.data,
        //       ],
        // );

        // setTotalRecentCount(AuthReducer?.recentUpdateClientResponse?.total);
        break;
      case 'Auth/recentUpdateClientFailure':
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
    if (totalPages > page && AuthReducer.status != 'Auth/ProviderListRequest') {
      setPage(page + 1);
      getFeaturedProviders({count: page + 1});
    }
  };

  const fetchRecentupdateData = () => {
    if (totalRecentCount !== recentUpdatesList?.length) {
      setPageRecent(pageRecent + 1);
      getRecentUpdateClient({count: pageRecent + 1});
    }
  };

  const searchRecentUpdates = text => {
    if (text.length >= 0) {
      getRecentUpdateClient({search: text, count: 1});
      setSearch(text);
    } else {
      setSearch(text);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* <Loader
        visible={
          AuthReducer?.status == 'Auth/ProviderListRequest' ||
          AuthReducer?.status == 'Auth/recentUpdateClientRequest'
        }
      /> */}
      <Header
        logo={Icons.Logo}
        onHeaderPress={() => NavigationService.navigate('Profile')}
      />
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={{paddingBottom: normalize(70)}}
          style={styles.container}
          scrollEventThrottle={16}
          onMomentumScrollEnd={e => {
            if (isCloseToBottom(e.nativeEvent)) {
              fetchRecentupdateData();
            }
          }}>
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
                  onChangeText={text => searchRecentUpdates(text?.trimStart())}
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
            <Text style={styles.headerTxt}>Featured Service Providers</Text>
            <View>
              <FlatList
                data={ProviderList}
                horizontal={true}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <View style={{width: normalize(8)}} />
                )}
                renderItem={({item, index}) =>
                  renderFeaturedServices(item, index)
                }
                contentContainerStyle={{
                  paddingBottom: normalize(10),
                }}
                scrollEventThrottle={16}
                onMomentumScrollEnd={e => {
                  if (isCloseToBottom(e.nativeEvent)) {
                    fetchProviderData();
                  }
                }}
                ListFooterComponent={
                  <>
                    {AuthReducer.status == 'Auth/ProviderListRequest' && (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 1,
                        }}>
                        <ActivityIndicator
                          size={'large'}
                          color={Colors.themeWhite}
                        />
                      </View>
                    )}
                  </>
                }
              />
            </View>
          </View>
          <View style={{paddingHorizontal: normalize(10)}}>
            <Text
              style={[
                styles.headerTxt,
                {color: Colors.themeBlack, paddingBottom: normalize(10)},
              ]}>
              Recent Updates
            </Text>

            <View>
              <FlatList
                data={recentUpdatesList}
                horizontal={false}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => (
                  <View style={{height: normalize(8)}} />
                )}
                renderItem={({item, index}) =>
                  renderRecentUpdate(item?.service_provider, index)
                }
                contentContainerStyle={{
                  paddingBottom: normalize(10),
                }}
                ListEmptyComponent={
                  <>
                    {AuthReducer?.status !=
                      'Auth/recentUpdateClientRequest' && (
                      <View
                        style={{
                          alignItems: 'center',
                          marginTop: normalize(20),
                        }}>
                        <Text
                          style={{
                            fontSize: normalize(12),
                            color: Colors.themeBlack,
                            fontFamily: Fonts.FustatMedium,
                          }}>
                          No Recent Updates Found
                        </Text>
                      </View>
                    )}
                  </>
                }
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Home;

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
    fontSize: normalize(12),
    color: Colors.themeBlack,
    lineHeight: normalize(16),
  },
  featuredSubTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(11),
    color: Colors.themeInactiveTxt,
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
    flex: 1,
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
    marginRight: normalize(3),
    tintColor: Colors.themeGreen,
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
    marginTop: normalize(10),
    textTransform: 'capitalize',
  },
});
