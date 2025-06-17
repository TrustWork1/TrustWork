import React, {useState} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Colors, Fonts, Icons} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';

const CustomDatePicker = props => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  function handleConfirm(date) {
    if (props.handleConfirm) {
      props.handleConfirm(date);
      setDatePickerVisibility(false);
    }
  }

  return (
    <View
      style={{
        height: props.height,
        flexDirection: 'row',
        width: props.width,
        borderRadius: props.borderRadius,
        borderWidth: props.show ? props.borderWidth : null,
        backgroundColor: props.backgroundColor,
        marginTop: props.marginTop,
        marginLeft: props.marginLeft,
        borderColor: props.show && props.borderColor,
        alignSelf: 'center',
        alignItems: props.alignItems ? props.alignItems : 'center',
        paddingLeft: props.paddingLeft,
        paddingRight: props.paddingRight,
        borderTopRightRadius: props.borderTopRightRadius,
        borderBottomRightRadius: props.borderBottomRightRadius,
        borderTopLeftRadius: props.borderTopLeftRadius,
        borderBottomLeftRadius: props.borderBottomLeftRadius,
        justifyContent: 'space-between',
      }}>
      {/* {props.label && (
          <Text
            style={{
              color: Colors.gray3,
              fontFamily: Fonts.RobotoMedium,
              fontSize: 12,
              lineHeight: normalize(15),
              fontStyle: 'normal',
              fontWeight: '500',
              paddingVertical: normalize(5),
            }}>
            {props.label}
          </Text>
        )} */}
      {/* <View style={{alignItems: 'flex-start'}}>
        {props.show ? (
          <View
            style={
              Platform.OS === 'ios'
                ? {
                    height: normalize(20),
                    width: props.outlineTxtwidth,
                    position: 'absolute',
                    backgroundColor: Colors.lightdark_White,
                    bottom: props.bottom ? props.bottom : normalize(13),
                    left: props.left ? props.left : 0,
                  }
                : {
                    height: normalize(20),
                    width: props.outlineTxtwidth,
                    position: 'absolute',
                    backgroundColor: Colors.lightdark_White,
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
        disabled={props?.disabled == undefined ? false : props?.disabled}
        onPress={() => setDatePickerVisibility(true)}
        style={[
          styles.dropdownContainer,
          {height: props.height ? props.height : normalize(33)},
        ]}>
        {props.show && (
          <Text
            style={{
              color: props.placeholderTextColor,
              fontFamily: Fonts.VerdanaProMedium,
              textAlign: 'left',
              top: Platform.OS === 'ios' ? 0 : normalize(2),
              paddingBottom: normalize(3),
              fontSize: 11,
              lineHeight: normalize(13),
            }}>
            {props.label}
          </Text>
        )}
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
                  : Colors.gray,
              },
            ]}>
            {props.value ? props.value : props.placeholder}
          </Text>
          <View
            style={{
              position: 'absolute',
              alignSelf: 'center',
              right: normalize(10),
              bottom: props.value ? normalize(4) : null,
            }}>
            <Image
              source={Icons.Calendar}
              style={{
                resizeMode: 'contain',
                height: normalize(17),
                width: normalize(17),
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
      <View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          minimumDate={props.minimumDate}
          maximumDate={props.maximumDate}
          onConfirm={date => handleConfirm(date)}
          onCancel={() => setDatePickerVisibility(false)}
        />
      </View>
    </View>
  );
};

export default CustomDatePicker;

const styles = StyleSheet.create({
  placeholderStyle: {
    fontFamily: Fonts.VerdanaProMedium,
    fontSize: 14,
    lineHeight: normalize(15),
    textAlign: 'left',
    // textTransform: 'capitalize',
  },

  dropdownContainer: {
    width: '100%',
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
