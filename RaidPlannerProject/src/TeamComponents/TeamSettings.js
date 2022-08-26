import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import TeamData from '../RaiderData/TeamData';

import { useNavigate } from "react-router-dom";
import { appendValues, setValues } from '../SheetsAPI/SheetsAPI'

import TeamDisplay from './TeamDisplay';

const TeamSettings = (props) => {
    const navigate = useNavigate();

    let originalTeamMembers = props.teamData.getTeamNamesArray();
    return (<>
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
    </>)
}

export default TeamSettings;