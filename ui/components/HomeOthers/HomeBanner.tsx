import assest from '@/json/assest';
import { HomeBannerBox } from '@/styles/StyledComponents/HomeBannerStyled';
import { IHomeModel } from '@/typescript/interface/home.interface';
import { Box, Button, ButtonGroup, Chip, Container, Stack, Typography } from '@mui/material';
import Image from 'next/image';

const HomeBanner = ({ appInfo }: { appInfo: IHomeModel['AppInfo'] }) => {
  return (
    <HomeBannerBox>
      <Image src={assest.shape01} width={170} height={392} alt='shape01' className='float-shape' />
      <Container fixed>
        <Box className='inner-contain'>
          <Stack direction='row' flexWrap='wrap' alignItems='center' className='banner-content'>
            <Box className='left-grid'>
              <Chip label={appInfo?.tagline} />
              <Typography variant='h1' textTransform={'capitalize'}>
                {appInfo?.title}
              </Typography>
              <Typography variant='body2'>{appInfo?.description}</Typography>
              <ButtonGroup>
                <Button
                  disableRipple
                  onClick={() => window.open(`${appInfo?.playstore_link}`, '_blank')}
                >
                  <Image src={assest.gPlay} width={200} height={65} alt='gplay' />
                </Button>
                <Button
                  disableRipple
                  onClick={() => window.open(`${appInfo?.appstore_link}`, '_blank')}
                >
                  <Image src={assest.appStore} width={200} height={65} alt='appstore' />
                </Button>
              </ButtonGroup>
            </Box>
            <Box className='right-grid'>
              <Image
                src={`${appInfo?.image}` || assest.bannerThumb}
                width={882}
                height={846}
                alt='bannerThumb'
              />
            </Box>
          </Stack>
        </Box>
      </Container>
    </HomeBannerBox>
  );
};

export default HomeBanner;
