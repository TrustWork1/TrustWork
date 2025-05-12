import assest from '@/json/assest';
import { ReferFriendPaper } from '@/styles/StyledComponents/ReferFriendStyled';
import { IHomeModel } from '@/typescript/interface/home.interface';
import CustomButtonPrimary from '@/ui/CustomButtons/CustomButtonPrimary';
import { Box, Container, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';

export default function ReferFriend({
  referralInfo,
}: {
  referralInfo: IHomeModel['ReferralSection'];
}) {
  const theme = useTheme();
  const isSmScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <ReferFriendPaper>
      <Container fixed>
        <Box className='refer-con'>
          {!isSmScreen && (
            <Box className='left-fig'>
              <Image
                src={referralInfo?.image || assest.referThumb}
                width={436}
                height={476}
                alt='friend'
              />
            </Box>
          )}
          <Stack direction='row' alignItems='center' flexWrap='wrap' className='inner-stack-root'>
            {isSmScreen && (
              <Box className='left-fig'>
                <Image
                  src={referralInfo?.image || assest.referThumb}
                  width={436}
                  height={476}
                  alt='friend'
                />
              </Box>
            )}
            <Box className='right-fig'>
              <Box className='rgt-inner'>
                <Typography variant='h3'>{referralInfo?.title}</Typography>
                <Typography variant='body1' marginBottom={'10px'}>
                  {referralInfo?.description}
                </Typography>
                <CustomButtonPrimary
                  variant='contained'
                  color='primary'
                  onClick={() => window.open(`${referralInfo?.button_link}`, '_blank')}
                >
                  {referralInfo?.button_title}
                </CustomButtonPrimary>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Container>
    </ReferFriendPaper>
  );
}
