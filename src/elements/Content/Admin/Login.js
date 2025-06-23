import React, {useState} from "react";
import {useLocation} from "react-router-dom";
import {useNavigate} from "react-router";
import {UseAuthContext} from "../../../context/AuthService";
import {ROUTES} from "../../../context/Constants";
import {UseDefaultNotification} from "../../../context/DefaultNotificationService";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [disabledOperation, setDisabledOperation] = useState(false);

    const {connection, profile, refreshProfileData, logout} = UseAuthContext();
    const {newNotification} = UseDefaultNotification()

    const location = useLocation();
    const navigate = useNavigate();

    const handleLogin = async () => {
        setDisabledOperation(true)
        const formData = new FormData();
        formData.append('mail_address', email);
        formData.append('password', password);
        try {
            const response = await connection.post(ROUTES.SIGN_IN, formData);
            if (response.data?.reply?.allowed) {
                await refreshProfileData()
                await sleep(1000)
                navigate(location.state?.from ? navigate(-1) : "/gallery")
            } else newNotification('Failed: SignIn');
        } catch (error) {
            newNotification('Sign in error:', error);
        } finally {
            setDisabledOperation(false)
        }
    };

    const handleLogout = async () => {
        try {
            await connection.post(ROUTES.SIGN_OUT);
            logout()
            navigate(`/gallery`, {replace: true})
        } catch (error) {
            newNotification('Sign out error:', error);
        } finally {
        }
    };

    return (<div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm">
                {profile && profile["is_admin"] ? (<div className="text-center space-y-4">
                        <p className="text-lg font-semibold">
                            Logged in as: {profile["identifier"]}<br/>
                            Role: {profile["role"]}<br/>
                            Remember: {profile["remember_me"] ? "yes" : "no"}<br/>
                        </p>
                        <button
                            disabled={disabledOperation}
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>) : (<>
                        <h2 className="text-xl font-bold text-center mb-4">Login</h2>
                        <input
                            type="text"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        />
                        <button
                            onClick={handleLogin}
                            disabled={disabledOperation}
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </>)}
            </div>
        </div>);
}
