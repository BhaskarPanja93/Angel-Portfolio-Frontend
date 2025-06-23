import {Link, useLocation} from "react-router-dom";

export default function NavBarStructure() {
    const location = useLocation();
    return (<div className="flex flex-wrap justify-start space-x-6 pt-40 lg:pt-32 md:pt-32 sm:pt-40">
            <Link
                className={`nav-item pb-1 ${location.pathname.includes("/about") ? "border-b-4 border-yellow-500 text-yellow-500" : "border-b-2 border-gray-500/20 text-gray-700"} text-lg font-medium cursor-pointer transition-colors duration-300 hover:text-yellow-500`}
                to={"/about"}>About</Link>
            <Link
                className={`nav-item pb-1 ${location.pathname.includes("/gallery") ? "border-b-4 border-yellow-500 text-yellow-500" : "border-b-2 border-gray-500/20 text-gray-700"} text-lg font-medium cursor-pointer transition-colors duration-300 hover:text-yellow-500`}
                to={"/gallery"}>Gallery</Link>
            <Link
                className={`nav-item pb-1 ${location.pathname.includes("/projects") ? "border-b-4 border-yellow-500 text-yellow-500" : "border-b-2 border-gray-500/20 text-gray-700"} text-lg font-medium cursor-pointer transition-colors duration-300 hover:text-yellow-500`}
                to={"/projects"}>Projects</Link>
            <Link
                className={`nav-item pb-1 ${location.pathname.includes("/network") ? "border-b-4 border-yellow-500 text-yellow-500" : "border-b-2 border-gray-500/20 text-gray-700"} text-lg font-medium cursor-pointer transition-colors duration-300 hover:text-yellow-500`}
                to={"/network"}>Network</Link>
        </div>)
}