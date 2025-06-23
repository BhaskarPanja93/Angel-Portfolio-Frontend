import {Link} from "react-router-dom"
import RobloxLogo from "../../static/roblox_logo.png";
import YoutubeLogo from "../../static/youtube_logo.png";
import DiscordLogo from "../../static/discord_logo.png";
import {UseDataFetcherContext} from "../../context/DataFetcher";
import {useEffect} from "react";


export default function Imagery() {
    const {fetchBannerData, bannerData} = UseDataFetcherContext()
    useEffect(() => {
        fetchBannerData()
    }, []);

    return (<>
            <div className="absolute top-3 left-3 flex space-x-3 bg-white rounded-lg p-1">
                <Link to="https://www.roblox.com/users/671956728/profile" target="_blank">
                    <img src={RobloxLogo} alt="Roblox"
                         className="w-6 h-6 lg:w-9 lg:h-9 md:w-8 md:h-8 sm:w-6 sm:h-6 opacity-75 hover:opacity-100"/>
                </Link>
                <Link to="https://www.youtube.com/channel/UCjFfZwXca5tiIoKvakB-O_g" target="_blank">
                    <img src={YoutubeLogo} alt="YouTube"
                         className="w-6 h-6 lg:w-9 lg:h-9 md:w-8 md:h-8 sm:w-6 sm:h-6 opacity-75 hover:opacity-100"/>
                </Link>
                <Link to="https://discord.gg/A8B4NynS8f" target="_blank" rel="noreferrer">
                    <img src={DiscordLogo} alt="Discord"
                         className="w-6 h-6 lg:w-9 lg:h-9 md:w-8 md:h-8 sm:w-6 sm:h-6 opacity-75 hover:opacity-100"/>
                </Link>
            </div>
            {bannerData && bannerData["banner"] ? <img src={`/portfolio/dynamic/${bannerData["banner"]}`} alt="Banner"
                                                       className="w-full h-full object-cover"/> : null}
        </>)
}