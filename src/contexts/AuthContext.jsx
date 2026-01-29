import { createContext, useContext, useEffect, useState } from 'react';
import { account, databases } from '@/lib/appwrite';
import { OAuthProvider } from 'appwrite';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        checkUserStatus();
    }, []);

    const checkUserStatus = async () => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const userId = urlParams.get('userId');
            const secret = urlParams.get('secret');

            // Check for OAuth errors passed in URL
            const error = urlParams.get('error');
            const errorDesc = urlParams.get('error_description');
            if (error) {
                console.error("OAuth Error from URL:", error, errorDesc);
                alert(`Login Failed: ${errorDesc || error}`);
            }

            if (userId && secret) {
                await account.updateMagicURLSession(userId, secret);
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            try {
                const accountDetails = await account.get();
                // console.log("User session active:", accountDetails.$id);
                setUser(accountDetails);

                const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
                const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;

                if (DATABASE_ID && USERS_COLLECTION_ID) {
                    try {
                        const userDoc = await databases.getDocument(
                            DATABASE_ID,
                            USERS_COLLECTION_ID,
                            accountDetails.$id
                        );
                        // console.log("User document fetched:", userDoc.$id);

                        setUserData({
                            ...userDoc,
                            type: userDoc.role,
                            email: accountDetails.email,
                        });
                    } catch (error) {
                        // console.error("Error fetching user document details:", error);
                        if (error.code === 404) {
                            try {
                                // console.log("Creating new user document...");
                                const newUserDoc = await databases.createDocument(
                                    DATABASE_ID,
                                    USERS_COLLECTION_ID,
                                    accountDetails.$id,
                                    {
                                        email: accountDetails.email,
                                        role: 'member',
                                        name: accountDetails.name,
                                    }
                                );
                                setUserData({
                                    ...newUserDoc,
                                    type: 'member',
                                    email: accountDetails.email,
                                });
                            } catch (createError) {
                                console.error("Failed to create user document:", createError);

                                setUserData({
                                    type: 'member',
                                    email: accountDetails.email,
                                    ...accountDetails
                                });
                            }
                        } else {
                            console.error("Error fetching user document:", error);

                            setUserData({
                                type: 'member',
                                email: accountDetails.email,
                                ...accountDetails
                            });
                        }
                    }
                } else {
                    console.warn("Appwrite Database/Collection IDs missing in .env");
                    let userType = 'member';
                    if (accountDetails.labels && accountDetails.labels.includes('admin')) {
                        userType = 'admin';
                    }
                    setUserData({
                        type: userType,
                        email: accountDetails.email,
                        ...accountDetails
                    });
                }
            } catch (error) {
                // Suppress 401 error for guests
                if (error.code === 401) {
                    // Start of Debug: 
                    // console.debug("User is not logged in (Guest) or Session Cookie missing.");
                } else {
                    console.error("Error fetching account details:", error);
                }
                setUser(null);
                setUserData(null);
            }

        } catch (error) {
            console.error("Unexpected error in checkUserStatus:", error);
            setUser(null);
            setUserData(null);
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        try {
            console.log("Initiating Google Login...");
            console.log("Success URL:", `${window.location.origin}/dashboard`);
            console.log("Failure URL:", `${window.location.origin}/login`);

            await account.createOAuth2Session(
                OAuthProvider.Google,
                `${window.location.origin}/dashboard`,
                `${window.location.origin}/login`
            );
        } catch (error) {
            console.error("Google Login Error:", error);
        }
    };

    const loginWithMagicLink = async (email) => {
        try {
            await account.createMagicURLToken(
                'unique()',
                email,
                `${window.location.origin}/dashboard`
            );
            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false, error };
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
            setUserData(null);
        } catch (error) {
            console.error(error);
        }
    };

    const value = {
        user,
        userData,
        loading,
        loginWithGoogle,
        loginWithMagicLink,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
