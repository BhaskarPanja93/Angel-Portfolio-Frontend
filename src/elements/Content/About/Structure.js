import AboutMeCloudGIF from "../../../static/about_me_cloud.gif"
import {UseDataFetcherContext} from "../../../context/DataFetcher";
import {useEffect} from "react";

export default function AboutStructure() {

    const {fetchBannerData, fetchPFPData} = UseDataFetcherContext()

    useEffect(() => {
        fetchBannerData()
        fetchPFPData()
    }, []);

    return (<>
        <div className="p-2">
            <p className="text-justify text-lg text-gray-600">Hello, I'm Angel! I'm a 19-year-old artist
                specializing in 2D art and 3D modeling.
                <br/>I started as a 2D artist, but in 2025, I expanded into 3D game development. I've collaborated
                with brands and creators on Roblox, designing games and collections of 3D items that have reached
                millions of players—from concept to completion.
                <br/>My work includes Anime-style digital art, 2D vector illustrations, 3D asset creation, Roblox
                UGC, clothing design, UI/UX, and website design.
                <br/>Feel free to reach out for inquiries—I hope you enjoy exploring my portfolio!</p>
        </div>
        <div className="pt-4"><img src={AboutMeCloudGIF} alt="Clouds"/></div>
    </>)
}