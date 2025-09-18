import assest from '@/json/assest';
import CustomButtonPrimary from '@/ui/CustomButtons/CustomButtonPrimary';
import Image from 'next/image';
import React, { ErrorInfo, ReactNode } from 'react';

export const highQualityImageDefine = { width: 180, height: 55 };

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    width: '100%',
    height: '100%',
    margin: '0 auto',
    textAlign: 'center' as const,
  },
  logo: {
    width: '80px',
    height: '80px',
    marginBottom: '20px',
  },
  message: {
    fontSize: '18px',
    color: '#333',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error(error, 'error');

    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <Image
            src={assest.logo_img}
            width={highQualityImageDefine?.width}
            height={highQualityImageDefine?.height}
            alt={assest.logo_img}
          />
          <h2 style={styles.message}>Oops! Something went wrong.</h2>

          <CustomButtonPrimary
            variant='outlined'
            color='primary'
            className='apply-btn'
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </CustomButtonPrimary>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
