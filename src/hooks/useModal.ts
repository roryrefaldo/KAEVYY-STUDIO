import { useState, useCallback } from 'react';

export function useModal<T = boolean>(initialState: T | null = null) {
  const [isOpen, setIsOpen] = useState<boolean>(!!initialState);
  const [modalData, setModalData] = useState<T | null>(initialState);

  const openModal = useCallback((data?: T) => {
    if (data !== undefined) {
      setModalData(data);
    }
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalData(null);
  }, []);

  return {
    isOpen,
    modalData,
    openModal,
    closeModal,
  };
}
