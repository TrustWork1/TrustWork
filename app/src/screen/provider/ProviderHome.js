import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../components/Header';
import ProjectCard from '../../components/Micro/ProjectCard';
import NavigationService from '../../navigators/NavigationService';
import {ProfileRequest} from '../../redux/reducer/AuthReducer';
import {ProActiveProjectRequest} from '../../redux/reducer/ProjectReducer';
import css from '../../themes/css';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import connectionrequest from '../../utils/helpers/NetInfo';
import normalize from '../../utils/helpers/normalize';
import showErrorAlert from '../../utils/helpers/Toast';

let status = '';

const ProviderHome = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const ProjectReducer = useSelector(state => state.ProjectReducer);

  const [activeProjects, setActiveProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState('');
  const [totalPages, setTotalpages] = useState('');

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
              console.log('User Press notification', detail);
              console.log(detail?.notification?.data?.data?.notification_type);

              if (
                detail?.notification?.data?.data?.notification_type ==
                'project_creation'
              ) {
                NavigationService?.navigate('ProjectDetailsProvider', {
                  item: JSON.parse(detail?.notification?.data?.data?.project),
                });
              } else if (
                detail?.notification?.data?.data?.notification_type ==
                'bid_status_change'
              ) {
                console.log('bid_status_change part');
                NavigationService?.navigate('ProviderBids');
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
      getProjectList({count: 1});
    }
  }, [isFocused]);

  const getProjectList = data => {
    if (data?.count === 1) {
      setActiveProjects([]);
      setPage(1);
    }

    let obj = {
      page: data?.count || page,
      perpage: 10,
      keyword_search: data?.search || '',
    };
    connectionrequest()
      .then(() => {
        dispatch(ProActiveProjectRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const renderProjects = (item, index) => {
    return (
      <>
        <ProjectCard
          img={item?.client_profile_pic}
          title={item?.project_title}
          desc={item?.project_description}
          type={item?.project_category?.title}
          location={item?.city}
          status={item?.status}
          onPress={() =>
            NavigationService?.navigate('ProjectDetailsProvider', {item: item})
          }
        />
      </>
    );
  };

  const listHeaderComponent = () => {
    return (
      <View>
        <Text style={styles.headerTxt}>Active Projects</Text>
      </View>
    );
  };

  if (status == '' || ProjectReducer.status != status) {
    switch (ProjectReducer.status) {
      case 'Project/ProActiveProjectRequest':
        status = ProjectReducer.status;
        break;
      case 'Project/ProActiveProjectSuccess':
        status = ProjectReducer.status;

        setActiveProjects(
          page === 1
            ? [...ProjectReducer?.ProActiveProjectResponse?.data]
            : [
                ...activeProjects,
                ...ProjectReducer?.ProActiveProjectResponse?.data,
              ],
        );

        setTotalCount(ProjectReducer?.ProActiveProjectResponse?.total);
        setTotalpages(ProjectReducer?.ProActiveProjectResponse?.pages);
        break;
      case 'Project/ProActiveProjectFailure':
        status = ProjectReducer.status;
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

  const fetchProjectData = () => {
    if (
      totalPages > page &&
      ProjectReducer.status != 'Project/ProActiveProjectRequest'
    ) {
      setPage(page + 1);
      getProjectList({count: page + 1});
    }
  };

  const searchProject = text => {
    if (text.length >= 0) {
      getProjectList({search: text, count: 1});
      setSearch(text);
    } else {
      setSearch(text);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* <Loader
        visible={ProjectReducer?.status == 'Project/ProActiveProjectRequest'}
      /> */}
      <Header
        logo={Icons.Logo}
        onHeaderPress={() => NavigationService.navigate('ProfileProvider')}
      />
      <SafeAreaView style={styles.mainContainer}>
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
                onChangeText={text => searchProject(text?.trimStart())}
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

        <View style={styles.container}>
          <View>
            <FlatList
              data={activeProjects}
              horizontal={false}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => (
                <View style={{height: normalize(8)}} />
              )}
              renderItem={({item, index}) => renderProjects(item, index)}
              contentContainerStyle={{
                paddingHorizontal: normalize(10),
                paddingBottom:
                  Platform.OS == 'ios' ? normalize(60) : normalize(100),
              }}
              scrollEventThrottle={16}
              onMomentumScrollEnd={e => {
                if (isCloseToBottom(e.nativeEvent)) {
                  fetchProjectData();
                }
              }}
              ListHeaderComponent={() => listHeaderComponent()}
              ListFooterComponent={
                <>
                  {ProjectReducer.status ==
                    'Project/ProActiveProjectRequest' && (
                    <View style={[css.aic, css.jcc, css.f1, css.mt2]}>
                      <ActivityIndicator
                        size={'large'}
                        color={Colors.themeGreen}></ActivityIndicator>
                    </View>
                  )}
                </>
              }
              ListEmptyComponent={
                <>
                  <View style={[css.aic]}>
                    <Text style={[css.txtStyle]}>No Project Found</Text>
                  </View>
                </>
              }
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ProviderHome;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    height: '80%',
    width: '100%',
  },
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
    marginBottom: normalize(15),
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
    fontFamily: Fonts.FustatBold,
    lineHeight: normalize(22),
    fontSize: normalize(14),
    color: Colors.themeWhite,
    paddingTop: normalize(10),
    paddingBottom: normalize(5),
    color: Colors.themeBlack,
    paddingBottom: normalize(10),
  },
});
