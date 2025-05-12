import offlineJson from '@/json/lottie/offline.json';
import { checkWindow } from '@/lib/functions/_helpers.lib';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
const Wrapper = dynamic(() => import('@/layout/wrapper/Wrapper'), { ssr: false });
const Container = dynamic(() => import('@mui/material/Container'), { ssr: false });
const Stack = dynamic(() => import('@mui/material/Stack'), { ssr: false });
const Button = dynamic(() => import('@mui/material/Button'), { ssr: false });

const OfflinePage = () => {
  const handleRetry = () => {
    if (checkWindow()) {
      window.location.reload();
    }
  };

  return (
    <Wrapper>
      <Container sx={{ padding: 5 }}>
        <Lottie
          loop
          autoPlay
          animationData={offlineJson}
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid slice',
          }}
          height={300}
          width={300}
        />
        <Stack direction='row' justifyContent='center'>
          <h1>You are offline!</h1>
        </Stack>
        <Stack direction='row' justifyContent='center'>
          <Button onClick={handleRetry} variant='contained' color='secondary' disableElevation>
            Retry
          </Button>
        </Stack>
      </Container>
    </Wrapper>
  );
};

export default OfflinePage;
