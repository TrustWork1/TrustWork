import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../components/Header';
import MsgListCard from '../components/Micro/MsgListCard';
import {notificationRequest} from '../redux/reducer/ProfileReducer';
import {Colors, Fonts, Icons} from '../themes/Themes';
import constants from '../utils/helpers/constants';
import Loader from '../utils/helpers/Loader';
import connectionrequest from '../utils/helpers/NetInfo';
import normalize from '../utils/helpers/normalize';

let status = '';

const Notification = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const ProfileReducer = useSelector(state => state.ProfileReducer);

  const [notificationsData, setNotificationsData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState('');

  useEffect(() => {
    getNotificationList();
  }, []);

  const getNotificationList = count => {
    let obj = {
      perpage: 10,
      page: count ? count : page,
    };
    connectionrequest()
      .then(() => {
        dispatch(notificationRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  if (status == '' || ProfileReducer.status != status) {
    switch (ProfileReducer.status) {
      case 'Profile/notificationRequest':
        status = ProfileReducer.status;
        break;
      case 'Profile/notificationSuccess':
        status = ProfileReducer.status;

        setNotificationsData(
          page === 1
            ? [...ProfileReducer?.notificationResponse?.data]
            : [
                ...notificationsData,
                ...ProfileReducer?.notificationResponse?.data,
              ],
        );
        setTotalCount(ProfileReducer?.notificationResponse?.total);
        break;
      case 'Profile/notificationFailure':
        status = ProfileReducer.status;
        //showErrorAlert( AuthReducer?.error?.message);
        break;
    }
  }

  const renderItem = (item, index) => {
    return (
      <>
        <MsgListCard
          Img={{uri: `${constants.IMAGE_URL}${item?.sender?.profile_picture}`}}
          name={item?.sender?.full_name}
          msg={item?.message}
          time={moment(item?.created_at).format('hh:mm A')}
          onPress={() => {}}
        />
      </>
    );
  };

  const listEmptyComponent = () => {
    return (
      <View
        style={[
          styles.headerContainer,
          {alignItems: 'center', justifyContent: 'center'},
        ]}>
        <Text
          style={{
            fontSize: normalize(12),
            fontFamily: Fonts.FustatSemiBold,
            color: Colors.themeBlack,
          }}>
          {'No Notification Found!'}
        </Text>
      </View>
    );
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const fetchNotificationData = () => {
    if (totalCount !== notificationsData.length) {
      setPage(page + 1);
      getNotificationList(page + 1);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Loader
        visible={ProfileReducer?.status == 'Profile/notificationRequest'}
      />
      <Header backIcon={Icons.BackIcon} headerTitle={'Notification'} />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          <FlatList
            data={notificationsData}
            contentContainerStyle={styles.flatlistContianer}
            // scrollEventThrottle={16}
            // onMomentumScrollEnd={e => {
            //   if (isCloseToBottom(e.nativeEvent)) {
            //     fetchNotificationData();
            //   }
            // }}
            ListEmptyComponent={() => listEmptyComponent()}
            // ItemSeparatorComponent={() => (
            //   <View style={{height: normalize(10)}} />
            // )}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => renderItem(item, index)}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Notification;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    height: '100%',
    width: '100%',
  },
  flatlistContianer: {
    paddingTop: normalize(10),
    paddingHorizontal: normalize(10),
    paddingBottom: normalize(30),
  },
  headerContainer: {
    paddingTop: normalize(15),
    paddingHorizontal: normalize(15),
  },
});
