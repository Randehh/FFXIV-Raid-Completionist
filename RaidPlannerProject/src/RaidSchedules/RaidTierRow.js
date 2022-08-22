import './RaidTierRow.css'

import React from 'react';

const RaidTierRow = ({props}) => {
    const [isNormalCompleted, setIsNormalCompleted] = React.useState(true);
    const [isHardCompleted, setIsHardCompleted] = React.useState(true);

    return (
        <>
            {React.Children.toArray(props.raiders.map((raider, raiderIndex) => {
                return <tr className='raid-row'>
                    {props.tier.printNames === true &&
                        <td className='raid-names-label raider-name'>{raider.name}</td>
                    }

                    {React.Children.toArray(props.tier.raidDefs.map((raid, index) => {
                        return <td className='raid-column'>
                            <div className='checkbox-container'>
                                <input type="checkbox" value={isNormalCompleted} onChange={event => setIsNormalCompleted(event.target.value)}/>
                                {!props.tier.hideHardMode &&
                                    <input type="checkbox" value={isHardCompleted} onChange={event => setIsHardCompleted(event.target.value)} />
                                }
                            </div>
                        </td>
                    }))}
                </tr>

            }))}
        </>
    );
}

export default RaidTierRow;