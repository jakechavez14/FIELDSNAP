import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import NewJob from "./NewJob";

import Jobs from "./Jobs";

import Clients from "./Clients";

import ClientView from "./ClientView";

import Home from "./Home";

import NewReport from "./NewReport";

import Reports from "./Reports";

import Settings from "./Settings";

import Setup from "./Setup";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    NewJob: NewJob,
    
    Jobs: Jobs,
    
    Clients: Clients,
    
    ClientView: ClientView,
    
    Home: Home,
    
    NewReport: NewReport,
    
    Reports: Reports,
    
    Settings: Settings,
    
    Setup: Setup,
    
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
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/NewJob" element={<NewJob />} />
                
                <Route path="/Jobs" element={<Jobs />} />
                
                <Route path="/Clients" element={<Clients />} />
                
                <Route path="/ClientView" element={<ClientView />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/NewReport" element={<NewReport />} />
                
                <Route path="/Reports" element={<Reports />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Setup" element={<Setup />} />
                
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