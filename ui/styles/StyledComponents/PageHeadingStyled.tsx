import { Box, styled } from '@mui/material';

export const PageHeadingBox = styled(Box, { shouldForwardProp: prop => prop !== 'alignItem' })<{
  alignItem?: 'center' | 'left';
}>`
  text-align: ${({ alignItem }) =>
    alignItem === 'center' ? 'center' : alignItem === 'left' ? 'left' : ''};

  h2 {
    margin-bottom: 5px;

    @media (max-width: 1199px) {
      font-size: 30px;
    }

    @media (max-width: 599px) {
      font-size: 24px;
    }
  }

  p {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }
`;
