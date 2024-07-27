import { createContext } from "react";

const UserDetailsContext = createContext({
    age: '',
    values: [''],

    setUserDetails: userDetails => {}
})

export default UserDetailsContext