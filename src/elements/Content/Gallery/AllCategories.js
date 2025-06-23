import {UseDataFetcherContext} from "../../../context/DataFetcher";
import {lazy, Suspense, useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import {UseAuthContext} from "../../../context/AuthService";


const NewCategory = lazy(() => import("../Admin/NewCategoryPopup"))
const ModifyPFP = lazy(() => import("../Admin/ModifyPFP"))
const ModifyBanner = lazy(() => import("../Admin/ModifyBanner"))


export default function AllCategories() {
    let loadingLocal = false
    let stopLoadingLocal = false;
    const {profile} = UseAuthContext()
    const {prepareImage, fetchCatExtData, catExtData, fetchCatIntData} = UseDataFetcherContext()
    const [loadedCategories, setLoadedCategories] = useState([])
    const [adminPopup, setAdminPopup] = useState(null)

    const sequentiallyLoadCategories = async () => {
        if (loadingLocal) return
        loadingLocal = true
        setLoadedCategories([])
        for (const categoryID of catExtData.sorted_ids) {
            if (stopLoadingLocal) return
            const categoryData = catExtData.individual[categoryID]
            setLoadedCategories(prev => [...prev, categoryData])
            await prepareImage(`${categoryID}/${categoryData["thumbnail"]}`)
        }
        loadingLocal = false
    }


    useEffect(() => {
        fetchCatExtData().then()
        sequentiallyLoadCategories().then()
        return () => {
            stopLoadingLocal = true
        }
    }, []);


    useEffect(() => {
        sequentiallyLoadCategories().then()
        return () => {
            stopLoadingLocal = true
        }
    }, [catExtData]);


    return (<Suspense fallback={null}>
        {profile && profile["is_admin"] && adminPopup === "NEW-CATEGORY" ? <NewCategory
            closePopup={() => setAdminPopup(null)}/> : profile && profile["is_admin"] && adminPopup === "MODIFY-PFP" ?
            <ModifyPFP
                closePopup={() => setAdminPopup(null)}/> : profile && profile["is_admin"] && adminPopup === "MODIFY-BANNER" ?
                <ModifyBanner closePopup={() => setAdminPopup(null)}/> : null}
        {profile && profile["is_admin"] && <>
            <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg mb-6 mr-4"
                onClick={() => {
                    setAdminPopup("NEW-CATEGORY")
                }}
            >New Category
            </button>
            <button
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg mb-6 mr-4"
                onClick={() => {
                    setAdminPopup("MODIFY-PFP")
                }}
            >Modify PFP
            </button>
            <button
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg mb-6 mr-4"
                onClick={() => {
                    setAdminPopup("MODIFY-BANNER")
                }}
            >
                Modify Banner
            </button>
        </>}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {loadedCategories.map((categoryData, index) => (<Link key={index}
                                                                  className="relative w-full pt-[100%] bg-gray-300 rounded-lg overflow-hidden shadow-lg cursor-pointer"
                                                                  to={`/gallery/${categoryData["id"]}`}
                                                                  onMouseEnter={() => fetchCatIntData(categoryData["id"])}
            >
                <img src={`/portfolio/dynamic/${categoryData["id"]}/${categoryData["thumbnail"]}`}
                     alt={categoryData["name"]}/>
                <div
                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center hover:bg-white hover:bg-opacity-20">
                        <span
                            className="text-white text-md sm:text-md md:text-2xl lg:text-2xl font-semibold">{categoryData["name"]}</span>
                </div>
            </Link>))}
        </div>
    </Suspense>)
}