import {Link} from "react-router-dom"
import DiscordLogo from "../../../static/discord_logo.png";

export default function NetworkDiscord() {
    return (<>
            <div className="flex gap-4 mt-8">
                <img src={DiscordLogo} alt="Discord"
                     className="w-6 h-6 lg:w-9 lg:h-9 md:w-8 md:h-8 sm:w-6 sm:h-6 opacity-75 hover:opacity-100"/>
                <h2 className='text-xl font-bold text-gray-800 mb-4'>Discord</h2>
            </div>
            <p className="text-gray-600">Connect with my Discord communities through the links below ♡ </p>
            <div className="flex gap-4 mt-2">
                <Link to="https://discord.gg/A8B4NynS8f" target="_blank"
                      className="text-xs px-2 sm:text-xs sm:px-2 md:text-md md:px-4 lg:text-md lg:px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-400 hover:text-white transition duration-300 cursor-pointer inline-block text-center">
                    Angel's Studio
                </Link>
                <Link to="https://discord.gg/N3dUEP4JZe" target="_blank"
                      className="text-xs px-2 sm:text-xs sm:px-2 md:text-md md:px-4 lg:text-md lg:px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-400 hover:text-white transition duration-300 cursor-pointer inline-block text-center">
                    Heavenly
                </Link>
            </div>
        </>)
}