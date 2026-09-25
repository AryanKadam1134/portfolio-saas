import { useState } from "react";

import GlobalModal from "../../components/common/GlobalModal";

import { ModalContext } from "./useModal";

export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState({});

  const openModal = (title, icon, content, className) => {
    setModalContent({
      isOpen: true,
      title: title,
      icon: icon,
      renderContent: content,
      className: className,
    });
  };

  const closeModal = () => {
    setModalContent({ isOpen: false });
  };

  return (
    <ModalContext.Provider
      value={{
        modalContent,
        openModal,
        closeModal,
      }}
    >
      <GlobalModal />
      {children}
    </ModalContext.Provider>
  );
};
