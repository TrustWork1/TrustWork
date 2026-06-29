import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {useEffect, useRef, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../components/Header';
import {messageListRequest} from '../../redux/reducer/ChatReducer';
import css from '../../themes/css';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import constants from '../../utils/helpers/constants';
import normalize from '../../utils/helpers/normalize';
import showErrorAlert from '../../utils/helpers/Toast';
import connectionrequest from '../../utils/helpers/NetInfo';
let status = '';

const ClientChat = props => {
  const scrollRef = useRef(null);
  const listRef = useRef();
  const [refreshing1, setrefreshing1] = useState(false);
  const userdata = props?.route?.params?.data;
  const [otherUser, setOtherUser] = useState({});

  const [msg, setMsg] = useState('');
  const [chatWithMe, setChatWithMe] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  // Use a ref so sendMsg always accesses the live socket instance
  const socketRef = useRef(null);
  // Reconnect attempt counter ref
  const reconnectTimeout = useRef(null);

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const ChatReducer = useSelector(state => state.ChatReducer);
  const AuthReducer = useSelector(state => state.AuthReducer);
  const roomId =
    props?.route?.params?.type != undefined
      ? ChatReducer?.createChatRoomResponse?.data?.id
      : userdata?.id;

  console.log('roomId --->', roomId, '| type:', props?.route?.params?.type, '| userdata?.id:', userdata?.id);
  console.log('otherUser--->', otherUser, userdata);

  useEffect(() => {
    if (!Object.keys(otherUser)?.length > 0) {
      AuthReducer?.ProfileResponse?.data?.id !=
      props?.route?.params?.data?.user2?.id
        ? setOtherUser(props?.route?.params?.data?.user2)
        : setOtherUser(props?.route?.params?.data?.user1);
    }
  }, [props?.route?.params?.data]);

  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(messageListRequest(roomId));
      })
      .catch(() => {
        showErrorAlert('Please connect to the internet');
      });
  }, [isFocused, page]);

  // Connect socket — only depends on roomId, not isFocused
  // so it doesn't reconnect every time the screen gains/loses focus
  const connectSocket = () => {
    if (!roomId) return;

    // Don't create a new socket if one is already open or connecting
    if (
      socketRef.current &&
      (socketRef.current.readyState === WebSocket.OPEN ||
        socketRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    console.log('Connecting WebSocket to:', constants?.SOCKET_URL + roomId + '/');
    const ws = new WebSocket(constants?.SOCKET_URL + roomId + '/');
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected ✓');
      setIsSocketConnected(true);
      // Clear any pending reconnect timer
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }
    };

    ws.onmessage = event => {
      try {
        const newMsg = JSON.parse(event.data);
        console.log('Message received:', newMsg);
        if (newMsg?.message) {
          setChatWithMe(prev => [...prev, newMsg.message]);
          setTimeout(() => {
            scrollRef.current?.scrollToEnd({animated: true});
          }, 500);
        }
      } catch (e) {
        console.log('Failed to parse message:', e);
      }
    };

    ws.onerror = error => {
      console.log('WebSocket error:', error);
      setIsSocketConnected(false);
    };

    ws.onclose = event => {
      console.log('WebSocket closed. Code:', event.code, 'Reason:', event.reason);
      setIsSocketConnected(false);
      socketRef.current = null;
      // Auto-reconnect after 3 seconds if screen is still focused
      reconnectTimeout.current = setTimeout(() => {
        console.log('Attempting to reconnect WebSocket...');
        connectSocket();
      }, 3000);
    };
  };

  // Connect on mount and when roomId becomes available
  useEffect(() => {
    if (!roomId) return;
    connectSocket();

    return () => {
      // Clear reconnect timer
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }
      // Close socket on unmount
      if (
        socketRef.current &&
        (socketRef.current.readyState === WebSocket.OPEN ||
          socketRef.current.readyState === WebSocket.CONNECTING)
      ) {
        socketRef.current.close();
      }
      socketRef.current = null;
      setIsSocketConnected(false);
    };
  }, [roomId]);

  const sendMsg = () => {
    if (msg?.trim() == '') {
      showErrorAlert('Please enter message');
      return;
    }

    const ws = socketRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = {
        user_id: AuthReducer?.ProfileResponse?.data?.id,
        message: msg,
        room_id:
          userdata?.id == undefined
            ? ChatReducer?.createChatRoomResponse?.data?.id
            : userdata?.id,
      };
      console.log('Sending message:', message);
      ws.send(JSON.stringify(message));
      setMsg('');
    } else {
      // Socket is still connecting — retry once after a short delay
      if (ws && ws.readyState === WebSocket.CONNECTING) {
        console.log('Socket still connecting, retrying in 1s...');
        setTimeout(() => sendMsg(), 1000);
      } else {
        console.log('Socket not connected. readyState:', ws?.readyState, '— reconnecting...');
        connectSocket();
        showErrorAlert('Reconnecting... please try again in a moment.');
      }
    }
  };

  const render_Chat = ({item, index}) => {
    return (
      <>
        {item?.sender_id != AuthReducer?.ProfileResponse?.data?.id ? (
          <View style={[css.row, css.aic, css.mt1]}>
            <Image
              source={
                item.sender_pic == null
                  ? Icons.UserPro
                  : {uri: constants.IMAGE_URL + '/media/' + item.sender_pic}
              }
              style={[styles.profileImg]}
            />
            <View style={[css.ml5]}>
              <View style={[styles.myMsgContainer]}>
                <Text style={[styles.timeStyle, css.fs11]}>
                  {item?.message}
                </Text>
              </View>
              <Text style={[styles.timeStyle, css.mt1, css.fs10]}>
                {moment(item?.created_at).format('hh:mm A')}
              </Text>
            </View>
          </View>
        ) : (
          <View style={[css.row, css.aic, css.jcfe, css.mt1]}>
            <View style={[css.mr5, css.aife]}>
              {item?.type == 'img' ? (
                <Image source={item?.msg} style={[styles.imageStyle]} />
              ) : (
                <View style={[styles.otherMsgContainer]}>
                  <Text style={[styles.timeStyle, css.fs11]}>
                    {item?.message}
                  </Text>
                </View>
              )}
              <Text style={[styles.timeStyle, css.mt1, css.fs10]}>
                {moment(item?.created_at).format('hh:mm A')}
              </Text>
            </View>
            <Image
              source={
                AuthReducer?.ProfileResponse?.data?.profile_picture == ''
                  ? Icons.profileImg
                  : {
                      uri:
                        constants.IMAGE_URL +
                        AuthReducer?.ProfileResponse?.data?.profile_picture,
                    }
              }
              style={[styles.profileImg]}
            />
          </View>
        )}
      </>
    );
  };

  if (status == '' || ChatReducer.status != status) {
    switch (ChatReducer.status) {
      case 'Chat/messageListRequest':
        status = ChatReducer.status;
        break;
      case 'Chat/messageListSuccess':
        status = ChatReducer.status;
        setChatWithMe(ChatReducer?.messageListResponse?.data);
        setTimeout(() => {
          scrollRef.current?.scrollToEnd({animated: true});
        }, 1000);
        break;
      case 'Chat/messageListFailure':
        status = ChatReducer.status;
        break;
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <View style={styles.mainContainer}>
        <Header
          messageProfile={
            otherUser != undefined
              ? {
                  uri: constants?.IMAGE_URL + otherUser?.profile_picture,
                }
              : {
                  uri: constants?.IMAGE_URL + userdata?.profile_picture,
                }
          }
          // backIcon={Icons.BackIcon}
          title={
            otherUser != undefined ? otherUser?.full_name : userdata?.full_name
          }
          subTitle={''}
          isTyping
        />

        {/* <SafeAreaView style={[styles.mainContainer, css.mt75]}> */}
        <View style={styles.container}>
          <View style={[css.fg1, css.jcfe]}>
            <View style={[css.mb9, css.mt75]}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                ref={scrollRef}
                style={[css.fg1, css.mb2, css.mt3]}>
                <View style={[css.px3, css.mb5]}>
                  {chatWithMe.map((item, index) => render_Chat({item, index}))}
                  {/* <FlatList
                      data={chatWithMe}
                      ref={scrollRef}
                      renderItem={render_Chat}
                      keyExtractor={(item, index) => index.toString()}
                      showsVerticalScrollIndicator={false}
                      style={[css.fg1]}
                      // extraData={}
                    /> */}
                </View>
              </ScrollView>
              {/* Connection status indicator */}
              {!isSocketConnected && (
                <View style={{
                  backgroundColor: '#FF6B6B',
                  paddingVertical: normalize(4),
                  paddingHorizontal: normalize(12),
                  marginHorizontal: normalize(15),
                  borderRadius: normalize(8),
                  marginBottom: normalize(6),
                  alignItems: 'center',
                }}>
                  <Text style={{color: '#fff', fontSize: normalize(11)}}>
                    Connecting to chat...
                  </Text>
                </View>
              )}
              {/* /////////////// message box ////////////// */}
              <View
                style={{
                  backgroundColor: Colors.themeWhite,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: normalize(12),
                  // alignSelf: 'flex-end',
                  marginHorizontal: normalize(15),
                  borderRadius: normalize(30),
                  marginBottom: normalize(30),
                }}>
                <View style={[css.row, css.aic]}>
                  <TouchableOpacity>
                    <Image
                      source={Icons.attechment}
                      style={[styles.attechmentStyle]}
                    />
                  </TouchableOpacity>
                  <TextInput
                    height={normalize(30)}
                    width={'70%'}
                    value={msg}
                    onChangeText={val => setMsg(val)}
                    paddingHorizontal={normalize(15)}
                    placeholder="Type a message"
                    placeholderTextColor={'#1D1D1F'}
                    fontSize={normalize(13)}
                    style={{
                      color: Colors.themeBlack,
                      backgroundColor: Colors.themeWhite,
                      paddingVertical: normalize(5),
                    }}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => sendMsg()}>
                  <Image source={Icons.sendMsg} style={[styles.sendStyle]} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        {/* </SafeAreaView> */}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ClientChat;

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
  profileImg: {
    height: normalize(20),
    width: normalize(20),
    borderRadius: normalize(20),
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: normalize(18),
  },
  timeStyle: {
    fontFamily: Fonts.FustatRegular,
    color: Colors.themeInactiveTxt,
  },
  myMsgContainer: {
    padding: normalize(12),
    backgroundColor: Colors.themeWhite,
    borderTopRightRadius: normalize(10),
    borderTopLeftRadius: normalize(10),
    borderBottomRightRadius: normalize(10),
    maxWidth: '100%',
  },
  otherMsgContainer: {
    padding: normalize(12),
    backgroundColor: Colors.themeWhite,
    borderTopRightRadius: normalize(10),
    borderTopLeftRadius: normalize(10),
    borderBottomLeftRadius: normalize(10),
    // maxWidth: '90%',
  },
  imageStyle: {
    height: normalize(100),
    width: normalize(140),
    // borderTopLeftRadius: normalize(10),
    resizeMode: 'contain',
  },
  attechmentStyle: {
    height: normalize(20),
    width: normalize(20),
    resizeMode: 'contain',
    marginLeft: normalize(15),
  },
  sendStyle: {
    height: normalize(30),
    width: normalize(30),
    resizeMode: 'contain',
  },
});
