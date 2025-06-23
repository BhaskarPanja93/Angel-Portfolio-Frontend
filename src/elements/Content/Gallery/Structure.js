import {useParams} from "react-router-dom";
import {lazy, Suspense, useEffect} from "react";
import {UseDataFetcherContext} from "../../../context/DataFetcher";
import {UseAuthContext} from "../../../context/AuthService";

const SingleIllustration = lazy(() => import("./SingleIllustration"));
const SingleCategory = lazy(() => import("./SingleCategory"));
const AllCategories = lazy(() => import("./AllCategories"));
const ModifyIllustrationPopup = lazy(() => import("../Admin/ModifyIllustrationPopup"));


export default function GalleryStructure() {
    const {'*': rest} = useParams();
    const segments = rest?.split('/') || [];
    const openedCategoryID = segments[0] || null;
    const openedIllustrationID = segments[1] || null;

    const {profile} = UseAuthContext()
    const {fetchBannerData, fetchPFPData} = UseDataFetcherContext()

    useEffect(() => {
        fetchBannerData()
        fetchPFPData()
    }, []);

    return (<Suspense fallback={null}>
        {openedCategoryID ? <>
            {openedIllustrationID && profile && profile["is_admin"] ?
                <ModifyIllustrationPopup categoryID={openedCategoryID}
                                         illustrationID={openedIllustrationID}/> : openedIllustrationID ?
                    <SingleIllustration categoryID={openedCategoryID} illustrationID={openedIllustrationID}/> : null}
            <SingleCategory categoryID={openedCategoryID}/>
        </> : <AllCategories/>}
    </Suspense>)
}