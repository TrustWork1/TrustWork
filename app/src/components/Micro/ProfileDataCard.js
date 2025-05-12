import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import css from '../../themes/css';
import normalize from '../../utils/helpers/normalize';

const ProfileDataCard = ({
  logo,
  title,
  onPress,
  hasSwitch,
  disabled,
  onChangeStatus,
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const isFocused = useIsFocused();
  const AuthReducer = useSelector(state => state.AuthReducer);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    onChangeStatus(!isEnabled);
  };

  useEffect(() => {
    setIsEnabled(AuthReducer?.ProfileResponse?.data?.notification_enabled);
  }, [isFocused]);

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.mainContainer]}
      onPress={onPress}>
      <View style={[css.row, css.aic]}>
        <View style={[styles.iconContainer]}>
          <Image source={logo} style={[styles.logoStyle]} />
        </View>
        <Text style={[styles.titleStyle]}>{title}</Text>
      </View>

      {hasSwitch ? (
        <Switch
          trackColor={{
            false: Colors.themeBoxBorder,
            true: Colors.themeGreen,
          }}
          thumbColor={isEnabled ? Colors.themeWhite : Colors.themeGray}
          ios_backgroundColor={Colors.themeBoxBorder}
          style={{transform: [{scaleX: 0.7}, {scaleY: 0.7}]}}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      ) : (
        <TouchableOpacity onPress={onPress}>
          <Image source={Icons.DownArrow} style={[styles.arrowStyle]} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default ProfileDataCard;

const styles = StyleSheet.create({
  mainContainer: {
    padding: normalize(5),
    backgroundColor: Colors.themeWhite,
    marginTop: normalize(10),
    borderRadius: normalize(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowStyle: {
    height: normalize(15),
    width: normalize(15),
    resizeMode: 'contain',
    transform: [{rotate: '-90deg'}],
    marginRight: normalize(8),
    tintColor: Colors.themeBlack,
  },
  iconContainer: {
    paddingHorizontal: normalize(11),
    paddingVertical: normalize(18),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(10),
    backgroundColor: '#E1F3D7',
    height: normalize(30),
  },
  logoStyle: {
    height: normalize(15),
    width: normalize(15),
    resizeMode: 'contain',
  },
  titleStyle: {
    color: Colors.themeBlack,
    fontSize: normalize(12),
    fontFamily: Fonts.FustatSemiBold,
    marginLeft: normalize(10),
  },
});
