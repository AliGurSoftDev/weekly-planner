import React, { createContext, useContext, useState } from "react";

const ActiveFormContext = createContext();

export const ActiveFormProvider = ({ children }) => {
    const [activeFormDate, setActiveFormDate] = useState(null);
    
    return (
        <ActiveFormContext.Provider value={{ activeFormDate, setActiveFormDate }}>
      {children}
    </ActiveFormContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useActiveForm = () => useContext(ActiveFormContext);
