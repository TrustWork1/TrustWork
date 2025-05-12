import {PixelRatio, Platform, Dimensions} from 'react-native';

let pixel = Platform?.isPad ? 560 : 320;

const scale = Dimensions.get('window').width / pixel;

export default normalize = size => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
