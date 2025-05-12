import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../components/Header';
import NextBtn from '../../components/NextBtn';
import Rating from '../../components/Rating';
import TextIn from '../../components/TextIn';
import NavigationService from '../../navigators/NavigationService';
import {createChatRoomRequest} from '../../redux/reducer/ChatReducer';
import {
  bidStatusRequest,
  getFeedBackRequest,
  markAsCompletedRequest,
  ProjectBidsRequest,
  projectDetailsRequest,
  RejectBidRequest,
  sendFeedBackRequest,
} from '../../redux/reducer/ProjectReducer';
import css from '../../themes/css';
import Images from '../../themes/Images';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import constants from '../../utils/helpers/constants';
import connectionrequest from '../../utils/helpers/NetInfo';
import normalize from '../../utils/helpers/normalize';
import showErrorAlert from '../../utils/helpers/Toast';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import {StripePaymentFailRequest} from '../../redux/reducer/AuthReducer';

let status = '';
let statuss = '';

const ProjectDetails = props => {
  const {flag, item} = props?.route?.params;

  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const ProjectReducer = useSelector(state => state.ProjectReducer);
  const ChatReducer = useSelector(state => state.ChatReducer);

  const [projectDetails, setProjectDetails] = useState({});
  const [bidList, setBidList] = useState([]);
  const [currentRating, setCurrentRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [bidId, setBidId] = useState('');
  const [description, setDescription] = useState('');
  const [userData, setUserdata] = useState({});
  const [isReject, setIsReject] = useState(false);
  const [selectedImg, setSelectedImg] = useState([]);

  useEffect(() => {
    if (isFocused) {
      getProjectDetails();
      flag === 'Completed' && getFeedBack(item?.id);
      flag === 'Active' && getBidList();
    }
  }, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      switch (ChatReducer.status) {
        case 'Chat/createChatRoomRequest':
          break;
        case 'Chat/createChatRoomSuccess':
          console.log('userData---->', userData);
          NavigationService?.navigate('ClientChat', {
            data: userData,
            type: 'create',
          });
          break;
        case 'Chat/createChatRoomFailure':
          break;
      }
    }, [ChatReducer.status]),
  );

  const getProjectDetails = () => {
    connectionrequest()
      .then(() => {
        dispatch(projectDetailsRequest(item?.id));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const getBidList = () => {
    connectionrequest()
      .then(() => {
        dispatch(ProjectBidsRequest(item?.id));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const bidStatusChange = (status, id) => {
    let obj = {
      data: {action: status, message: description},
      bid_id: id,
    };
    connectionrequest()
      .then(() => {
        dispatch(bidStatusRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const markAsCompletedProject = (status, id) => {
    let obj = {
      data: {status: status},
      id: id,
    };
    connectionrequest()
      .then(() => {
        dispatch(markAsCompletedRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const sendFeedBack = id => {
    if (feedback == null) {
      showErrorAlert('Please enter review');
    } else if (currentRating == null) {
      showErrorAlert('Please select rating');
    } else {
      let obj = {
        data: {client_review: feedback, client_rating: currentRating},
        id: id,
      };
      connectionrequest()
        .then(() => {
          dispatch(sendFeedBackRequest(obj));
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

  const listHeaderComponent = () => {
    return (
      <View>
        <Text style={styles.ongoingTitleTxt}>
          {projectDetails?.project_title}
        </Text>
        <Text style={styles.ongoingDescriptionTxt}>
          {projectDetails?.project_description}
        </Text>

        <View>
          <Text style={[styles.loactionTxt, css.mt3]}>Document</Text>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('DocView', {
                link: projectDetails?.document,
              });
            }}
            style={[css.row, css.aic]}>
            <Image source={Icons.fileDoc} style={[styles.fileIcon]} />
            <Text style={[styles.featuredSubTxt, css.ml2]}>
              {projectDetails?.document?.split('/')?.pop()}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ongoingConatiner}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
            }}>
            <View style={{flex: 0.5, flexDirection: 'column'}}>
              <Text style={styles.bidCommonTxt}>Category:</Text>
            </View>
            <View style={{flex: 0.5, flexDirection: 'column'}}>
              <Text style={styles.bidResultCommonTxt}>
                {projectDetails?.project_category?.title}
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
            }}>
            <View style={{flex: 0.5, flexDirection: 'column'}}>
              <Text style={styles.bidCommonTxt}>Budget:</Text>
            </View>
            <View style={{flex: 0.5, flexDirection: 'column'}}>
              <Text style={styles.bidResultCommonTxt}>
                ${projectDetails?.project_budget}
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
            }}>
            <View style={{flex: 0.5, flexDirection: 'column'}}>
              <Text style={styles.bidCommonTxt}>Estimated Timeline:</Text>
            </View>
            <View style={{flex: 0.5, flexDirection: 'column'}}>
              <Text style={styles.bidResultCommonTxt}>
                {projectDetails?.project_timeline}{' '}
                {projectDetails?.project_hrs_week}
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
            }}>
            <View style={{flex: 0.5, flexDirection: 'column'}}>
              <Text style={styles.bidCommonTxt}>Location:</Text>
            </View>
            <View style={{flex: 0.5, flexDirection: 'column'}}>
              <Text style={styles.bidResultCommonTxt}>
                <Text style={styles.bidResultCommonTxt}>
                  {projectDetails?.project_address}
                </Text>
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
            }}>
            <View style={{flex: 0.5, flexDirection: 'column'}}>
              <Text style={styles.bidCommonTxt}>Status:</Text>
            </View>
            <View style={{flex: 0.5, flexDirection: 'column'}}>
              <Text style={styles.bidResultCommonTxt}>
                {projectDetails?.status}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.providerHeaderTxt}>{'Job Bids'}</Text>
      </View>
    );
  };

  const renderActiveComponent = (item, index) => {
    console.log(item);
    return (
      <>
        {ProjectReducer?.projectDetailsResponse?.data?.payment_status ==
        'in_progress' ? (
          <></>
        ) : (
          <>
            {item?.status != 'Rejected' && (
              <View style={styles.activeMainConatiner}>
                <View style={styles.activeContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      NavigationService.navigate('ServiceProvidersDetails', {
                        item: item?.service_provider,
                      })
                    }
                    style={{flexDirection: 'row'}}>
                    <Image
                      source={
                        item?.project?.client_profile_pic
                          ? {
                              uri: `${constants.IMAGE_URL}${item?.service_provider?.profile_picture}`,
                            }
                          : Icons.UserPro
                      }
                      style={styles.recentImg}
                      resizeMode="cover"
                    />
                    <View
                      style={{
                        // justifyContent: 'center',
                        // alignItems: 'center',
                        flex: 1,
                        paddingLeft: normalize(10),
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.featuredNameTxt}>
                          {item?.service_provider?.full_name}
                        </Text>
                        <View style={styles.starRatingContainer}>
                          <Image
                            source={Icons.Star}
                            style={styles.recentStarRating}
                            resizeMode="contain"
                          />
                          <Text
                            style={
                              styles.featuredSubTxt
                            }>{`${item?.service_provider?.profile_rating}/5`}</Text>
                        </View>
                      </View>

                      <View style={styles.contactConatiner}>
                        <View style={styles.commonRowConatiner}>
                          <Image
                            source={Icons.Contact}
                            style={styles.featuredLocationImg}
                            resizeMode="contain"
                          />
                          <Text style={styles.featuredSubTxt}>
                            {item?.service_provider?.phone}
                          </Text>
                        </View>
                        <View style={styles.emailContiner}>
                          <Image
                            source={Icons.Email}
                            style={styles.recentStarRating}
                            resizeMode="contain"
                          />
                          <Text style={styles.featuredSubTxt}>
                            {item?.service_provider?.email}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.bidMainContainer}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                    }}>
                    <View style={{flex: 0.5, flexDirection: 'column'}}>
                      <Text style={styles.bidCommonTxt}>Bid Amount:</Text>
                    </View>
                    <View style={{flex: 0.5, flexDirection: 'column'}}>
                      <Text style={styles.bidResultCommonTxt}>
                        ${item?.project_total_cost || 0}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                    }}>
                    <View style={{flex: 0.5, flexDirection: 'column'}}>
                      <Text style={styles.bidCommonTxt}>
                        Estimated Timeline:
                      </Text>
                    </View>
                    <View style={{flex: 0.5, flexDirection: 'column'}}>
                      <Text style={styles.bidResultCommonTxt}>
                        {item?.time_line} {item?.time_line_hour}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                    }}>
                    <View style={{flex: 0.5, flexDirection: 'column'}}>
                      <Text style={styles.bidCommonTxt}>Bid Details:</Text>
                    </View>
                    <View style={{flex: 0.5, flexDirection: 'column'}}>
                      <Text style={styles.bidResultCommonTxt}>
                        {item?.bid_details}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                    }}>
                    <View style={{flex: 0.5, flexDirection: 'column'}}>
                      <Text style={styles.bidCommonTxt}>
                        Quotation Details:
                      </Text>
                    </View>
                    <View style={{flex: 0.5, flexDirection: 'column'}}>
                      <Text style={styles.bidResultCommonTxt}>
                        {item?.quotation_details}
                      </Text>
                    </View>
                  </View>
                </View>

                {!item?.bid_sent && (
                  <View style={styles.statusBtnConatiner}>
                    <View style={{width: '47%', marginBottom: normalize(8)}}>
                      <TouchableOpacity
                        onPress={() => {
                          setIsReject(true);
                          setBidId(item?.id);
                          // bidStatusChange('reject', item?.id);
                        }}
                        style={styles.rejectBidBtn}>
                        <Text style={styles.rejectBidBtnText}>Reject Bid</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{width: '47%', marginBottom: normalize(8)}}>
                      <TouchableOpacity
                        onPress={() => {
                          // bidStatusChange('accept', item?.id);
                          NavigationService.navigate('Payment', {
                            bidId: item?.id,
                            amount: item?.project_total_cost,
                          });
                        }}
                        style={styles.acceptBidBtn}>
                        <Text style={styles.acceptBidBtnText}>Accept Bid</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => {
                    dispatch(
                      createChatRoomRequest({
                        user_id: item?.service_provider?.id,
                      }),
                      setUserdata(item?.service_provider),
                    );
                  }}
                  style={styles.messageConatiner}>
                  <Image
                    source={Icons.Message}
                    style={styles.messageImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.messageTxt}>{'Message'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </>
    );
  };

  const ongoingDetailsComponent = () => {
    return (
      <ScrollView style={styles.ongoingMainConatiner}>
        <View>
          <Text style={styles.ongoingTitleTxt}>
            {projectDetails?.project_title}
          </Text>
          <Text style={styles.ongoingDescriptionTxt}>
            {projectDetails?.project_description}
          </Text>

          <View style={styles.ongoingConatiner}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidCommonTxt}>Category:</Text>
              </View>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidResultCommonTxt}>
                  {projectDetails?.project_category?.title}
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidCommonTxt}>Budget:</Text>
              </View>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidResultCommonTxt}>
                  ${projectDetails?.project_budget}
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidCommonTxt}>Estimated Timeline:</Text>
              </View>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidResultCommonTxt}>
                  {projectDetails?.project_timeline}{' '}
                  {projectDetails?.project_hrs_week}
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidCommonTxt}>Location:</Text>
              </View>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidResultCommonTxt}>
                  <Text style={styles.bidResultCommonTxt}>
                    {projectDetails?.project_address}
                  </Text>
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidCommonTxt}>Submitted Bid:</Text>
              </View>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidResultCommonTxt}>
                  ${projectDetails?.project_total_cost || 0}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidCommonTxt}>Submitted Timeline:</Text>
              </View>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidResultCommonTxt}>
                  {projectDetails?.bid?.time_line}{' '}
                  {projectDetails?.bid?.time_line_hour}
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidCommonTxt}>Status:</Text>
              </View>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidResultCommonTxt}>
                  {projectDetails?.status}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.providerHeaderTxt}>{'Service Provider'}</Text>
        </View>
        <View style={styles.providerContiner}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={
                projectDetails?.provider?.profile_picture
                  ? {
                      uri:
                        constants?.IMAGE_URL +
                        projectDetails?.provider?.profile_picture,
                    }
                  : Images.User_1
              }
              style={styles.providerImage}
              resizeMode="stretch"
            />
            <View
              style={{
                // justifyContent: 'center',
                // alignItems: 'center',
                paddingLeft: normalize(10),
                flex: 1,
              }}>
              <Text style={styles.providerNameTxt}>
                {projectDetails?.provider?.full_name}
              </Text>
              <View style={styles.providerSubMainConatiner}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={Icons.LocationPin}
                    style={styles.locationImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.featuredSubTxt}>
                    {projectDetails?.provider?.state}
                  </Text>
                </View>
                <View style={styles.emailContiner}>
                  <Image
                    source={Icons.Star}
                    style={styles.recentStarRating}
                    resizeMode="contain"
                  />
                  <Text
                    style={
                      styles.featuredSubTxt
                    }>{`${projectDetails?.provider?.profile_rating}/5`}</Text>
                </View>
                <View style={styles.emailContiner}>
                  <Image
                    source={Icons.WorkType}
                    style={styles.recentStarRating}
                    resizeMode="contain"
                  />
                  <Text style={styles.featuredSubTxt}>
                    {projectDetails?.project_category?.title}
                  </Text>
                </View>
                <View style={styles.emailContiner}>
                  <Image
                    source={Icons.Experience}
                    style={styles.recentStarRating}
                    resizeMode="contain"
                  />
                  <Text
                    style={
                      styles.featuredSubTxt
                    }>{`${projectDetails?.provider?.year_of_experiance} Year`}</Text>
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.providerDecriptionTxt}>
            {projectDetails?.provider?.profile_bio}
          </Text>
        </View>
        <View style={styles.btnMainContainer}>
          <NextBtn
            loading={ProjectReducer?.status == 'Project/markAsCompletedRequest'}
            height={normalize(50)}
            title={'MARK AS COMPLETED'}
            borderColor={Colors.themeGreen}
            color={Colors.themeWhite}
            backgroundColor={Colors.themeGreen}
            onPress={() => markAsCompletedProject('completed', item?.id)}
          />
        </View>
        <TouchableOpacity
          // onPress={() => {
          //   NavigationService?.navigate('ClientChat', {
          //     data: ProjectReducer?.projectDetailsResponse?.data?.provider,
          //   });
          // }}
          onPress={() => {
            dispatch(
              createChatRoomRequest({
                user_id:
                  ProjectReducer?.projectDetailsResponse?.data?.provider?.id,
              }),
              setUserdata(
                ProjectReducer?.projectDetailsResponse?.data?.provider,
              ),
            );
          }}
          style={[
            styles.providerSubConatiner,
            {
              paddingVertical: normalize(15),
            },
          ]}>
          <Image
            source={Icons.Message}
            style={styles.messageImage}
            resizeMode="contain"
          />
          <Text style={styles.messageTxt}>{'Message'}</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const completedDetailsComponent = () => {
    return (
      <ScrollView style={styles.ongoingMainConatiner}>
        <View>
          <Text style={styles.ongoingTitleTxt}>
            {projectDetails?.project_title}
          </Text>
          <Text style={styles.ongoingDescriptionTxt}>
            {projectDetails?.project_description}
          </Text>

          <View style={styles.ongoingConatiner}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidCommonTxt}>Category:</Text>
              </View>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidResultCommonTxt}>
                  {projectDetails?.project_category?.title}
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidCommonTxt}>Budget:</Text>
              </View>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidResultCommonTxt}>
                  ${projectDetails?.project_budget}
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidCommonTxt}>Estimated Timeline:</Text>
              </View>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidResultCommonTxt}>
                  {projectDetails?.project_timeline}{' '}
                  {projectDetails?.project_hrs_week}
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidCommonTxt}>Location:</Text>
              </View>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidResultCommonTxt}>
                  <Text style={styles.bidResultCommonTxt}>
                    {projectDetails?.project_address}
                  </Text>
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidCommonTxt}>Submitted Bid:</Text>
              </View>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidResultCommonTxt}>
                  ${projectDetails?.project_total_cost}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidCommonTxt}>Submitted Timeline:</Text>
              </View>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidResultCommonTxt}>
                  {projectDetails?.bid?.time_line}{' '}
                  {projectDetails?.bid?.time_line_hour}
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidCommonTxt}>Status:</Text>
              </View>
              <View style={{flex: 0.5, flexDirection: 'column'}}>
                <Text style={styles.bidResultCommonTxt}>
                  {projectDetails?.status}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={[styles.providerHeaderTxt, css.mt2]}>
          {'Service Provider'}
        </Text>
        <View style={styles.providerContiner}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={
                projectDetails?.provider?.profile_picture
                  ? {
                      uri:
                        constants?.IMAGE_URL +
                        projectDetails?.provider?.profile_picture,
                    }
                  : Images.User_1
              }
              style={styles.providerImage}
              resizeMode="stretch"
            />
            <View
              style={{
                // justifyContent: 'center',
                // alignItems: 'center',
                flex: 1,
                paddingLeft: normalize(10),
              }}>
              <Text style={styles.providerNameTxt}>
                {projectDetails?.provider?.full_name}
              </Text>
              <View style={styles.providerSubMainConatiner}>
                <View style={styles.providerSubConatiner}>
                  <Image
                    source={Icons.LocationPin}
                    style={styles.locationImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.featuredSubTxt}>
                    {projectDetails?.provider?.state}
                  </Text>
                </View>
                <View style={styles.emailContiner}>
                  <Image
                    source={Icons.Star}
                    style={styles.recentStarRating}
                    resizeMode="contain"
                  />
                  <Text
                    style={
                      styles.featuredSubTxt
                    }>{`${projectDetails?.provider?.profile_rating}/5`}</Text>
                </View>
                {projectDetails?.provider?.job_category[0]?.title && (
                  <View style={styles.emailContiner}>
                    <Image
                      source={Icons.WorkType}
                      style={styles.recentStarRating}
                      resizeMode="contain"
                    />
                    <Text style={styles.featuredSubTxt}>
                      {projectDetails?.provider?.job_category[0]?.title}
                    </Text>
                  </View>
                )}
                <View style={styles.emailContiner}>
                  <Image
                    source={Icons.Experience}
                    style={styles.recentStarRating}
                    resizeMode="contain"
                  />
                  <Text style={styles.featuredSubTxt}>
                    {projectDetails?.provider?.year_of_experiance} Year
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.providerDecriptionTxt}>
            {projectDetails?.provider?.profile_bio}
          </Text>
          <View style={{marginTop: normalize(20)}}>
            <Text style={styles.feedbackTxt}>{'Send Feedback'}</Text>
            {ProjectReducer?.getFeedBackResponse?.data?.feedback
              ?.provider_rating == undefined ? (
              <Rating
                size={normalize(16)}
                starDistance={normalize(5)}
                rating={currentRating}
                maxRating={5}
                isBlack={true}
                onStarPress={newRating => setCurrentRating(newRating)}
              />
            ) : (
              <Rating
                size={normalize(16)}
                starDistance={normalize(5)}
                rating={currentRating}
                maxRating={5}
                isBlack={true}
                // onStarPress={newRating => setCurrentRating(newRating)}
              />
            )}
          </View>

          {ProjectReducer?.getFeedBackResponse?.data?.feedback?.client_rating ==
          undefined ? (
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
              <Text style={styles.bidCommonTxt}>{feedback}</Text>
            </View>
          )}

          {ProjectReducer?.getFeedBackResponse?.data?.feedback?.client_rating ==
            undefined && (
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
      </ScrollView>
    );
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

      case 'Project/ProjectBidsRequest':
        status = ProjectReducer.status;
        break;
      case 'Project/ProjectBidsSuccess':
        status = ProjectReducer.status;
        // setBidList(ProjectReducer?.ProjectBidsResponse?.data);

        const newArr = ProjectReducer?.ProjectBidsResponse?.data.filter(
          data => {
            return data?.status === 'active';
          },
        );
        if (newArr?.length > 0) {
          setBidList(ProjectReducer?.ProjectBidsResponse?.data);
        } else {
          setBidList([]);
        }
        console.log(newArr);

        break;
      case 'Project/ProjectBidsFailure':
        status = ProjectReducer.status;
        break;

      case 'Project/bidStatusRequest':
        status = ProjectReducer.status;
        break;
      case 'Project/bidStatusSuccess':
        status = ProjectReducer.status;
        getBidList();
        break;
      case 'Project/bidStatusFailure':
        status = ProjectReducer.status;
        break;

      case 'Project/markAsCompletedRequest':
        status = ProjectReducer.status;
        break;
      case 'Project/markAsCompletedSuccess':
        status = ProjectReducer.status;
        NavigationService?.navigate('Completed');
        break;
      case 'Project/markAsCompletedFailure':
        status = ProjectReducer.status;
        break;

      case 'Project/sendFeedBackRequest':
        status = ProjectReducer.status;
        break;
      case 'Project/sendFeedBackSuccess':
        status = ProjectReducer.status;
        getFeedBack(item?.id);
        break;
      case 'Project/sendFeedBackFailure':
        status = ProjectReducer.status;
        break;

      case 'Project/getFeedBackRequest':
        status = ProjectReducer.status;
        break;
      case 'Project/getFeedBackSuccess':
        status = ProjectReducer.status;
        setCurrentRating(
          ProjectReducer?.getFeedBackResponse?.data?.feedback?.client_rating,
        );
        setFeedback(
          ProjectReducer?.getFeedBackResponse?.data?.feedback?.client_review,
        );
        break;
      case 'Project/getFeedBackFailure':
        status = ProjectReducer.status;
        break;
    }
  }

  return (
    <View style={styles.mainContainer}>
      {/* <Loader
        visible={
          ProjectReducer.status == 'Project/ProjectBidsRequest' ||
          ProjectReducer.status == 'Project/getFeedBackRequest' ||
          ProjectReducer.status == 'Project/sendFeedBackRequest' ||
          ProjectReducer.status == 'Project/getProjectRequest' ||
          ProjectReducer.status == 'Project/markAsCompletedRequest' ||
          ProjectReducer.status == 'Project/projectDetailsRequest' ||
          ProjectReducer.status == 'Project/bidStatusRequest'
        }
      /> */}

      <Header backIcon={Icons.BackIcon} headerTitle={'My Project Details'} />

      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          {flag === 'Active' ? (
            <View>
              <FlatList
                data={bidList}
                horizontal={false}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => (
                  <View style={{height: normalize(10)}} />
                )}
                ListHeaderComponent={() => listHeaderComponent()}
                renderItem={({item, index}) =>
                  renderActiveComponent(item, index)
                }
                ListEmptyComponent={
                  <>
                    <View
                      style={{
                        alignItems: 'center',
                        marginTop: normalize(30),
                      }}>
                      <Text
                        style={{
                          fontSize: normalize(12),
                          color: Colors.themeBlack,
                          fontFamily: Fonts.FustatMedium,
                        }}>
                        No Bids Found
                      </Text>
                    </View>
                  </>
                }
                contentContainerStyle={{
                  marginTop: normalize(15),
                  paddingHorizontal: normalize(10),
                  paddingBottom: normalize(30),
                }}
              />
            </View>
          ) : flag === 'Ongoing' ? (
            ongoingDetailsComponent()
          ) : (
            completedDetailsComponent()
          )}
          {ProjectReducer?.projectDetailsResponse?.data?.payment_status ==
            'in_progress' && (
            <View>
              <View style={[]}>
                <View style={[css.asc]}>
                  <Text style={[styles.bidCommonTxt]}>
                    Project is in progress. Please check back later.
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>

      {/* <Modal
        isVisible={imgPicker}
        onBackdropPress={() => setImgPicker(false)}
        style={[css.m0, css.jcfe]}>
        <View
          style={[css.px2, {backgroundColor: Colors.themeProjectBackground}]}>
          <View style={[css.px3, css.py3]}>
            <NextBtn
              title="Camera"
              onPress={withCamera}
              color={Colors.themeWhite}
              borderColor={Colors.themeGreen}
              backgroundColor={Colors.themeGreen}
            />
          </View>
          <View style={[css.px3, css.pb5]}>
            <NextBtn
              title="Gallery"
              onPress={FromGalary}
              borderColor={Colors.themeGreen}
              color={Colors.themeWhite}
              backgroundColor={Colors.themeGreen}
            />
          </View>
        </View>
      </Modal> */}

      <Modal
        propagateSwipe
        visible={isReject}
        backdropOpacity={0}
        useNativeDriverForBackdrop={true}
        animationIn="slideInDown"
        animationOut="slideOutDown"
        useNativeDriver={true}
        swipeDirection={['down']}
        avoidKeyboard={true}
        style={styles.modalContainer}
        onBackdropPress={() => setIsReject(false)}
        onBackButtonPress={() => setIsReject(false)}>
        <View style={styles.modalSubContainer}>
          <Text style={[css.headerTxt]}>Reject Bid</Text>
          <View style={[css.mx3]}>
            <TextIn
              show={description?.length > 0 ? true : false}
              value={description}
              isVisible={false}
              onChangeText={val => setDescription(val?.trimStart())}
              height={normalize(100)}
              textAreaHeight={normalize(80)}
              width={normalize(260)}
              fonts={Fonts.FustatMedium}
              borderColor={Colors.themeBoxBorder}
              borderWidth={1}
              maxLength={300}
              // marginLeft={normalize(10)}
              outlineTxtwidth={normalize(50)}
              // label={'Project Description'}
              placeholder={'Enter bid reject reason'}
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
          </View>

          <View style={[css.mt2]}>
            <NextBtn
              title="Submit"
              height={normalize(40)}
              onPress={() => {
                if (description?.trim() == '') {
                  showErrorAlert('Please enter a reason');
                } else {
                  bidStatusChange('reject', bidId);
                  setIsReject(false);
                }
              }}
              color={Colors.themeWhite}
              borderColor={Colors.themeGreen}
              backgroundColor={Colors.themeGreen}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProjectDetails;

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
    // lineHeight: normalize(22),
  },
  featuredSubTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(11),
    color: Colors.themeInactiveTxt,
    // lineHeight: normalize(22),
  },
  featuredLocationImg: {
    width: normalize(11),
    height: normalize(11),
    marginRight: normalize(2),
  },
  activeMainConatiner: {
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(12),
  },
  activeContainer: {
    paddingVertical: normalize(15),
    borderBottomWidth: 1,
    borderBottomColor: Colors.themeBoxBorder,
    borderTopLeftRadius: normalize(10),
    borderTopRightRadius: normalize(10),
    marginHorizontal: normalize(15),
    justifyContent: 'center',
  },
  recentImg: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(8),
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
  starRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: normalize(10),
  },
  commonRowConatiner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactConatiner: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: normalize(3),
    flexWrap: 'wrap',
  },
  emailContiner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: normalize(10),
  },
  bidMainContainer: {
    flex: 1,
    borderBottomLeftRadius: normalize(10),
    borderBottomRightRadius: normalize(10),
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(15),
    flexDirection: 'column',
    // justifyContent: 'space-between',
  },
  bidCommonTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    color: Colors.themeBlack,
    lineHeight: normalize(22),
  },
  bidResultCommonTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    color: Colors.themeInactiveTxt,
    lineHeight: normalize(22),
    textTransform: 'capitalize',
  },
  statusBtnConatiner: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: normalize(15),
  },
  rejectBidBtn: {
    borderColor: Colors.themeBlack,
    borderWidth: 1,
    borderRadius: normalize(8),
    marginTop: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(5),
    flex: 1,
  },
  rejectBidBtnText: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    color: Colors.themeBlack,
    lineHeight: normalize(22),
    textTransform: 'uppercase',
  },
  acceptBidBtn: {
    backgroundColor: Colors.themeGreen,
    borderRadius: normalize(8),
    marginTop: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(6),
    flex: 1,
  },
  acceptBidBtnText: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    color: Colors.themeWhite,
    lineHeight: normalize(22),
    textTransform: 'uppercase',
  },
  messageConatiner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(15),
    borderTopWidth: 1,
    borderTopColor: Colors.themeBoxBorder,
  },
  messageImage: {
    width: normalize(24),
    height: normalize(24),
    marginRight: normalize(5),
  },
  messageTxt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(12),
    color: Colors.themeGreen,
    lineHeight: normalize(22),
    textTransform: 'uppercase',
  },
  ongoingMainConatiner: {
    flex: 1,
    paddingHorizontal: normalize(10),
    marginTop: normalize(15),
  },
  ongoingTitleTxt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(16),
    color: Colors.themeBlack,
    lineHeight: normalize(22),
    textTransform: 'capitalize',
  },
  ongoingDescriptionTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    color: Colors.themeInactiveTxt,
    lineHeight: normalize(18),
    paddingTop: normalize(4),
  },
  ongoingConatiner: {
    backgroundColor: Colors.themeProviderBackground,
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(15),
    flexDirection: 'column',
    borderRadius: normalize(8),
    marginVertical: normalize(15),
  },
  providerHeaderTxt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(16),
    color: Colors.themeBlack,
    lineHeight: normalize(22),
    marginBottom: normalize(15),
  },
  providerContiner: {
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(12),
    paddingTop: normalize(12),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(15),
  },
  providerImage: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(8),
  },
  providerNameTxt: {
    fontFamily: Fonts.FustatSemiBold,
    fontSize: normalize(14),
    color: Colors.themeBlack,
    lineHeight: normalize(16),
  },
  providerSubMainConatiner: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: normalize(3),
    flexWrap: 'wrap',
  },
  providerSubConatiner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationImage: {
    width: normalize(11),
    height: normalize(11),
    marginRight: normalize(2),
  },
  providerDecriptionTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    color: Colors.themeInactiveTxt,
    lineHeight: normalize(16),
    marginTop: normalize(15),
  },
  feedbackTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(14),
    color: Colors.themeBlack,
    lineHeight: normalize(22),
  },

  loactionTxt: {
    fontFamily: Fonts.FustatBold,
    fontSize: normalize(14),
    color: Colors.themeBlack,
    lineHeight: normalize(16),
  },

  fileIcon: {
    height: normalize(40),
    width: normalize(40),
    resizeMode: 'contain',
    tintColor: Colors.themeGreen,
    marginVertical: normalize(12),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    margin: 0,
    width: '100%',
  },
  modalHeaderTxtContainer: {
    paddingHorizontal: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderTxt: {
    fontFamily: Fonts.FustatSemiBold,
    color: Colors.themeBlack,
    fontSize: 26,
    lineHeight: normalize(28),
    marginBottom: normalize(7),
  },
  modalHeaderSubTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: 14,
    color: Colors.themeBlack,
    lineHeight: normalize(16),
    textAlign: 'center',
    paddingHorizontal: normalize(5),
  },
  modalMainContainer: {
    // flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSubContainer: {
    backgroundColor: Colors.themeWhite,
    width: '90%',
    borderRadius: 20,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(10),
    shadowColor: Colors.themeGray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});
