import React from 'react';
import {StyleSheet, View} from 'react-native';
import HTMLView from 'react-native-htmlview';
import {Colors, Fonts} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';

const HTMLTextComponent = props => {
  const {htmlContent} = props;

  // const htmlText = htmlContent && htmlContent.replace(/(<\/.+>)(\s+)(<)/g, '');
  return (
    <View style={{}}>
      {htmlContent && (
        <HTMLView
          paragraphBreak={true}
          addLineBreaks={true}
          value={htmlContent}
          stylesheet={styles}
          //onLinkPress={url => openInAppLink(url)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  p: {
    // marginTop: normalize(2),
    // marginBottom: normalize(3),
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(11),
    lineHeight: normalize(16),
    color: Colors.themeBlack,
  },
  div: {
    fontFamily: Fonts.FustatMedium,
    fontSize: 11,
    color: Colors.themeBlack,
  },
  strong: {
    fontFamily: Fonts.FustatBold,
    fontSize: normalize(13),
    color: Colors.themeBlack,
    lineHeight: normalize(14),
  },
  a: {
    fontFamily: Fonts.FustatMedium,
    fontSize: 11,
    color: Colors.themeBlack,
    textDecorationLine: 'underline',
  },
  li: {
    fontFamily: Fonts.FustatMedium,
    fontSize: 11,
    color: Colors.themeBlack,
  },
  ol: {
    fontFamily: Fonts.FustatMedium,
    fontSize: 11,
    lineHeight: normalize(14),
    color: Colors.themeBlack,
  },
  // ul: {
  //   fontFamily: Fonts.FustatMedium,
  //   fontSize: 11,
  //   lineHeight: normalize(14),
  //   color: Colors.themeBlack,
  // },
});
export default HTMLTextComponent;
