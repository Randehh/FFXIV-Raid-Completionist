import './NavBar.css';

import React from 'react';
import { Link } from "react-router-dom";

const NavBar = () => {
    const [input, setTeam] = React.useState({});
    return (
        <div className='nav-bar'>
            <Link to="/FFXIV-Raid-Completionist/">
                <button className='nav-bar-button' type="button">Home</button>
            </Link>

            <div className='nav-bar-search'>
                <div>Search for team:</div>
                <input className='nav-bar-element' type="text" onChange={event => setTeam(event.target.value)}></input>
                <Link to={"/FFXIV-Raid-Completionist/Team/" + input}>
                    <button className='nav-bar-button' type="button">Find</button>
                </Link>
            </div>
        </div>
    );
}

export default NavBar;