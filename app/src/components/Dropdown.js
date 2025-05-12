import React, {useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {Colors, Fonts, Icons} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';

const Dropdown = props => {
  const [customModelVisible, setCustomModelVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayList, setDisplayList] = useState([]);
  const [codeList, setCodeList] = useState([]);

  const filteredData = props?.data?.filter(item =>
    item?.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const noCodeData = props?.data?.filter(
    item => item?.title?.toLowerCase().includes(searchQuery.toLowerCase()),
    // item?.dial_code?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderItem = (item, index) => {
    // console.log(item);
    return (
      <TouchableOpacity
        onPress={() => {
          props.onChange(item, index);
          setSearchQuery('');
          setCustomModelVisible(!customModelVisible);
        }}
        style={styles.listMainContainer}>
        <View style={styles.titleTextContainer}>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={styles.modalContainerTxt}>
            {props?.isPhone
              ? `${item?.dial_code} (${item?.title})`
              : item?.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const clearData = () => {
    // props.onChange('', -1);
    setSearchQuery('');
    setCustomModelVisible(!customModelVisible);
  };

  return (
    <View
      style={{
        marginTop: props.marginTop,
      }}>
      <Text
        style={{
          color: Colors.themeBlack,
          fontFamily: Fonts.FustatMedium,
          textAlign: 'left',
          // top: Platform.OS === 'ios' ? 0 : normalize(12),
          paddingBottom: normalize(2),
          fontSize: 14,
          lineHeight: normalize(22),
          marginLeft: props.marginLeft,
        }}>
        {props.label}
      </Text>

      <View
        style={{
          height: props.height,
          width: props.width,
          flexDirection: 'row',
          borderTopRightRadius: props.borderTopRightRadius,
          borderBottomRightRadius: props.borderBottomRightRadius,
          borderTopLeftRadius: props.borderTopLeftRadius,
          borderBottomLeftRadius: props.borderBottomLeftRadius,
          borderColor: props.borderColor,
          borderRadius: props.borderRadius,
          borderWidth: props.borderWidth,
          justifyContent: 'space-between',
          alignSelf: 'center',
          alignItems: props.alignItems ? props.alignItems : 'center',
          paddingLeft: props.paddingLeft,
          paddingRight: props.paddingRight,
        }}>
        {/* <View style={{alignItems: 'flex-start'}}>
        {props.show ? (
          <View
            style={
              Platform.OS === 'ios'
                ? {
                    height: normalize(20),
                    width: props.outlineTxtwidth && props.outlineTxtwidth,
                    position: 'absolute',
                    backgroundColor: props.backgroundColor
                      ? props.backgroundColor
                      : Colors.lightdark_White,
                    bottom: props.bottom ? props.bottom : normalize(13),
                    left: props.left ? props.left : 0,
                  }
                : {
                    height: normalize(20),
                    width: props.outlineTxtwidth && props.outlineTxtwidth,
                    position: 'absolute',
                    backgroundColor: props.backgroundColor
                      ? props.backgroundColor
                      : Colors.lightdark_White,
                    bottom: props.bottom ? props.bottom : normalize(15),
                    left: props.left ? props.left : 0,
                  }
            }>
            <Text
              style={{
                color: props.borderColor,
                fontFamily: Fonts.RobotoMedium,
                textAlign: 'center',
              }}>
              {props.label}
            </Text>
          </View>
        ) : null}
      </View> */}

        <TouchableOpacity
          disabled={props?.disabled || false}
          onPress={() => setCustomModelVisible(!customModelVisible)}
          style={[
            styles.dropdownContainer,
            {
              height: props.height ? props.height : normalize(33),
              // paddingHorizontal: props.paddingHorizontal,
            },
          ]}>
          {/* {props.show && (
            <Text
              style={{
                color: props.placeholderTextColor,
                fontFamily: Fonts.FustatMedium,
                textAlign: 'left',
                top: Platform.OS === 'ios' ? 0 : normalize(2),
                paddingBottom: normalize(3),
                fontSize: 11,
                lineHeight: normalize(13),
              }}>
              {props.label}
            </Text>
          )} */}
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={[
                styles.placeholderStyle,
                {
                  color: props.value
                    ? props.valueColor
                    : props.placeholderTextColor
                    ? props.placeholderTextColor
                    : Colors.themeGray,
                },
              ]}>
              {props.value ? props.value : props.placeholder}
            </Text>
            <View
              style={{
                position: 'absolute',
                alignSelf: 'center',
                right: normalize(15),
                // bottom: props.value ? normalize(4) : null,
              }}>
              <Image
                source={Icons.DownArrow}
                resizeMode="contain"
                style={{
                  height: normalize(18),
                  width: normalize(18),
                }}
              />
            </View>
          </View>
        </TouchableOpacity>

        <Modal
          propagateSwipe
          transparent={true}
          visible={customModelVisible}
          backdropOpacity={0}
          useNativeDriverForBackdrop={true}
          animationIn={'slideInDown'}
          animationOut={'slideOutDown'}
          useNativeDriver={true}
          animationType="slide"
          swipeDirection={['down']}
          avoidKeyboard={true}
          style={{
            justifyContent: 'center',
            margin: 0,
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}
          onBackButtonPress={() => clearData()}
          onBackdropPress={() => clearData()}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={{marginBottom: normalize(10)}}
              onPress={() => clearData()}>
              <Image source={Icons.Cross} style={styles.crossIcon} />
            </TouchableOpacity>

            <View
              style={[
                styles.modalMainContainer,
                {
                  height: props.modalHeight ? props.modalHeight : '60%',
                },
              ]}>
              {props?.isSerachBar && (
                <View style={styles.searchBoxContainer}>
                  <TextInput
                    placeholder="Search..."
                    placeholderTextColor={props.placeholderTextColor}
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text?.trimStart())}
                    style={styles.searchBox}
                  />
                </View>
              )}
              <View
                style={{
                  flex: 1,
                }}>
                <FlatList
                  showsVerticalScrollIndicator={true}
                  onEndThreshold={0}
                  data={props?.isPhone ? noCodeData : filteredData}
                  contentContainerStyle={{
                    paddingVertical: normalize(5),
                    marginHorizontal: normalize(5),
                  }}
                  ItemSeparatorComponent={() => (
                    <View style={{height: normalize(10)}} />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => renderItem(item, index)}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  placeholderStyle: {
    fontFamily: Fonts.FustatMedium,
    fontSize: 14,
    lineHeight: normalize(15),
    textAlign: 'left',
    marginRight: '15%',
  },

  dropdownContainer: {
    width: '100%',
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  modalContainer: {
    // flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  crossIcon: {
    width: normalize(30),
    height: normalize(30),
    tintColor: Colors.themeGreen,
  },
  modalMainContainer: {
    //flex: 1,

    width: '90%',
    backgroundColor: Colors.themeWhite,
    borderRadius: 10,
    paddingTop: normalize(15),
    paddingHorizontal: normalize(15),
    // shadowColor: Colors.black1,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
    paddingBottom: normalize(15),
  },
  modalContainerTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    lineHeight: normalize(16),
    // textAlign: 'center',
    color: Colors.themeBlack,
    paddingVertical: normalize(6),
  },
  modalContainerDivider: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.themeBoxBorder,
    paddingBottom: normalize(10),
    //marginBottom: normalize(10),
  },
  listMainContainer: {
    height: normalize(50),
    width: '100%',
    flexDirection: 'row',
    backgroundColor: Colors.themeWhite,
    borderRadius: 12,
    paddingHorizontal: normalize(8),
    shadowColor: Colors.themeGray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  listImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  titleTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBoxContainer: {
    width: '100%',
    paddingBottom: normalize(10),
  },
  searchBox: {
    height: normalize(50),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.themeBoxBorder,
    paddingHorizontal: normalize(10),
    backgroundColor: Colors.themeWhite,
    fontFamily: Fonts.FustatMedium,
    color: Colors.themeBlack,
  },
});
