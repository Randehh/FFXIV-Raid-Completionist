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
            <h4 style={{margin: "12px"}}>Select focus target</h4>
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