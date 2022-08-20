import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './Home';
import TeamPage from "./TeamPage"

class Main extends React.Component {
    render() {
        return (
            <Routes>
                <Route path='FFXIV-Raid-Completionist' element={<Home />}></Route>
                <Route path='FFXIV-Raid-Completionist/team' element={<TeamPage />}>
                    <Route path=':teamId' element={<TeamPage />}></Route>
                </Route>
            </Routes>
        );
    }
}

export default Main;