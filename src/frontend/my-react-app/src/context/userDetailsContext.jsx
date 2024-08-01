import { useState } from "react";

const UserDetailsState = () => {
    const [age, setAge] = useState("");
    const [values, setValues] = useState("");
    return {
      age,
      setAge,
      values,
      setValues
    };
  };
export default UserDetailsState