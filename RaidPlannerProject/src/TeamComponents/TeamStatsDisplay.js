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
                            return <tr style={{ backgroundColor: focusRaider == raider ? 'rgba(0, 178, 33, 0.2)' : '' }}>
                                <td>{raider.name}</td>
                                {React.Children.toArray(RaidNames.map((raidId, index) => {
                                    let normalCount = teamStats.raiderCounts[raider.name][raidId].normal;
                                    let hardCount = teamStats.raiderCounts[raider.name][raidId].hard;

                                    totalNormal += normalCount;
                                    totalHard += hardCount;

                                    return <td>
                                        {`${teamStats.raiderCounts[raider.name][raidId].normal}/${teamStats.totalCounts[raidId].normal}`}
                                        {normalCount == teamStats.totalCounts[raidId].normal ?
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z" /><path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" fill="rgba(156,224,169,1)" /></svg>
                                            :
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z" /><path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" fill="rgba(231,76,60,1)" /></svg>}
                                        {` - `}
                                        <b>{`${teamStats.raiderCounts[raider.name][raidId].hard}/${teamStats.totalCounts[raidId].hard}`}
                                            {hardCount == teamStats.totalCounts[raidId].hard ?
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z" /><path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" fill="rgba(156,224,169,1)" /></svg>
                                                :
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z" /><path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" fill="rgba(231,76,60,1)" /></svg>}</b>
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