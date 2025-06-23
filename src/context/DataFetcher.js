import {createContext, useContext, useState} from "react";
import axios from "axios"
import {BACKEND_URL, DYNAMIC_ROUTE, ROUTES} from "./Constants";
import {UseDefaultNotification} from "./DefaultNotificationService";

export const DataFetcherContext = createContext(null);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


let fetchAllCategoryDataOngoing = false
let fetchPfpDataOngoing = false
let fetchBannerDataOngoing = false
const fetchCategoryDataOngoing = {}
const fetchIllustrationDataOngoing = {}


export default function DataProvider({children}) {
    const [catExtData, setCatExtData] = useState({cache_id: null, sorted_ids: [], individual: {}});
    const [catIntData, setCatIntData] = useState({}); // for each cat : cache_id:null, sorted_ids: [], individual: {}
    const [illusIntData, setIllusIntData] = useState({}); // for each cat : for each illus : cache_id:null, name:null, images:[], gif:null, description:null
    const [pfpData, setPfpData] = useState({cache_id: null});
    const [bannerData, setBannerData] = useState({cache_id: null});

    const {newNotification} = UseDefaultNotification()


    const fetchCatExtData = async (force) => {
        if (!fetchAllCategoryDataOngoing || force) {
            fetchAllCategoryDataOngoing = true
            try {
                const response = await axios.get(ROUTES.ALL_CATEGORY_DATA + (catExtData.cache_id ? "?cache_id=" + catExtData.cache_id : ""))
                const data = response.data
                if (data !== null) {
                    const new_data = {cache_id: null, sorted_ids: [], individual: {}}
                    new_data.cache_id = data["cache_id"]
                    data["all_categories"].forEach(category => {
                        new_data.sorted_ids.push(category["id"])
                        new_data.individual[category["id"]] = category
                    })
                    setCatExtData(new_data)
                }
            } catch (e) {
                newNotification("Error getting site data")
            } finally {
                await sleep(5000)
                fetchAllCategoryDataOngoing = false
            }
        }
    }


    const fetchCatIntData = async (categoryID, force) => {
        if (!categoryID) return
        if (!fetchCategoryDataOngoing[categoryID] || force) {
            fetchCategoryDataOngoing[categoryID] = true
            try {
                const response = await axios.get(ROUTES.SINGLE_CATEGORY_DATA + "/" + categoryID + (catIntData[categoryID]?.cache_id ? "?cache_id=" + catIntData.cache_id : ""))
                const data = response.data
                if (data !== null) {
                    const new_data = {cache_id: null, sorted_ids: [], individual: {}}
                    data["all_illustrations"].forEach(illustration => {
                        new_data.sorted_ids.push(illustration["id"])
                        new_data.individual[illustration["id"]] = illustration
                    })
                    setCatIntData(prevData => ({...prevData, [categoryID]: new_data}))
                }
            } catch (e) {
                newNotification("Error getting category data")
            } finally {
                await sleep(5000)
                fetchCategoryDataOngoing[categoryID] = false
            }
        }
    }


    const fetchIllusIntData = async (categoryID, illustrationID, force) => {
        if (!categoryID || !illustrationID) return
        if (fetchIllustrationDataOngoing[categoryID] == null) fetchIllustrationDataOngoing[categoryID] = {}
        if (!fetchIllustrationDataOngoing[categoryID][illustrationID] || force) {
            fetchIllustrationDataOngoing[categoryID][illustrationID] = true
            try {
                const response = await axios.get(`${ROUTES.SINGLE_ILLUSTRATION_DATA}/${categoryID}/${illustrationID}${illusIntData[categoryID]?.[illustrationID]?.cache_id ? `?cache_id=${illustrationID}${illusIntData[categoryID][illustrationID].cache_id}` : ''}`);

                const data = response.data
                if (data !== null) {
                    setIllusIntData(prevData => ({
                        ...prevData,
                        [categoryID]: {...prevData[categoryID], [illustrationID]: data}
                    }))
                }
            } catch (e) {
                newNotification("Error getting illustration data")
            } finally {
                await sleep(5000)
                fetchIllustrationDataOngoing[categoryID][illustrationID] = false
            }
        }
    }


    const fetchPFPData = async (force) => {
        if (!fetchPfpDataOngoing || force) {
            fetchPfpDataOngoing = true
            try {
                const response = await axios.get(ROUTES.PFP_DATA + (pfpData.cache_id ? "?cache_id=" + pfpData.cache_id : ""))
                const data = response.data
                if (data !== null) {
                    setPfpData(data)
                }
            } catch (e) {
                newNotification("Error getting PFP data")
            } finally {
                await sleep(5000)
                fetchPfpDataOngoing = false
            }
        }
    }


    const fetchBannerData = async (force) => {
        if (!fetchBannerDataOngoing || force) {
            fetchBannerDataOngoing = true
            try {
                const response = await axios.get(ROUTES.BANNER_DATA + (bannerData.cache_id ? "?cache_id=" + bannerData.cache_id : ""))
                const data = response.data
                if (data !== null) {
                    setBannerData(data)
                }
            } catch (e) {
                newNotification("Error getting Banner data")
            } finally {
                await sleep(5000)
                fetchBannerDataOngoing = false
            }
        }
    }


    const prepareImage = async (imgURL) => {
        if (imgURL == null) return
        return new Promise((resolve) => {
            imgURL = BACKEND_URL + DYNAMIC_ROUTE + "/" + imgURL
            const img = new Image()
            img.onerror = () => {
                resolve()
            }
            img.onload = () => {
                resolve()
            }
            img.src = imgURL
        })
    }


    return (<DataFetcherContext.Provider value={{
            prepareImage,
            fetchCatExtData,
            fetchPFPData,
            fetchBannerData,
            fetchCatIntData,
            fetchIllusIntData,
            catExtData,
            pfpData,
            bannerData,
            catIntData,
            illusIntData
        }}>
            {children}
        </DataFetcherContext.Provider>);
};


export const UseDataFetcherContext = () => useContext(DataFetcherContext);

