import { Box, Container, Link, Paper, Rating, Typography } from '@mui/material';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React from 'react';

interface LocationMapProps {
  apiKey: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  rating?: number;
  zoom?: number;
  height?: string;
}

const LocationMap: React.FC<LocationMapProps> = ({
  apiKey,
  latitude,
  longitude,
  locationName,
  rating = 4.5,
  zoom = 14,
  height = '442px',
}) => {
  const mapContainerStyle = {
    width: '100%',
    height,
    borderRadius: '10px',
    position: 'relative' as const,
  };

  const center = {
    lat: latitude,
    lng: longitude,
  };

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  return (
    <Container fixed>
      <Box sx={{ position: 'relative', borderRadius: '10px', overflow: 'hidden' }}>
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={zoom}
            options={options}
          >
            <Marker
              position={center}
              title={locationName}
              animation={window.google?.maps.Animation.DROP}
            />
          </GoogleMap>
        </LoadScript>

        {/* Overlay Card */}
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            padding: 2,
            maxWidth: 300,
            zIndex: 1000,
            borderRadius: 2,
          }}
        >
          <Typography variant='subtitle2' fontWeight={600}>
            {locationName}
          </Typography>

          <Rating name='read-only' value={rating} precision={0.5} readOnly sx={{ mt: 1 }} />
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
            target='_blank'
            rel='noopener'
            underline='hover'
            sx={{ display: 'inline-block', mt: 1 }}
          >
            View larger map
          </Link>
        </Paper>
      </Box>
    </Container>
  );
};

export default LocationMap;
