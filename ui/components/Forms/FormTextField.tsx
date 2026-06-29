import { FormTextFieldProps } from '@/typescript/interface/form.interface';
import InputFieldCommon from '@/ui/CommonInput/CommonInput';
import { Typography } from '@mui/material';
import { Controller, FieldValues, get } from 'react-hook-form';

const FormTextField = <T extends FieldValues>({
  name,
  labelName,
  type,
  placeHolder = '',
  isPassword = false,
  control,
  errors,
  multiline = false,
  isDisable = false,
  endAdornment,
  inputattributes,
  ...rest
}: FormTextFieldProps<T>) => {
  const errorMessage = get(errors, name as string)?.message as string;
  const inputAttributes =
    type === 'number'
      ? {
          inputMode: 'numeric' as const,
          pattern: '[0-9]*',
          ...inputattributes,
        }
      : inputattributes;

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <InputFieldCommon
            {...field}
            label={labelName}
            placeholder={placeHolder ? placeHolder : `Enter ${labelName?.toLowerCase()}`}
            error={!!errors}
            isPassword={isPassword}
            disabled={isDisable}
            multiline={multiline}
            endAdornment={endAdornment}
            {...(type ? { type } : {})}
            inputattributes={inputAttributes}
            sx={
              type === 'number'
                ? {
                    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                      {
                        WebkitAppearance: 'none',
                        margin: 0,
                      },
                    '& input[type=number]': {
                      MozAppearance: 'textfield',
                    },
                  }
                : {}
            }
            {...rest}
          />
        )}
      />
      {errorMessage && (
        <Typography variant='caption' color='error' className='errorCls'>
          {errorMessage}
        </Typography>
      )}
    </>
  );
};

export default FormTextField;
