import './RaidTierRow.css'

import React from 'react';

const RaidTierRow = ({ props }) => {
    let focusRaider = props.focusRaider;
    return (
        <>
            {React.Children.toArray(props.raiders.map((raider, raiderIndex) => {
                return <tr className='raid-row' style={{ backgroundColor: focusRaider == raider ? 'rgba(0, 178, 33, 0.3)' : '' }}>
                    {props.tier.printNames === true &&
                        <td className='raid-names-label raider-name'>{raider.name}</td>
                    }

                    {React.Children.toArray(props.tier.raidDefs.map((raid, index) => {
                        return <TickBoxSet tier={props.tier} raid={raid} raidHard={props.tier.raidHardDefs[index]} raider={raider} focusRaider={focusRaider} />
                    }))}
                </tr>

            }))}
        </>
    );
}

const TickBoxSet = ({ tier, raid, raidHard, raider, focusRaider }) => {
    let normalModeState = raider.getRaidCompleted(raid.acronym);
    let hardModeState = raidHard != null ? raider.getRaidCompleted(raidHard.acronym) : null;

    const [isNormalCompleted, setIsNormalCompleted] = React.useState(normalModeState);
    const [isHardCompleted, setIsHardCompleted] = React.useState(hardModeState);

    const onToggleNormalCheckbox = (raid, raider, value) => {
        setIsNormalCompleted(value);
        raider.setRaidCompleted(raid, value);
    }

    const onToggleHardCheckbox = (raid, raider, value) => {
        setIsHardCompleted(value);
        raider.setRaidCompleted(raid, value);
    }

    return (<td className='raid-column' >
        <div className='checkbox-container'>
            <input type="checkbox" checked={isNormalCompleted} onChange={event => onToggleNormalCheckbox(raid, raider, event.target.checked)} />
            {raidHard != null &&
                <input type="checkbox" checked={isHardCompleted} onChange={event => onToggleHardCheckbox(raidHard, raider, event.target.checked)} />
            }
        </div>
    </td>)
}

export default RaidTierRow;