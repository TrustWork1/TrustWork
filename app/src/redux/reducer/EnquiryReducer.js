import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: '',
  isLoading: true,
  error: {},
  sendEnquiryResponse: {},
  enquiryListResponse: {},
  deleteEnquiryResponse: {},
  enquiryDetailsResponse: {},
  quotationDetailsResponse: {},
  quotationAcceptRejectResponse: {},
  paymentIntentResponse: {},
  paymentDetailsResponse: {},
  estimationAcceptRejectResponse: {},
  uploadDigitalSignResponse: {},
  availableDatesResponse: {},
  availableTimeSlotsResponse: {},
  appointmentBookingResponse: {},
  vendorSiteVisitListResponse: {},
  vendorAddSiteVisitDataResponse: {},
  vendorAddSiteVisitListResponse: {},
  vendorShowSiteVisitSOWResponse: {},
  vendorDeleteSiteVisitResponse: {},
  vendorUploadDigitalSignResponse: {},
  appointmentTimelineListResponse: {},
  sendAppointmentTimelineMessageResponse: {},
  vendorRescheduleResponse: {},
  vendorVisitEstimationResponse: {},
  rejectSOWResponse: {},
  managerVendorListResponse: {},
  clientUploadDigitalSignResponse: {},
  vendorUploadContractSignResponse: {},
  vendorAddSiteVisitDataUpdateResponse: {},
  groupChatSeenResponse: {},
};

