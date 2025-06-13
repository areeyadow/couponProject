"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { liffConfig } from "./liffConfig";

// Define LIFF context types
type LiffContextType = {
  liff: any | null;
  liffError: string | null;
  isLoggedIn: boolean;
  profile: any | null;
  isLoading: boolean;
};

// Create LIFF context
const LiffContext = createContext<LiffContextType>({
  liff: null,
  liffError: null,
  isLoggedIn: false,
  profile: null,
  isLoading: true,
});

// LIFF Provider Props
interface LiffProviderProps {
  children: ReactNode;
}

// Custom hook to use LIFF context
export const useLiff = () => useContext(LiffContext);

// LIFF Provider component
export function LiffProvider({ children }: LiffProviderProps) {
  const [liffObject, setLiffObject] = useState<any>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize LIFF
  useEffect(() => {
    // Import LIFF dynamically to avoid issues with SSR
    import("@line/liff")
      .then((liff) => {
        console.log("LIFF initialized!");

        // Initialize LIFF app
        liff.default
          .init(liffConfig)
          .then(() => {
            setLiffObject(liff.default);

            // Check if user is logged in
            if (liff.default.isLoggedIn()) {
              setIsLoggedIn(true);

              // Get user profile if logged in
              liff.default
                .getProfile()
                .then((profile: any) => {
                  setProfile(profile);
                })
                .catch((error: Error) => {
                  console.error("Error getting profile", error);
                })
                .finally(() => {
                  setIsLoading(false);
                });
            } else {
              setIsLoading(false);
            }
          })
          .catch((error: Error) => {
            console.error("LIFF initialization failed", error);
            setLiffError(`LIFF initialization failed: ${error.message}`);
            setIsLoading(false);
          });
      })
      .catch((error: Error) => {
        console.error("Failed to load LIFF SDK", error);
        setLiffError(`Failed to load LIFF SDK: ${error.message}`);
        setIsLoading(false);
      });
  }, []);

  // LIFF context value
  const contextValue = {
    liff: liffObject,
    liffError,
    isLoggedIn,
    profile,
    isLoading,
  };

  return (
    <LiffContext.Provider value={contextValue}>{children}</LiffContext.Provider>
  );
}
