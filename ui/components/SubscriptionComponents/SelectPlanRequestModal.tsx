import { SelectPlanQueryFormValues } from '@/schema/subscription.yup';
import CustomButtonPrimary from '@/ui/CustomButtons/CustomButtonPrimary';
import { MailIcon } from '@/ui/Icon/Maillcon';
import { NoteIcon } from '@/ui/Icon/NoteIcon';
import UserIcon from '@/ui/Icon/UserIcon';
import MuiModalWrapper from '@/ui/Modal/MuiModalWrapper';
import { Grid2 } from '@mui/material';
import { Control, FieldErrors } from 'react-hook-form';
import FormTextField from '../Forms/FormTextField';

const SelectPlanRequestModal = ({
  open,
  onClose,
  onSubmit,
  control,
  errors,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  control: Control<SelectPlanQueryFormValues>;
  errors: FieldErrors<SelectPlanQueryFormValues>;
  isPending: boolean;
}) => {
  return (
    <MuiModalWrapper
      title='Please Fill The Following Information'
      subTitle='Lorem ipsum dolor sit amet consectetur. Lacus ornare neque sem sollicitudin sit.'
      isModalHead
      open={open}
      onClose={onClose}
    >
      <Grid2 container spacing={1.25}>
        <Grid2 size={{ xs: 12 }}>
          <FormTextField
            name='full_name'
            placeHolder='Full name'
            endAdornment={<UserIcon />}
            control={control}
            errors={errors}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <FormTextField
            name='phone'
            placeHolder='Phone Number'
            endAdornment={<NoteIcon />}
            control={control}
            errors={errors}
            type='number'
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <FormTextField
            name='email'
            placeHolder='Email Address'
            endAdornment={<MailIcon />}
            control={control}
            errors={errors}
          />
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <CustomButtonPrimary
            sx={{ marginTop: '10px' }}
            variant='contained'
            className='sendBtn'
            color='primary'
            onClick={onSubmit}
            loading={isPending}
            disabled={isPending}
          >
            Submit
          </CustomButtonPrimary>
        </Grid2>
      </Grid2>
    </MuiModalWrapper>
  );
};

export default SelectPlanRequestModal;
