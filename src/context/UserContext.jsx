import React, { useState } from "react";
import { createContext } from "react";

export const UserDataContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <UserDataContext.Provider value={{ user, setUser }}>
            {children}
        </UserDataContext.Provider>
    );
};

export default UserProvider;