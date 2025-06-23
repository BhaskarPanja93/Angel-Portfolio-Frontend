import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {Link, useLocation} from "react-router-dom";
import {UseDataFetcherContext} from "../../../context/DataFetcher";
import NextTriangle from "../../../static/right_triangle.png";
import PrevTriangle from "../../../static/left_triangle.png";

export default function SingleIllustration({categoryID, illustrationID}) {
    const {fetchCatIntData, fetchIllusIntData, catIntData, illusIntData} = UseDataFetcherContext()
    const [imageIndex, setImageIndex] = useState(0)
    const [showingGIF, setShowingGIF] = useState(false)
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCatIntData(categoryID).then()
        fetchIllusIntData(categoryID, illustrationID).then()
    }, []);

    return (illusIntData && illusIntData[categoryID] && illusIntData[categoryID][illustrationID] && catIntData && catIntData[categoryID] && catIntData[categoryID].individual[illustrationID] ? (<>
        <div
            className="fixed inset-0 w-screen h-screen bg-black opacity-70 backdrop-blur-lg flex items-center justify-center z-10"></div>

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
            <div
                className="bg-white w-[90%] max-w-[400px] h-auto p-6 rounded-lg shadow-lg relative flex flex-col items-center  shadow-gray-800 shadow-xl border border-gray-200">

                <div
                    className="cursor-pointer self-end mb-4 bg-gray-200 text-gray-500 font-bold border border-gray-500 px-3 py-1 rounded-lg"
                    onClick={() => location.state?.from ? navigate(-1) : navigate(`/gallery/${categoryID}`, {replace: true})}
                >X
                </div>

                <img
                    src={showingGIF ? `/portfolio/dynamic/${categoryID}/${illustrationID}/${illusIntData[categoryID][illustrationID]["gif"]}` : `/portfolio/dynamic/${categoryID}/${illustrationID}/${illusIntData[categoryID][illustrationID]["images"][imageIndex]}`}
                    className="w-full object-contain rounded-lg mb-3"
                    style={{maxHeight: "500px"}}
                    alt={illusIntData[categoryID][illustrationID]["name"]}/>
                {illusIntData[categoryID][illustrationID]["gif"] ? <button
                    className="absolute top-24 right-10 text-white font-bold text-xl border-4 border-white rounded-lg px-2 py-2 shadow-inner transform"
                    onClick={() => setShowingGIF(!showingGIF)}
                >
                    {showingGIF ? "2D" : "3D"}
                </button> : null}

                <button
                    className="border border-4 border-gray-500 absolute left-2 top-1/2 -translate-y-1/2 bg-white text-gray-700 rounded-full p-2 shadow-lg"
                    onClick={() => setImageIndex(imageIndex - 1)}
                    hidden={showingGIF || imageIndex <= 0}
                >
                    <img src={PrevTriangle} alt="Previous" className="w-4 h-4 opacity-70"/>
                </button>

                <button
                    className="border border-4 border-gray-500 absolute right-2 top-1/2 -translate-y-1/2 bg-white text-gray-700 rounded-full p-2 shadow-lg"
                    onClick={() => setImageIndex(imageIndex + 1)}
                    hidden={showingGIF || illusIntData[categoryID][illustrationID]["images"].length <= imageIndex + 1}
                >
                    <img src={NextTriangle} alt="Next" className="w-4 h-4 opacity-70"/>
                </button>

                <div className="text-center">

                    {catIntData[categoryID].individual[illustrationID]["roblox"] || catIntData[categoryID].individual[illustrationID]["yt"] ?
                        <div
                            className="absolute top-3 left-6 flex flex-row space-x-3 rounded-lg p-2 items-center justify-center">
                            {catIntData[categoryID].individual[illustrationID]["roblox"] ? <Link
                                to={`https://roblox.com/${catIntData[categoryID].individual[illustrationID]["roblox"]}`}
                                target="_blank"
                                className="text-xs px-2 sm:text-xs sm:px-2 md:text-md md:px-4 lg:text-md lg:px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-400 hover:text-white transition duration-300 cursor-pointer inline-block text-center">
                                View on Roblox
                            </Link> : null}

                            {catIntData[categoryID].individual[illustrationID]["yt"] ? <Link
                                to={`https://youtube.com/shorts/${catIntData[categoryID].individual[illustrationID]["yt"]}`}
                                target="_blank"
                                className="text-xs px-2 sm:text-xs sm:px-2 md:text-md md:px-4 lg:text-md lg:px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-400 hover:text-white transition duration-300 cursor-pointer inline-block text-center">
                                View Timelapse
                            </Link> : null}
                        </div> : null}

                    <h2 className="text-xl font-semibold mb-2">{illusIntData[categoryID][illustrationID]["name"]}</h2>
                    <p className="text-sm text-gray-700">{illusIntData[categoryID][illustrationID]["description"]}</p>
                </div>
            </div>
        </div>
    </>) : "Please wait while data is being loaded")
}