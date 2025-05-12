import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Header from '../../components/Header';
import {Colors, Fonts, Icons} from '../../themes/Themes';

import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import DataWithIcon from '../../components/Micro/DataWithIcon';
import NextBtn from '../../components/NextBtn';
import Rating from '../../components/Rating';
import TextIn from '../../components/TextIn';
import {
  getFeedBackRequest,
  paymentReqRequest,
  projectDetailsRequest,
  sendFeedBackProviderRequest,
} from '../../redux/reducer/ProjectReducer';
import Images from '../../themes/Images';
import constants from '../../utils/helpers/constants';
import connectionrequest from '../../utils/helpers/NetInfo';
import normalize from '../../utils/helpers/normalize';
import showErrorAlert from '../../utils/helpers/Toast';
import NavigationService from '../../navigators/NavigationService';

let status = '';

const ProviderProjectDetails = props => {
  const {item, flag} = props?.route?.params;

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const ProjectReducer = useSelector(state => state.ProjectReducer);
  const AuthReducer = useSelector(state => state.AuthReducer);

  const [projectDetails, setProjectDetails] = useState({});
  const [currentRating, setCurrentRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (isFocused) {
      getProjectDetails();
      flag === 'Completed' && getFeedBack(item?.id);
    }
  }, [isFocused]);

  const getProjectDetails = () => {
    connectionrequest()
      .then(() => {
        dispatch(projectDetailsRequest(item?.id));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const sendFeedBack = id => {
    if (feedback == '') {
      showErrorAlert('Please enter review');
    } else if (currentRating == 0) {
      showErrorAlert('Please select rating');
    } else {
      let obj = {
        data: {
          provider_review: feedback,
          provider_rating: currentRating,
          provider_id: AuthReducer?.ProfileResponse?.data?.id,
        },
        id: id,
      };
      connectionrequest()
        .then(() => {
          dispatch(sendFeedBackProviderRequest(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect to the internet');
        });
    }
  };

  const getFeedBack = id => {
    let obj = {
      id: id,
    };
    connectionrequest()
      .then(() => {
        dispatch(getFeedBackRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  if (status == '' || ProjectReducer.status != status) {
    switch (ProjectReducer.status) {
      case 'Project/projectDetailsRequest':
        status = ProjectReducer.status;
        break;
      case 'Project/projectDetailsSuccess':
        status = ProjectReducer.status;
        setProjectDetails(ProjectReducer?.projectDetailsResponse?.data);
        break;
      case 'Project/projectDetailsFailure':
        status = ProjectReducer.status;
        break;

      case 'Project/sendFeedBackProviderRequest':
        status = ProjectReducer.status;
        break;
      case 'Project/sendFeedBackProviderSuccess':
        status = ProjectReducer.status;
        getFeedBack(item?.id);
        break;
      case 'Project/sendFeedBackProviderFailure':
        status = ProjectReducer.status;
        break;

      case 'Project/getFeedBackRequest':
        status = ProjectReducer.status;
        break;
      case 'Project/getFeedBackSuccess':
        status = ProjectReducer.status;
        setCurrentRating(
          ProjectReducer?.getFeedBackResponse?.data?.feedback?.provider_rating,
        );
        setFeedback(
          ProjectReducer?.getFeedBackResponse?.data?.feedback?.provider_review,
        );
        break;
      case 'Project/getFeedBackFailure':
        status = ProjectReducer.status;
        break;
    }
  }

  const activeProjectComponent = () => {
    return (
      <View>
        <View style={{marginTop: normalize(16)}}>
          <View style={styles.lightContainer}>
            <View style={{flex: 1}}>
              <Text style={styles.projectTitle}>
                {projectDetails?.project_title}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={Icons.LocationPin} style={styles.locationIcon} />
                <Text style={[styles.greyTxt, {paddingTop: normalize(5)}]}>
                  {projectDetails?.project_address}
                </Text>
              </View>
            </View>
            <View style={styles.statusContainer}>
              <Text style={styles.statusTxt}>{projectDetails?.status}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: normalize(4),
              marginBottom: normalize(8),
              backgroundColor: Colors.themeLightYellow,
              borderRadius: normalize(10),
            }}>
            <Image source={Icons.clock} style={styles.locationIcon} />
            <Text style={styles.greyTxt}>
              {projectDetails?.project_timeline}{' '}
              {projectDetails?.project_hrs_week} Timeline
            </Text>
          </View>
          <Text style={styles.descTxt}>
            {projectDetails?.project_description}
          </Text>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: normalize(10),
            }}>
            <View style={{flex: 0.48}}>
              <DataWithIcon
                padding={normalize(8)}
                img={Icons.status}
                darkTxt={'Project Category'}
                lightTxt={projectDetails?.project_category?.title}
              />
            </View>
            <View style={{flex: 0.48}}>
              <DataWithIcon
                padding={normalize(8)}
                img={Icons.cal}
                darkTxt={'Initiation Date'}
                // lightTxt={projectDetails?.InitDate}
                lightTxt={moment(projectDetails?.created_at).format(
                  'Do MMM, YYYY',
                )}
              />
            </View>
          </View>
        </View>

        {/* /////////////////// Project Updates //////////////////// */}

        {projectDetails?.last_message?.message && (
          <View>
            <Text
              style={[styles.projectTitle, {marginVertical: normalize(16)}]}>
              {'Project Updates'}
            </Text>
            <View style={styles.WhiteBox}>
              <Text style={styles.descTxt}>
                {projectDetails?.last_message?.message}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: normalize(8),
                }}>
                <Image source={Icons.clock} style={styles.clockGreen} />
                <Text
                  style={{
                    color: Colors.themeGreen,
                    fontSize: normalize(11),
                    marginLeft: normalize(4),
                  }}>
                  {moment(projectDetails?.created_at).format('Do MMM, YYYY')}
                </Text>
              </View>
              <NextBtn
                height={normalize(28)}
                title={'send Message'}
                borderColor={Colors.themeGreen}
                color={Colors.themeWhite}
                backgroundColor={Colors.themeGreen}
                onPress={() => {
                  NavigationService?.navigate('Chat', {
                    data: ProjectReducer?.projectDetailsResponse?.data?.client,
                    type: 'create',
                  });
                }}
              />
            </View>
          </View>
        )}

        {/* ////////////////////// Payment History //////////////// */}
        <View>
          <Text style={[styles.projectTitle, {marginVertical: normalize(16)}]}>
            {'Payment History'}
          </Text>
          <View style={styles.WhiteBox}>
            <View style={styles.lightContainer}>
              <View>
                <Text
                  style={
                    styles.amountTxt
                  }>{`$${ProjectReducer?.projectDetailsResponse?.data?.project_total_cost}`}</Text>
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.greyTxt}>
                    {`Payment for ${ProjectReducer?.projectDetailsResponse?.data?.project_title}`}
                  </Text>
                </View>
              </View>
              {/* <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: normalize(8),
                }}>
                <Image source={Icons.clock} style={styles.clockGreen} />
                <Text
                  style={[
                    {
                      color: Colors.themeGreen,
                      fontSize: normalize(11),
                      marginLeft: normalize(4),
                    },
                  ]}>
                  {moment(
                    ProjectReducer?.projectDetailsResponse?.data?.updated_at,
                  ).format('ll')}
                </Text>
              </View> */}
            </View>

            <NextBtn
              height={normalize(28)}
              title={'send payment Request'}
              borderColor={Colors.themeGreen}
              color={Colors.themeWhite}
              backgroundColor={Colors.themeGreen}
              onPress={() => {
                let obj = {
                  project_id: ProjectReducer?.projectDetailsResponse?.data?.id,
                };

                dispatch(paymentReqRequest(obj));
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  const completedProjectComponent = () => {
    return (
      <View>
        <View style={{marginTop: normalize(16)}}>
          <View style={styles.lightContainer}>
            <View style={{flex: 1}}>
              <Text style={[styles.projectTitle]}>
                {projectDetails?.project_title}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={Icons.LocationPin} style={styles.locationIcon} />
                <Text style={[styles.greyTxt, {paddingTop: normalize(5)}]}>
                  {projectDetails?.project_address}
                </Text>
              </View>
            </View>
            <View style={styles.statusContainer}>
              <Text style={[styles.statusTxt]}>{projectDetails?.status}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: normalize(4),
              marginBottom: normalize(8),
              backgroundColor: Colors.themeLightYellow,
              borderRadius: normalize(10),
            }}>
            <Image source={Icons.clock} style={styles.locationIcon} />
            <Text style={styles.greyTxt}>
              {projectDetails?.project_timeline}{' '}
              {projectDetails?.project_hrs_week} Timeline
            </Text>
          </View>
          <Text style={[styles.descTxt, {marginTop: normalize(6)}]}>
            {projectDetails?.project_description}
          </Text>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: normalize(10),
            }}>
            <View style={{flex: 0.48}}>
              <DataWithIcon
                padding={normalize(8)}
                img={Icons.status}
                darkTxt={'Project Category'}
                lightTxt={projectDetails?.project_category?.title}
              />
            </View>
            <View style={{flex: 0.48}}>
              <DataWithIcon
                padding={normalize(8)}
                img={Icons.dollar}
                darkTxt={'Project Budget'}
                lightTxt={`$${projectDetails?.project_budget}`}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: normalize(10),
            }}>
            <View style={{flex: 0.48}}>
              <DataWithIcon
                padding={normalize(8)}
                img={Icons.payStatus}
                darkTxt={'Payment Status'}
                lightTxt={
                  projectDetails?.payment_status == ' '
                    ? 'Waiting for Payment'
                    : projectDetails?.payment_status
                }
              />
            </View>
            <View style={{flex: 0.48}}>
              <DataWithIcon
                padding={normalize(8)}
                img={Icons.Contact}
                darkTxt={'Contact Info'}
                lightTxt={projectDetails?.email}
              />
            </View>
          </View>
        </View>

        {/* /////////////////// Client //////////////////// */}
        <View>
          <Text style={[styles.projectTitle, {marginVertical: normalize(16)}]}>
            {'Client'}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: Colors.themeWhite,
            borderRadius: normalize(12),
            paddingTop: normalize(12),
            paddingHorizontal: normalize(10),
            paddingVertical: normalize(15),
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={
                projectDetails?.client?.profile_picture
                  ? {
                      uri:
                        constants?.IMAGE_URL +
                        projectDetails?.client?.profile_picture,
                    }
                  : Images.User_1
              }
              style={{
                width: normalize(40),
                height: normalize(40),
                borderRadius: normalize(8),
              }}
              resizeMode="stretch"
            />
            <View
              style={{
                // justifyContent: 'center',
                // alignItems: 'center',
                flex: 1,
                paddingLeft: normalize(10),
              }}>
              <Text
                style={{
                  fontFamily: Fonts.FustatSemiBold,
                  fontSize: normalize(14),
                  color: Colors.themeBlack,
                  lineHeight: normalize(16),
                }}>
                {projectDetails?.client?.full_name}
              </Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingVertical: normalize(3),
                  flexWrap: 'wrap',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={Icons.LocationPin}
                    style={{
                      width: normalize(11),
                      height: normalize(11),
                      marginRight: normalize(2),
                    }}
                    resizeMode="contain"
                  />
                  <Text style={styles.featuredSubTxt}>
                    {projectDetails?.client?.city}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingLeft: normalize(8),
                  }}>
                  <Image
                    source={Icons.Star}
                    style={styles.recentStarRating}
                    resizeMode="contain"
                  />
                  <Text style={styles.featuredSubTxt}>
                    {`${projectDetails?.client?.profile_rating}/5`}
                  </Text>
                </View>
                {/* <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingLeft: normalize(8),
                  }}>
                  <Image
                    source={Icons.WorkType}
                    style={styles.recentStarRating}
                    resizeMode="contain"
                  />
                  <Text style={styles.featuredSubTxt}>
                    {projectDetails?.project_category?.title}
                  </Text>
                </View> */}
                {/* <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingLeft: normalize(8),
                  }}>
                  <Image
                    source={Icons.Experience}
                    style={styles.recentStarRating}
                    resizeMode="contain"
                  />
                  <Text style={styles.featuredSubTxt}>{'2 Year'}</Text>
                </View> */}
              </View>
            </View>
          </View>
          {/* <Text
            style={{
              fontFamily: Fonts.FustatMedium,
              fontSize: normalize(12),
              color: Colors.themeInactiveTxt,
              lineHeight: normalize(16),
              marginTop: normalize(15),
            }}>
            Lorem ipsum dolor sit amet consectetur. Tristique praes ent viverra
            volutpat in. Sed ante ac quis.
          </Text> */}
          <View style={{marginTop: normalize(20)}}>
            <Text
              style={{
                fontFamily: Fonts.FustatMedium,
                fontSize: normalize(14),
                color: Colors.themeBlack,
                lineHeight: normalize(22),
              }}>
              {'Send Feedback'}
            </Text>
            <Rating
              size={normalize(16)}
              starDistance={normalize(5)}
              rating={currentRating}
              maxRating={5}
              isBlack={true}
              onStarPress={newRating => setCurrentRating(newRating)}
            />
          </View>

          {ProjectReducer?.getFeedBackResponse?.data?.feedback
            ?.provider_rating == undefined ? (
            <TextIn
              show={feedback?.length > 0 ? true : false}
              value={feedback}
              isVisible={false}
              onChangeText={val => setFeedback(val?.trimStart())}
              height={normalize(100)}
              textAreaHeight={normalize(80)}
              width={normalize(280)}
              fonts={Fonts.FustatMedium}
              borderColor={Colors.themeBoxBorder}
              borderWidth={1}
              maxLength={300}
              marginTop={normalize(15)}
              marginBottom={normalize(10)}
              // marginLeft={normalize(10)}
              outlineTxtwidth={normalize(50)}
              label={'Write A Review'}
              placeholder={'Enter Review'}
              textAlignVertical={'top'}
              multiline={true}
              numberOfLines={20}
              //placeholderIcon={Icons.Email}
              placeholderTextColor={Colors.themePlaceholder}
              borderRadius={normalize(6)}
              fontSize={14}
              //Eyeshow={true}
              paddingLeft={normalize(10)}
              paddingRight={normalize(10)}
            />
          ) : (
            <View style={{paddingTop: normalize(10)}}>
              <Text style={[styles.bidCommonTxt]}>{feedback}</Text>
            </View>
          )}

          {ProjectReducer?.getFeedBackResponse?.data?.feedback
            ?.provider_rating == undefined && (
            <View style={styles.btnMainContainer}>
              <NextBtn
                loading={
                  ProjectReducer?.status == 'Project/sendFeedBackRequest'
                }
                height={normalize(50)}
                title={'Submit'}
                borderColor={Colors.themeGreen}
                color={Colors.themeWhite}
                backgroundColor={Colors.themeGreen}
                onPress={() => sendFeedBack(item?.id)}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* <Loader
        visible={
          ProjectReducer.status == 'Project/projectDetailsRequest' ||
          ProjectReducer.status == 'Project/getFeedBackRequest' ||
          ProjectReducer.status == 'Project/sendFeedBackRequest'
        }
      /> */}
      <Header backIcon={Icons.BackIcon} headerTitle={'Project Details'} />
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={{paddingBottom: normalize(70)}}
          style={styles.container}>
          <View style={{paddingHorizontal: normalize(10)}}>
            {flag === 'Active'
              ? activeProjectComponent()
              : completedProjectComponent()}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ProviderProjectDetails;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    height: '100%',
    width: '100%',
  },
  featuredSubTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(11),
    color: Colors.themeInactiveTxt,
    // lineHeight: normalize(22),
  },
  lightContainer: {
    // padding: normalize(14),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: normalize(15),
  },
  locationIcon: {
    width: normalize(12),
    height: normalize(12),
    resizeMode: 'contain',
    marginLeft: normalize(2),
    marginRight: normalize(4),
  },
  projectTitle: {
    color: Colors.themeBlack,
    fontSize: normalize(14),
    textTransform: 'capitalize',
    fontFamily: Fonts.FustatBold,
  },
  statusTxt: {
    fontFamily: Fonts.FustatMedium,
    color: Colors.themeWhite,
    fontSize: normalize(10),
    textTransform: 'capitalize',
    letterSpacing: normalize(0.5),
  },
  statusContainer: {
    paddingHorizontal: normalize(10),
    height: normalize(20),
    backgroundColor: Colors.themeGreen,
    justifyContent: 'center',
    borderRadius: normalize(10),
  },
  greyTxt: {
    fontFamily: Fonts.FustatRegular,
    fontSize: normalize(11),
    color: Colors.themeInactiveTxt,
    // marginLeft: normalize(4),
  },
  WhiteBox: {
    padding: normalize(15),
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(8),
  },
  descTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(11),
    color: Colors.themeInactiveTxt,
    lineHeight: normalize(16),
    marginTop: normalize(2),
  },

  amountTxt: {
    color: Colors.themeGreen,
    fontSize: normalize(14),
    fontFamily: Fonts.FustatMedium,
  },

  clockGreen: {
    height: normalize(15),
    width: normalize(15),
    resizeMode: 'contain',
    tintColor: Colors.themeGreen,
  },

  recentStarRating: {
    width: normalize(11),
    height: normalize(11),
    marginRight: normalize(3),
    tintColor: Colors.themeGreen,
  },
  btnMainContainer: {
    width: '100%',
    marginTop: normalize(20),
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: normalize(18),
  },
  bidCommonTxt: {
    color: Colors.themeBlack,
    fontSize: normalize(12),
  },
});
