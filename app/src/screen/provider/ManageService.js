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
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../components/Header';
import NavigationService from '../../navigators/NavigationService';
import {
  ProfileRequest,
  serviceListRequest,
  UpdateProfileRequest,
} from '../../redux/reducer/AuthReducer';
import {height} from '../../themes/css';
import {Colors, Fonts, Icons, Sizes} from '../../themes/Themes';
import connectionrequest from '../../utils/helpers/NetInfo';
import normalize from '../../utils/helpers/normalize';
import showErrorAlert from '../../utils/helpers/Toast';
import constants from '../../utils/helpers/constants';

let status = '';

const ManageService = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

  const [showServiceModal, setshowServiceModal] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getProfile();
    getServices();
  }, [isFocused, page]);

  const getProfile = () => {
    connectionrequest()
      .then(() => {
        dispatch(ProfileRequest());
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const getServices = () => {
    connectionrequest()
      .then(() => {
        dispatch(serviceListRequest({page: page, limit: 10}));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const updateServices = () => {
    if (selectedIds?.length === 0) {
      showErrorAlert('Select Service');
    } else {
      const obj = new FormData();
      obj.append('job_category', selectedIds);

      connectionrequest()
        .then(() => {
          dispatch(UpdateProfileRequest(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect to the internet');
        });
    }
  };

  const handleSelectItem = id => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/ProfileRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/ProfileSuccess':
        status = AuthReducer.status;
        const allIds = AuthReducer?.ProfileResponse?.data?.job_category?.map(
          item => item.job_category__id,
        );
        setSelectedIds(allIds);
        setSelectedServices(AuthReducer?.ProfileResponse?.data?.job_category);

        break;
      case 'Auth/ProfileFailure':
        status = AuthReducer.status;
        break;

      case 'Auth/serviceListRequest':
        status = AuthReducer.status;
        if (page == 1) {
          setServiceList([]);
        }
        break;
      case 'Auth/serviceListSuccess':
        status = AuthReducer.status;

        AuthReducer?.serviceListResponse?.data?.length > 0
          ? serviceList?.length < 1
            ? setServiceList(AuthReducer?.serviceListResponse?.data)
            : setServiceList([
                ...serviceList,
                ...AuthReducer?.serviceListResponse?.data,
              ])
          : setPage(1);

        // setServiceList(AuthReducer?.serviceListResponse?.data);
        break;
      case 'Auth/serviceListFailure':
        status = AuthReducer.status;
        break;

      case 'Auth/UpdateProfileRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/UpdateProfileSuccess':
        status = AuthReducer.status;
        getProfile();
        setshowServiceModal(false);
        break;
      case 'Auth/UpdateProfileFailure':
        status = AuthReducer.status;
        break;
    }
  }

  const listHeaderComponent = () => {
    return (
      <View
        style={{
          paddingTop: normalize(20),
          paddingHorizontal: normalize(10),
          paddingVertical: normalize(15),
        }}>
        <Text
          style={{
            fontFamily: Fonts.FustatSemiBold,
            fontSize: normalize(15),
            color: Colors.themeBlack,
            lineHeight: normalize(22),
          }}>
          {'My Services'}
        </Text>
        <Text
          style={{
            fontFamily: Fonts.FustatMedium,
            fontSize: normalize(12),
            color: Colors.themeInactiveTxt,
            lineHeight: normalize(16),
            marginTop: normalize(5),
          }}>
          {'Here you can manage your services'}
        </Text>
      </View>
    );
  };

  const renderServices = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() =>
          NavigationService.navigate('ServiceDetails', {item: item})
        }
        style={styles.recentContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={{
              uri: `${constants.IMAGE_URL}/media/${item?.job_category__image}`,
            }}
            style={styles.recentImg}
            resizeMode="stretch"
          />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: normalize(10),
            }}>
            <Text style={styles.featuredNameTxt}>
              {item?.job_category__title}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: normalize(24),
            width: normalize(60),
            backgroundColor: Colors.themeStarRatingBackground,
            borderRadius: normalize(30),
            marginTop: normalize(10),
          }}>
          <Image
            source={Icons.Star}
            style={{
              height: normalize(11),
              width: normalize(11),
              marginRight: normalize(3),
              tintColor: Colors.themeStarColor,
            }}
            resizeMode="contain"
          />
          <Text style={styles.featuredStarRatingTxt}>{`${
            item?.rating || '0'
          }/5`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderServicesModal = (item, index) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.themeWhite,
          borderRadius: normalize(12),
          paddingHorizontal: normalize(8),
          paddingVertical: normalize(8),
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: Colors.themeBoxBorder,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={{uri: `${constants.IMAGE_URL}${item?.image}`}}
            style={styles.recentImg}
            resizeMode="stretch"
          />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: normalize(10),
            }}>
            <Text style={styles.featuredNameTxt}>{item.title}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleSelectItem(item.id)}
          style={styles.featuredStarRatingContainer}>
          <Image
            source={isSelected ? Icons.CheckBoxFill : Icons.CheckboxUnFill}
            style={styles.featuredStarImg}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    );
  };

  const serviceComponent = () => {
    return (
      <View style={styles.modalMainContainer}>
        <View style={styles.modalSubContainer}>
          <View
            style={{
              //   justifyContent: 'center',
              //   alignItems: 'center',
              paddingVertical: normalize(10),
            }}>
            <View style={styles.modalHeaderTxtContainer}>
              <Text style={styles.modalHeaderTxt}>Select Services</Text>
              <Text style={styles.modalHeaderSubTxt}>
                {'You can select and remove your services'}
              </Text>
            </View>

            <FlatList
              data={serviceList}
              showsVerticalScrollIndicator={false}
              // horizontal={false}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => (
                <View style={{height: normalize(8)}} />
              )}
              renderItem={({item, index}) => renderServicesModal(item, index)}
              style={{
                maxHeight: normalize(300),
                // paddingBottom: normalize(100),
                // width: '100%',
              }}
              onEndReached={() => {
                if (AuthReducer?.serviceListResponse?.pages > page) {
                  setPage(page + 1);
                }
              }}
            />
            <TouchableOpacity
              onPress={() => updateServices()}
              style={{
                borderRadius: normalize(10),
                paddingHorizontal: normalize(42),
                paddingVertical: normalize(11),
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                backgroundColor: Colors?.themeGreen,
                marginTop: normalize(20),
              }}>
              <Text
                style={{
                  fontFamily: Fonts.FustatMedium,
                  fontSize: normalize(14),
                  lineHeight: normalize(22),
                  color: Colors.themeWhite,
                  textTransform: 'uppercase',
                }}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={{
            left: Sizes.width / 4,
            marginVertical: normalize(15),
            paddingBottom: normalize(10),
          }}
          onPress={() => setshowServiceModal(!showServiceModal)}>
          <View
            style={{
              borderRadius: normalize(10),
              paddingHorizontal: normalize(42),
              paddingVertical: normalize(11),
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors?.themeGreen,
              top: normalize(2),
              right: normalize(2),
            }}>
            <Text
              style={{
                fontFamily: Fonts.FustatMedium,
                fontSize: normalize(14),
                lineHeight: normalize(22),
                color: Colors.themeWhite,
                textTransform: 'uppercase',
              }}>
              Close
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Header backIcon={Icons.BackIcon} headerTitle={'Manage Service'} />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          <View
            style={{
              paddingHorizontal: normalize(10),
            }}>
            <FlatList
              data={selectedServices}
              horizontal={false}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => (
                <View style={{height: normalize(8)}} />
              )}
              ListHeaderComponent={() => listHeaderComponent()}
              renderItem={({item, index}) => renderServices(item, index)}
            />
          </View>
        </View>
        {!showServiceModal && (
          <View style={styles.addServiceMainContainer}>
            <TouchableOpacity
              onPress={() => setshowServiceModal(!showServiceModal)}
              style={styles.addServiceContainer}>
              <Text
                style={{
                  fontFamily: Fonts.FustatMedium,
                  fontSize: normalize(14),
                  lineHeight: normalize(22),
                  color: Colors.themeWhite,
                  textTransform: 'uppercase',
                }}>
                + Add Service
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
      <Modal
        visible={showServiceModal}
        style={styles.modalContainer}
        onBackButtonPress={() => setshowServiceModal(!showServiceModal)}
        onBackdropPress={() => setshowServiceModal(!showServiceModal)}>
        {serviceComponent()}
      </Modal>
    </View>
  );
};

