import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import StatusCard from '../../components/Micro/StatusCard';
import NavigationService from '../../navigators/NavigationService';
import {ProviderProjectListRequest} from '../../redux/reducer/ProjectReducer';
import {Colors, Fonts} from '../../themes/Themes';
import connectionrequest from '../../utils/helpers/NetInfo';
import normalize from '../../utils/helpers/normalize';
import showErrorAlert from '../../utils/helpers/Toast';

let status = '';

const ProviderActiveProject = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const ProjectReducer = useSelector(state => state.ProjectReducer);

  const [search, setSearch] = useState('');
  const [projectList, setProjectList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState('');

  useEffect(() => {
    if (isFocused) {
      getProjectList({count: 1});
    }
  }, [isFocused]);

  const getProjectList = data => {
    if (data?.count === 1) {
      setProjectList([]);
      setPage(1);
    }

    let obj = {
      status: 'active',
      page: data?.count || page,
      perpage: 10,
      keyword_search: data?.search || '',
    };

    connectionrequest()
      .then(() => {
        dispatch(ProviderProjectListRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  if (status == '' || ProjectReducer.status != status) {
    switch (ProjectReducer.status) {
      case 'Project/ProviderProjectListRequest':
        status = ProjectReducer.status;
        break;
      case 'Project/ProviderProjectListSuccess':
        status = ProjectReducer.status;

        setProjectList(ProjectReducer?.ProviderProjectListResponse?.data);

        setProjectList(
          page === 1
            ? [...ProjectReducer?.ProviderProjectListResponse?.data]
            : [
                ...projectList,
                ...ProjectReducer?.ProviderProjectListResponse?.data,
              ],
        );

        setTotalCount(ProjectReducer?.ProviderProjectListResponse?.total);

        break;
      case 'Project/ProviderProjectListFailure':
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
    if (totalCount !== projectList?.length) {
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

  const renderProject = (item, index) => {
    return (
      <>
        <StatusCard
          title={item?.project_title}
          location={item?.project_address}
          category={item?.project_category}
          InitDate={moment(item?.created_at).format('Do MMM, YYYY')}
          // status={item?.status}
          status={item?.status}
          timeLine={item?.project_timeline}
          timeLineUnit={item?.project_hrs_week}
          onPress={() =>
            NavigationService.navigate('ProviderProjectDetails', {
              item,
              flag: 'Active',
            })
          }
        />
      </>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          {/* <Loader
            visible={
              ProjectReducer.status == 'Project/ProviderProjectListRequest'
            }
          /> */}

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
              </View>
            </View>
          </View>

          <FlatList
            data={projectList}
            renderItem={({item, index}) => renderProject(item, index)}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              {
                paddingHorizontal: normalize(15),
                paddingBottom:
                  Platform.OS == 'ios' ? normalize(180) : normalize(150),
              },
            ]}
            ListHeaderComponent={
              <View
                style={{
                  // paddingHorizontal: normalize(10),
                  paddingTop: normalize(15),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.FustatBold,
                    fontSize: normalize(14),
                    color: Colors.themeBlack,
                  }}>
                  Active Projects
                </Text>
              </View>
            }
            scrollEventThrottle={16}
            onMomentumScrollEnd={e => {
              if (isCloseToBottom(e.nativeEvent)) {
                fetchProjectData();
              }
            }}
            ListEmptyComponent={
              <>
                {ProjectReducer.status !=
                  'Project/ProviderProjectListRequest' && (
                  <View
                    style={{alignItems: 'center', marginTop: normalize(20)}}>
                    <Text
                      style={{
                        fontFamily: Fonts.FustatBold,
                        fontSize: normalize(14),
                        color: Colors.themeBlack,
                      }}>
                      No Project Found !!
                    </Text>
                  </View>
                )}
              </>
            }
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ProviderActiveProject;

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
    paddingBottom: normalize(15),
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
});
