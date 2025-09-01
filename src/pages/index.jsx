import Layout from "./Layout.jsx";

import Application from "./Application";

import Recommendations from "./Recommendations";

import Dashboard from "./Dashboard";

import EssayCoach from "./EssayCoach";

import ApplicationTracker from "./ApplicationTracker";

import ScholarshipFinder from "./ScholarshipFinder";

import SelectedColleges from "./SelectedColleges";

import CollegeDetail from "./CollegeDetail";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Application: Application,
    
    Recommendations: Recommendations,
    
    Dashboard: Dashboard,
    
    EssayCoach: EssayCoach,
    
    ApplicationTracker: ApplicationTracker,
    
    ScholarshipFinder: ScholarshipFinder,
    
    SelectedColleges: SelectedColleges,
    
    CollegeDetail: CollegeDetail,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Application />} />
                
                
                <Route path="/Application" element={<Application />} />
                
                <Route path="/Recommendations" element={<Recommendations />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/EssayCoach" element={<EssayCoach />} />
                
                <Route path="/ApplicationTracker" element={<ApplicationTracker />} />
                
                <Route path="/ScholarshipFinder" element={<ScholarshipFinder />} />
                
                <Route path="/SelectedColleges" element={<SelectedColleges />} />
                
                <Route path="/CollegeDetail" element={<CollegeDetail />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}