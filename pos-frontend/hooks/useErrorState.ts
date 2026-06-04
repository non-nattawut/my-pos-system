import { useState } from 'react';

export function useErrorState() {
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');

  const showError = (message: string) => {
    setErrorModalMessage(message);
    setErrorModalOpen(true);
  };

  const closeError = () => {
    setErrorModalOpen(false);
  };

  return {
    errorModalOpen,
    setErrorModalOpen,
    errorModalMessage,
    setErrorModalMessage,
    showError,
    closeError,
  };
}
