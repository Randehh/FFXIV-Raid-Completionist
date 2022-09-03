import './TeamStatsDisplay.css';

import React from 'react';
import Table from 'react-bootstrap/Table';

import { RaidNames } from '../RaidConstants';

const TeamStats = (props) => {
    if (props.raiders.length === 0) {
        return (<></>);
    } else {
        let teamStats = props.teamStats;
        let focusRaider = props.focusRaider;
        return (
            <div className='team-stats-content'>
                <Table className='team-table' striped>
                    <thead>
                        <tr>
                            <th>Raider</th>
                            {React.Children.toArray(RaidNames.map((raidId, index) => {
                                return <th>{raidId}</th>;
                            }))}
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {React.Children.toArray(props.raiders.map((raider, index) => {
                            let totalNormal = 0;
                            let totalHard = 0;
                            return <tr style={{backgroundColor: focusRaider == raider ? 'rgba(0, 178, 33, 0.2)' : ''}}>
                                <td>{raider.name}</td>
                                {React.Children.toArray(RaidNames.map((raidId, index) => {
                                    let normalCount = teamStats.raiderCounts[raider.name][raidId].normal;
                                    let hardCount = teamStats.raiderCounts[raider.name][raidId].hard;

                                    totalNormal += normalCount;
                                    totalHard += hardCount;
                                    
                                    return <td>
                                        {`${teamStats.raiderCounts[raider.name][raidId].normal}/${teamStats.totalCounts[raidId].normal}${normalCount == teamStats.totalCounts[raidId].normal ? '✔️' : "❌"} - `}
                                        <b>{`${teamStats.raiderCounts[raider.name][raidId].hard}/${teamStats.totalCounts[raidId].hard}${hardCount == teamStats.totalCounts[raidId].hard ? '✔️' : "❌"}`}</b>
                                    </td>
                                }))}

                                <td>
                                    {`${totalNormal}/${teamStats.totalCounts["TOTAL"].normal} - `}
                                    <b>{`${totalHard}/${teamStats.totalCounts["TOTAL"].hard}`}</b>
                                </td>
                            </tr>
                        }))}
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default TeamStats;