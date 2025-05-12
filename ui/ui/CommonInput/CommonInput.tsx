import { styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { StandardTextFieldProps } from '@mui/material/TextField';
import React, { forwardRef, useCallback, useState } from 'react';
import PasswordNonVisibilityIcon from '../Icon/PasswordNonVisibilityIcon';
import PasswordVisibilityIcon from '../Icon/PasswordVisibilityIcon';

const InputWrap = styled(TextField)`
  .MuiInputBase-root {
    background-color: ${({ theme }) => theme.palette.common.white};
    border-radius: 10px;
    padding: 15px 16px 15px 20px;
    border: 1px solid ${({ theme }) => theme.palette.customColors.borderColor};

    .MuiInputBase-input {
      font-size: 16px;
      color: ${({ theme }) => theme.palette.customColors?.dark};
      padding: 0;

      &::placeholder {
        color: ${({ theme }) => theme.palette.customColors?.dark} !important;
        opacity: 1;
        -webkit-text-fill-color: ${({ theme }) => theme.palette.customColors?.dark} !important;
        font-size: 12px;
      }

      &::-ms-input-placeholder {
        color: ${({ theme }) => theme.palette.customColors?.dark} !important;
        opacity: 1;
        -webkit-text-fill-color: ${({ theme }) => theme.palette.customColors?.dark} !important;
        font-size: 12px;
      }
    }

    .MuiInputAdornment-positionEnd {
      margin-left: 8px;
      .MuiIconButton-root {
        padding: 0;
      }
    }

    .MuiInputAdornment-positionStart {
      margin-right: 8px;
    }
  }

  fieldset {
    display: none;
  }
`;

type InputFieldCommonProps = StandardTextFieldProps & {
  isPassword?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
};

const InputFieldCommon = forwardRef<HTMLInputElement, InputFieldCommonProps>(
  ({ isPassword = false, startAdornment, endAdornment, ...others }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = useCallback(() => {
      setShowPassword(prev => !prev);
    }, []);

    const handleMouseDownPassword = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    }, []);

    return (
      <InputWrap
        fullWidth
        variant={others.variant ?? 'outlined'}
        type={isPassword ? (showPassword ? 'text' : 'password') : others?.type}
        slotProps={{
          input: {
            inputRef: ref,
            startAdornment: startAdornment && (
              <InputAdornment position='start'>{startAdornment}</InputAdornment>
            ),
            endAdornment: isPassword ? (
              <InputAdornment position='end' className='password-icon'>
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  disableRipple
                >
                  {showPassword ? <PasswordVisibilityIcon /> : <PasswordNonVisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ) : (
              endAdornment && <InputAdornment position='end'>{endAdornment}</InputAdornment>
            ),
          },
        }}
        {...others}
      />
    );
  }
);

export default InputFieldCommon;
