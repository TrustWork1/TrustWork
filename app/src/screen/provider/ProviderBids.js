import {useIsFocused} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../components/Header';
import NavigationService from '../../navigators/NavigationService';
import ProviderBidTabNav from '../../navigators/ProviderBidTabNav';
import {Colors} from '../../themes/Themes';

const ProviderProjects = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const ProjectReducer = useSelector(state => state.ProjectReducer);

  return (
    <View style={styles.mainContainer}>
      {/* <Loader visible={ProjectReducer?.status == 'Project/bidListRequest'} /> */}
      <Header
        onHeaderPress={() => NavigationService.navigate('ProfileProvider')}
        menuTxt={'My Bids'}
      />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.themeGreen,
            }}>
            <ProviderBidTabNav />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ProviderProjects;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.themeBackground,
  },
  container: {
    height: '100%',
    width: '100%',
  },
});
