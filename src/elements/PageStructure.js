import React, { Suspense, lazy } from 'react';


const Banner = lazy(() => import('./Banner/Structure'));
const NavBar = lazy(() => import('./NavBar/Structure'));
const Content = lazy(() => import("./Content/Structure"));


export default function PageStructure() {
    return (
        <Suspense fallback={null}>
            <Banner/>
            <NavBar/>
            <Content/>
        </Suspense>
    )
}