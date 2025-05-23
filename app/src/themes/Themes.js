import {Dimensions} from 'react-native';
import allimages from './Images';
const {width, height, fontScale} = Dimensions.get('screen');

export const Colors = {
  themeBackground: '#EEF6EA',
  themeBlack: '#111610',
  themeGreen: '#4B991E',
  themeYellow: '#DCE210',
  themeWhite: '#FFFFFF',
  themeGray: '#4B5654',
  themeBoxBorder: '#DADADA',
  themePlaceholder: '#868686',
  themeInactiveTxt: '#494949',
  themeTabContainer: '#DEDEDE',
  themeRed: '#E73D44',
  themeDocBackground: '#F7F7F7',
  themeSearchBackground: '#EEF6EACC',
  themeSearchBorder: '#8FB578',
  themeStarColor: '#ECA315',
  themeStarRatingBackground: '#ECA31533',
  themeProviderBackground: '#4C9D1E1A',
  themeProjectBackground: '#D2DDCC',
  themeLightYellow: '#DCE2104D',
};

export const Sizes = {
  width,
  height,
  fontScale,
};

export const Fonts = {
  FustatBold: 'Fustat-Bold',
  FustatMedium: 'Fustat-Medium',
  FustatRegular: 'Fustat-Regular',
  FustatSemiBold: 'Fustat-SemiBold',
};
export const Icons = {
  Logo: require('../assets/icon/logo.png'),
  LocationAccess: require('../assets/icon/Location_Access.png'),
  EyeShow: require('../assets/icon/eyeClose.png'),
  EyeHide: require('../assets/icon/eyeOpen.png'),
  // Tick: require('../assets/icon/tick.png'),
  // UnTick: require('../assets/icon/unTick.png'),
  // ArrowLeft: require('../assets/icon/arrowLeft.png'),
  Notification: require('../assets/icon/notification.png'),
  Message: require('../assets/icon/message.png'),
  BackIcon: require('../assets/icon/backIcon.png'),
  Star: require('../assets/icon/star.png'),
  UnfillStar: require('../assets/icon/unFillStar.png'),
  // HomeSendEnquiry: require('../assets/icon/sendEnquiry.png'),
  // HomeQuote: require('../assets/icon/quote.png'),
  // HomeGuesstimate: require('../assets/icon/homeGuesstimate.png'),
  // HomeEstimation: require('../assets/icon/homeEstimation.png'),
  // HomePayment: require('../assets/icon/payment.png'),
  // HomeWorkDone: require('../assets/icon/workDone.png'),
  // Delete: require('../assets/icon/delete.png'),
  // NotiListIcon: require('../assets/icon/notiList_Icon.png'),
  // EditProfile: require('../assets/icon/edit_Profile.png'),
  // Menu_ChangePassword: require('../assets/icon/change_Password.png'),
  // Menu_Legal: require('../assets/icon/legal.png'),
  Contact: require('../assets/icon/contact.png'),

  // Menu_DeleteAccount: require('../assets/icon/delete_Account.png'),
  // ProfileIcon: require('../assets/icon/ProfileIcon.png'),
  // Menu_Enquiry: require('../assets/icon/enquiry.png'),
  // Contact_Us: require('../assets/icon/contactUs.png'),
  Email: require('../assets/icon/email.png'),
  // Phone: require('../assets/icon/phone.png'),
  // Doc: require('../assets/icon/doc.png'),
  DownArrow: require('../assets/icon/downArrow.png'),
  Cross: require('../assets/icon/cross.png'),
  // Calendar: require('../assets/icon/calendar.png'),
  Account: require('../assets/icon/account.png'),
  // ArrowRight: require('../assets/icon/arrowRight.png'),
  CheckBoxFill: require('../assets/icon/checkBoxFill.png'),
  CheckboxUnFill: require('../assets/icon/checkboxUnFill.png'),
  // ModalBack: require('../assets/icon/modalBack.png'),
  // Radio_UnClicked: require('../assets/icon/radioUnclicked.png'),
  // Radio_Clicked: require('../assets/icon/radioClicked.png'),
  // Cash: require('../assets/icon/Cash.png'),
  // Card: require('../assets/icon/Card.png'),
  // Search: require('../assets/icon/search.png'),
  // Emoji: require('../assets/icon/emoji.png'),
  // Attachments: require('../assets/icon/attachments.png'),
  // Send: require('../assets/icon/send.png'),
  // Message_Icon: require('../assets/icon/message1.png'),
  // Bill: require('../assets/icon/bill.png'),
  // Document_Share: require('../assets/icon/document.png'),
  // Message_Icon2: require('../assets/icon/message2.png'),

  user: require('../assets/icon/user.png'),
  // camera: require('../assets/icon/camera.png'),
  selectLocation: require('../assets/icon/selectLocation.png'),
  Radio_Tick: require('../assets/icon/Radio_Tick.png'),
  // UnTickcircle: require('../assets/icon/UnTickcircle.png'),
  // support: require('../assets/icon/support.png'),
  // tabmessage: require('../assets/icon/tabmessage.png'),
  // taskReject: require('../assets/icon/taskReject.png'),
  // taskAssign: require('../assets/icon/taskAssign.png'),
  // taskComplete: require('../assets/icon/taskComplete.png'),
  // taskEstimate: require('../assets/icon/taskEstimate.png'),
  // selectMsg: require('../assets/icon/selectMsg.png'),
  // selectSupport: require('../assets/icon/selectSupport.png'),
  // BusinessIcon: require('../assets/icon/BusinessIcon.png'),
  VendorPayout: require('../assets/icon/VendorPayout.png'),
  Warning: require('../assets/icon/warning.png'),
  RightArrow: require('../assets/icon/rightArrow.png'),
  UploadProfile: require('../assets/icon/uploadProfile.png'),
  // AddMorePhoto: require('../assets/icon/addMore_photo.png'),
  // UploadImage: require('../assets/icon/uploadImage.png'),
  // modalClose: require('../assets/icon/modalClose.png'),
  // bankIcon: require('../assets/icon/bankIcon.png'),
  // ThreeDots: require('../assets/icon/threeDots.png'),
  // dropIcon: require('../assets/icon/dropIcon.png'),
  // nextPrev: require('../assets/icon/nextPrev.png'),
  // DoubleTick: require('../assets/icon/doubleTick.png'),
  // SingleTick: require('../assets/icon/singleTick.png'),
  // Exclamation: require('../assets/icon/exclamation.png'),
  // Reply: require('../assets/icon/reply.png'),
  // Site_Visit: require('../assets/icon/site_Visit.png'),
  // Share: require('../assets/icon/share.png'),
  // DeleteBin: require('../assets/icon/bin.png'),
  // EditPen: require('../assets/icon/edit.png'),
  // MaterialManagement: require('../assets/icon/materialManagement.png'),
  // Refresh: require('../assets/icon/refresh.png'),

  // BankofAmerica: require('../assets/icon/BankofAmerica.png'),
  // JPMorganChase: require('../assets/icon/JPMorganChase.png'),
  // WellsFargo: require('../assets/icon/WellsFargo.png'),
  // Citibank: require('../assets/icon/Citibank.png'),
  // USBank: require('../assets/icon/USBank.png'),
  // PNCBank: require('../assets/icon/PNCBank.png'),
  // CapitalOne: require('../assets/icon/CapitalOne.png'),
  // TDBank: require('../assets/icon/TDBank.png'),
  // TruistBank: require('../assets/icon/TruistBank.png'),
  // SunTrustBank: require('../assets/icon/SunTrustBank.png'),
  // OtherBank: require('../assets/icon/OtherBank.png'),
  // UnTickSign: require('../assets/icon/unTickSign.png'),
  // Verify: require('../assets/icon/verify.png'),
  // Download: require('../assets/icon/Download.png'),
  Profile_Placeholder: require('../assets/icon/Profile_Placeholder.png'),
  Plan_Crown: require('../assets/icon/Plan_Crown.png'),
  Filter: require('../assets/icon/Filter.png'),
  Upload: require('../assets/icon/upload.png'),
  LocationPin: require('../assets/icon/location_Pin.png'),
  clockTime: require('../assets/icon/clockTime.png'),
  WorkType: require('../assets/icon/workType.png'),
  Experience: require('../assets/icon/experience.png'),
  Plumber: require('../assets/icon/plumber.png'),
  Construction: require('../assets/icon/construction.png'),
  Painter: require('../assets/icon/painter.png'),
  Electrician: require('../assets/icon/electrician.png'),
  Mechanic: require('../assets/icon/mechanic.png'),
  Plus: require('../assets/icon/plus.png'),
  status: require('../assets/icon/status.png'),
  MultipleMap: require('../assets/icon/MultipleMap.png'),
  SignleMap: require('../assets/icon/SignleMap.png'),
  mapPin: require('../assets/icon/mapPin.png'),
  clock: require('../assets/icon/clock.png'),
  dollar: require('../assets/icon/dollar.png'),
  payStatus: require('../assets/icon/payStatus.png'),
  profileCircle: require('../assets/icon/profileCircle.png'),
  editPencil: require('../assets/icon/editPencil.png'),
  emailbox: require('../assets/icon/emailbox.png'),
  phoneBox: require('../assets/icon/phoneBox.png'),
  about: require('../assets/icon/about.png'),
  service: require('../assets/icon/service.png'),
  settings: require('../assets/icon/settings.png'),
  wallet: require('../assets/icon/wallet.png'),
  help: require('../assets/icon/help.png'),
  switch: require('../assets/icon/switch.png'),
  logout: require('../assets/icon/logout.png'),
  bidAmount: require('../assets/icon/bidAmount.png'),
  cal: require('../assets/icon/cal.png'),
  sendMsg: require('../assets/icon/sendMsg.png'),
  attechment: require('../assets/icon/attechment.png'),
  landmark: require('../assets/icon/landmark.png'),
  Bank_1: require('../assets/icon/Bank_1.png'),
  deleteIcon: require('../assets/icon/deleteIcon.png'),
  editIcon: require('../assets/icon/editIcon.png'),
  UserPro: require('../assets/icon/userPro.png'),
  Referal1: require('../assets/icon/booking.png'),
  Referal2: require('../assets/icon/job-offer.png'),
  Referal3: require('../assets/icon/letter.png'),
  ShareNew: require('../assets/icon/sharenew.png'),
  fileDoc: require('../assets/icon/fileDoc.png'),
  addImage: require('../assets/icon/addImage.png'),
  dummyImage: require('../assets/icon/dummy_img.png'),
};

export const GifImage = {
  Done: require('../assets/gif/doneTick.gif'),
};

export const Images = allimages;
