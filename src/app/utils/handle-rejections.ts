import { IResponse } from '../interfaces/response.model';

/**
 * Handle result from rejection
 * @param errorException comes from response rejection header
 */
export const handleRejectionMessage = (errorException: any): IResponse => {
  const {
    error: { error, message },
  } = errorException;
  return {
    result: 'error',
    message,
    data: error,
  };
};
