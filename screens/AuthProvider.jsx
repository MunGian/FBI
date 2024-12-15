import React, { useEffect, useState, createContext } from 'react';
import { supabase } from '../services/supabase'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext(); 

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const isTokenExpired = (token) => {
        const decoded = jwt_decode(token);
        return decoded.exp * 1000 < Date.now();
    };

    const restoreUserSession = async () => {
        const token = await AsyncStorage.getItem("user");
        if (token && !isTokenExpired(token)) {
            const { data, error } = await supabase.auth.setAuth(token);
            if (error) {
                console.error("Error restoring session:", error);
            } else {
                setUser(data.user);
                console.log("Session restored:", data.user);
            }
        } else {
            console.log("Token is expired or not found.");
        }
    };

    useEffect(() => {
        restoreUserSession(); // Attempt to restore the user session on app launch

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            const currentUser = session?.user;
            setUser(currentUser ?? null);
            if (session) {
                AsyncStorage.setItem("user", session.access_token || "").then(() => {
                    console.log("JWT Stored:", session.access_token); // Debugging log
                });
            }
        });

        return () => {
            authListener?.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
