import { createContext, useContext, useEffect, useState } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(()=>{
    let role= JSON.parse(localStorage.getItem('user')) 
    
    if(role=='admin'){

        setUser('admin')

        console.log('auto login')

    }
  },[])

  return (
    <GlobalContext.Provider value={{ user, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);
