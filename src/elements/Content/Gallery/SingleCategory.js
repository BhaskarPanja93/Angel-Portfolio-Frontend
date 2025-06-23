import {UseDataFetcherContext} from "../../../context/DataFetcher";
import {lazy, Suspense, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import RobloxLogo from "../../../static/roblox_logo.png";
import YoutubeLogo from "../../../static/youtube_logo.png";
import {UseAuthContext} from "../../../context/AuthService";


const ModifyCategory = lazy(() => import("../Admin/ModifyCategoryPopup"))
const NewIllustration = lazy(() => import("../Admin/NewIllustrationPopup"))


export default function SingleCategory({categoryID}) {
    let loadingLocal = false
    let stopLoadingLocal = false;
    const {profile} = UseAuthContext()
    const {prepareImage, fetchCatIntData, catIntData, fetchIllusIntData} = UseDataFetcherContext()
    const [loadedIllustrations, setLoadedIllustrations] = useState([])
    const [adminPopup, setAdminPopup] = useState(null)

    const sequentiallyLoadIllustrations = async () => {
        if (loadingLocal) return
        if (!(catIntData[categoryID] && catIntData[categoryID].sorted_ids)) return
        loadingLocal = true
        setLoadedIllustrations([])
        for (const illustrationID of catIntData[categoryID].sorted_ids) {
            if (stopLoadingLocal) return
            const illustrationData = catIntData[categoryID].individual[illustrationID];
            setLoadedIllustrations(prev => [...prev, illustrationData]);
            await prepareImage(`${categoryID}/${illustrationID}/${illustrationData["thumbnail"]}`)
        }
        loadingLocal = false
    }


    useEffect(() => {
        fetchCatIntData(categoryID).then()
        sequentiallyLoadIllustrations().then()
        return () => {
            stopLoadingLocal = true
        }
    }, []);


    useEffect(() => {
        sequentiallyLoadIllustrations().then()
    }, [catIntData]);


    return (<Suspense fallback={null}>
            {profile && profile["is_admin"] && adminPopup === "MODIFY-CATEGORY" ? <ModifyCategory
                closePopup={() => setAdminPopup(null)}/> : profile && profile["is_admin"] && adminPopup === "NEW-ILLUSTRATION" ?
                <NewIllustration closePopup={() => setAdminPopup(null)}/> : null}
            {profile && profile["is_admin"] && <>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg mb-6 mr-4"
                        onClick={() => {
                            setAdminPopup("MODIFY-CATEGORY")
                        }}
                >Modify Category
                </button>
                <button
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg mb-6 mr-4"
                    onClick={() => {
                        setAdminPopup("NEW-ILLUSTRATION")
                    }}
                >New Illustration
                </button>
            </>}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {loadedIllustrations.map((illustrationData, index) => (<Link key={index}
                                                                             className="relative w-full pt-[100%] bg-gray-300 rounded-lg overflow-hidden shadow-lg cursor-pointer"
                                                                             to={`/gallery/${categoryID}/${illustrationData["id"]}`}
                                                                             state={{from: `/gallery/${categoryID}`}}
                                                                             onMouseEnter={() => fetchIllusIntData(categoryID, illustrationData["id"])}
                    >
                        <div
                            className="flex items-center justify-center relative w-full pt-[100%] rounded-tl-lg rounded-tr-lg rounded-bl-lg overflow-hidden object-contain">
                            <img
                                src={`/portfolio/dynamic/${categoryID}/${illustrationData["id"]}/${illustrationData["thumbnail"]}`}
                                className="rounded-lg cursor-pointer" alt="Illustration"/>

                            <div
                                className="absolute inset-0 bg-gradient-to-t from-white/25 to-transparent opacity-0 hover:opacity-25 transition-opacity cursor-pointer"></div>

                            {illustrationData["roblox"] || illustrationData["yt"] ? <div
                                className="absolute bottom-0 right-0 bg-gray-100 rounded-tl-lg p-1 flex flex-col gap-1">

                                {illustrationData["roblox"] ? <button
                                    onClick={() => window.open(`https://roblox.com/${illustrationData["roblox"]}`, '_blank')}
                                    className="illustration-btn-img">
                                    <img src={RobloxLogo} alt="Roblox"
                                         className="w-full h-full cursor-pointer hover:opacity-75"/>
                                </button> : null}

                                {illustrationData["yt"] ? <button
                                    onClick={() => window.open(`https://youtube.com/shorts/${illustrationData["yt"]}`, '_blank')}
                                    className="illustration-btn-img">
                                    <img src={YoutubeLogo} alt="YouTube"
                                         className="w-full h-full cursor-pointer hover:opacity-75"/>
                                </button> : null}
                            </div> : null}
                        </div>
                    </Link>))}
            </div>
        </Suspense>)
}