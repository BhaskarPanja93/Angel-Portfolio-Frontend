import {UseDataFetcherContext} from "../../../context/DataFetcher";
import {useEffect} from "react";
import NetworkRoblox from "./Roblox";
import NetworkDiscord from "./Discord";


export default function NetworkStructure() {

    const {fetchBannerData, fetchPFPData} = UseDataFetcherContext()

    useEffect(() => {
        fetchBannerData()
        fetchPFPData()
    }, []);

    return (<>
            <NetworkRoblox/>
            <NetworkDiscord/>
        </>)
}