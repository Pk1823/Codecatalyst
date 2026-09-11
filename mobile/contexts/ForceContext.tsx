import React, { createContext, useContext, useState } from "react";
import { ForceId, ForceConfig, FORCES_CONFIG } from "../constants/forces";

interface ForceContextValue {
  currentForce: ForceConfig;
  setForce: (id: ForceId) => void;
  availableForces: ForceConfig[];
}

const ForceContext = createContext<ForceContextValue | undefined>(undefined);

export const ForceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [forceId, setForceId] = useState<ForceId>("CRPF");

  const setForce = (id: ForceId) => {
    setForceId(id);
  };

  return (
    <ForceContext.Provider
      value={{
        currentForce: FORCES_CONFIG[forceId],
        setForce,
        availableForces: Object.values(FORCES_CONFIG),
      }}
    >
      {children}
    </ForceContext.Provider>
  );
};

export const useForce = (): ForceContextValue => {
  const context = useContext(ForceContext);
  if (!context) {
    throw new Error("useForce must be used within a ForceProvider");
  }
  return context;
};
