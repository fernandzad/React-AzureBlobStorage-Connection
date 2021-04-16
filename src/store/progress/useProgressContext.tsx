import React, { createContext, useReducer, useContext } from "react";

import { filesProgressReducer } from "./useProgressReducer";
import { setProgressFilesAction } from "./useProgressActions";
import { PayloadProgressType, StateType } from './types/progressTypes';

interface ProviderProps {
  children: React.ReactNode;
} 

const initialState: StateType = {
  filesProgress: []
};

const FileProgressContext = createContext(initialState);

export const UserPreferencesProvider = ({ children }: ProviderProps ) => {
  const [state, dispatch] = useReducer(filesProgressReducer, initialState);
  console.log("STATE", state);

  const value = {
    ...state,
    setProgressFiles: setProgressFilesAction(dispatch),
  };

  return (
    <FileProgressContext.Provider value={value}>
      {children}
    </FileProgressContext.Provider>
  );
};

export default function useFileProgressContext() {
  return useContext(FileProgressContext);
}