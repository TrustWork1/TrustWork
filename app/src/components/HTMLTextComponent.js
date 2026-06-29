import React from 'react';
import {StyleSheet, View} from 'react-native';
// import HTMLView from 'react-native-htmlview';
import {Colors, Fonts} from '../themes/Themes';
import normalize from '../utils/helpers/normalize';
import Markdown from 'react-native-markdown-display';
import RenderHTML from 'react-native-render-html';
const HTMLTextComponent = props => {
  const {htmlContent, containerStyle, tagsStyles} = props;
  const cleanHtml = htmlContent
    ?.replace(/\s{2,}/g, ' ')
    ?.replace(/(<br\s*\/?>)+/gi, '');

  return (
    <View style={[styles.container, containerStyle]}>
      {htmlContent && (
        <RenderHTML
          source={{html: cleanHtml}}
          tagsStyles={{
            p: styles.p,
            div: styles.div,
            strong: styles.strong,
            a: styles.a,
            li: styles.li,
            ol: styles.ol,
            ul: styles.ul,
            ...tagsStyles,
          }}
        />

        // <Markdown style={markdownStyles}>{htmlContent}</Markdown>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
  },
  p: {
    marginTop: 0,
    marginBottom: normalize(10),
    padding: 0,
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(11),
    color: Colors.themeBlack,
  },
  div: {
    marginTop: 0,
    marginBottom: 0,
    padding: 0,
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(11),
    color: Colors.themeBlack,
  },
  strong: {
    fontFamily: Fonts.FustatBold,
    fontSize: normalize(13),
    color: Colors.themeBlack,
    lineHeight: normalize(15),
  },
  a: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(11),
    color: Colors.themeBlack,
    textDecorationLine: 'underline',
  },
  li: {
    marginTop: 0,
    marginBottom: 0,
    padding: 0,
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(11),
    color: Colors.themeBlack,
  },
  ol: {
    marginTop: 0,
    marginBottom: 0,
    padding: 0,
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(11),
    lineHeight: normalize(14),
    color: Colors.themeBlack,
  },
  ul: {
    marginTop: 0,
    marginBottom: 0,
    padding: 0,
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(11),
    lineHeight: normalize(14),
    color: Colors.themeBlack,
  },
});

const markdownStyles = {
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
  heading3: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
};
export default HTMLTextComponent;
