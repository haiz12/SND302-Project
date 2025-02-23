import { createContext, useState } from "react";

export const AuthContext = createContext({
    _id: "",
    username: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    phoneNumber: "",
    avatar: "",
    role_id: ""
});
export const AuthWrapper = (props) => {
    const [user, setUser] = useState({
        _id: "",
        username: "",
        email: "",    
        password: "",
        dob: "",
        gender: "",
        phoneNumber: "",
        avatar: "",
        role_id: ""
    })
    const accessToken = localStorage.getItem("access_token")
    const [isAppLoading, setIsAppLoading] = useState(true);
    return (
        <AuthContext.Provider value={{
            user, setUser,
            isAppLoading, setIsAppLoading,
            accessToken
        }}>
            {props.children}
            {/* <RouterProvider router={router} /> */}
        </AuthContext.Provider>
    )

}