export default ManageService;

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
  },
  featuredLocationImg: {
    width: normalize(11),
    height: normalize(11),
    marginRight: normalize(2),
  },
  featuredStarImg: {
    height: normalize(20),
    width: normalize(20),
    marginRight: normalize(5),
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
  addServiceMainContainer: {
    position: 'absolute',
    // bottom: Platform.OS === 'ios' ? normalize(30) : normalize(50),
    bottom: normalize(25),
    right: normalize(18),
  },
  addServiceContainer: {
    borderRadius: normalize(10),
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors?.themeGreen,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    margin: 0,
    width: '100%',
  },
  modalMainContainer: {
    // flex: 1,
    maxHeight: height - 100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // overflow: 'hidden',
    // marginTop: normalize(50),
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSubContainer: {
    backgroundColor: Colors.themeWhite,
    width: '90%',
    borderRadius: 20,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(10),
    shadowColor: Colors.themeGray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  modalHeaderTxtContainer: {
    paddingHorizontal: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(15),
  },
  modalHeaderTxt: {
    fontFamily: Fonts.FustatSemiBold,
    color: Colors.themeBlack,
    fontSize: 26,
    lineHeight: normalize(28),
  },
  modalHeaderSubTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: 14,
    color: Colors.themeBlack,
    lineHeight: normalize(22),
    textAlign: 'center',
    paddingHorizontal: normalize(10),
  },
});
