import React from 'react';
import RaidTierRow from './RaidTierRow';

class RaidTier extends React.Component {
    render() {
        return (
            <div className='raid-tier'>
                {this.props.tier.printNames === true &&
                    <div className='raid-names-label-padder'>
                        <div className='raid-names-label raid-names-label-padder' />
                        <h2 className='raid-title'>{this.props.tier.name}</h2>
                    </div>
                }

                {this.props.tier.printNames === false &&
                    <h2 className='raid-title'>{this.props.tier.name}</h2>
                }
                <table className='raid-table'>
                    <tbody>
                        <tr>
                            {this.props.tier.printNames === true &&
                                <th className='raid-names-label' />
                            }

                            {React.Children.toArray(this.props.tier.raidDefs.map((raid, index) => {
                                return <th>
                                    <div className='raid-header'>
                                        <div>{raid.acronym ? raid.acronym : raid.name}</div>
                                        <div className='mini-subtitle'>{raid.subtitle}</div>
                                        <div className='raid-difficulty'>
                                            <div>Normal</div>
                                            {!this.props.tier.hideHardMode &&
                                                <div>{this.props.tier.hardPrefix}</div>
                                            }
                                        </div>
                                    </div>
                                </th>
                            }))}
                        </tr>
                        <RaidTierRow tier={this.props.tier} raiders={this.props.raiders} />
                    </tbody>
                </table>
            </div>
        );
    }
}

export default RaidTier;