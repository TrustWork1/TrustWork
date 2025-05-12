import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../components/Header';
import Rating from '../../components/Rating';
import NavigationService from '../../navigators/NavigationService';
import {getOveralReviewRequest} from '../../redux/reducer/ProjectReducer';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import connectionrequest from '../../utils/helpers/NetInfo';
import showErrorAlert from '../../utils/helpers/Toast';
import constants from '../../utils/helpers/constants';
import normalize from '../../utils/helpers/normalize';

let status = '';

const ServiceDetails = props => {
  const {item, id} = props.route.params;

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const ProjectReducer = useSelector(state => state.ProjectReducer);
  const AuthReducer = useSelector(state => state.AuthReducer);

  const [review, setReview] = useState({});

  useEffect(() => {
    if (isFocused) {
      getProviderDetails();
    }
  }, [isFocused]);

  const getProviderDetails = () => {
    let obj = {
      provider_id:
        AuthReducer?.ProfileResponse?.data?.user_type == 'Service Provider'
          ? AuthReducer?.ProfileResponse?.data?.id
          : id,
      job_category_id: item.job_category__id,
    };
    connectionrequest()
      .then(() => {
        dispatch(getOveralReviewRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  if (status == '' || ProjectReducer.status != status) {
    switch (ProjectReducer.status) {
      case 'Project/getOveralReviewRequest':
        status = ProjectReducer.status;
        break;
      case 'Project/getOveralReviewSuccess':
        status = ProjectReducer.status;
        setReview(
          ProjectReducer?.getOveralReviewResponse?.data?.clients_feedback,
        );
        break;
      case 'Project/getOveralReviewFailure':
        status = ProjectReducer.status;
        break;
    }
  }

  const listHeaderComponent = () => {
    return (
      <View style={{paddingBottom: normalize(10)}}>
        <Text style={styles.serviceTitle}>
          {ProjectReducer?.getOveralReviewResponse?.data?.service_name}
        </Text>
        <Text style={styles.serviceDescription}>
          {ProjectReducer?.getOveralReviewResponse?.data?.description}
        </Text>
        <View style={[styles.recentContainer, {marginTop: normalize(15)}]}>
          <View style={styles.ratingContainer}>
            <Text style={styles.overalTxt}>Overall Rating</Text>
            <Text style={styles.overalRatingTxt}>
              {ProjectReducer?.getOveralReviewResponse?.data?.overall_rating}
            </Text>
            <Rating
              size={normalize(16)}
              starDistance={normalize(5)}
              rating={
                ProjectReducer?.getOveralReviewResponse?.data?.overall_rating
              }
              maxRating={5}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderServiceDetails = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() =>
          NavigationService.navigate('ServiceProvidersDetails', {item: item})
        }
        style={styles.recentContainer}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={
              item?.profile_pic
                ? {
                    uri: `${constants.IMAGE_URL}${item?.profile_pic}`,
                  }
                : Icons.profile_pic
            }
            style={styles.recentImg}
            resizeMode="stretch"
          />
          <View style={styles.nameConatiner}>
            <Text style={styles.featuredNameTxt}>{item?.client_name}</Text>
            <View style={styles.ratingSubContainer}>
              <Rating rating={5} maxRating={5} />
              <Text
                style={
                  styles.featuredSubTxt
                }>{`${item?.client_rating}/5`}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.reviewTxt}>{item?.client_review}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Header backIcon={Icons.BackIcon} headerTitle={'Service Details'} />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          <View style={styles.listMainContainer}>
            <View>
              <FlatList
                data={
                  ProjectReducer?.getOveralReviewResponse?.data
                    ?.clients_feedback
                }
                horizontal={false}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => (
                  <View style={{height: normalize(8)}} />
                )}
                ListHeaderComponent={() => listHeaderComponent()}
                ListEmptyComponent={() => {
                  return (
                    <View
                      style={{
                        alignItems: 'center',
                        marginTop: normalize(30),
                      }}>
                      <Text style={styles.projectTitle}>
                        No Reviews Found !!
                      </Text>
                    </View>
                  );
                }}
                renderItem={({item, index}) =>
                  renderServiceDetails(item, index)
                }
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ServiceDetails;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    height: '100%',
    width: '100%',
  },
  featuredNameTxt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(14),
    color: Colors.themeBlack,
    lineHeight: normalize(16),
  },
  featuredSubTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(11),
    color: Colors.themeInactiveTxt,
    paddingLeft: normalize(3),
    // lineHeight: normalize(22),
  },
  recentContainer: {
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(12),
    paddingTop: normalize(12),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(15),
  },
  recentImg: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(8),
  },
  projectTitle: {
    color: Colors.themeBlack,
    fontSize: normalize(13),
    fontFamily: Fonts.FustatSemiBold,
  },
  listMainContainer: {
    paddingHorizontal: normalize(10),
    marginTop: normalize(15),
  },
  serviceTitle: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(15),
    color: Colors.themeBlack,
    lineHeight: normalize(22),
  },
  serviceDescription: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    color: Colors.themeInactiveTxt,
    lineHeight: normalize(18),
  },
  ratingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(10),
  },
  overalTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(14),
    color: Colors.themeBlack,
    lineHeight: normalize(22),
  },
  overalRatingTxt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(30),
    color: Colors.themeBlack,
    lineHeight: normalize(42),
  },
  nameConatiner: {
    justifyContent: 'center',
    // alignItems: 'center',
    paddingLeft: normalize(10),
    paddingTop: normalize(5),
  },
  ratingSubContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    color: Colors.themeInactiveTxt,
    lineHeight: normalize(16),
    marginTop: normalize(10),
  },
});
