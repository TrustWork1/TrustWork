import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import DataWithIcon from '../../components/Micro/DataWithIcon';
import {bidListRequest} from '../../redux/reducer/ProjectReducer';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import connectionrequest from '../../utils/helpers/NetInfo';
import normalize from '../../utils/helpers/normalize';
import showErrorAlert from '../../utils/helpers/Toast';

let status = '';

const CompletedBids = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const ProjectReducer = useSelector(state => state.ProjectReducer);

  const [CompletBidList, setCompletBidList] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (isFocused) {
      getbidList();
    }
  }, [isFocused, page]);

  const getbidList = () => {
    let obj = {
      page: page,
      limit: 5,
      status: 'completed',
    };
    connectionrequest()
      .then(() => {
        dispatch(bidListRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const listHeaderComponent = () => {
    return (
      <View
        style={{
          paddingVertical: normalize(10),
        }}>
        <Text
          style={{
            fontFamily: Fonts.FustatBold,
            fontSize: normalize(14),
            color: Colors.themeBlack,
          }}>
          Completed Bids
        </Text>
      </View>
    );
  };

  const completedBidsRender = ({item, index}) => {
    return (
      <View style={styles.listMainConatiner}>
        <View style={styles.lightContainer}>
          <View>
            <Text style={styles.projectTitle}>
              {item?.project?.project_title}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={Icons.LocationPin} style={styles.locationIcon} />
              <Text style={styles.greyTxt}>
                {item?.project?.project_address}
              </Text>
            </View>
          </View>
        </View>
        <View style={[{backgroundColor: Colors.themeWhite}]}>
          <View
            style={{
              paddingHorizontal: normalize(16),
              paddingVertical: normalize(8),
            }}>
            <View style={styles.commonConatiner}>
              <View style={{flex: 0.47}}>
                <DataWithIcon
                  img={Icons.dollar}
                  darkTxt={'Project Budget'}
                  lightTxt={`$${item?.project?.project_budget}`}
                />
              </View>
              <View style={{flex: 0.47}}>
                <DataWithIcon
                  img={Icons.status}
                  darkTxt={'Project Category'}
                  lightTxt={item?.project?.project_category?.title}
                />
              </View>
            </View>
            <View style={styles.commonConatiner}>
              <View style={{flex: 0.47}}>
                <DataWithIcon
                  img={Icons.profileCircle}
                  darkTxt={'Client Name'}
                  lightTxt={item?.project?.client_full_name}
                />
              </View>
              <View style={{flex: 0.47}}>
                <DataWithIcon
                  img={Icons.LocationPin}
                  darkTxt={'Client Location'}
                  lightTxt={item?.project?.project_address}
                />
              </View>
            </View>
            <View style={styles.commonConatiner}>
              <View style={{flex: 0.47}}>
                <DataWithIcon
                  img={Icons.bidAmount}
                  darkTxt={'Bid Amount'}
                  lightTxt={`$${item?.project_total_cost || 0}`}
                />
              </View>
              <View style={{flex: 0.47}}>
                <DataWithIcon
                  img={Icons.cal}
                  darkTxt={'Accepted Date'}
                  lightTxt={moment(item?.created_at).format('Do MMM, YYYY')}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (status == '' || ProjectReducer.status != status) {
    switch (ProjectReducer.status) {
      case 'Project/bidListRequest':
        status = ProjectReducer.status;
        if (page == 1) {
          setCompletBidList([]);
        }
        break;
      case 'Project/bidListSuccess':
        status = ProjectReducer.status;

        ProjectReducer?.bidListResponse?.data?.length > 0
          ? CompletBidList?.length < 1
            ? setCompletBidList(ProjectReducer?.bidListResponse?.data)
            : setCompletBidList([
                ...CompletBidList,
                ...ProjectReducer?.bidListResponse?.data,
              ])
          : setPage(1);

        break;
      case 'Project/bidListFailure':
        status = ProjectReducer.status;
        break;
    }
  }

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          <View>
            <FlatList
              data={ProjectReducer?.bidListResponse?.data}
              renderItem={completedBidsRender}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={() => listHeaderComponent()}
              ItemSeparatorComponent={() => (
                <View style={{height: normalize(10)}} />
              )}
              contentContainerStyle={[
                {
                  paddingHorizontal: normalize(10),
                  paddingBottom:
                    Platform.OS == 'ios' ? normalize(120) : normalize(160),
                },
              ]}
              onEndReached={() => {
                if (ProjectReducer?.bidListResponse?.pages > page) {
                  setPage(page + 1);
                }
              }}
              ListFooterComponent={
                <>
                  {ProjectReducer.status == 'Project/bidListRequest' && (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                      }}>
                      <ActivityIndicator
                        size={'large'}
                        color={Colors.themeGreen}
                      />
                    </View>
                  )}
                </>
              }
              ListEmptyComponent={
                <>
                  {ProjectReducer.status !== 'Project/bidListRequest' && (
                    <View
                      style={{
                        alignItems: 'center',
                        marginTop: normalize(30),
                      }}>
                      <Text style={styles.projectTitle}>No Bids Found</Text>
                    </View>
                  )}
                </>
              }
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CompletedBids;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    height: '100%',
    width: '100%',
  },

  listMainConatiner: {
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(14),
    overflow: 'hidden',
    flex: 1,
  },

  greyTxt: {
    fontFamily: Fonts.FustatRegular,
    fontSize: normalize(11),
    color: Colors.themeInactiveTxt,
    marginLeft: normalize(4),
  },
  locationIcon: {
    width: normalize(12),
    height: normalize(12),
    resizeMode: 'contain',
  },
  projectTitle: {
    color: Colors.themeBlack,
    fontSize: normalize(13),
    fontFamily: Fonts.FustatSemiBold,
    textTransform: 'capitalize',
  },
  statusTxt: {
    color: Colors.themeWhite,
    fontFamily: Fonts.FustatMedium,
    letterSpacing: normalize(0.5),
    fontSize: normalize(10),
  },
  statusContainer: {
    paddingHorizontal: normalize(10),
    height: normalize(20),
    backgroundColor: Colors.themeGreen,
    justifyContent: 'center',
    borderRadius: normalize(10),
  },
  lightContainer: {
    backgroundColor: Colors.themeProjectBackground,
    padding: normalize(14),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: normalize(15),
  },
  commonConatiner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(8),
  },
});
