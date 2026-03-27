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

    const handleSignIn = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password: password.trim(),
            })

            if (error) {
                console.error('Error signing in:', error);
                return { success: false, error: error.message }
            }

            if (data.session) {
                console.log("Sign in successful");
                return { success: true, data }
            }

        } catch (error) {
            console.error('Unexpected sign in error:', error.message);
            return { success: false, error: 'An unexpected error occurred.' }
        }
    }

    const handleSignUp = async (email, password, name, role) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email.trim().toLowerCase(),
                password: password.trim(),
                options: {
                    data: {
                        name: name.trim(),
                        role: role,
                    }
                }
            })

            if (error) {
                console.error('Error signing up:', error);
                return { success: false, error: error.message }
            }

            if (data.user) {
                console.log("Sign up successful");
                return { success: true, data }
            }

        } catch (error) {
            console.error('Unexpected sign up error:', error.message);
            return { success: false, error: 'An unexpected error occurred.' }
        }
    }

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Error signing out:', error);
            return { success: false, error: error.message }
        }

        console.log("Sign out successful");
        return { success: true }
    }


    return (
        <AuthContext.Provider value={{ session, handleSignIn, handleSignUp, handleSignOut }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    return useContext(AuthContext);
}