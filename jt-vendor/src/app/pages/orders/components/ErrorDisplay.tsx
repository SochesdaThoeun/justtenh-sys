import React from 'react';
import { KTIcon } from '../../../../_metronic/helpers';

interface ErrorDisplayProps {
  title?: string;
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'Error',
  message
}) => {
  return (
    <div className="alert alert-danger d-flex align-items-center p-5 mb-10">
      <span className="svg-icon svg-icon-2hx svg-icon-danger me-4">
        <KTIcon iconName="cross-circle" className="fs-1" />
      </span>
      <div className="d-flex flex-column">
        <h5 className="mb-1">{title}</h5>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default ErrorDisplay; 