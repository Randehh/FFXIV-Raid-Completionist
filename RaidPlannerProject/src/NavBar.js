import './NavBar.css';

import React from 'react';
import { Link } from "react-router-dom";

import Button from 'react-bootstrap/Button';

import CreateTeamModal from './CreateTeamModal';

const NavBar = () => {
    const [input, setTeam] = React.useState({});
    return (
        <>
        <div className='nav-bar'>
            <Link to="/FFXIV-Raid-Completionist/">
                <Button className='nav-bar-button' type="button">Home</Button>
            </Link>

            <div className='nav-bar-search'>
                <div>Search for team:</div>
                <input className='nav-bar-element' type="text" onChange={event => setTeam(event.target.value)}></input>
                <Link to={"/FFXIV-Raid-Completionist/Team/" + input}>
                    <Button className='nav-bar-button' type="button">Find</Button>
                </Link>
            </div>

            <CreateTeamModal/>
        </div>
        
        </>
    );
}

export default NavBar;