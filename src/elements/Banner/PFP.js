import {UseDataFetcherContext} from "../../context/DataFetcher";
import {useEffect} from "react";


export default function PFP() {
    const {fetchPFPData, pfpData} = UseDataFetcherContext()
    useEffect(() => {
        fetchPFPData()
    }, []);
    return (<div
            className="absolute bottom-[-60px] mt-3 left-5 w-24 h-24 bg-gray-500 border-4 border-white rounded-full shadow-lg overflow-hidden">
            {pfpData && pfpData["pfp"] ? <img src={`/portfolio/dynamic/${pfpData['pfp']}`} alt="PFP"
                                              className="w-full h-full object-cover"/> : null}
        </div>)
}
