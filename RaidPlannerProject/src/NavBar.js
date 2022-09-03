import './NavBar.css';

import React from 'react';
import { Link, useNavigate } from "react-router-dom";

import Button from 'react-bootstrap/Button';

import TeamDisplay from './TeamComponents/TeamDisplay';

import { appendValues } from './SheetsAPI/SheetsAPI'
import { generateUUID } from './Utils/UUID'

const NavBar = () => {
    const navigate = useNavigate();

    const [input, setTeam] = React.useState({});

    return (
        <>
            <div className='nav-bar'>
                <Link to="/FFXIV-Raid-Completionist/">
                    <Button className='nav-bar-button' type="button">
                        <div className='icon-title'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M21 20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.49a1 1 0 0 1 .386-.79l8-6.222a1 1 0 0 1 1.228 0l8 6.222a1 1 0 0 1 .386.79V20zm-2-1V9.978l-7-5.444-7 5.444V19h14z" fill="rgba(203,203,203,1)"/></svg>
                            Home
                        </div>
                    </Button>
                </Link>

                <div className='nav-bar-search'>
                    <div>Search for team:</div>
                    <input className='nav-bar-element search-bar' type="text" onChange={event => setTeam(event.target.value)}></input>
                    <Link to={"/FFXIV-Raid-Completionist/Team/" + input}>
                        <Button className='nav-bar-button' type="button">
                            <div className='icon-title'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z" /><path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z" fill="rgba(203,203,203,1)" /></svg>
                                Find
                            </div>
                        </Button>
                    </Link>
                </div>

                <TeamDisplay
                    title="Create new team"
                    buttonText="Create team"
                    confirmText="Create"
                    onConfirm={(teamName, teamMembers, callback) => {
                        let id = generateUUID();
                        let bodyData = [id, teamName, teamMembers];
                        teamMembers.split('\n').forEach(memberName => {
                            bodyData.push(memberName + "=");
                        });
                        appendValues(null, "A1:C1", bodyData, false, (response) => {
                            navigate("/FFXIV-Raid-Completionist/Team/" + id, { replace: true });
                        });
                        callback();
                    }
                    } />
            </div>

        </>
    );
}

export default NavBar;