import React, {useState} from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Colors, Fonts, Icons} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';

export default function TextIn(props) {
  const [passwordVisible, setPasswordVisible] = useState(true);

  const [selection, setSelection] = useState({start: 0});
  const handleFocus = () => {
    setSelection(null);
  };
  const handleBlur = () => {
    setSelection({start: 0});
  };

  function onChangeText(text) {
    if (props.onChangeText) {
      props.onChangeText(text);
    }
  }

  function onSubmitEditing() {
    if (props.onSubmitEditing) {
      props.onSubmitEditing();
    }
  }

  function onPress() {
    if (props.onPress) {
      props.onPress();
    }
  }

  function onClosePress() {
    if (props.onClosePress) {
      props.onClosePress();
    }
  }

  return (
    <View
      style={{
        marginTop: props.marginTop,
      }}>
      {/* <View style={{alignItems: 'flex-start'}}>
        {props.show ? (
          <View
            style={
              Platform.OS === 'ios'
                ? {
                    height: normalize(20),
                    width: props.outlineTxtwidth,
                    position: 'absolute',
                    backgroundColor: Colors.themeBackground,
                    bottom: props.bottom ? props.bottom : normalize(13),
                  }
                : {
                    height: normalize(20),
                    width: props.outlineTxtwidth,
                    position: 'absolute',
                    backgroundColor: Colors.themeBackground,
                    bottom: props.bottom ? props.bottom : normalize(15),
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
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',

            //paddingHorizontal: !props.show ? normalize(10) : null,
          }}>
          {!props.show && props.placeholderIcon && (
            <View
              style={{
                paddingHorizontal: 5,
                marginLeft: normalize(20),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={props.placeholderIcon}
                resizeMode="contain"
                style={{
                  width: normalize(12),
                  height: normalize(12),
                  borderRadius: 3,
                }}
              />
            </View>
          )}

          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            {/* {props.show && (
            <Text
              style={{
                color: props.placeholderTextColor,
                fontFamily: Fonts.VerdanaProMedium,
                textAlign: 'left',
                top: Platform.OS === 'ios' ? 0 : normalize(12),
                paddingBottom: normalize(2),
                fontSize: 11,
                lineHeight: normalize(13),
              }}>
              {props.label}
            </Text>
          )} */}

            <TextInput
              ref={props.inputRef}
              // onFocus={() =>props.onFocus()?props.onFocus():false }
              // onBlur={() => (props.onBlur() ? props.onBlur() : false)}
              keyboardType={props.keyboardType}
              autoCorrect={false}
              placeholder={props.placeholder}
              placeholderTextColor={props.placeholderTextColor}
              maxLength={props.maxLength}
              fontFamily={props.fonts}
              value={props.value}
              secureTextEntry={
                passwordVisible ? props.isVisible : !props.isVisible
              }
              onChangeText={text => onChangeText(text)}
              onSubmitEditing={() => onSubmitEditing()}
              multiline={props.multiline}
              autoCapitalize="none"
              returnKeyType={props.returnKeyType}
              textContentType="oneTimeCode"
              blurOnSubmit={props.blurOnSubmit}
              editable={props.editable}
              numberOfLines={props.numberOfLines}
              // onBlur={handleBlur}
              // onFocus={handleFocus}
              // selection={selection}
              style={{
                height: props.textAreaHeight,
                width: props.locationShown ? '85%' : '100%',
                fontSize: props.fontSize ? props.fontSize : normalize(14),
                textAlign: props.textAlign,
                //paddingLeft: props.paddingLeft,
                color: Colors.themeBlack,
                textAlignVertical: props.textAlignVertical,
                marginTop: props.marginTopInput ? props.marginTopInput : null,
              }}
            />
          </View>
        </View>

        {/* Eye iCON */}
        {props.Eyeshow && (
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={{right: normalize(22), height: normalize(17)}}>
            <Image
              source={!passwordVisible ? Icons.EyeShow : Icons.EyeHide}
              resizeMode="contain"
              style={{
                right: normalize(6),
                height: normalize(17),
                width: normalize(17),
                tintColor: passwordVisible
                  ? Colors.themePlaceholder
                  : Colors.themeGreen,
              }}
            />
          </TouchableOpacity>
        )}

        {/* downarrow */}
        {props.arrowshow && (
          <View
            style={{
              //width: normalize(20),
              // height:normalize(20),
              //backgroundColor: 'blue',
              position: 'absolute',
              alignSelf: 'center',
              right: normalize(15),
            }}>
            <TouchableOpacity onPress={() => onPress()}>
              <Image
                source={Icons.DownArrow}
                resizeMode="contain"
                style={{
                  height: normalize(18),
                  width: normalize(18),
                }}
              />
            </TouchableOpacity>
          </View>
        )}
        {/* calender */}
        {props.calenderShown && (
          <View
            style={{
              //width: normalize(20),
              // height:normalize(20),
              //backgroundColor: 'blue',
              position: 'absolute',
              alignSelf: 'center',
              right: normalize(15),
            }}>
            <TouchableOpacity onPress={() => onPress()}>
              <Image
                source={Icons.Calender}
                style={{
                  resizeMode: 'contain',
                  height: normalize(17),
                  width: normalize(17),
                }}
              />
            </TouchableOpacity>
          </View>
        )}
        {/* location */}
        {props.locationShown && (
          <View
            style={{
              //width: normalize(20),
              // height:normalize(20),
              //backgroundColor: 'blue',
              position: 'absolute',
              alignSelf: 'center',
              right: normalize(15),
            }}>
            {!props?.value ? (
              <TouchableOpacity onPress={() => onPress()}>
                <Image
                  source={Icons.selectLocation}
                  style={{
                    resizeMode: 'contain',
                    width: normalize(22),
                    height: normalize(22),
                    tintColor: Colors.themeGreen,
                  }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => onClosePress()}>
                <Image
                  source={Icons.Cross}
                  style={{
                    resizeMode: 'contain',
                    width: normalize(20),
                    height: normalize(20),
                    tintColor: Colors.themeGreen,
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* checkbox */}
        {props.checkedShown && (
          <View
            style={{
              //width: normalize(20),
              // height:normalize(20),
              //backgroundColor: 'blue',
              position: 'absolute',
              alignSelf: 'center',
              right: normalize(15),
            }}>
            <TouchableOpacity
              onPress={() => {
                onPress();
              }}>
              <Image
                source={props.userOption ? Icons.checked : Icons.unchecked}
                resizeMode="contain"
                style={{
                  height: normalize(15),
                  width: normalize(15),
                  tintColor: Colors.orange,
                }}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Document Upload */}
        {props.documentShown && (
          <View
            style={{
              position: 'absolute',
              alignSelf: 'center',
              right: normalize(0),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: normalize(48),
                borderLeftWidth: props.borderWidth,
                borderLeftColor: props.borderColor,
                paddingHorizontal: normalize(10),
                backgroundColor: Colors.themeDocBackground,
                borderTopRightRadius: props.borderRadius,
                borderBottomRightRadius: props.borderRadius,
              }}
              onPress={() => {
                onPress();
              }}>
              <Image
                source={Icons.Upload}
                resizeMode="contain"
                style={{
                  height: normalize(20),
                  width: normalize(20),
                }}
              />
              <Text
                style={{
                  color: Colors.themePlaceholder,
                  fontFamily: Fonts.FustatMedium,
                  fontSize: 14,
                  marginLeft: normalize(5),
                }}>
                Upload
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
