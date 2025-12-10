import { createContext, useState, useContext } from 'react';

const PageTitleContext = createContext();

export function PageTitleProvider({ children }) {
  const [title, setTitle] = useState('Dashboard');

  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}

export function usePageTitle() {
  return useContext(PageTitleContext);
}
