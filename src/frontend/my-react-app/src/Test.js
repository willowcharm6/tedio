import React, { useState } from "react";
import { useBetween } from "use-between";

// Make a custom hook with your future shared state
const useFormState = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  return {
    username,
    setUsername,
    email,
    setEmail
  };
};

// Make a custom hook for sharing your state between any components
const useSharedFormState = () => useBetween(useFormState);

const ComponentA = () => {
  // Use the shared hook!
  const { username, setUsername } = useSharedFormState();
  return (
    <p>
      Username:{" "}
      <input value={username} onChange={(ev) => setUsername(ev.target.value)} />
    </p>
  );
};

const ComponentB = () => {
  // Use  the shared hook!
  const { email, setEmail } = useSharedFormState();
  return (
    <p>
      Email:{" "}
      <input value={email} onChange={(ev) => setEmail(ev.target.value)} />
    </p>
  );
};

const ComponentC = () => {
  // Use shared hook!
  const { email, username } = useSharedFormState();
  return (
    <p>
      Username: {username} <br />
      Email: {email}
    </p>
  );
};

export const Test = () => (
  <>
    <ComponentA />
    <ComponentB />
    <ComponentC />
  </>
);
