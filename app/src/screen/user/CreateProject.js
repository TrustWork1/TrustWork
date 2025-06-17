import {useIsFocused} from '@react-navigation/native';
import _ from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import Dropdown from '../../components/Dropdown';
import GooglePlaces from '../../components/GooglePlaces';
import Header from '../../components/Header';
import NextBtn from '../../components/NextBtn';
import TextIn from '../../components/TextIn';
import NavigationService from '../../navigators/NavigationService';
import {
  CreateProjectRequest,
  EditProjectRequest,
  JobCategoryProviderRequest,
  JobCategoryRequest,
  ProviderOfferRequest,
} from '../../redux/reducer/ProjectReducer';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import connectionrequest from '../../utils/helpers/NetInfo';
import normalize from '../../utils/helpers/normalize';
import showErrorAlert from '../../utils/helpers/Toast';
import DocumentPicker from 'react-native-document-picker';
import constants from '../../utils/helpers/constants';

const timelineUnits = [
  {
    id: 1,
    title: 'Hrs',
  },
  {
    id: 2,
    title: 'Days',
  },
  {
    id: 3,
    title: 'Weeks',
  },
  {
    id: 4,
    title: 'Months',
  },
  {
    id: 5,
    title: 'Years',
  },
];

let status = '';

const CreateProject = props => {
  const item = props?.route?.params?.item;

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const ProjectReducer = useSelector(state => state.ProjectReducer);

  const [category, setCategory] = useState('');
  const [units, setUnits] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [street, setStreet] = useState('');
  const [state, setState] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [city, setCity] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [budget, setBudget] = useState(0);
  const [timeline, setTimeline] = useState('');
  const [Cat_Id, setCat_Id] = useState('');
  const [doc, setDoc] = useState('');
  const [docFile, setDocFile] = useState();
  const [jobCategoryList, setJobCategoryList] = useState([]);
  console.log(zipcode);

  useEffect(() => {
    if (isFocused) {
      getJobCategory();
    }
  }, [isFocused]);
  // console.log(item);
  useEffect(() => {
    if (item?.id) {
      setCat_Id(item?.project_category?.id);
      setCategory(item?.project_category?.title);
      setTitle(item?.project_title);
      setDescription(item?.project_description);
      setAddress(item?.project_address);
      setStreet(item?.street);
      setState(item?.state);
      setStateCode(item?.state_code);
      setCity(item?.city);
      setZipcode(item?.zip_code);
      setCountry(item?.country);
      setLat(item?.latitude);
      setLng(item?.longitude);
      setBudget(JSON.stringify(item?.project_budget));
      setTimeline(item?.project_timeline);
      setUnits(item?.project_hrs_week);
      setDoc(item?.document?.split('/')?.pop());
      // setDocFile(constants.IMAGE_URL + item?.document);
    }
  }, []);

  const getJobCategory = () => {
    connectionrequest()
      .then(() => {
        let obj = {
          data: props?.route?.params?.providerId,
        };
        if (props?.route?.params?.providerId != undefined) {
          dispatch(JobCategoryProviderRequest(obj));
        } else {
          dispatch(JobCategoryRequest());
        }
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const CreateProjectFun = () => {
    if (Cat_Id == '') {
      showErrorAlert('Please select Project Category');
    } else if (title?.trim() == '') {
      showErrorAlert('Please enter project title');
    } else if (description?.trim() == '') {
      showErrorAlert('Please enter project description');
    } else if (doc == '') {
      showErrorAlert('Please upload document');
    } else if (address?.trim() == '') {
      showErrorAlert('Please enter project address');
    } else if (budget == 0) {
      showErrorAlert('Please enter project budget');
    } else if (!budget.match(/^[0-9]+$/)) {
      showErrorAlert('please use numerical value for budget');
    } else if (timeline?.trim() == '') {
      showErrorAlert('Please enter project timeline');
    } else if (units == '') {
      showErrorAlert('Please select Project Category Units');
    } else {
      const createObj = new FormData();
      createObj.append('project_category', Cat_Id);
      createObj.append('project_title', title);
      createObj.append('project_description', description);
      createObj.append('project_budget', Number(budget));
      createObj.append('project_timeline', timeline);
      createObj.append('project_hrs_week', units);
      createObj.append('project_address', address);
      createObj.append('street', street);
      createObj.append('state', state);
      createObj.append('state_code', stateCode);
      createObj.append('city', city);
      createObj.append('country', country);
      createObj.append('zip_code', zipcode);
      createObj.append('latitude', lat);
      createObj.append('longitude', lng);
      createObj.append('document', docFile);

      let editdata = new FormData();
      editdata.append('project_category', Cat_Id);
      editdata.append('project_title', title);
      editdata.append('project_description', description);
      editdata.append('project_budget', Number(budget));
      editdata.append('project_timeline', timeline);
      editdata.append('project_hrs_week', units);
      editdata.append('project_address', address);
      editdata.append('street', street);
      editdata.append('state', state);
      editdata.append('state_code', stateCode);
      editdata.append('city', city);
      editdata.append('country', country);
      editdata.append('zip_code', zipcode);
      editdata.append('latitude', lat);
      editdata.append('longitude', lng);
      !_.isEmpty(docFile) && editdata.append('document', docFile);

      let editobj = {
        data: editdata,
        id: item?.id,
      };

      // editObj.append('id', item?.id);

      let providerOffer = new FormData();
      providerOffer.append(
        'project_data',
        JSON.stringify({
          project_category: Cat_Id,
          project_title: title,
          project_description: description,
          project_budget: Number(budget),
          project_timeline: timeline,
          project_hrs_week: units,
          project_address: address,
          street: street,
          state: state,
          state_code: stateCode,
          city: city,
          country: country,
          zip_code: zipcode,
          latitude: lat,
          longitude: lng,
        }),
      );
      providerOffer.append('provider_id', props?.route?.params?.providerId);
      providerOffer.append('document', docFile);

      connectionrequest()
        .then(() => {
          dispatch(
            item?.id
              ? EditProjectRequest(editobj)
              : props?.route?.params?.providerId
              ? ProviderOfferRequest(providerOffer)
              : CreateProjectRequest(createObj),
          );
        })
        .catch(err => {
          showErrorAlert('Please connect to the internet');
        });
    }
  };

  const handlecertificateUpload = useCallback(async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        // presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.pdf],
      });

      let docObject = {
        size: response.size,
        name: response.name,
        uri: response.uri,
        type: response.type,
      };

      setDocFile(docObject);
      setDoc(docObject?.name);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  if (status == '' || ProjectReducer.status != status) {
    switch (ProjectReducer.status) {
      case 'Project/JobCategoryRequest':
        status = ProjectReducer.status;
        break;
      case 'Project/JobCategorySuccess':
        status = ProjectReducer.status;
        setJobCategoryList(ProjectReducer.JobCategoryResponse.data);
        break;
      case 'Project/JobCategoryFailure':
        status = ProjectReducer.status;
        break;

      case 'Project/JobCategoryProviderRequest':
        status = ProjectReducer.status;
        break;
      case 'Project/JobCategoryProviderSuccess':
        status = ProjectReducer.status;
        setJobCategoryList(ProjectReducer.JobCategoryProviderResponse.data);
        break;
      case 'Project/JobCategoryProviderFailure':
        status = ProjectReducer.status;
        break;

      case 'Project/CreateProjectRequest':
        status = ProjectReducer.status;
        break;
      case 'Project/CreateProjectSuccess':
        status = ProjectReducer.status;
        NavigationService.goBack();
        break;
      case 'Project/CreateProjectFailure':
        status = ProjectReducer.status;
        break;

      case 'Project/ProviderOfferRequest':
        status = ProjectReducer.status;
        break;
      case 'Project/ProviderOfferSuccess':
        status = ProjectReducer.status;
        NavigationService.goBack();
        break;
      case 'Project/ProviderOfferFailure':
        status = ProjectReducer.status;
        break;

      case 'Project/EditProjectRequest':
        status = ProjectReducer.status;
        break;
      case 'Project/EditProjectSuccess':
        status = ProjectReducer.status;
        NavigationService.goBack();
        break;
      case 'Project/EditProjectFailure':
        status = ProjectReducer.status;
        break;
    }
  }

  return (
    <View style={styles.mainContainer}>
      {/* <Loader
        visible={
          ProjectReducer?.status == 'Project/JobCategoryRequest' ||
          ProjectReducer?.status == 'Project/CreateProjectRequest' ||
          ProjectReducer?.status == 'Project/EditProjectRequest'
        }
      /> */}
      <Header
        backIcon={Icons.BackIcon}
        headerTitle={item?.id ? 'Edit Project' : 'Create Project'}
      />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          <KeyboardAwareScrollView
            keyboardOpeningTime={0}
            enableResetScrollToCoords={false}
            bounces={false}
            showsVerticalScrollIndicator={false}
            // style={{marginBottom: 150}}
            enableOnAndroid={true}
            scrollEnabled={true}
            // extraScrollHeight={100}
            keyboardDismissMode="none"
            keyboardShouldPersistTaps={'handled'}
            scrollToOverflowEnabled={true}
            enableAutomaticScroll={true}
            contentContainerStyle={{
              //paddingBottom: windowHeight / 4,
              paddingBottom:
                Platform.OS === 'ios' ? normalize(20) : normalize(75),
            }}>
            <View
              style={{
                paddingHorizontal: normalize(10),
                marginTop: normalize(15),
              }}>
              <Dropdown
                show={category?.length > 0 ? true : false}
                data={jobCategoryList}
                height={normalize(50)}
                width={normalize(280)}
                borderColor={Colors.themeBoxBorder}
                borderWidth={1}
                fonts={Fonts.VerdanaProMedium}
                borderRadius={normalize(6)}
                fontSize={14}
                marginTop={normalize(15)}
                paddingLeft={normalize(12)}
                valueColor={Colors.themeBlack}
                paddingHorizontal={normalize(5)}
                label={'Project Category'}
                placeholder={'Select Category'}
                value={category}
                disabled={item?.bid_count > 0 || false}
                // modalHeight
                marginBottom={normalize(10)}
                marginLeft={normalize(10)}
                outlineTxtwidth={normalize(50)}
                placeholderTextColor={Colors.themePlaceholder}
                onChange={(selecetedItem, index) => {
                  setCategory(selecetedItem?.title);
                  setCat_Id(selecetedItem?.id);
                  // if (item?.bid_count > 0) {
                  //   showErrorAlert('Not Editable');
                  // } else {
                  //   setCategory(selecetedItem?.title);
                  //   setCat_Id(selecetedItem?.id);
                  // }
                }}
              />

              <TextIn
                show={title?.length > 0 ? true : false}
                value={title}
                isVisible={false}
                onChangeText={val =>
                  setTitle(
                    val
                      ?.trimStart()
                      .replace(/\b\w/g, char => char.toUpperCase()),
                  )
                }
                height={normalize(50)}
                width={normalize(280)}
                fonts={Fonts.FustatMedium}
                borderColor={Colors.themeBoxBorder}
                borderWidth={1}
                maxLength={60}
                marginTop={normalize(15)}
                marginBottom={normalize(10)}
                marginLeft={normalize(10)}
                outlineTxtwidth={normalize(50)}
                label={'Project Title'}
                placeholder={'Enter Project Title'}
                //placeholderIcon={Icons.Email}
                placeholderTextColor={Colors.themePlaceholder}
                borderRadius={normalize(6)}
                fontSize={14}
                //Eyeshow={true}
                paddingLeft={normalize(10)}
                paddingRight={normalize(10)}
              />

              <TextIn
                show={description?.length > 0 ? true : false}
                value={description}
                isVisible={false}
                onChangeText={val =>
                  setDescription(
                    val
                      ?.trimStart()
                      .replace(/\b\w/g, char => char.toUpperCase()),
                  )
                }
                height={normalize(100)}
                textAreaHeight={normalize(80)}
                width={normalize(280)}
                fonts={Fonts.FustatMedium}
                borderColor={Colors.themeBoxBorder}
                borderWidth={1}
                maxLength={300}
                marginTop={normalize(15)}
                marginBottom={normalize(10)}
                marginLeft={normalize(10)}
                outlineTxtwidth={normalize(50)}
                label={'Project Description'}
                placeholder={'Enter Project Description'}
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

              <TextIn
                show={doc?.length > 0 ? true : false}
                value={doc}
                isVisible={false}
                onChangeText={val => setDoc(val?.trimStart())}
                height={normalize(50)}
                width={normalize(280)}
                fonts={Fonts.FustatMedium}
                borderColor={Colors.themeBoxBorder}
                borderWidth={1}
                maxLength={30}
                marginTop={normalize(10)}
                marginBottom={normalize(10)}
                marginLeft={normalize(10)}
                outlineTxtwidth={normalize(50)}
                label={'Upload document'}
                placeholder={'Upload document'}
                //placeholderIcon={Icons.Email}
                placeholderTextColor={Colors.themePlaceholder}
                borderRadius={normalize(6)}
                fontSize={14}
                editable={false}
                documentShown={true}
                paddingLeft={normalize(12)}
                onPress={() => {
                  handlecertificateUpload();
                }}
              />

              <GooglePlaces
                value={address}
                setValue={setAddress}
                setStreet={setStreet}
                label={'Project Address'}
                placeholder={'Enter Project Address'}
                marginLeft={normalize(10)}
                setLat={setLat}
                setLng={setLng}
                setCity={setCity}
                setState={setState}
                setStateCode={setStateCode}
                setCountry={setCountry}
                setZipcode={setZipcode}
                flx={1}
                width={normalize(280)}
              />

              <TextIn
                show={budget?.length > 0 ? true : false}
                value={budget}
                isVisible={false}
                onChangeText={val => setBudget(val?.trimStart())}
                height={normalize(50)}
                width={normalize(280)}
                fonts={Fonts.FustatMedium}
                borderColor={Colors.themeBoxBorder}
                borderWidth={1}
                maxLength={60}
                keyboardType={'number-pad'}
                marginTop={normalize(15)}
                marginBottom={normalize(10)}
                marginLeft={normalize(10)}
                outlineTxtwidth={normalize(50)}
                label={'Project Budget'}
                placeholder={'Enter Project Budget'}
                //placeholderIcon={Icons.Email}
                placeholderTextColor={Colors.themePlaceholder}
                borderRadius={normalize(6)}
                fontSize={14}
                //Eyeshow={true}
                paddingLeft={normalize(10)}
                paddingRight={normalize(10)}
                editable={item?.bid_count > 0 ? false : true}
              />

              <TextIn
                show={timeline?.length > 0 ? true : false}
                value={timeline}
                isVisible={false}
                onChangeText={val => setTimeline(val?.trimStart())}
                height={normalize(50)}
                width={normalize(280)}
                fonts={Fonts.FustatMedium}
                borderColor={Colors.themeBoxBorder}
                borderWidth={1}
                maxLength={60}
                keyboardType={'number-pad'}
                marginTop={normalize(15)}
                marginBottom={normalize(10)}
                marginLeft={normalize(10)}
                outlineTxtwidth={normalize(50)}
                label={'Project Timeline'}
                placeholder={'Enter Project Timeline'}
                //placeholderIcon={Icons.Email}
                placeholderTextColor={Colors.themePlaceholder}
                borderRadius={normalize(6)}
                fontSize={14}
                //Eyeshow={true}
                paddingLeft={normalize(10)}
                paddingRight={normalize(10)}
              />

              <Dropdown
                show={units?.length > 0 ? true : false}
                data={timelineUnits}
                height={normalize(50)}
                width={normalize(280)}
                borderColor={Colors.themeBoxBorder}
                borderWidth={1}
                fonts={Fonts.VerdanaProMedium}
                borderRadius={normalize(6)}
                fontSize={14}
                marginTop={normalize(15)}
                paddingLeft={normalize(12)}
                valueColor={Colors.themeBlack}
                paddingHorizontal={normalize(5)}
                label={'Project Timeline Units'}
                placeholder={'Select Units'}
                value={units}
                // modalHeight
                marginBottom={normalize(10)}
                marginLeft={normalize(10)}
                outlineTxtwidth={normalize(50)}
                placeholderTextColor={Colors.themePlaceholder}
                onChange={(selecetedItem, index) => {
                  setUnits(selecetedItem?.title);
                }}
              />
            </View>
            <View style={styles.btnMainContainer}>
              <NextBtn
                loading={
                  item?.id
                    ? ProjectReducer?.status == 'Project/EditProjectRequest'
                    : ProjectReducer?.status ==
                        'Project/CreateProjectRequest' ||
                      ProjectReducer?.status == 'Project/ProviderOfferRequest'
                }
                height={normalize(50)}
                title={'SUBMIT'}
                borderColor={Colors.themeGreen}
                color={Colors.themeWhite}
                backgroundColor={Colors.themeGreen}
                onPress={() => CreateProjectFun()}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CreateProject;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    height: '100%',
    width: '100%',
  },
  searchMainContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: normalize(7),
    flexDirection: 'row',
  },
  searchContainer: {
    width: '100%',
    height: normalize(50),
    backgroundColor: Colors.themeSearchBackground,
    borderColor: Colors.themeSearchBorder,
    borderWidth: 2,
    borderRadius: 8,
    flexDirection: 'row',
  },
  searchInputContainer: {
    width: '80%',
    fontSize: normalize(14),
    fontFamily: Fonts.FustatMedium,
    color: Colors.themeBlack,
    paddingHorizontal: normalize(10),
  },
  searchIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
    borderLeftWidth: 1,
    borderColor: Colors.themeSearchBorder,
  },
  headerTxt: {
    fontFamily: Fonts.FustatSemiBold,
    lineHeight: normalize(22),
    fontSize: normalize(16),
    color: Colors.themeWhite,
    paddingTop: normalize(10),
    paddingBottom: normalize(5),
  },
  featuredContainer: {
    width: normalize(110),
    backgroundColor: Colors.themeWhite,
    borderRadius: normalize(12),
    marginVertical: normalize(10),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(15),
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
  featuredImg: {
    width: normalize(56),
    height: normalize(56),
    borderRadius: normalize(56 / 2),
  },

  featuredImgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredTxtContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: normalize(10),
  },
  featuredLocationImg: {
    width: normalize(11),
    height: normalize(11),
    marginRight: normalize(2),
  },
  featuredStarImg: {
    width: normalize(13),
    height: normalize(13),
    marginRight: normalize(3),
    tintColor: Colors.themeStarColor,
  },
  featuredStarRatingTxt: {
    fontFamily: Fonts.FustatMedium,
    fontSize: normalize(12),
    color: Colors.themeBlack,
    lineHeight: normalize(16),
  },
  featuredStarRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(24),
    width: normalize(60),
    backgroundColor: Colors.themeStarRatingBackground,
    borderRadius: normalize(30),
    marginTop: normalize(10),
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
    paddingHorizontal: normalize(18),
  },
  DropdownContainer: {
    padding: normalize(10),
    backgroundColor: 'white',
    borderRadius: normalize(10),
    marginTop: normalize(2),
    width: '95%',
    alignSelf: 'center',
  },
});
