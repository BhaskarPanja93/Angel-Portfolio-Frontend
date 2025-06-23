import {Link} from "react-router-dom"
import RobloxLogo from "../../../static/roblox_logo.png";


export default function NetworkRoblox() {
    return (<>
        <div className="flex gap-4">
            <img src={RobloxLogo} alt="Roblox"
                 className="w-6 h-6 lg:w-9 lg:h-9 md:w-8 md:h-8 sm:w-6 sm:h-6 opacity-75 hover:opacity-100"/>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Roblox</h2>
        </div>
        <p className="text-gray-600">Connect with my Roblox communities through the links below ♡ </p>
        <div className="flex gap-4 mt-2">
            <Link to="https://www.roblox.com/communities/32822799/Heavenly-UGC#!/about" target="_blank"
                  className="text-xs px-2 sm:text-xs sm:px-2 md:text-md md:px-4 lg:text-md lg:px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-400 hover:text-white transition duration-300 cursor-pointer inline-block text-center">
                Heavenly UGC
            </Link>
            <Link to="https://www.roblox.com/communities/12641329/Heaven#!/about" target="_blank"
                  className="text-xs px-2 sm:text-xs sm:px-2 md:text-md md:px-4 lg:text-md lg:px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-400 hover:text-white transition duration-300 cursor-pointer inline-block text-center">
                Heavenly Outfits
            </Link>
            <Link to="https://www.roblox.com/communities/34569233/Heavenly-Arcade#!/about" target="_blank"
                  className="text-xs px-2 sm:text-xs sm:px-2 md:text-md md:px-4 lg:text-md lg:px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-400 hover:text-white transition duration-300 cursor-pointer inline-block text-center">
                Heavenly Arcade
            </Link>
        </div>
    </>)
}