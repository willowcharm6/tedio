import { createContext } from "react";
import merge from 'lodash.merge'
import { useState } from "react";

const UserDetailsContext = createContext({
    age: '',
    values: [''],

    setUserDetails: userDetails => {}
})

export const UserDetailsProvider = ({children}) => {
    const [userDetails, setUserDetails] = useState({
      age: '',
      values: [''],
    });
  
    const updateUserDetails = (newDetails) => {
      setUserDetails(prevState => merge({}, prevState, newDetails));
    };
  
    return (
      <UserDetailsContext.Provider value={{...userDetails, setUserDetails: updateUserDetails}}>
        {children}
      </UserDetailsContext.Provider>
    );
  };
  
  export default UserDetailsContext;