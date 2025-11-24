import React, { createContext, useState } from 'react';

export const LayoutContext = createContext();

export function LayoutProvider({ children }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = isVisible => {
    setIsSidebarVisible(isVisible);
  };

  return (
    <LayoutContext.Provider value={{ isSidebarVisible, toggleSidebar }}>
      {children}
    </LayoutContext.Provider>
  );
}
