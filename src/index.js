import React, {lazy, Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import './index.css';


const DefaultNotificationServiceProvider = lazy(() => import('./context/DefaultNotificationService'));
const AuthServiceProvider = lazy(() => import('./context/AuthService'));
const DataProvider = lazy(() => import('./context/DataFetcher'));
const AdminChecker = lazy(() => import('./context/AdminChecker'));
const PageStructure = lazy(() => import("./elements/PageStructure"));

const AboutContent = lazy(() => import("./elements/Content/About/Structure"));
const ProjectsContent = lazy(() => import("./elements/Content/Projects/Structure"));
const NetworkContent = lazy(() => import("./elements/Content/Network/Structure"));
const GalleryContent = lazy(() => import("./elements/Content/Gallery/Structure"));

const AdminLogin = lazy(() => import("./elements/Content/Admin/Login"));


ReactDOM.createRoot(document.getElementById('root')).render(<BrowserRouter basename='/portfolio'>
    <Suspense fallback={null}>
        <DefaultNotificationServiceProvider>
            <AuthServiceProvider>
                <DataProvider>
                    <Routes>
                        <Route path="login" element={<AdminLogin/>}/>

                        <Route path="/" element={<PageStructure/>}>
                            <Route index element={<Navigate to="/gallery" replace/>}/>

                            <Route path="about" element={<AboutContent/>}/>
                            <Route path="projects" element={<ProjectsContent/>}/>
                            <Route path="network" element={<NetworkContent/>}/>
                            <Route path="gallery/*" element={<GalleryContent/>}/>

                            <Route path="admin" element={<AdminChecker/>}>
                                <Route index element={<Navigate to="/admin/gallery" replace/>}/>
                                <Route path="gallery/*" element={<GalleryContent/>}/>
                                <Route path="*" element={<Navigate to="/admin/gallery"/>}/>
                            </Route>

                        </Route>

                        <Route path="*" element={<Navigate to="/gallery" replace/>}/>
                    </Routes>
                </DataProvider>
            </AuthServiceProvider>
        </DefaultNotificationServiceProvider>
    </Suspense>
</BrowserRouter>);
