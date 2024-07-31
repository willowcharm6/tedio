/**
 * v0 by Vercel.
 * @see https://v0.dev/t/tegg21IGR6Q
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Input from "../../components/input.jsx";
import Button from "../../components/button.jsx";
import UserDetailsContext from "../../context/userDetailsContext.jsx";
import { useState, useContext } from "react";
import Age from "../Age/Age.jsx";
import merge from 'lodash.merge'

const UserDetailsProvider = ({children}) => {
  const setUserDetails = ({
    age,
    values
  }) => {
    updateUserDetails(prevState => {
      const newState = { ...prevState }
      return merge(newState, {
        age,
        values
      })
    })
  }

  const userState = {
    age: '',
    values: [''],
    setUserDetails
  }

  const [userDetails, updateUserDetails] = useState(userState)

  return (
    <UserDetailsContext.Provider value={userDetails}>
      <h3>
        This is homepage.jsx
      </h3>
      <Age />
    </UserDetailsContext.Provider>
  )

}

export default UserDetailsProvider