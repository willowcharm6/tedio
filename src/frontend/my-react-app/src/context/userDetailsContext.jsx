import { useState } from "react";

const UserDetailsContext = () => {
    const [age, setAge] = useState("");
    const [values, setValues] = useState("");
    return {
      age,
      setAge,
      values,
      setValues
    };
  };
export default UserDetailsContext