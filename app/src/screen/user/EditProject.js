import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../components/Header';
import NextBtn from '../../components/NextBtn';
import TextIn from '../../components/TextIn';
import NavigationService from '../../navigators/NavigationService';
import {
  EditProjectRequest,
  JobCategoryRequest,
} from '../../redux/reducer/ProjectReducer';
import css from '../../themes/css';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import normalize from '../../utils/helpers/normalize';
import showErrorAlert from '../../utils/helpers/Toast';
let status = '';

const EditProject = props => {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [budget, setBudget] = useState(0);
  const [timeline, setTimeline] = useState('');
  const [isCatList, setIsCatList] = useState(false);
  const [Cat_Id, setCat_Id] = useState('');

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const ProjectReducer = useSelector(state => state.ProjectReducer);

  // console.log(props);
  useEffect(() => {
    dispatch(JobCategoryRequest());
    setCat_Id(props?.route?.params?.data?.project_category?.id);
    setCategory(props?.route?.params?.data?.project_category?.title);
    setTitle(props?.route?.params?.data?.project_title);
    setDescription(props?.route?.params?.data?.project_description);
    setAddress(props?.route?.params?.data?.project_address);
    setBudget(JSON.stringify(props?.route?.params?.data?.project_budget));
    setTimeline(props?.route?.params?.data?.project_timeline);
  }, []);

  const EditProjectFun = () => {
    if (Cat_Id == '') {
      showErrorAlert('Please select Project Category');
    } else if (title?.trim() == '') {
      showErrorAlert('Please enter project title');
    } else if (description?.trim() == '') {
      showErrorAlert('Please enter project description');
    } else if (address?.trim() == '') {
      showErrorAlert('Please enter project address');
    } else if (budget == 0) {
      showErrorAlert('Please enter project budget');
    } else if (!budget.match(/^[0-9]+$/)) {
      showErrorAlert('please use numerical value for budget');
    } else if (timeline?.trim() == '') {
      showErrorAlert('Please enter project timeline');
    } else {
      let obj = {
        data: {
          project_category: Cat_Id,
          // project_location: '',
          project_title: title,
          project_description: description,
          project_address: address,
          project_budget: Number(budget),
          project_timeline: timeline,
          // client: AuthReducer?.ProfileResponse?.data?.id,
        },
        id: props?.route?.params?.data?.id,
      };
      // console.log(obj);
      dispatch(EditProjectRequest(obj));
    }
  };

  const jobCatListRender = ({item, index}) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            setCategory(item?.title);
            setCat_Id(item?.id);
            setIsCatList(false);
          }}>
          <Text style={[css.mt2, css.txtStyle]}>{`${item?.title}`}</Text>
        </TouchableOpacity>
      </>
    );
  };

  if (status == '' || ProjectReducer.status != status) {
    switch (ProjectReducer.status) {
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
      <Header backIcon={Icons.BackIcon} headerTitle={'Edit Project'} />
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
              <TextIn
                show={category?.length > 0 ? true : false}
                value={category}
                isVisible={false}
                onChangeText={val => setCategory(val?.trimStart())}
                height={normalize(50)}
                width={normalize(280)}
                fonts={Fonts.FustatMedium}
                borderColor={Colors.themeBoxBorder}
                borderWidth={1}
                maxLength={60}
                //marginTop={normalize(25)}
                marginBottom={normalize(10)}
                marginLeft={normalize(10)}
                outlineTxtwidth={normalize(50)}
                label={'Project Category'}
                placeholder={'Real Estate'}
                //placeholderIcon={Icons.Email}
                placeholderTextColor={Colors.themePlaceholder}
                borderRadius={normalize(6)}
                fontSize={14}
                arrowshow={true}
                paddingLeft={normalize(10)}
                paddingRight={normalize(10)}
                editable={false}
                onPress={() => setIsCatList(!isCatList)}
              />

              {isCatList && (
                <View style={[styles.DropdownContainer]}>
                  <FlatList
                    data={ProjectReducer.JobCategoryResponse.data}
                    renderItem={jobCatListRender}
                    // contentContainerStyle={[styles.DropdownContainer]}
                  />
                </View>
              )}

              <TextIn
                show={title?.length > 0 ? true : false}
                value={title}
                isVisible={false}
                onChangeText={val => setTitle(val?.trimStart())}
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
                onChangeText={val => setDescription(val?.trimStart())}
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
                show={address?.length > 0 ? true : false}
                value={address}
                isVisible={false}
                onChangeText={val => setAddress(val?.trimStart())}
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
                label={'Project Address'}
                placeholder={'Enter Project Address'}
                //placeholderIcon={Icons.Email}
                placeholderTextColor={Colors.themePlaceholder}
                borderRadius={normalize(6)}
                fontSize={14}
                //Eyeshow={true}
                paddingLeft={normalize(10)}
                paddingRight={normalize(10)}
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
            </View>
            <View style={styles.btnMainContainer}>
              <NextBtn
                loading={ProjectReducer?.status == 'Project/EditProjectRequest'}
                height={normalize(50)}
                title={'SUBMIT'}
                borderColor={Colors.themeGreen}
                color={Colors.themeWhite}
                backgroundColor={Colors.themeGreen}
                onPress={() => {
                  EditProjectFun();
                }}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default EditProject;

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
