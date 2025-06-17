import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import NavigationService from '../../navigators/NavigationService';
import {projectListRequest} from '../../redux/reducer/ProjectReducer';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import Loader from '../../utils/helpers/Loader';
import connectionrequest from '../../utils/helpers/NetInfo';
import normalize from '../../utils/helpers/normalize';
import showErrorAlert from '../../utils/helpers/Toast';

let status = '';

const CompletedProjects = () => {
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
      status: 'completed',
      page: data?.count || page,
      perpage: 10,
      keyword_search: data?.search || '',
    };

    connectionrequest()
      .then(() => {
        dispatch(projectListRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  if (status == '' || ProjectReducer.status != status) {
    switch (ProjectReducer.status) {
      case 'Project/projectListRequest':
        status = ProjectReducer.status;
        break;
      case 'Project/projectListSuccess':
        status = ProjectReducer.status;

        setProjectList(
          page === 1
            ? [...ProjectReducer?.projectListResponse?.data]
            : [...projectList, ...ProjectReducer?.projectListResponse?.data],
        );

        setTotalCount(ProjectReducer?.projectListResponse?.total);
        break;
      case 'Project/projectListFailure':
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

  const renderProjectList = (item, index) => {
    return (
      <View style={styles.listMainConatiner}>
        <View style={styles.listConatiner}>
          <Text style={styles.featuredNameTxt}>{item?.project_title}</Text>
        </View>

        <View style={styles.listSubConatiner}>
          <View style={{flex: 0.47, flexDirection: 'column'}}>
            <Text style={styles.commonTxt}>Project Category:</Text>
            <Text style={styles.commonTxt}>Status:</Text>
          </View>
          <View style={{flex: 0.48, flexDirection: 'column'}}>
            <Text style={styles.commonInactiveTxt}>
              {item?.project_category?.title}
            </Text>
            <Text
              style={[styles.commonInactiveTxt, {textTransform: 'capitalize'}]}>
              {item?.status}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            NavigationService.navigate('ProjectDetails', {
              flag: 'Completed',
              item: item,
            })
          }
          style={styles.buttonFillColor}>
          <Text style={styles.buttonFillColorTxt}>View Details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          <Loader
            visible={ProjectReducer.status == 'Project/projectListRequest'}
          />

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
              <TouchableOpacity
                style={styles.createConatiner}
                onPress={() => NavigationService?.navigate('CreateProject')}>
                <Image source={Icons.Plus} style={styles.plusImag} />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: normalize(10),
            }}>
            <View>
              <FlatList
                data={projectList}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => (
                  <View style={{height: normalize(10)}} />
                )}
                renderItem={({item, index}) => renderProjectList(item, index)}
                contentContainerStyle={{
                  marginTop: normalize(15),
                  paddingBottom:
                    Platform.OS == 'ios' ? normalize(180) : normalize(150),
                }}
                scrollEventThrottle={16}
                onMomentumScrollEnd={e => {
                  if (isCloseToBottom(e.nativeEvent)) {
                    fetchProjectData();
                  }
                }}
                ListEmptyComponent={() => {
                  return (
                    <>
                      {ProjectReducer.status !=
                        'Project/projectListRequest' && (
                        <View
                          style={{
                            alignItems: 'center',
                            marginTop: normalize(30),
                          }}>
                          <Text style={styles.projectTitle}>
                            No Projects Found !!
                          </Text>
                        </View>
                      )}
                    </>
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

export default CompletedProjects;

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
    width: '80%',
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

  featuredNameTxt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(14),
    color: Colors.themeBlack,
    textTransform: 'capitalize',
    // lineHeight: normalize(22),
  },

  listMainConatiner: {
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(12),
    // paddingTop: normalize(12),
    // paddingHorizontal: normalize(10),
    // paddingVertical: normalize(15),
  },

  projectTitle: {
    color: Colors.themeBlack,
    fontSize: normalize(13),
    fontFamily: Fonts.FustatSemiBold,
  },
  createConatiner: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
  },
  plusImag: {
    width: normalize(48),
    height: normalize(48),
    alignSelf: 'center',
  },
  listConatiner: {
    paddingVertical: normalize(15),
    backgroundColor: Colors.themeProjectBackground,
    borderTopLeftRadius: normalize(10),
    borderTopRightRadius: normalize(10),
    paddingHorizontal: normalize(15),
    justifyContent: 'center',
  },
  listSubConatiner: {
    flex: 1,
    borderBottomLeftRadius: normalize(10),
    borderBottomRightRadius: normalize(10),
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commonTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    color: Colors.themeBlack,
    lineHeight: normalize(22),
  },
  commonInactiveTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    color: Colors.themeInactiveTxt,
    lineHeight: normalize(22),
  },
  buttonFillColor: {
    backgroundColor: Colors.themeGreen,
    borderRadius: normalize(8),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(6),
    marginBottom: normalize(15),
    marginHorizontal: normalize(15),
  },
  buttonFillColorTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    color: Colors.themeWhite,
    lineHeight: normalize(22),
    textTransform: 'uppercase',
  },
});
