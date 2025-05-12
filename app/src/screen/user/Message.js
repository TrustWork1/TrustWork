import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../components/Header';
import MsgListCard from '../../components/Micro/MsgListCard';
import NavigationService from '../../navigators/NavigationService';
import {chatUserListRequest} from '../../redux/reducer/ChatReducer';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import {height} from '../../themes/css';
import connectionrequest from '../../utils/helpers/NetInfo';
import showErrorAlert from '../../utils/helpers/Toast';
import constants from '../../utils/helpers/constants';

const Message = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const ChatReducer = useSelector(state => state.ChatReducer);
  const AuthReducer = useSelector(state => state.AuthReducer);

  useEffect(() => {
    if (isFocused) {
      connectionrequest()
        .then(() => {
          dispatch(chatUserListRequest());
        })
        .catch(err => {
          showErrorAlert('Please connect to the internet');
        });
    }
  }, [isFocused]);

  const userListRender = (item, index) => {
    let userdata =
      AuthReducer?.ProfileResponse?.data?.id == item?.user1?.id
        ? item?.user2
        : item?.user1;
    return (
      <>
        <MsgListCard
          Img={
            userdata?.profile_picture == null
              ? Icons.UserPro
              : {uri: constants?.IMAGE_URL + userdata?.profile_picture}
          }
          name={userdata?.full_name}
          msg={item?.last_message_details?.message}
          time={moment(item?.last_message_details?.updated_at).format(
            'hh:mm A',
          )}
          count={item?.count}
          onPress={() => {
            NavigationService?.navigate('ClientChat', {data: item});
          }}
        />
      </>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Header
        onHeaderPress={() => NavigationService.navigate('Profile')}
        menuTxt={'Message'}
      />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          <View style={{flexGrow: 1, paddingHorizontal: normalize(10)}}>
            <FlatList
              data={ChatReducer?.chatUserListResponse?.data}
              renderItem={({item, index}) => userListRender(item, index)}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: normalize(120),
                marginTop: normalize(10),
              }}
              ListEmptyComponent={
                <>
                  {ChatReducer.status !== 'Chat/chatUserListRequest' && (
                    <View
                      style={{
                        height: height - 250,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: normalize(12),
                          color: Colors.themeBlack,
                          fontFamily: Fonts.FustatMedium,
                        }}>
                        No Chat list Found
                      </Text>
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

export default Message;

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
});
