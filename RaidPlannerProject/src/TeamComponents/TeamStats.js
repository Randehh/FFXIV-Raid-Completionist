import './TeamStats.css';

import React from 'react';
import Table from 'react-bootstrap/Table';

import { RaidNames } from '../RaidConstants';

const TeamStats = (props) => {
    if (props.raiders.length === 0) {
        return (<></>);
    } else {
        let raiderCounts = {};
        let totalCounts = {};

        let superNormalTotal = 0;
        let superHardTotal = 0;

        props.raiders.forEach(raider => {
            let c = {};
            props.raidSets.forEach(set => {
                let totalNormal = 0;
                let totalHard = 0;
                let setCountNormal = 0;
                let setCountHard = 0;
                set.tiers.forEach(tier => {
                    tier.raidDefs.forEach(raid => {
                        if (raider.getRaidCompleted(raid.acronym)) {
                            setCountNormal++;
                        }
                        if (raider.getRaidCompleted(raid.acronymHard)) {
                            setCountHard++;
                        }

                        totalNormal++;
                        if (!tier.hideHardMode) {
                            totalHard++;
                        }
                    });
                });
                c[set.identifier] = {
                    normal: setCountNormal,
                    hard: setCountHard
                };

                if (!totalCounts[set.identifier]) {
                    totalCounts[set.identifier] = {
                        normal: totalNormal,
                        hard: totalHard,
                    }

                    superNormalTotal += totalNormal;
                    superHardTotal += totalHard;
                }
            });
            raiderCounts[raider.name] = c;
        });

        totalCounts["TOTAL"] = {
            normal: superNormalTotal,
            hard: superHardTotal,
        }

        return (
            <div className='team-stats-content'>
                <Table striped>
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
                            return <tr>
                                <td>{raider.name}</td>
                                {React.Children.toArray(RaidNames.map((raidId, index) => {
                                    totalNormal += raiderCounts[raider.name][raidId].normal;
                                    totalHard += raiderCounts[raider.name][raidId].hard;
                                    return <td>
                                        {`${raiderCounts[raider.name][raidId].normal}/${totalCounts[raidId].normal} - `}
                                        <b>{`${raiderCounts[raider.name][raidId].hard}/${totalCounts[raidId].hard}`}</b>
                                    </td>
                                }))}

                                <td>
                                    {`${totalNormal}/${totalCounts["TOTAL"].normal} - `}
                                    <b>{`${totalHard}/${totalCounts["TOTAL"].hard}`}</b>
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