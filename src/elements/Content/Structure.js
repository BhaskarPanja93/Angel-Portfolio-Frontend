import {Outlet} from "react-router-dom";


export default function ContentStructure() {
    return (<div className="mt-6 p-4 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg shadow-md">
            <Outlet/>
        </div>)
}