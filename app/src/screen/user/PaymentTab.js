import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../components/Header';
import NavigationService from '../../navigators/NavigationService';
import {
  PaymentHistoryRequest,
  PendingPaymentRequest,
} from '../../redux/reducer/ProjectReducer';
import {Colors, Fonts} from '../../themes/Themes';
import css from '../../themes/css';
import connectionrequest from '../../utils/helpers/NetInfo';
import showErrorAlert from '../../utils/helpers/Toast';
import constants from '../../utils/helpers/constants';
import normalize from '../../utils/helpers/normalize';
let status = '';

const PaymentTab = () => {
  const [select, setSelect] = useState('pending');
  const [page, setPage] = useState(1);
  const [page1, setPage1] = useState(1);
  const [pendingList, setPendingList] = useState([]);
  const [paymentList, setPaymentList] = useState([]);

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const ProjectReducer = useSelector(state => state.ProjectReducer);
  const ProfileReducer = useSelector(state => state.ProfileReducer);

  useEffect(() => {
    getPendingPaymentList();
  }, [isFocused, page]);

  useEffect(() => {
    getPaymentList();
  }, [isFocused, page1]);

  const getPendingPaymentList = () => {
    connectionrequest()
      .then(() => {
        dispatch(PendingPaymentRequest({page: page, limit: 10}));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };
  const getPaymentList = () => {
    connectionrequest()
      .then(() => {
        dispatch(PaymentHistoryRequest({page: page1, limit: 10}));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const renderPendingPayment = ({item, index}) => {
    // console.log(item);
    return (
      <>
        <View style={styles.listMainConatiner}>
          <View>
            <View style={styles.listConatiner}>
              <Text style={styles.featuredNameTxt}>
                {item?.project?.project_title}
              </Text>
            </View>

            <View style={styles.listSubConatiner}>
              <View style={{flex: 0.47, flexDirection: 'column'}}>
                <Text style={styles.commonTxt}>Project Category:</Text>
                {/* <Text style={styles.commonTxt}>Status:</Text> */}
                <Text style={styles.commonTxt}>Estimated Timeline:</Text>
                <Text style={styles.commonTxt}>Payment Amount:</Text>
              </View>
              <View style={{flex: 0.47, flexDirection: 'column'}}>
                <Text style={styles.commonInactiveTxt}>
                  {item?.project?.project_category?.title}
                </Text>
                {/* <Text
                  style={[
                    styles.commonInactiveTxt,
                    {textTransform: 'capitalize'},
                  ]}>
                  {item?.status}
                </Text> */}
                <Text style={styles.commonInactiveTxt}>
                  {item?.project?.project_timeline}{' '}
                  {item?.project?.project_hrs_week}
                </Text>
                <Text style={styles.commonInactiveTxt}>
                  {item?.project?.project_budget}
                </Text>
              </View>
            </View>
          </View>
          <View style={[css.row, css.jcsb]}>
            {/* <TouchableOpacity
              onPress={() => {
                NavigationService.navigate('CreateProject', {item: item});
              }}
              style={styles.buttonWithBorder}>
              <Text style={styles.buttonWithBorderTxt}>Edit Project</Text>
            </TouchableOpacity> */}
            {/* onPress=
            {() => {
              NavigationService.navigate('Payment', {
                bidId: item?.id,
              });
            }} */}
            <TouchableOpacity
              onPress={() =>
                NavigationService.navigate('Payment', {
                  bidId: item?.bid?.id,
                  amount: item?.bid?.project_total_cost,
                })
              }
              style={styles.buttonFillColor}>
              <Text style={styles.buttonFillColorTxt}>Pay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  const historyRender = ({item, index}) => {
    return (
      <>
        <View onPress={() => {}} style={styles.historyContainer}>
          <Image
            source={{
              uri: `${constants.IMAGE_URL}${item?.bid?.service_provider?.profile_picture}`,
            }}
            resizeMode="stretch"
            style={styles.profileImg}
          />
          <View style={[css.ml2, css.f1]}>
            <View style={[css.aic, css.row, css.jcsb, css.f1]}>
              <Text style={[styles.nameStyle]}>
                {item?.bid?.service_provider?.full_name}
              </Text>
              <Text style={[styles.timeStyle, css.fs10]}>
                {moment(item?.created_at).format('LLL')}
              </Text>
            </View>
            <View style={[css.aic, css.row, css.jcsb, css.f1]}>
              <Text style={[styles.timeStyle, css.fs11]}>
                <Text style={[styles.commonTxt]}>Transaction Amount: </Text>
                {`$${item?.bid?.project_total_cost}`}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  if (status == '' || ProjectReducer.status != status) {
    switch (ProjectReducer.status) {
      case 'Project/PendingPaymentRequest':
        status = ProjectReducer.status;
        if (page == 1) {
          setPendingList([]);
        }
        break;
      case 'Project/PendingPaymentSuccess':
        status = ProjectReducer.status;
        ProjectReducer?.PendingPaymentResponse?.data?.length > 0
          ? pendingList?.length < 1
            ? setPendingList(ProjectReducer?.PendingPaymentResponse?.data)
            : setPendingList([
                ...pendingList,
                ...ProjectReducer?.PendingPaymentResponse?.data,
              ])
          : setPage1(1);

        break;
      case 'Project/PendingPaymentFailure':
        status = ProjectReducer.status;
        break;

      //////////////// History ////////////
      case 'Project/PaymentHistoryRequest':
        status = ProjectReducer.status;
        if (page1 == 1) {
          setPaymentList([]);
        }
        break;
      case 'Project/PaymentHistorySuccess':
        status = ProjectReducer.status;
        ProjectReducer?.PaymentHistoryResponse?.data?.length > 0
          ? paymentList?.length < 1
            ? setPaymentList(ProjectReducer?.PaymentHistoryResponse?.data)
            : setPaymentList([
                ...paymentList,
                ...ProjectReducer?.PaymentHistoryResponse?.data,
              ])
          : setPage1(1);

        break;
      case 'Project/PaymentHistoryFailure':
        status = ProjectReducer.status;
        break;
    }
  }

  return (
    <View style={styles.mainContainer}>
      <Header
        onHeaderPress={() => NavigationService.navigate('Profile')}
        menuTxt={'Payment'}
      />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          {/* ////////////////// Tab Change ///////////////// */}
          <View style={[css.rowBetween, css.mx4]}>
            <TouchableOpacity
              onPress={() => setSelect('pending')}
              style={[
                styles.tabContainer,
                {
                  backgroundColor:
                    select == 'pending'
                      ? Colors.themeGreen
                      : Colors.themeBackground,
                },
              ]}>
              <Text
                style={[
                  styles.boldTxt,
                  {
                    color:
                      select == 'pending'
                        ? Colors.themeWhite
                        : Colors.themeGreen,
                  },
                ]}>
                Pending Payment
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelect('complete')}
              style={[
                styles.tabContainer,
                {
                  backgroundColor:
                    select == 'complete'
                      ? Colors.themeGreen
                      : Colors.themeBackground,
                },
              ]}>
              <Text
                style={[
                  styles.boldTxt,
                  {
                    color:
                      select == 'complete'
                        ? Colors.themeWhite
                        : Colors.themeGreen,
                  },
                ]}>
                History
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[css.f1, css.px3]}>
            {select == 'pending' ? (
              <FlatList
                data={pendingList}
                renderItem={renderPendingPayment}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => (
                  <View style={{height: normalize(10)}} />
                )}
                contentContainerStyle={{
                  marginTop: normalize(15),
                  paddingBottom:
                    Platform.OS == 'ios' ? normalize(80) : normalize(150),
                }}
                onEndReached={() => {
                  if (ProjectReducer?.PendingPaymentResponse?.pages > page) {
                    setPage(page + 1);
                  }
                }}
                ListEmptyComponent={() => {
                  return (
                    <>
                      {ProjectReducer.status !=
                        'Project/PendingPaymentRequest' && (
                        <View
                          style={{
                            alignItems: 'center',
                            marginTop: normalize(30),
                          }}>
                          <Text style={styles.projectTitle}>
                            No Pending Payment Found !!
                          </Text>
                        </View>
                      )}
                    </>
                  );
                }}
              />
            ) : (
              <FlatList
                data={paymentList}
                renderItem={historyRender}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => (
                  <View style={{height: normalize(5)}} />
                )}
                contentContainerStyle={{
                  marginTop: normalize(15),
                  paddingBottom:
                    Platform.OS == 'ios' ? normalize(100) : normalize(150),
                }}
                onEndReached={() => {
                  if (ProjectReducer?.PendingPaymentResponse?.pages > page1) {
                    setPage1(page1 + 1);
                  }
                }}
                ListEmptyComponent={() => {
                  return (
                    <>
                      {ProjectReducer.status !=
                        'Project/PaymentHistoryRequest' && (
                        <View
                          style={{
                            alignItems: 'center',
                            marginTop: normalize(30),
                          }}>
                          <Text style={styles.projectTitle}>
                            No Payment Found !!
                          </Text>
                        </View>
                      )}
                    </>
                  );
                }}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default PaymentTab;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    flex: 1,
    // backgroundColor: Colors.themeBackground,
  },
  tabContainer: {
    padding: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    marginTop: normalize(15),
    width: '48%',
    borderRadius: normalize(10),
    borderColor: Colors.themeBoxBorder,
  },
  boldTxt: {
    fontSize: normalize(14),
    fontFamily: Fonts.FustatSemiBold,
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
  commonInactiveTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    color: Colors.themeInactiveTxt,
    lineHeight: normalize(22),
  },
  buttonFillColor: {
    backgroundColor: Colors.themeGreen,
    borderRadius: normalize(8),
    marginTop: normalize(5),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(6),
    flexGrow: 1,
    margin: normalize(10),
  },
  buttonFillColorTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    color: Colors.themeWhite,
    lineHeight: normalize(22),
    textTransform: 'uppercase',
  },
  commonTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    color: Colors.themeBlack,
    lineHeight: normalize(22),
  },
  buttonWithBorder: {
    borderColor: Colors.themeBlack,
    borderWidth: 1,
    borderRadius: normalize(8),
    marginTop: normalize(5),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(5),
    flexGrow: 1,
    margin: normalize(10),
  },
  buttonWithBorderTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    color: Colors.themeBlack,
    lineHeight: normalize(22),
    textTransform: 'uppercase',
  },
  historyContainer: {
    backgroundColor: Colors.themeWhite,
    marginTop: normalize(5),
    borderRadius: normalize(10),
    padding: normalize(10),
    flexDirection: 'row',
  },
  profileImg: {
    height: normalize(40),
    width: normalize(40),
    borderRadius: normalize(40 / 2),
  },
  nameStyle: {
    fontSize: normalize(12),
    fontFamily: Fonts.FustatSemiBold,
    color: Colors.themeBlack,
  },
  timeStyle: {
    fontFamily: Fonts.FustatRegular,
    color: Colors.themeInactiveTxt,
  },
  countContainer: {
    backgroundColor: Colors.themeYellow,
    paddingHorizontal: normalize(4),
    borderRadius: normalize(10),
  },
});
