import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../components/Header';
import HTMLTextComponent from '../components/HTMLTextComponent';
import {aboutUsRequest} from '../redux/reducer/ProfileReducer';
import {Colors, Fonts, Icons} from '../themes/Themes';
import Loader from '../utils/helpers/Loader';
import connectionrequest from '../utils/helpers/NetInfo';
import normalize from '../utils/helpers/normalize';
import showErrorAlert from '../utils/helpers/Toast';

const AboutUs = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const ProfileReducer = useSelector(state => state.ProfileReducer);

  const [cmsData, setCmsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Track which status we've already handled to avoid re-running on unrelated updates
  const handledStatus = useRef('');

  useEffect(() => {
    if (isFocused) {
      fetchAboutUs();
    }
  }, [isFocused]);

  // React to reducer status changes
  useEffect(() => {
    const {status} = ProfileReducer;

    // Skip if we've already handled this status
    if (handledStatus.current === status) return;

    switch (status) {
      case 'Profile/aboutUsRequest':
        handledStatus.current = status;
        setIsLoading(true);
        setHasError(false);
        break;

      case 'Profile/aboutUsSuccess': {
        handledStatus.current = status;
        setIsLoading(false);
        setHasError(false);
        const data = ProfileReducer?.aboutUsResponse?.data;
        if (data) {
          setCmsData(data);
        } else {
          // API succeeded but returned no content
          setHasError(true);
        }
        break;
      }

      case 'Profile/aboutUsFailure':
        handledStatus.current = status;
        setIsLoading(false);
        setHasError(true);
        showErrorAlert(
          ProfileReducer?.error?.message || 'Something went wrong',
        );
        break;

      default:
        break;
    }
  }, [ProfileReducer.status]);

  const fetchAboutUs = () => {
    connectionrequest()
      .then(() => {
        dispatch(aboutUsRequest());
      })
      .catch(() => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const renderContent = () => {
    // Loading state — full-screen spinner (Loader overlay handles this)
    if (isLoading) {
      return null;
    }

    // Error / empty state
    if (hasError || !cmsData) {
      return (
        <View style={styles.centeredContainer}>
          <Text style={styles.errorTxt}>
            {hasError
              ? 'Failed to load content. Please try again.'
              : 'No content available.'}
          </Text>
          {hasError && (
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={fetchAboutUs}
              activeOpacity={0.7}>
              <Text style={styles.retryTxt}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    // Success state
    return (
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: normalize(15),
          paddingTop: normalize(10),
          paddingBottom: normalize(10),
        }}>
        {!!cmsData?.title && (
          <Text style={styles.headerTxt}>{cmsData.title}</Text>
        )}
        {!!cmsData?.content ? (
          <View style={styles.txtConatiner}>
            <HTMLTextComponent htmlContent={cmsData.content} />
          </View>
        ) : (
          <Text style={styles.emptyTxt}>No content available.</Text>
        )}
      </ScrollView>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Loader visible={isLoading} />
      <Header backIcon={Icons.BackIcon} headerTitle={'About Us'} />
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.container}>
          {renderContent()}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: normalize(10),
  },
  headerTxt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(16),
    color: Colors.themeBlack,
    lineHeight: normalize(22),
    paddingBottom: normalize(10),
  },
  txtConatiner: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: normalize(20),
    paddingTop: normalize(40),
  },
  errorTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(14),
    color: Colors.themeBlack,
    textAlign: 'center',
    marginBottom: normalize(16),
  },
  emptyTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(14),
    color: Colors.themeBlack,
    textAlign: 'center',
    marginTop: normalize(20),
  },
  retryBtn: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(30),
    backgroundColor: Colors.themeGreen,
    borderRadius: normalize(8),
  },
  retryTxt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(14),
    color: Colors.themeWhite,
  },
});
