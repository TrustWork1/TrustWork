import { BillingToggleWrap } from '@/styles/StyledComponents/BillingToggleWrap';
import { Box, Switch, Typography } from '@mui/material';
import { useState } from 'react';

function BillingToggle() {
  const [isYearly, setIsYearly] = useState(false);

  const onToggle = () => {
    setIsYearly(prev => !prev);
  };

  return (
    <BillingToggleWrap>
      <Box display='flex' alignItems='center' gap={2}>
        <Typography variant='body1' className={`${isYearly ? '' : 'active'} labelPara`}>
          Monthly
        </Typography>

        <Switch
          checked={isYearly}
          onChange={onToggle}

          // sx={{
          //   '& .MuiSwitch-switchBase.Mui-checked': {
          //     color: '#4CAF50',
          //     transform: 'translateX(16px)',
          //   },
          //   '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
          //     backgroundColor: '#C8E6C9',
          //   },
          //   '& .MuiSwitch-track': {
          //     backgroundColor: '#C8E6C9',
          //     borderRadius: 20,
          //   },
          //   '& .MuiSwitch-thumb': {
          //     backgroundColor: '#4CAF50',
          //   },
          // }}
        />

        <Typography variant='body1' className={`${isYearly ? 'active' : ''} labelPara`}>
          Yearly
        </Typography>
      </Box>
    </BillingToggleWrap>
  );
}

export default BillingToggle;
