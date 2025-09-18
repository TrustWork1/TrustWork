import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Box, Typography } from '@mui/material';
import Lightbox from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import 'yet-another-react-lightbox/styles.css';

import React, { useState } from 'react';

interface IVideoLightboxProps {
  src?: string | File | null;
  label?: string;
  height?: number;
  width?: number;
  isAutoPlay: boolean;
}

const VideoComp: React.FC<IVideoLightboxProps> = ({
  src,
  label = 'Preview',
  height = 240,
  width = '100%',
  isAutoPlay = false,
}) => {
  const [open, setOpen] = useState(false);

  if (!src) return null;

  const videoUrl = typeof src === 'string' ? src : URL.createObjectURL(src);

  return (
    <>
      <Box
        onClick={() => setOpen(true)}
        sx={{
          cursor: 'pointer',
          position: 'relative',
          width,
          height,
          borderRadius: 2,
          overflow: 'hidden',
          '&:hover .play-icon': { opacity: 1 },
        }}
        className='videoWrapperIn'
      >
        {label && (
          <Typography variant='subtitle2' mb={1}>
            {label}
          </Typography>
        )}
        <video
          src={videoUrl}
          height={height}
          autoPlay={isAutoPlay}
          width='100%'
          muted
          style={{ objectFit: 'cover', display: 'block' }}
        />
        <Box
          className='play-icon'
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.3s',
            opacity: 0,
          }}
        >
          <PlayCircleOutlineIcon sx={{ fontSize: 50, color: '#fff' }} />
        </Box>
      </Box>

      {/* <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen={fullScreen}
        maxWidth='lg'
        fullWidth
      >
        <DialogContent sx={{ p: 0, bgcolor: 'black' }}>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <video
            src={videoUrl}
            controls
            autoPlay
            style={{
              width: '100%',
              height: fullScreen ? '100vh' : '90vh',
              objectFit: 'contain',
              backgroundColor: 'transparent',
            }}
          />
        </DialogContent>
      </Dialog> */}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[
          {
            type: 'video',
            sources: [{ src: videoUrl, type: 'video/mp4' }],
            autoPlay: true,
            controls: true,
          },
        ]}
        carousel={{ finite: true }}
        render={{
          buttonPrev: () => null, // hide prev arrow
          buttonNext: () => null, // hide next arrow
        }}
        plugins={[Video]}
      />
    </>
  );
};

export default VideoComp;
