import styled from '@emotion/styled';
import Button, { ButtonProps } from '@mui/material/Button';

const CustomButtonWrapper = styled(Button)``;

interface CustomButtonprops extends ButtonProps {
  children: React.JSX.Element | React.JSX.Element[] | string;
  className?: string;
  buttonType?: 'small' | 'large';
}

const CustomButtonPrimary = ({ children, className, buttonType, ...others }: CustomButtonprops) => {
  return (
    <CustomButtonWrapper
      className={`${buttonType === 'small' && 'smallButton'} ${className || ''}`}
      {...others}
    >
      {children}
    </CustomButtonWrapper>
  );
};

export default CustomButtonPrimary;
