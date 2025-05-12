import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: '',
  isLoading: true,
  error: {},
  editProfileResponse: {},
  viewProfileResponse: {},
  cmsResponse: {},
  contactUsResponse: {},
  contactUsDetailsResponse: {},
  specializationListResponse: {},
  userDetailsResponse: {},
  readUnReadNotificationResponse: {},
  notificationResponse: {},
  notificationStatusChangeResponse: {},
  deleteNotificationResponse: {},
  bankAccountResponse: {},
  addBankAccountResponse: {},
  deleteBankAccountResponse: {},
  updateBankAccountResponse: {},
  makePrimaryResponse: {},
  SwitchAccountResponse: {},
  WithdrawPointsResponse: {},
  BankTransferResponse: {},
  deleteGalleryItemResponse: {},
};

const ProfileSlice = createSlice({
  name: 'Profile',
  initialState,
  reducers: {
    // specializationList //
    specializationListRequest(state, action) {
      state.status = action.type;
    },
    specializationListSuccess(state, action) {
      state.specializationListResponse = action.payload;
      state.status = action.type;
    },
    specializationListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // userDetails //
    userDetailsRequest(state, action) {
      state.status = action.type;
    },
    userDetailsSuccess(state, action) {
      state.userDetailsResponse = action.payload;
      state.status = action.type;
    },
    userDetailsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // editProfile //
    editProfileRequest(state, action) {
      state.status = action.type;
    },
    editProfileSuccess(state, action) {
      state.editProfileResponse = action.payload;
      state.status = action.type;
    },
    editProfileFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // viewProfile //
    viewProfileRequest(state, action) {
      state.status = action.type;
    },
    viewProfileSuccess(state, action) {
      state.viewProfileResponse = action.payload;
      state.status = action.type;
    },
    viewProfileFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // Privacypolicy & Term&Conditions & CookiesPloicy//
    cmsRequest(state, action) {
      state.status = action.type;
    },
    cmsSuccess(state, action) {
      state.cmsResponse = action.payload;
      state.status = action.type;
    },
    cmsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // contactUs //
    contactUsRequest(state, action) {
      state.status = action.type;
    },
    contactUsSuccess(state, action) {
      state.contactUsResponse = action.payload;
      state.status = action.type;
    },
    contactUsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // contactUsDetails //
    contactUsDetailsRequest(state, action) {
      state.status = action.type;
    },
    contactUsDetailsSuccess(state, action) {
      state.contactUsDetailsResponse = action.payload;
      state.status = action.type;
    },
    contactUsDetailsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // NOTIFICATION //
    notificationRequest(state, action) {
      state.status = action.type;
    },
    notificationSuccess(state, action) {
      state.notificationResponse = action.payload;
      state.status = action.type;
    },
    notificationFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // NOTIFICATIONStatusChange //
    notificationStatusChangeRequest(state, action) {
      state.status = action.type;
    },
    notificationStatusChangeSuccess(state, action) {
      state.notificationStatusChangeResponse = action.payload;
      state.status = action.type;
    },
    notificationStatusChangeFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // delete NOTIFICATION //
    deleteNotificationRequest(state, action) {
      state.status = action.type;
    },
    deleteNotificationSuccess(state, action) {
      state.deleteNotificationResponse = action.payload;
      state.status = action.type;
    },
    deleteNotificationFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // bankAccount //
    bankAccountRequest(state, action) {
      state.status = action.type;
    },
    bankAccountSuccess(state, action) {
      state.bankAccountResponse = action.payload;
      state.status = action.type;
    },
    bankAccountFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // addBankAccount //
    addBankAccountRequest(state, action) {
      state.status = action.type;
    },
    addBankAccountSuccess(state, action) {
      state.addBankAccountResponse = action.payload;
      state.status = action.type;
    },
    addBankAccountFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // deleteBankAccount //
    deleteBankAccountRequest(state, action) {
      state.status = action.type;
    },
    deleteBankAccountSuccess(state, action) {
      state.deleteBankAccountResponse = action.payload;
      state.status = action.type;
    },
    deleteBankAccountFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // updateBankAccount //
    updateBankAccountRequest(state, action) {
      state.status = action.type;
    },
    updateBankAccountSuccess(state, action) {
      state.updateBankAccountResponse = action.payload;
      state.status = action.type;
    },
    updateBankAccountFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // makePrimary //
    makePrimaryRequest(state, action) {
      state.status = action.type;
    },
    makePrimarySuccess(state, action) {
      state.makePrimaryResponse = action.payload;
      state.status = action.type;
    },
    makePrimaryFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // SwitchAccount //
    SwitchAccountRequest(state, action) {
      state.status = action.type;
    },
    SwitchAccountSuccess(state, action) {
      state.SwitchAccountResponse = action.payload;
      state.status = action.type;
    },
    SwitchAccountFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // withdraw points //
    WithdrawPointsRequest(state, action) {
      state.status = action.type;
    },
    WithdrawPointsSuccess(state, action) {
      state.WithdrawPointsResponse = action.payload;
      state.status = action.type;
    },
    WithdrawPointsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    ///////////////////// Bank Transfer //////////////////
    BankTransferRequest(state, action) {
      state.status = action.type;
    },
    BankTransferSuccess(state, action) {
      state.BankTransferResponse = action.payload;
      state.status = action.type;
    },
    BankTransferFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // deleteGalleryItem //
    deleteGalleryItemRequest(state, action) {
      state.status = action.type;
    },
    deleteGalleryItemSuccess(state, action) {
      state.deleteGalleryItemResponse = action.payload;
      state.status = action.type;
    },
    deleteGalleryItemFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
  },
});
export const {
  specializationListRequest,
  specializationListSuccess,
  specializationListFailure,

  userDetailsRequest,
  userDetailsSuccess,
  userDetailsFailure,

  editProfileRequest,
  editProfileSuccess,
  editProfileFailure,

  viewProfileRequest,
  viewProfileSuccess,
  viewProfileFailure,

  cmsRequest,
  cmsSuccess,
  cmsFailure,

  contactUsRequest,
  contactUsSuccess,
  contactUsFailure,

  contactUsDetailsRequest,
  contactUsDetailsSuccess,
  contactUsDetailsFailure,

  notificationRequest,
  notificationSuccess,
  notificationFailure,

  notificationStatusChangeRequest,
  notificationStatusChangeSuccess,
  notificationStatusChangeFailure,

  deleteNotificationRequest,
  deleteNotificationSuccess,
  deleteNotificationFailure,

  bankAccountRequest,
  bankAccountSuccess,
  bankAccountFailure,

  addBankAccountRequest,
  addBankAccountSuccess,
  addBankAccountFailure,

  deleteBankAccountRequest,
  deleteBankAccountSuccess,
  deleteBankAccountFailure,

  updateBankAccountRequest,
  updateBankAccountSuccess,
  updateBankAccountFailure,

  makePrimaryRequest,
  makePrimarySuccess,
  makePrimaryFailure,

  SwitchAccountRequest,
  SwitchAccountSuccess,
  SwitchAccountFailure,

  WithdrawPointsRequest,
  WithdrawPointsSuccess,
  WithdrawPointsFailure,

  BankTransferRequest,
  BankTransferSuccess,
  BankTransferFailure,

  deleteGalleryItemRequest,
  deleteGalleryItemSuccess,
  deleteGalleryItemFailure,
} = ProfileSlice.actions;

export default ProfileSlice.reducer;
