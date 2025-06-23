import {Navigate, useLocation} from "react-router-dom";
import {UseAuthContext} from "./AuthService";

const AdminChecker = ({children}) => {
    const {profile} = UseAuthContext();
    const location = useLocation();
    return profile && profile["is_admin"] ? children : <Navigate to="/login" state={{from: location}} replace/>;
};

export default AdminChecker;
