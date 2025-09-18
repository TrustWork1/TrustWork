import assest from '@/json/assest';
import { DownloadAppWrapper } from '@/styles/StyledComponents/DownloadAppWrapper';
import { Box, Button, ButtonGroup, Container, Grid2, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import PageHeading from '../PageHeading/PageHeading';
import { IHomeModel } from '@/typescript/interface/home.interface';

export const DownloadApp = ({ downloadInfo }: { downloadInfo: IHomeModel['DownloadSection'] }) => {
  const theme = useTheme();
  const isSmScreen = useMediaQuery(theme.breakpoints.down('lg'));
  return (
    <DownloadAppWrapper>
      <Container fixed>
        <Box className='pageContent'>
          <Grid2 container spacing={{ md: 13 }} alignItems='center'>
            <Grid2 size={{ lg: 6, xs: 12 }}>
              <Box className='download-banner-content'>
                <Box className='pageHeading'>
                  <PageHeading title={downloadInfo?.title} suTitle={downloadInfo?.description} />
                </Box>
                <ButtonGroup>
                  <Button
                    disableRipple
                    onClick={() => window.open(`${downloadInfo?.playstore_link}`, '_blank')}
                  >
                    <Image src={assest.downloadPlayStore} width={185} height={61} alt='gplay' />
                  </Button>
                  <Button
                    disableRipple
                    onClick={() => window.open(`${downloadInfo?.appstore_link}`, '_blank')}
                  >
                    <Image src={assest.downloadAppleStore} width={185} height={61} alt='appstore' />
                  </Button>
                </ButtonGroup>
              </Box>
            </Grid2>
            {!isSmScreen && (
              <Grid2 size={{ lg: 6, xs: 12 }}>
                <figure className='iphoneImg'>
                  <Image
                    src={downloadInfo?.image || assest.iphone12Img}
                    alt='iphone12Img'
                    width={430}
                    height={515}
                  />
                </figure>
              </Grid2>
            )}
          </Grid2>
        </Box>
      </Container>
    </DownloadAppWrapper>
  );
};
