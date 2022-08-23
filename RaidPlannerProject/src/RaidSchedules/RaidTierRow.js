import './RaidTierRow.css'

import React from 'react';

const RaidTierRow = ({ props }) => {

    return (
        <>
            {React.Children.toArray(props.raiders.map((raider, raiderIndex) => {
                return <tr className='raid-row'>
                    {props.tier.printNames === true &&
                        <td className='raid-names-label raider-name'>{raider.name}</td>
                    }

                    {React.Children.toArray(props.tier.raidDefs.map((raid, index) => {
                        return <TickBoxSet tier={props.tier} raid={raid} raider={raider}/>
                    }))}
                </tr>

            }))}
        </>
    );
}

const TickBoxSet = ({ tier, raid, raider }) => {
    let normalModeState = raider.getRaidCompleted(raid.acronym);
    let hardModeState = raider.getRaidCompleted("#" + raid.acronymHard);

    const [isNormalCompleted, setIsNormalCompleted] = React.useState(normalModeState);
    const [isHardCompleted, setIsHardCompleted] = React.useState(hardModeState);

    const onToggleNormalCheckbox = (raid, raider, value) => {
        setIsNormalCompleted(value);
        raider.setRaidCompleted(raid, value, false);
    }

    const onToggleHardCheckbox = (raid, raider, value) => {
        setIsHardCompleted(value);
        raider.setRaidCompleted(raid, value, true);
    }

    return (<td className='raid-column'>
        <div className='checkbox-container'>
            <input type="checkbox" checked={isNormalCompleted} onChange={event => onToggleNormalCheckbox(raid, raider, event.target.checked)} />
            {!tier.hideHardMode &&
                <input type="checkbox" checked={isHardCompleted} onChange={event => onToggleHardCheckbox(raid, raider, event.target.checked)} />
            }
        </div>
    </td>)
}

export default RaidTierRow;