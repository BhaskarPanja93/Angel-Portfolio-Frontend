import axios from "axios";
import Cookies from 'js-cookie';
import {createContext, useContext, useEffect, useState} from "react";
import {RESPONSIVE_CHECK_ROUTE, ROUTES} from "./Constants";
import {UseDefaultNotification} from "./DefaultNotificationService";


export const AuthServiceContext = createContext(null);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


let accessToken = "";
let serverFailureCount = {};

export default function AuthServiceProvider({children}) {
    const [profile, setProfile] = useState(null);


    const connection = axios.create({withCredentials: true});
    const {newNotification} = UseDefaultNotification()


    const refreshProfileData = async () => {
        try {
            const response = await connection.post(ROUTES.AUTHORITY_CHECK)
            setProfile(response.data["reply"])
        } catch (error) {
            newNotification("Unable to fetch profile. Please refresh tab");
        }
    }


    let sendPingPromise = {};
    const sendPingAndWait = (host) => { // Create and return a new promise that resolves when server ping succeeds or fails resolving to a boolean.
        if (sendPingPromise[host] != null) return sendPingPromise[host];
        sendPingPromise[host] = new Promise((resolve) => {
            connection.post("https://" + host + RESPONSIVE_CHECK_ROUTE, {}, {
                responsiveCheck: true
            }).then(() => {
                resolve(true)
            }).catch(() => {
                resolve(false)
            }).finally(() => {
                sendPingPromise[host] = null;
            });
        });
        return sendPingPromise[host];
    }


    let sendTokenRefreshPromise = null;
    const refreshTokenAndWait = (skipLogin) => { // Create and return a new promise that resolves when the token is refreshed or fails resolving to a boolean.
        if (sendTokenRefreshPromise) return sendTokenRefreshPromise
        sendTokenRefreshPromise = new Promise((resolve) => {
            connection.post(ROUTES.REFRESH, {}, {
                refreshToken: true, skipLogin: skipLogin, headers: {
                    'csrf': Cookies.get("angel:portfolio:csrf"),
                }
            }).then(() => {
                resolve(true)
            }).catch(() => {
                if (!skipLogin) newNotification("Unable to authenticate you to the website. Please refresh tab")
                resolve(false)
            }).finally(() => {
                sendTokenRefreshPromise = null;
            });
        });
        return sendTokenRefreshPromise;
    }


    const logout = () => {
        accessToken = ""
        setProfile(null)
    }


    const retryRequest = async (connection, config) => {
        try {
            return await connection(config);
        } catch (error) {
            return Promise.reject(error);
        }
    };


    connection.interceptors.request.use(async (config) => {
        const fullUrl = new URL(config.url, config.baseURL);
        const host = fullUrl.host;
        config.host = host;
        if (isNaN(config.serverErroredCount)) config.serverErroredCount = 0
        if (isNaN(config.serverErrorRetryLimit)) config.serverErrorRetryLimit = 3
        if (isNaN(serverFailureCount[host])) serverFailureCount[host] = 0
        if (serverFailureCount[host] > 0) await sleep(1000 * serverFailureCount[host]) // wait 1000*n ms before sending any request
        if (!config.responsiveCheck) {
            while (serverFailureCount[host] > 0) {
                console.log(serverFailureCount[host], "pinging", host)
                await sendPingAndWait(host)
            }
        } // if there are server failures, wait for the server to be back online, except its responsive check itself
        if (accessToken) {
            config.headers["access"] = accessToken; // Attach access token to request if it exists
        }
        return config
    }, async (error) => {
        return Promise.reject(error)
    });


    connection.interceptors.response.use(async (response) => {
        if (response.status === 200) {
            serverFailureCount[response.config.host] = 0
            if (response.data["auth"]["change_tokens"]) {
                accessToken = response.data["auth"]["access_token"] // if new token, apply it
            }
            if (response.data["noti"]) response.data["noti"].forEach((notification) => newNotification(notification)) // if new notification, display it

            if (response.responsiveCheck) return response // responsive check passed, return simply
            else if (response.data && response.data["auth"] && response.data["auth"]["allowed"] !== true) { // If Auth wasn't allowed, open login and wait for close
                if (response.refreshToken) { // if the refresh request was rejected
                    delete response.data["auth"];
                    return response
                } else {
                    if (!await refreshTokenAndWait()) return null // Returns null if retry after refresh didn't work, prompting to re-request
                    else return await retryRequest(connection, response.config) // Returns retried response if refresh worked
                }
            } else {
                if (response.data && response.data["auth"]) delete response.data["auth"];
                return response
            }
        }
    }, async (error) => {
        if (error.status === 422) {
            newNotification("Form invalid, please contact support")
            return Promise.reject(error)
        }
        if (error.status === 429) {
            newNotification("Rate Limited. Please try after some time")
            return Promise.reject(error)
        }
        serverFailureCount[error.config.host]++ // Increment server error count
        error.config.serverErroredCount++ // Increment request error count
        if (error.config.responsiveCheck) return Promise.reject(error) // responsive check failed, return simply
        if (error.config.serverErroredCount >= error.config.serverErrorRetryLimit) { // Retry limit exceeded
            newNotification("Server Error: " + error.message)
            return Promise.reject(error) // Return the last error
        } else {
            return await retryRequest(connection, error.config) // Retry till limit hits
        }
    })


    useEffect(() => {
        refreshTokenAndWait(true).then((success) => {
            if (success) refreshProfileData().then()
        })
    }, [])


    return (<AuthServiceContext.Provider value={{connection, logout, profile, refreshProfileData}}>
            {children}
        </AuthServiceContext.Provider>);
};


export const UseAuthContext = () => useContext(AuthServiceContext);

