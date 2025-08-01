import assest from '@/json/assest';
import { ReferFriendPaper } from '@/styles/StyledComponents/ReferFriendStyled';
import CustomButtonPrimary from '@/ui/CustomButtons/CustomButtonPrimary';
import { Box, Container, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';

export default function ReferFriend() {
  const theme = useTheme();
  const isSmScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <ReferFriendPaper>
      <Container fixed>
        <Box className='refer-con'>
          {!isSmScreen && (
            <Box className='left-fig'>
              <Image src={assest.referThumb} width={436} height={476} alt='friend' />
            </Box>
          )}
          <Stack direction='row' alignItems='center' flexWrap='wrap' className='inner-stack-root'>
            {isSmScreen && (
              <Box className='left-fig'>
                <Image src={assest.referThumb} width={436} height={476} alt='friend' />
              </Box>
            )}
            <Box className='right-fig'>
              <Box className='rgt-inner'>
                <Typography variant='h3'>Refer A Friend</Typography>
                <Typography variant='body1' marginBottom={'10px'}>
                  Amet congue eu sed nulla leo sed elit. Tempor pellentesque consequat quam neque
                  morbi. Sagittis arcu. Sed elit senectus fermentum .
                </Typography>
                <CustomButtonPrimary variant='contained' color='primary'>
                  get started
                </CustomButtonPrimary>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Container>
    </ReferFriendPaper>
  );
}
