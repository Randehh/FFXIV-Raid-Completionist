import React from 'react';

import Button from 'react-bootstrap/Button';
import { ButtonGroup } from 'react-bootstrap';

import { setValues } from '../SheetsAPI/SheetsAPI'

import TeamDisplay from './TeamDisplay';

const TeamSettings = (props) => {
    const handleClick = (raider) => props.onFocusRaiderChanged(raider);

    let originalTeamMembers = props.teamData.getTeamNamesArray();

    return (<>
    <div>
    <h4 style={{margin: "12px"}}>Edit the current team</h4>
        <TeamDisplay
            title="Edit team"
            buttonText="Edit team"
            confirmText="Apply"
            editTeam={props.teamData}
            onConfirm={(teamName, teamMembers, callback) => {
                let membersToAdd = [];
                teamMembers.split("\n").forEach(newMember => {
                    if (!originalTeamMembers.includes(newMember)) {
                        membersToAdd.push(newMember);
                    }
                });

                let bodyData = [];
                membersToAdd.forEach(memberName => {
                    bodyData.push(memberName + "=");
                });
                if (bodyData.length > 0) {
                    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    let cellNotation = `${alphabet[props.teamData.lastRaiderColumn + 1]}${props.teamData.sheetRow}` + ":" + `${alphabet[props.teamData.lastRaiderColumn + bodyData.length + 1]}${props.teamData.sheetRow}`
                    setValues(null, cellNotation, bodyData);
                }
                setValues(null, `B${props.teamData.sheetRow}`, [teamName]);
                setValues(null, `C${props.teamData.sheetRow}`, [teamMembers], (response) => {
                    window.location.reload();
                });

                callback();
            }
            }></TeamDisplay>
        </div>
        <div>
            <div className='icon-title'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M13 1l.001 3.062A8.004 8.004 0 0 1 19.938 11H23v2l-3.062.001a8.004 8.004 0 0 1-6.937 6.937L13 23h-2v-3.062a8.004 8.004 0 0 1-6.938-6.937L1 13v-2h3.062A8.004 8.004 0 0 1 11 4.062V1h2zm-1 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" fill="rgba(203,203,203,1)"/></svg>
            <h4 style={{margin: "12px"}}>Select focus target</h4>
            </div>
            <ButtonGroup>
                {React.Children.toArray(props.teamData.raiders.map((raider, index) => {
                    return(<Button onClick={() => handleClick(raider)}>{raider.name}</Button>);
                }))}
            </ButtonGroup>
            <Button onClick={() => handleClick(null)} style={{marginLeft: "12px"}}>Clear focus</Button>
        </div>
    </>)
}

export default TeamSettings;