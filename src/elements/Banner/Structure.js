import {lazy, Suspense} from "react";

const Imagery = lazy(() => import("./Imagery"))
const PFP = lazy(() => import("./PFP"))
const Textual = lazy(() => import("./Textual"))


export default function BannerStructure() {

    return (<div className="relative w-[600px] h-[250px]">
            <Suspense fallback={null}>
                <Imagery/>
                <PFP/>
                <Textual/>
            </Suspense>
        </div>)
}
