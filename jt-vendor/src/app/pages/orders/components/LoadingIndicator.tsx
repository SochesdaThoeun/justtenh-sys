import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = 'Loading...'
}) => {
  return (
    <div className="d-flex justify-content-center my-10">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">{message}</span>
      </div>
    </div>
  );
};

export default LoadingIndicator; 