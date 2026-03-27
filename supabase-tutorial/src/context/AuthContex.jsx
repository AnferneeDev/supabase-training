import { createContext, useState, useContext, useEffect } from "react";
import supabase from "../supabase-client";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

    const [session, setSession] = useState(undefined);

    useEffect(() => {

        async function getInitialSession() {
            const { data, error } = await supabase.auth.getSession();
            try {
                if (error) {
                    console.error('Error getting session:', error);
                } else {
                    setSession(data.session);
                    console.log(data.session);
                }
            } catch (error) {
                console.error('Error getting session:', error);
            }
        }

        getInitialSession();
        

        const { data: { subscription } } =  supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            console.log("Session changed: ", session)
        });

        return () => {
            subscription.unsubscribe();
        }

    }, [])


    return (
        <AuthContext.Provider value={{ session }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    return useContext(AuthContext);
}