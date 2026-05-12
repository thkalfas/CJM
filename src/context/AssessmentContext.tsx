"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { AssessmentState, INITIAL_STATE } from "@/lib/types";

interface AssessmentContextValue {
  state: AssessmentState;
  setState: React.Dispatch<React.SetStateAction<AssessmentState>>;
  resetState: () => void;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AssessmentState>(INITIAL_STATE);

  const resetState = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return (
    <AssessmentContext.Provider value={{ state, setState, resetState }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) {
    throw new Error("useAssessment must be used within AssessmentProvider");
  }
  return ctx;
}
