import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../components/Header';
import ProjectCard from '../../components/Micro/ProjectCard';
import NavigationService from '../../navigators/NavigationService';
import {projectListByLocationRequest} from '../../redux/reducer/ProjectReducer';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import constants from '../../utils/helpers/constants';
import connectionrequest from '../../utils/helpers/NetInfo';
import normalize from '../../utils/helpers/normalize';
import showErrorAlert from '../../utils/helpers/Toast';

let status = '';

const ExploreProject = props => {
  const mapRef = useRef(null);

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const ProjectReducer = useSelector(state => state.ProjectReducer);

  const [search, setSearch] = useState('');
  const [providerList, setProviderList] = useState([]);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState('');
  const [mapData, setMapData] = useState([]);

  useEffect(() => {
    if (isFocused) {
      getAddress();
    }
  }, [isFocused]);

  const getAddress = () => {
    AsyncStorage.getItem(constants.TRUSTWORKTKNADDRESS)
      .then(res => {
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
      keyword_search: data?.search || '',
    };

    connectionrequest()
      .then(() => {
        dispatch(projectListByLocationRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  useEffect(() => {
    if (mapData?.length > 0 && mapRef.current) {
      const coordinates = mapData.map(marker => ({
        latitude: marker.coordinate.latitude,
        longitude: marker.coordinate.longitude,
      }));

      // Fit all markers into view
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        },
        animated: true,
      });
    }
  }, [mapData]);

  const renderRecentUpdate = (item, index) => {
    return (
      <>
        <ProjectCard
          img={item?.client_profile_pic}
          title={item?.project_title}
          desc={item?.project_description}
          type={item?.project_category?.title}
          location={item?.project_address}
          status={item?.status}
          onPress={() =>
            NavigationService?.navigate('ProjectDetailsProvider', {item: item})
          }
        />
      </>
    );
  };

  if (status == '' || ProjectReducer.status != status) {
    switch (ProjectReducer.status) {
      case 'Project/projectListByLocationRequest':
        status = ProjectReducer.status;

        break;
      case 'Project/projectListByLocationSuccess':
        status = ProjectReducer.status;

        let projects = Array.isArray(
          ProjectReducer?.projectListByLocationResponse?.data,
        )
          ? ProjectReducer?.projectListByLocationResponse?.data
          : [];

        const markers = projects
          ?.filter(
            project =>
              project?.latitude &&
              project?.longitude &&
              !isNaN(parseFloat(project.latitude)) &&
              !isNaN(parseFloat(project.longitude)),
          )
          ?.map(project => ({
            id: project.id,
            coordinate: {
              latitude: parseFloat(project.latitude),
              longitude: parseFloat(project.longitude),
            },
            address: project.project_address,
          }));

        console.log('Markers:', markers);
        setMapData(markers);

        // setProviderList(
        //   page === 1
        //     ? [...ProjectReducer?.projectListByLocationResponse?.data]
        //     : [
        //         ...providerList,
        //         ...ProjectReducer?.projectListByLocationResponse?.data,
        //       ],
        // );
        setProviderList(ProjectReducer?.projectListByLocationResponse?.data);

        setTotalCount(ProjectReducer?.projectListByLocationResponse?.total);
        break;
      case 'Project/projectListByLocationFailure':
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

  const fetchProviderData = () => {
    if (totalCount !== providerList?.length) {
      setPage(page + 1);
      getServiceProviderList({count: page + 1, lat: lat, long: long});
    }
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
        visible={
          ProjectReducer?.status == 'Project/projectListByLocationRequest'
        }
      /> */}
      <Header
        onHeaderPress={() => NavigationService.navigate('ProfileProvider')}
        menuTxt={'Explore Project'}
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
        <ScrollView
          contentContainerStyle={{paddingBottom: normalize(70)}}
          style={styles.container}
          // scrollEventThrottle={16}
          // onMomentumScrollEnd={e => {
          //   if (isCloseToBottom(e.nativeEvent)) {
          //     fetchProviderData();
          //   }
          // }}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: normalize(15),
            }}>
            {
              mapData?.length > 0 && (
                <View
                  style={{
                    flex: 1,
                    marginTop: normalize(15),
                  }}>
                  <MapView
                    ref={mapRef}
                    provider="google"
                    style={styles.mapStyle}
                    initialRegion={{
                      latitude: parseFloat(lat) || 40.7128,
                      longitude: parseFloat(long) || -74.006,
                      latitudeDelta: 0.1,
                      longitudeDelta: 0.1,
                    }}>
                    {mapData?.map(marker => (
                      <Marker
                        key={marker.id}
                        coordinate={{
                          latitude: marker.coordinate.latitude,
                          longitude: marker.coordinate.longitude,
                        }}
                        title={marker.project_address}>
                        <Image
                          source={Icons.LocationPin}
                          style={styles.featuredLocationImg}
                          resizeMode="contain"
                        />
                      </Marker>
                    ))}
                  </MapView>
                </View>
              )
              //  : (
              //   <ActivityIndicator size="large" color={Colors.themeGreen} />
              // )
            }

            <Text style={[styles.headerTxt]}>Explore Projects</Text>
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
                //     ProjectReducer?.projectListByLocationResponse?.pages > page
                //   ) {
                //     setPage(page + 1);
                //   }
                // }}
                renderItem={({item, index}) => renderRecentUpdate(item, index)}
                contentContainerStyle={{}}
                ListEmptyComponent={() => {
                  return (
                    <View
                      style={{alignItems: 'center', marginTop: normalize(30)}}>
                      <Text style={styles.projectTitle}>
                        No Projects Found !!
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ExploreProject;

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
  mapStyle: {
    height: normalize(200),
    width: '100%',
    borderRadius: normalize(10),
  },
  projectTitle: {
    color: Colors.themeBlack,
    fontSize: normalize(13),
    fontFamily: Fonts.FustatSemiBold,
  },
});
