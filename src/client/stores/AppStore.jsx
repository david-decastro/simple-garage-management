import { createContext, useContext, useState } from "react";

const AppStoreContext = createContext();

export const AppStore = ({ children }) => {
  const [version, setVersion] = useState({});

  return (
    <AppStoreContext.Provider value={{ version, setVersion }}>
      {children}
    </AppStoreContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error("useAppStore must be used within a provider");
  }
  return context;
};
