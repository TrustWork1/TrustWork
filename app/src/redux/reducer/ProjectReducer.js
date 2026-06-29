import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: '',
  isLoading: false,
  error: {},
  CreateProjectResponse: {},
  ProviderOfferResponse: {},
  EditProjectResponse: {},
  projectListResponse: {},
  clientActiveProjectResponse: {},
  ProviderProjectListResponse: {},
  ProviderOfferListResponse: {},
  projectDetailsResponse: {},
  JobCategoryResponse: {},
  JobCategoryProviderResponse: {},
  ProActiveProjectResponse: {},
  SendBidResponse: {},
  ProjectBidsResponse: {},
  bidStatusResponse: {},
  bidListResponse: {},
  markAsCompletedResponse: {},
  sendFeedBackResponse: {},
  getFeedBackResponse: {},
  sendFeedBackProviderResponse: {},
  getFeedBackProviderResponse: {},
  projectListByLocationResponse: {},
  getOveralReviewResponse: {},
  projectDetailsByLocationResponse: {},
  cancelBidResponse: {},
  PendingPaymentResponse: {},
  PaymentHistoryResponse: {},
  ProviderPaymentListResponse: {},
  UploadImagesResponse: {},
  RejectBidResponse: {},
  paymentReqResponse: {},
  bidDetailsResponse:{},
  orangePayResponse: {},
};

