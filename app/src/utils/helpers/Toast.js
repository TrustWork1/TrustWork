import {Platform, ToastAndroid} from 'react-native';
import Toast from 'react-native-simple-toast';

export default function showErrorAlert(message, isLong = false) {
  if (Platform.OS == 'android') {
    ToastAndroid.show(
      message,
      isLong == true ? ToastAndroid.LONG : ToastAndroid.SHORT,
    );
  } else {
    Toast.show(message, isLong == true ? Toast.LONG : Toast.SHORT);
  }
}
