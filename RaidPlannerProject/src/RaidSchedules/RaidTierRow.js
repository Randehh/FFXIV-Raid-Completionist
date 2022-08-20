import React from 'react';

class RaidTierRow extends React.Component {
    render() {
        return (
            <>
                {React.Children.toArray(this.props.raiders.map((raider, raiderIndex) => {
                    return <tr>
                        {this.props.tier.printNames === true &&
                            <td className='raid-names-label raider-name'>{raider.name}</td>
                        }

                        {React.Children.toArray(this.props.tier.raidDefs.map((raid, index) => {
                            return <td>
                                <div>
                                    <input type="checkbox" />
                                    {!this.props.tier.hideHardMode &&
                                        <input type="checkbox" />
                                    }
                                </div>
                            </td>
                        }))}
                    </tr>

                }))}
            </>
        );
    }
}

export default RaidTierRow;