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
                    <Button className='nav-bar-button' type="button">Home</Button>
                </Link>

                <div className='nav-bar-search'>
                    <div>Search for team:</div>
                    <input className='nav-bar-element search-bar' type="text" onChange={event => setTeam(event.target.value)}></input>
                    <Link to={"/FFXIV-Raid-Completionist/Team/" + input}>
                        <Button className='nav-bar-button' type="button">Find</Button>
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