const EnquirySlice = createSlice({
  name: 'Enquiry',
  initialState,
  reducers: {
    // availableDates //
    availableDatesRequest(state, action) {
      state.status = action.type;
    },
    availableDatesSuccess(state, action) {
      state.availableDatesResponse = action.payload;
      state.status = action.type;
    },
    availableDatesFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // availableTimeSlots //
    availableTimeSlotsRequest(state, action) {
      state.status = action.type;
    },
    availableTimeSlotsSuccess(state, action) {
      state.availableTimeSlotsResponse = action.payload;
      state.status = action.type;
    },
    availableTimeSlotsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // appointmentBooking //
    appointmentBookingRequest(state, action) {
      state.status = action.type;
    },
    appointmentBookingSuccess(state, action) {
      state.appointmentBookingResponse = action.payload;
      state.status = action.type;
    },
    appointmentBookingFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // sendEnquiry //
    sendEnquiryRequest(state, action) {
      state.status = action.type;
    },
    sendEnquirySuccess(state, action) {
      state.sendEnquiryResponse = action.payload;
      state.status = action.type;
    },
    sendEnquiryFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // enquiryList //
    enquiryListRequest(state, action) {
      state.status = action.type;
    },
    enquiryListSuccess(state, action) {
      state.enquiryListResponse = action.payload;
      state.status = action.type;
    },
    enquiryListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // deleteEnquiry //
    deleteEnquiryRequest(state, action) {
      state.status = action.type;
    },
    deleteEnquirySuccess(state, action) {
      state.deleteEnquiryResponse = action.payload;
      state.status = action.type;
    },
    deleteEnquiryFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // enquiryDetails //
    enquiryDetailsRequest(state, action) {
      state.status = action.type;
    },
    enquiryDetailsSuccess(state, action) {
      state.enquiryDetailsResponse = action.payload;
      state.status = action.type;
    },
    enquiryDetailsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // quotationDetails //
    quotationDetailsRequest(state, action) {
      state.status = action.type;
    },
    quotationDetailsSuccess(state, action) {
      state.quotationDetailsResponse = action.payload;
      state.status = action.type;
    },
    quotationDetailsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // quotationAcceptReject //
    quotationAcceptRejectRequest(state, action) {
      state.status = action.type;
    },
    quotationAcceptRejectSuccess(state, action) {
      state.quotationAcceptRejectResponse = action.payload;
      state.status = action.type;
    },
    quotationAcceptRejectFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // paymentIntent //
    paymentIntentRequest(state, action) {
      state.status = action.type;
    },
    paymentIntentSuccess(state, action) {
      state.paymentIntentResponse = action.payload;
      state.status = action.type;
    },
    paymentIntentFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // paymentDetails //
    paymentDetailsRequest(state, action) {
      state.status = action.type;
    },
    paymentDetailsSuccess(state, action) {
      state.paymentDetailsResponse = action.payload;
      state.status = action.type;
    },
    paymentDetailsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // estimationAcceptReject //
    estimationAcceptRejectRequest(state, action) {
      state.status = action.type;
    },
    estimationAcceptRejectSuccess(state, action) {
      state.estimationAcceptRejectResponse = action.payload;
      state.status = action.type;
    },
    estimationAcceptRejectFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // uploadDigitalSign //
    uploadDigitalSignRequest(state, action) {
      state.status = action.type;
    },
    uploadDigitalSignSuccess(state, action) {
      state.uploadDigitalSignResponse = action.payload;
      state.status = action.type;
    },
    uploadDigitalSignFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // vendorSiteVisitList //
    vendorSiteVisitListRequest(state, action) {
      state.status = action.type;
    },
    vendorSiteVisitListSuccess(state, action) {
      state.vendorSiteVisitListResponse = action.payload;
      state.status = action.type;
    },
    vendorSiteVisitListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // vendorAddSiteVisitData //
    vendorAddSiteVisitDataRequest(state, action) {
      state.status = action.type;
    },
    vendorAddSiteVisitDataSuccess(state, action) {
      state.vendorAddSiteVisitDataResponse = action.payload;
      state.status = action.type;
    },
    vendorAddSiteVisitDataFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // vendorAddSiteVisitDataUpdate //
    vendorAddSiteVisitDataUpdateRequest(state, action) {
      state.status = action.type;
    },
    vendorAddSiteVisitDataUpdateSuccess(state, action) {
      state.vendorAddSiteVisitDataUpdateResponse = action.payload;
      state.status = action.type;
    },
    vendorAddSiteVisitDataUpdateFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // vendorAddSiteVisitList //
    vendorAddSiteVisitListRequest(state, action) {
      state.status = action.type;
    },
    vendorAddSiteVisitListSuccess(state, action) {
      state.vendorAddSiteVisitListResponse = action.payload;
      state.status = action.type;
    },
    vendorAddSiteVisitListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // vendorDeleteSiteVisit//
    vendorDeleteSiteVisitRequest(state, action) {
      state.status = action.type;
    },
    vendorDeleteSiteVisitSuccess(state, action) {
      state.vendorDeleteSiteVisitResponse = action.payload;
      state.status = action.type;
    },
    vendorDeleteSiteVisitFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // vendorShowSiteVisitSOW //
    vendorShowSiteVisitSOWRequest(state, action) {
      state.status = action.type;
    },
    vendorShowSiteVisitSOWSuccess(state, action) {
      state.vendorShowSiteVisitSOWResponse = action.payload;
      state.status = action.type;
    },
    vendorShowSiteVisitSOWFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // vendorUploadDigitalSign //
    vendorUploadDigitalSignRequest(state, action) {
      state.status = action.type;
    },
    vendorUploadDigitalSignSuccess(state, action) {
      state.vendorUploadDigitalSignResponse = action.payload;
      state.status = action.type;
    },
    vendorUploadDigitalSignFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // appointmentTimelineList //
    appointmentTimelineListRequest(state, action) {
      state.status = action.type;
    },
    appointmentTimelineListSuccess(state, action) {
      state.appointmentTimelineListResponse = action.payload;
      state.status = action.type;
    },
    appointmentTimelineListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // sendAppointmentTimelineListResponseimelineMessage //
    sendAppointmentTimelineMessageRequest(state, action) {
      state.status = action.type;
    },
    sendAppointmentTimelineMessageSuccess(state, action) {
      state.sendAppointmentTimelineMessageResponse = action.payload;
      state.status = action.type;
    },
    sendAppointmentTimelineMessageFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // vendorReschedule //
    vendorRescheduleRequest(state, action) {
      state.status = action.type;
    },
    vendorRescheduleSuccess(state, action) {
      state.vendorRescheduleResponse = action.payload;
      state.status = action.type;
    },
    vendorRescheduleFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // vendorVisitEstimation //
    vendorVisitEstimationRequest(state, action) {
      state.status = action.type;
    },
    vendorVisitEstimationSuccess(state, action) {
      state.vendorVisitEstimationResponse = action.payload;
      state.status = action.type;
    },
    vendorVisitEstimationFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // rejectSOW //
    rejectSOWRequest(state, action) {
      state.status = action.type;
    },
    rejectSOWSuccess(state, action) {
      state.rejectSOWResponse = action.payload;
      state.status = action.type;
    },
    rejectSOWFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // managerVendorList //
    managerVendorListRequest(state, action) {
      state.status = action.type;
    },
    managerVendorListSuccess(state, action) {
      state.managerVendorListResponse = action.payload;
      state.status = action.type;
    },
    managerVendorListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // clientUploadDigitalSign //
    clientUploadDigitalSignRequest(state, action) {
      state.status = action.type;
    },
    clientUploadDigitalSignSuccess(state, action) {
      state.clientUploadDigitalSignResponse = action.payload;
      state.status = action.type;
    },
    clientUploadDigitalSignFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // vendorUploadContractSign //
    vendorUploadContractSignRequest(state, action) {
      state.status = action.type;
    },
    vendorUploadContractSignSuccess(state, action) {
      state.vendorUploadContractSignResponse = action.payload;
      state.status = action.type;
    },
    vendorUploadContractSignFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // groupChatSeen //
    groupChatSeenRequest(state, action) {
      state.status = action.type;
    },
    groupChatSeenSuccess(state, action) {
      state.groupChatSeenResponse = action.payload;
      state.status = action.type;
    },
    groupChatSeenFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
  },
});
export const {
  availableDatesRequest,
  availableDatesSuccess,
  availableDatesFailure,

  availableTimeSlotsRequest,
  availableTimeSlotsSuccess,
  availableTimeSlotsFailure,

  appointmentBookingRequest,
  appointmentBookingSuccess,
  appointmentBookingFailure,

  sendEnquiryRequest,
  sendEnquirySuccess,
  sendEnquiryFailure,

  enquiryListRequest,
  enquiryListSuccess,
  enquiryListFailure,

  deleteEnquiryRequest,
  deleteEnquirySuccess,
  deleteEnquiryFailure,

  enquiryDetailsRequest,
  enquiryDetailsSuccess,
  enquiryDetailsFailure,

  quotationDetailsRequest,
  quotationDetailsSuccess,
  quotationDetailsFailure,

  quotationAcceptRejectRequest,
  quotationAcceptRejectSuccess,
  quotationAcceptRejectFailure,

  paymentIntentRequest,
  paymentIntentSuccess,
  paymentIntentFailure,

  paymentDetailsRequest,
  paymentDetailsSuccess,
  paymentDetailsFailure,

  estimationAcceptRejectRequest,
  estimationAcceptRejectSuccess,
  estimationAcceptRejectFailure,

  uploadDigitalSignRequest,
  uploadDigitalSignSuccess,
  uploadDigitalSignFailure,

  vendorSiteVisitListRequest,
  vendorSiteVisitListSuccess,
  vendorSiteVisitListFailure,

  vendorAddSiteVisitDataRequest,
  vendorAddSiteVisitDataSuccess,
  vendorAddSiteVisitDataFailure,

  vendorAddSiteVisitListRequest,
  vendorAddSiteVisitListSuccess,
  vendorAddSiteVisitListFailure,

  vendorShowSiteVisitSOWRequest,
  vendorShowSiteVisitSOWSuccess,
  vendorShowSiteVisitSOWFailure,

  vendorDeleteSiteVisitRequest,
  vendorDeleteSiteVisitSuccess,
  vendorDeleteSiteVisitFailure,

  vendorUploadDigitalSignRequest,
  vendorUploadDigitalSignSuccess,
  vendorUploadDigitalSignFailure,

  appointmentTimelineListRequest,
  appointmentTimelineListSuccess,
  appointmentTimelineListFailure,

  sendAppointmentTimelineMessageRequest,
  sendAppointmentTimelineMessageSuccess,
  sendAppointmentTimelineMessageFailure,

  vendorRescheduleRequest,
  vendorRescheduleSuccess,
  vendorRescheduleFailure,

  vendorVisitEstimationRequest,
  vendorVisitEstimationSuccess,
  vendorVisitEstimationFailure,

  rejectSOWRequest,
  rejectSOWSuccess,
  rejectSOWFailure,

  managerVendorListRequest,
  managerVendorListSuccess,
  managerVendorListFailure,

  clientUploadDigitalSignRequest,
  clientUploadDigitalSignSuccess,
  clientUploadDigitalSignFailure,

  vendorUploadContractSignRequest,
  vendorUploadContractSignSuccess,
  vendorUploadContractSignFailure,

  vendorAddSiteVisitDataUpdateRequest,
  vendorAddSiteVisitDataUpdateSuccess,
  vendorAddSiteVisitDataUpdateFailure,

  groupChatSeenRequest,
  groupChatSeenSuccess,
  groupChatSeenFailure,
} = EnquirySlice.actions;

export default EnquirySlice.reducer;
