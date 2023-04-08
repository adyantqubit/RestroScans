import React from 'react';
import { useState } from 'react';

export const AppStateContext = React.createContext();

export const AppStateProvider = ({children}) => {

  var [render ,setRender] = useState(false)

  return (
    <AppStateContext.Provider value={{render, setRender}}>
      {children}
    </AppStateContext.Provider>
  );
};