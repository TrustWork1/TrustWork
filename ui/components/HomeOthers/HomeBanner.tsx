import assest from '@/json/assest';
import { HomeBannerBox } from '@/styles/StyledComponents/HomeBannerStyled';
import { Box, Button, ButtonGroup, Chip, Container, Stack, Typography } from '@mui/material';
import Image from 'next/image';

const HomeBanner = () => {
  return (
    <HomeBannerBox>
      <Image src={assest.shape01} width={170} height={392} alt='shape01' className='float-shape' />
      <Container fixed>
        <Box className='inner-contain'>
          <Stack direction='row' flexWrap='wrap' alignItems='center' className='banner-content'>
            <Box className='left-grid'>
              <Chip label='Lorem Ipsum is simply dummy text' />
              <Typography variant='h1' textTransform={'capitalize'}>
                We always provide
                <br /> Best services
              </Typography>
              <Typography variant='body2'>
                Nulla non enim tortor est euismod tempus maecenas vel adipiscing. Eget accumsan urna
                gravida placerat egestas dolor. Sed molestie.
              </Typography>
              <ButtonGroup>
                <Button disableRipple>
                  <Image src={assest.gPlay} width={200} height={65} alt='gplay' />
                </Button>
                <Button disableRipple>
                  <Image src={assest.appStore} width={200} height={65} alt='appstore' />
                </Button>
              </ButtonGroup>
            </Box>
            <Box className='right-grid'>
              <Image src={assest.bannerThumb} width={882} height={846} alt='bannerThumb' />
            </Box>
          </Stack>
        </Box>
      </Container>
    </HomeBannerBox>
  );
};

export default HomeBanner;
