import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../components/Header';
import MsgListCard from '../../components/Micro/MsgListCard';
import NavigationService from '../../navigators/NavigationService';
import {chatUserListRequest} from '../../redux/reducer/ChatReducer';
import css, {height} from '../../themes/css';
import {Colors, Icons} from '../../themes/Themes';
import constants from '../../utils/helpers/constants';
import Loader from '../../utils/helpers/Loader';
import connectionrequest from '../../utils/helpers/NetInfo';
import showErrorAlert from '../../utils/helpers/Toast';

let status = '';

const ProviderMessage = props => {
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

  const userListRender = ({item, index}) => {
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
            NavigationService?.navigate('Chat', {data: item});
          }}
        />
      </>
    );
  };

  if (status == '' || ChatReducer.status != status) {
    switch (ChatReducer.status) {
      case 'Chat/chatUserListRequest':
        status = ChatReducer.status;
        break;
      case 'Chat/chatUserListSuccess':
        status = ChatReducer.status;

        break;
      case 'Chat/chatUserListFailure':
        status = ChatReducer.status;
        break;
    }
  }
  return (
    <View style={styles.mainContainer}>
      <Header
        onHeaderPress={() => NavigationService.navigate('ProfileProvider')}
        menuTxt={'Message'}
      />
      <SafeAreaView style={styles.mainContainer}>
        <Loader visible={ChatReducer.status == 'Chat/chatUserListRequest'} />
        <View style={styles.container}>
          <View>
            <View>
              <View style={[css.fg1, css.px3]}>
                <FlatList
                  // data={UserList}
                  data={ChatReducer?.chatUserListResponse?.data}
                  renderItem={userListRender}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[{paddingBottom: normalize(120)}]}
                  // style={[css.f1]}
                  ListEmptyComponent={
                    <>
                      {ChatReducer.status != 'Chat/chatUserListRequest' && (
                        <View
                          style={[css.aic, css.jcc, {height: height - 250}]}>
                          <Text style={[css.txtStyle]}>No Chat list Found</Text>
                        </View>
                      )}
                    </>
                  }
                />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ProviderMessage;

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
