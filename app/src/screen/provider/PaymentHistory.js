import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import NavigationService from '../../navigators/NavigationService';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import css from '../../themes/css';
import {paymentHistory} from '../../utils/helpers/DataStore';
import normalize from '../../utils/helpers/normalize';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {ProviderPaymentListRequest} from '../../redux/reducer/ProjectReducer';
import Images from '../../themes/Images';
import constants from '../../utils/helpers/constants';
import moment from 'moment';
import Loader from '../../utils/helpers/Loader';
let status = '';
const PaymentHistory = props => {
  const [page, setPage] = useState(1);
  const [serachtext, setSearchtext] = useState('');
  const [paymentList, setPaymentList] = useState([]);

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const ProjectReducer = useSelector(state => state.ProjectReducer);

  useEffect(() => {
    PaymentHistoryFun();
  }, [isFocused, page]);

  const PaymentHistoryFun = text => {
    dispatch(
      ProviderPaymentListRequest({
        page: page,
        limit: 10,
        keyword_search: text || '',
      }),
    );
  };

  const paymentHistoryRender = ({item, index}) => {
    // console.log(item);
    return (
      <>
        <TouchableOpacity onPress={() => {}} style={[styles.msgContainer]}>
          <Image
            source={
              item?.project?.client?.profile_picture
                ? {
                    uri:
                      constants?.IMAGE_URL +
                      item?.project?.client?.profile_picture,
                  }
                : Images.User_1
            }
            // source={item?.project?.client?.profile_picture}
            style={[styles.profileImg]}
          />
          <View style={[css.ml2, css.f1]}>
            <View style={[css.aic, css.row, css.jcsb, css.f1]}>
              <Text style={[styles.nameStyle]}>
                {item?.project?.client?.full_name}
              </Text>
              <Text style={[styles.nameStyle]}>
                ${item?.project?.project_total_cost}
              </Text>
            </View>
            <View style={[css.aic, css.row, css.jcsb, css.f1]}>
              <Text style={[styles.timeStyle, css.fs11]}>
                {item?.project?.project_title}
              </Text>

              <Text style={[styles.dateTxt]}>
                {moment(item?.created_at).format('ll')}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const searchProject = text => {
    if (text.length >= 0) {
      PaymentHistoryFun(text);
      setSearchtext(text);
    } else {
      setSearchtext(text);
    }
  };

  if (status == '' || ProjectReducer.status != status) {
    switch (ProjectReducer.status) {
      case 'Project/ProviderPaymentListRequest':
        status = ProjectReducer.status;
        if (page == 1) {
          setPaymentList([]);
        }
        break;
      case 'Project/ProviderPaymentListSuccess':
        status = ProjectReducer.status;
        ProjectReducer?.ProviderPaymentListResponse?.data?.length > 0
          ? paymentList?.length < 1
            ? setPaymentList(ProjectReducer?.ProviderPaymentListResponse?.data)
            : setPaymentList([
                ...paymentList,
                ...ProjectReducer?.ProviderPaymentListResponse?.data,
              ])
          : setPage(1);

        break;
      case 'Project/ProviderPaymentListFailure':
        status = ProjectReducer.status;
        break;
    }
  }

  return (
    <View style={styles.mainContainer}>
      <Header backIcon={Icons.BackIcon} headerTitle={'Payment History'} />
      <SafeAreaView style={styles.mainContainer}>
        {/* <Loader
          visible={
            ProjectReducer.status == 'Project/ProviderPaymentListRequest'
          }
        /> */}
        <View style={styles.container}>
          <View style={[css.px3, css.mt3]}>
            {/* <View style={styles.searchContainer}>
              <TextInput
                placeholder="Search "
                placeholderTextColor={Colors.themeBlack}
                fontFamily={Fonts.FustatMedium}
                textAlign="left"
                autoCapitalize="none"
                value={serachtext}
                onChangeText={text => searchProject(text?.trimStart())}
                style={styles.searchInputContainer}
              />
            </View> */}
            <View>
              <View style={[css.fg1]}>
                <FlatList
                  data={paymentList}
                  renderItem={paymentHistoryRender}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[{paddingBottom: normalize(150)}]}
                  onEndReachedThreshold={0.1}
                  onEndReached={() => {
                    if (
                      ProjectReducer?.ProviderPaymentListResponse?.pages >
                        page &&
                      ProjectReducer.status !=
                        'Project/ProviderPaymentListRequest'
                    ) {
                      setPage(page + 1);
                    }
                  }}
                  ListEmptyComponent={
                    <>
                      {ProjectReducer.status !==
                        'Project/ProviderPaymentListRequest' && (
                        <View
                          style={{
                            alignItems: 'center',
                            marginTop: normalize(30),
                          }}>
                          <Text style={styles.projectTitle}>
                            No payment Found
                          </Text>
                        </View>
                      )}
                    </>
                  }
                  ListFooterComponent={
                    <>
                      {ProjectReducer.status ==
                        'Project/ProviderPaymentListRequest' && (
                        <View style={[css.aic, css.jcc, css.f1, css.mt2]}>
                          <ActivityIndicator
                            size={'large'}
                            color={Colors.themeGreen}></ActivityIndicator>
                        </View>
                      )}
                    </>
                  }
                  // style={[css.f1]}
                />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default PaymentHistory;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.themeBackground,
  },
  msgContainer: {
    backgroundColor: Colors.themeWhite,
    marginTop: normalize(10),
    borderRadius: normalize(10),
    padding: normalize(10),
    flexDirection: 'row',
  },
  profileImg: {
    height: normalize(38),
    width: normalize(38),
    borderRadius: normalize(20),
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
  dateTxt: {
    fontSize: normalize(11),
    color: Colors.themeInactiveTxt,
    fontFamily: Fonts.FustatRegular,
  },
  searchContainer: {
    width: '100%',
    height: normalize(45),
    backgroundColor: Colors.themeWhite,
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
  projectTitle: {
    color: Colors.themeBlack,
    fontSize: normalize(13),
    fontFamily: Fonts.FustatSemiBold,
    textTransform: 'capitalize',
  },
});
