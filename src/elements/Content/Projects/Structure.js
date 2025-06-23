import {UseDataFetcherContext} from "../../../context/DataFetcher";
import {useEffect} from "react";

export default function ProjectsStructure() {
    const {fetchBannerData, fetchPFPData} = UseDataFetcherContext()

    useEffect(() => {
        fetchBannerData()
        fetchPFPData()
    }, []);

    return (<>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Projects</h2>
            <p className="text-gray-600">Adding soon....</p>
        </>)
}