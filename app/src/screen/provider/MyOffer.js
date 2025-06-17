import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, Platform, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import OfferCard from '../../components/Micro/OfferCard';
import {
  bidStatusRequest,
  ProviderOfferListRequest,
} from '../../redux/reducer/ProjectReducer';
import css from '../../themes/css';
import Loader from '../../utils/helpers/Loader';
import connectionrequest from '../../utils/helpers/NetInfo';
import normalize from '../../utils/helpers/normalize';
import showErrorAlert from '../../utils/helpers/Toast';
let status = '';

const MyOffer = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const ProjectReducer = useSelector(state => state.ProjectReducer);

  const [search, setSearch] = useState('');
  const [projectList, setProjectList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState('');

  // useEffect(() => {
  //   setPage(1);
  // }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      getProjectList();
    }
  }, [isFocused, page]);

  const getProjectList = () => {
    connectionrequest()
      .then(() => {
        dispatch(ProviderOfferListRequest({page: page, limit: 10}));
        // dispatch(ProviderProjectListRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect to the internet');
      });
  };

  const bidStatusChange = (status, id) => {
    let obj = {
      data: {action: status},
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

  if (status == '' || ProjectReducer.status != status) {
    switch (ProjectReducer.status) {
      case 'Project/ProviderOfferListRequest':
        status = ProjectReducer.status;
        if (page == 1) {
          setProjectList([]);
        }
        break;
      case 'Project/ProviderOfferListSuccess':
        status = ProjectReducer.status;

        ProjectReducer?.ProviderOfferListResponse?.data?.length > 0
          ? projectList?.length < 1
            ? setProjectList(ProjectReducer?.ProviderOfferListResponse?.data)
            : setProjectList([
                ...projectList,
                ...ProjectReducer?.ProviderOfferListResponse?.data,
              ])
          : setPage(1);

        break;
      case 'Project/ProviderOfferListFailure':
        status = ProjectReducer.status;
        break;

      case 'Project/bidStatusRequest':
        status = ProjectReducer.status;
        break;
      case 'Project/bidStatusSuccess':
        status = ProjectReducer.status;
        getProjectList();

        break;
      case 'Project/bidStatusFailure':
        status = ProjectReducer.status;
        break;
    }
  }

  const offersRender = ({item, index}) => {
    return (
      <>
        <OfferCard
          title={item?.project_title}
          location={item?.project_address}
          category={item?.project_category?.title}
          budget={`$${item?.project_budget}`}
          client={item?.client?.full_name}
          clientLoc={item?.client?.city}
          timeline={`${item?.project_timeline} ${item?.project_hrs_week}`}
          // loading={ProjectReducer.status == 'Project/bidStatusRequest'}
          accept_press={() => {
            bidStatusChange('accept', item?.bid?.bid_id);
          }}
          reject_Press={() => {
            bidStatusChange('reject', item?.bid?.bid_id);
          }}
        />
      </>
    );
  };

  return (
    <>
      <Loader
        visible={
          ProjectReducer.status == 'Project/ProviderOfferListRequest' ||
          ProjectReducer.status == 'Project/bidStatusRequest'
        }
      />
      <View style={[css.px3]}>
        <View style={[css.pt2]}>
          <Text style={[css.headerTxt]}>My Offers</Text>
        </View>
        <View style={[css.fg1]}>
          <FlatList
            data={projectList}
            renderItem={offersRender}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              {
                paddingBottom:
                  Platform.OS == 'ios' ? normalize(120) : normalize(150),
              },
            ]}
            onEndReachedThreshold={0.1}
            onEndReached={() => {
              if (ProjectReducer?.ProviderOfferListResponse?.pages > page) {
                setPage(page + 1);
              }
            }}
            ListEmptyComponent={
              <>
                {ProjectReducer.status !=
                  'Project/ProviderOfferListRequest' && (
                  <View style={[css.aic, css.mt7]}>
                    <Text style={[css.txtStyle]}>No offers Found</Text>
                  </View>
                )}
              </>
            }
            // style={[css.f1]}
          />
        </View>
      </View>
    </>
  );
};

export default MyOffer;

const styles = StyleSheet.create({});
