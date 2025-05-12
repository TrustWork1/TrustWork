import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {Colors, Fonts} from '../themes/Themes';
import constants from '../utils/helpers/constants';
import normalize from '../utils/helpers/normalize';
import TextIn from './TextIn';

const GooglePlaces = ({
  flx,
  width,
  value,
  setValue,
  setStreet,
  setLat,
  setLng,
  setCity,
  setState,
  setStateCode,
  setCountry,
  setZipcode,
  label,
  placeholder,
  marginLeft,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    if (value) {
      setSearchQuery(value);
    }
  }, [value]);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${constants.GOOGLEAPIKEY}`,
        )
          .then(response => response.json())
          .then(data => {
            if (data?.results?.length > 0) {
              const formattedAddress = data?.results[0]?.formatted_address;
              setAllAddressDetails(data.results[0]);
              setValue(formattedAddress);
              setSearchQuery(formattedAddress);
              setPredictions([]);
            }
          })
          .catch(error => {
            Alert.alert('Error', 'Unable to get the current location');
          });
      },
      error => {
        Alert.alert('Error', 'Unable to get the current location');
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  const fetchPlaceDetails = async placeId => {
    try {
      const apiKey = constants.GOOGLEAPIKEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?key=${apiKey}&placeid=${placeId}`,
      );
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching place details', error);
      return null;
    }
  };

  const handleSearch = async text => {
    setSearchQuery(text);
    try {
      const apiKey = constants.GOOGLEAPIKEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${text}`,
      );
      const data = await response.json();

      if (data.predictions) {
        setPredictions(data.predictions);
      }
    } catch (error) {
      console.error('Error fetching predictions', error);
    }
  };

  const handlePredictionPress = async item => {
    setValue(item.description);
    setSearchQuery(item.description);
    setPredictions([]);

    const placeDetails = await fetchPlaceDetails(item.place_id);
    if (placeDetails) {
      setAllAddressDetails(placeDetails);
    }
  };

  const onClear = () => {
    setValue('');
    setSearchQuery('');
    setPredictions([]);
  };

  const setAllAddressDetails = results => {
    if (!results || results.length === 0) return;

    const location = results?.geometry?.location;

    if (location) {
      const {lat, lng} = location;
      if (lat) setLat(lat);
      if (lng) setLng(lng);
    }

    const street = results?.formatted_address;
    if (street) {
      setStreet(street);
    }

    const addressComponents = results?.address_components || [];
    addressComponents.forEach(component => {
      const types = component?.types || [];

      if (
        types.includes('locality') ||
        types.includes('administrative_area_level_1') ||
        types.includes('administrative_area_level_2') ||
        types.includes('administrative_area_level_3')
      ) {
        setCity(component.long_name);
      }

      if (types.includes('administrative_area_level_1')) {
        setState(component.long_name);
        setStateCode(component.short_name);
      }

      if (types.includes('country')) {
        setCountry(component.long_name);
      }

      if (
        types.includes('postal_code') ||
        types.includes('postal_code_prefix')
      ) {
        setZipcode(component.long_name);
      }
    });
  };

  return (
    <View style={{flex: flx}}>
      <TextIn
        show={searchQuery?.length > 0 ? true : false}
        value={searchQuery}
        isVisible={false}
        onChangeText={text => handleSearch(text)}
        height={normalize(55)}
        width={width}
        fonts={Fonts.FustatMedium}
        borderColor={Colors.themeBoxBorder}
        borderWidth={1}
        maxLength={150}
        marginTop={normalize(10)}
        marginBottom={normalize(15)}
        outlineTxtwidth={normalize(80)}
        label={label ? label : 'Address'}
        placeholder={placeholder ? placeholder : 'Enter Address'}
        //placeholderIcon={Icons.Email}
        placeholderTextColor={Colors.themePlaceholder}
        borderRadius={normalize(6)}
        fontSize={14}
        locationShown={true}
        onClosePress={() => onClear()}
        onPress={() => getCurrentLocation()}
        paddingLeft={normalize(12)}
        marginLeft={marginLeft ? marginLeft : normalize(20)}
      />

      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{
          width: '100%',
          paddingHorizontal: normalize(15),
        }}>
        <FlatList
          data={predictions}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={{
            width: '100%',
            paddingHorizontal: normalize(10),
            backgroundColor: Colors.themeSearchBackground,
          }}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={[
                styles.itemContainer,
                {
                  borderBottomColor:
                    predictions?.length - 1 == index
                      ? 'transparent'
                      : Colors.themeBoxBorder,
                  borderBottomWidth: predictions?.length - 1 == index ? 0 : 1,
                },
              ]}
              onPress={() => handlePredictionPress(item)}>
              <Text style={styles.itemTxt}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  );
};

export default GooglePlaces;
const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(5),
    width: '100%',
  },
  itemTxt: {
    color: Colors.themeBlack,
    fontFamily: Fonts.FustatMedium,
    fontSize: 12,
    lineHeight: normalize(14),
  },
});