const ProjectSlice = createSlice({
  name: 'Project',
  initialState,

  reducers: {
    clearProjectReducer(state, action) {
      state.status = action.type;
    },

    ///////////////////// CreateProject ///////////////////////
    CreateProjectRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    CreateProjectSuccess(state, action) {
      state.isLoading = false;
      state.CreateProjectResponse = action.payload;
      state.status = action.type;
    },
    CreateProjectFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// ProviderOffer ///////////////////////
    ProviderOfferRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    ProviderOfferSuccess(state, action) {
      state.isLoading = false;
      state.ProviderOfferResponse = action.payload;
      state.status = action.type;
    },
    ProviderOfferFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// EditProject ///////////////////////
    EditProjectRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    EditProjectSuccess(state, action) {
      state.isLoading = false;
      state.EditProjectResponse = action.payload;
      state.status = action.type;
    },
    EditProjectFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// projectList ///////////////////
    projectListRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    projectListSuccess(state, action) {
      state.isLoading = false;
      state.projectListResponse = action.payload;
      state.status = action.type;
    },
    projectListFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// clientActiveProject ///////////////////
    clientActiveProjectRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    clientActiveProjectSuccess(state, action) {
      state.isLoading = false;
      state.clientActiveProjectResponse = action.payload;
      state.status = action.type;
    },
    clientActiveProjectFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// ProviderProjectList ///////////////////
    ProviderProjectListRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    ProviderProjectListSuccess(state, action) {
      state.isLoading = false;
      state.ProviderProjectListResponse = action.payload;
      state.status = action.type;
    },
    ProviderProjectListFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// ProviderOfferList ///////////////////
    ProviderOfferListRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    ProviderOfferListSuccess(state, action) {
      state.isLoading = false;
      state.ProviderOfferListResponse = action.payload;
      state.status = action.type;
    },
    ProviderOfferListFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //////////////////// projectDetails ///////////////////////
    projectDetailsRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    projectDetailsSuccess(state, action) {
      state.isLoading = false;
      state.projectDetailsResponse = action.payload;
      state.status = action.type;
    },
    projectDetailsFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //////////////////// JobCategory ////////////////////
    JobCategoryRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    JobCategorySuccess(state, action) {
      state.isLoading = false;
      state.JobCategoryResponse = action.payload;
      state.status = action.type;
    },
    JobCategoryFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //////////////////// JobCategoryProvider ////////////////////
    JobCategoryProviderRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    JobCategoryProviderSuccess(state, action) {
      state.isLoading = false;
      state.JobCategoryProviderResponse = action.payload;
      state.status = action.type;
    },
    JobCategoryProviderFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //////////////////// ProActiveProject ////////////////////
    ProActiveProjectRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    ProActiveProjectSuccess(state, action) {
      state.isLoading = false;
      state.ProActiveProjectResponse = action.payload;
      state.status = action.type;
    },
    ProActiveProjectFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //////////////////// SendBid ////////////////////
    SendBidRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    SendBidSuccess(state, action) {
      state.isLoading = false;
      state.SendBidResponse = action.payload;
      state.status = action.type;
    },
    SendBidFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //////////////////// ProjectBids ////////////////////
    ProjectBidsRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    ProjectBidsSuccess(state, action) {
      state.isLoading = false;
      state.ProjectBidsResponse = action.payload;
      state.status = action.type;
    },
    ProjectBidsFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ////////////////////bidStatus ////////////////////
    bidStatusRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    bidStatusSuccess(state, action) {
      state.isLoading = false;
      state.bidStatusResponse = action.payload;
      state.status = action.type;
    },
    bidStatusFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //////////////////// bidList ////////////////////
    bidListRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    bidListSuccess(state, action) {
      state.isLoading = false;
      state.bidListResponse = action.payload;
      state.status = action.type;
    },
    bidListFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    clearProviderProjects(state, action) {
      state.ProviderProjectListResponse = {};
    },

    //////////////////// markAsCompleted ////////////////////
    markAsCompletedRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    markAsCompletedSuccess(state, action) {
      state.isLoading = false;
      state.markAsCompletedResponse = action.payload;
      state.status = action.type;
    },
    markAsCompletedFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //////////////////// sendFeedBack ////////////////////
    sendFeedBackRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    sendFeedBackSuccess(state, action) {
      state.isLoading = false;
      state.sendFeedBackResponse = action.payload;
      state.status = action.type;
    },
    sendFeedBackFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //////////////////// getFeedBack ////////////////////
    getFeedBackRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    getFeedBackSuccess(state, action) {
      state.isLoading = false;
      state.getFeedBackResponse = action.payload;
      state.status = action.type;
    },
    getFeedBackFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //////////////////// sendFeedBackProvider ////////////////////
    sendFeedBackProviderRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    sendFeedBackProviderSuccess(state, action) {
      state.isLoading = false;
      state.sendFeedBackProviderResponse = action.payload;
      state.status = action.type;
    },
    sendFeedBackProviderFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    //////////////////// getFeedBackProvider ////////////////////
    getFeedBackProviderRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    getFeedBackProviderSuccess(state, action) {
      state.isLoading = false;
      state.getFeedBackProviderResponse = action.payload;
      state.status = action.type;
    },
    getFeedBackProviderFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// projectListByLocation //////////////////
    projectListByLocationRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    projectListByLocationSuccess(state, action) {
      state.isLoading = false;
      state.projectListByLocationResponse = action.payload;
      state.status = action.type;
    },
    projectListByLocationFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// projectDetailsByLocation //////////////////
    projectDetailsByLocationRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    projectDetailsByLocationSuccess(state, action) {
      state.isLoading = false;
      state.projectDetailsByLocationResponse = action.payload;
      state.status = action.type;
    },
    projectDetailsByLocationFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// getOveralReview //////////////////
    getOveralReviewRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    getOveralReviewSuccess(state, action) {
      state.isLoading = false;
      state.getOveralReviewResponse = action.payload;
      state.status = action.type;
    },
    getOveralReviewFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// cancelBid //////////////////
    cancelBidRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    cancelBidSuccess(state, action) {
      state.isLoading = false;
      state.cancelBidResponse = action.payload;
      state.status = action.type;
    },
    cancelBidFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// PendingPayment //////////////////
    PendingPaymentRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    PendingPaymentSuccess(state, action) {
      state.isLoading = false;
      state.PendingPaymentResponse = action.payload;
      state.status = action.type;
    },
    PendingPaymentFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// PaymentHistory //////////////////
    PaymentHistoryRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    PaymentHistorySuccess(state, action) {
      state.isLoading = false;
      state.PaymentHistoryResponse = action.payload;
      state.status = action.type;
    },
    PaymentHistoryFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// ProviderPaymentList //////////////////
    ProviderPaymentListRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    ProviderPaymentListSuccess(state, action) {
      state.isLoading = false;
      state.ProviderPaymentListResponse = action.payload;
      state.status = action.type;
    },
    ProviderPaymentListFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// UploadImages //////////////////
    UploadImagesRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    UploadImagesSuccess(state, action) {
      state.isLoading = false;
      state.UploadImagesResponse = action.payload;
      state.status = action.type;
    },
    UploadImagesFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// paymentReq //////////////////
    paymentReqRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    paymentReqSuccess(state, action) {
      state.isLoading = false;
      state.paymentReqResponse = action.payload;
      state.status = action.type;
    },
    paymentReqFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },


    ///////////////////// bidDetails //////////////////
    bidDetailsRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    bidDetailsSuccess(state, action) {
      state.isLoading = false;
      state.bidDetailsResponse = action.payload;
      state.status = action.type;
    },
    bidDetailsFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },

    ///////////////////// orangePay //////////////////
    orangePayRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    orangePaySuccess(state, action) {
      state.isLoading = false;
      state.orangePayResponse = action.payload;
      state.status = action.type;
    },
    orangePayFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.status = action.type;
    },
  },
});
export const {
  clearProjectReducer,

  projectListRequest,
  projectListSuccess,
  projectListFailure,

  clientActiveProjectRequest,
  clientActiveProjectSuccess,
  clientActiveProjectFailure,

  ProviderProjectListRequest,
  ProviderProjectListSuccess,
  ProviderProjectListFailure,

  ProviderOfferListRequest,
  ProviderOfferListSuccess,
  ProviderOfferListFailure,

  projectDetailsRequest,
  projectDetailsSuccess,
  projectDetailsFailure,

  CreateProjectRequest,
  CreateProjectSuccess,
  CreateProjectFailure,

  ProviderOfferRequest,
  ProviderOfferSuccess,
  ProviderOfferFailure,

  EditProjectRequest,
  EditProjectSuccess,
  EditProjectFailure,

  JobCategoryRequest,
  JobCategorySuccess,
  JobCategoryFailure,

  JobCategoryProviderRequest,
  JobCategoryProviderSuccess,
  JobCategoryProviderFailure,

  ProActiveProjectRequest,
  ProActiveProjectSuccess,
  ProActiveProjectFailure,

  SendBidRequest,
  SendBidSuccess,
  SendBidFailure,

  ProjectBidsRequest,
  ProjectBidsSuccess,
  ProjectBidsFailure,

  bidStatusRequest,
  bidStatusSuccess,
  bidStatusFailure,

  bidListRequest,
  bidListSuccess,
  bidListFailure,

  clearProviderProjects,

  markAsCompletedRequest,
  markAsCompletedSuccess,
  markAsCompletedFailure,

  sendFeedBackRequest,
  sendFeedBackSuccess,
  sendFeedBackFailure,

  getFeedBackRequest,
  getFeedBackSuccess,
  getFeedBackFailure,

  sendFeedBackProviderRequest,
  sendFeedBackProviderSuccess,
  sendFeedBackProviderFailure,

  getFeedBackProviderRequest,
  getFeedBackProviderSuccess,
  getFeedBackProviderFailure,

  projectListByLocationRequest,
  projectListByLocationSuccess,
  projectListByLocationFailure,

  projectDetailsByLocationRequest,
  projectDetailsByLocationSuccess,
  projectDetailsByLocationFailure,

  getOveralReviewRequest,
  getOveralReviewSuccess,
  getOveralReviewFailure,

  cancelBidRequest,
  cancelBidSuccess,
  cancelBidFailure,

  PendingPaymentRequest,
  PendingPaymentSuccess,
  PendingPaymentFailure,

  PaymentHistoryRequest,
  PaymentHistorySuccess,
  PaymentHistoryFailure,

  ProviderPaymentListRequest,
  ProviderPaymentListSuccess,
  ProviderPaymentListFailure,

  UploadImagesRequest,
  UploadImagesSuccess,
  UploadImagesFailure,

  paymentReqRequest,
  paymentReqSuccess,
  paymentReqFailure,

  bidDetailsRequest,
  bidDetailsSuccess,
  bidDetailsFailure,

  orangePayRequest,
  orangePaySuccess,
  orangePayFailure,
} = ProjectSlice.actions;

export default ProjectSlice.reducer;
