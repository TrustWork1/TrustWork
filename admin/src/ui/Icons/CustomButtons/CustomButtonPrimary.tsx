import { CircularProgress, CircularProgressProps, styled } from '@mui/material'
import Button, { ButtonProps } from '@mui/material/Button'

const CustomButtonWrapper = styled(Button)`
  .MuiButton-icon {
    margin-left: 0px;
    @media (max-width: 599px) {
      margin-right: 3px;
    }
  }

  &.side-listing-btn {
    display: inline-block;
    padding: 0;
    color: aquamarine;
    font-weight: 600;
    font-size: 16px;
    line-height: 1;
    min-width: auto;
    background: transparent;
  }

  @media (max-width: 899px) {
    min-height: 50px;
    padding: 10px 44px;
    font-size: 16px;
  }
  @media (max-width: 599px) {
    /* min-width: auto; */
    padding: 0px 10px !important;
  }

  &.Mui-disabled {
    background-color: #999;
    border: 1px solid #777;
    color: rgba(0, 0, 0, 0.615);

    p {
      color: #ddd;
    }
    img {
      filter: contrast(0);
    }
  }
  &.smallButton {
    padding: 4px 16px;
    min-height: 40px;
    min-width: 110px;
    width: auto;
  }

  .custom-btn-loader {
    &.smallProgress {
      size: 10px;
    }
    @media (max-width: 599px) {
      width: 30px !important;
      height: 30px !important;
    }
  }

  &:hover {
    .custom-btn-loader {
      color: #c81e24;
    }
    .MuiButton-icon {
      .MuiSvgIcon-root {
        color: inherit;
      }
    }
  }

  &.no_bg {
    background: none;
    min-width: auto;
  }
  .current_location {
    color: inherit;
  }
`

interface CustomButtonprops extends ButtonProps {
  children: JSX.Element | JSX.Element[] | string | number
  className?: string
  buttonType?: 'small' | 'large'
  loading?:
    | boolean
    | {
        delay?: number
      }
  configLoader?: CircularProgressProps
}

const CustomButtonPrimary = ({
  children,
  className,
  buttonType,
  loading = false,
  configLoader,
  ...others
}: CustomButtonprops) => {
  return (
    <CustomButtonWrapper
      className={`${buttonType === 'small' && 'smallButton'} ${className || ''} ${loading && 'no_bg'}`}
      {...others}
    >
      {/* {children} */}
      {loading ? <CircularProgress className={`custom-btn-loader`} size={configLoader?.size ?? 40} /> : children}
    </CustomButtonWrapper>
  )
}

export default CustomButtonPrimary
