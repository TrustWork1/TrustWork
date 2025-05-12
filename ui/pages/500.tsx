import animationData from '@/json/lottie/404.json';
import { checkWindow } from '@/lib/functions/_helpers.lib';
import CustomButtonPrimary from '@/ui/CustomButtons/CustomButtonPrimary';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
const Wrapper = dynamic(() => import('@/layout/wrapper/Wrapper'), { ssr: false });

const Index = () => {
  const reload = () => {
    if (checkWindow()) {
      window.location.reload();
    }
  };

  return (
    <Wrapper>
      <Stack direction='row' alignItems='center' justifyContent='center' p={2}>
        <div>
          <h1>Something Went wrong</h1>
          <Lottie
            animationData={animationData}
            loop
            style={{
              height: 300,
              width: 300,
            }}
            height={300}
            width={300}
          />
          <CustomButtonPrimary type='button' variant='contained' color='primary' onClick={reload}>
            <Typography>Error</Typography>
          </CustomButtonPrimary>
        </div>
      </Stack>
    </Wrapper>
  );
};

export default Index;
