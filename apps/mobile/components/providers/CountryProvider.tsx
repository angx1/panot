import React, { createContext, useContext, useState, ReactNode } from "react";

interface Country {
  cca2: string;
  name: { common: string };
  callingCode: string;
  flag: string;
}

interface CountryContextType {
  selectedCountry: Country;
  setSelectedCountry: (country: Country) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

const defaultCountry: Country = {
  cca2: "ES",
  name: { common: "Spain" },
  callingCode: "+34",
  flag: "🇪🇸",
};

export function CountryProvider({ children }: { children: ReactNode }) {
  const [selectedCountry, setSelectedCountry] =
    useState<Country>(defaultCountry);

  const contextValue = React.useMemo(
    () => ({ selectedCountry, setSelectedCountry }),
    [selectedCountry]
  );

  return (
    <CountryContext.Provider value={contextValue}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
}
