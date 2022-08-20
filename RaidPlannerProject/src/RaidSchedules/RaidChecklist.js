import React from 'react';
import RaidTier from './RaidTier';

class RaidChecklist extends React.Component{
    render(){
    return (
        <div className='raid-checklist'>
            <h1 style={{ paddingBlockStart: "0.67em" }}>{this.props.tierName}</h1>
            <div style={{ display: "flex", justifyContent: "center" }}>

                {React.Children.toArray(this.props.tiers.map((tier, index) => {
                    return <RaidTier tier={tier} raiders={this.props.raiders} />
                }))}
            </div>
        </div>
    );
            }
}

export default RaidChecklist;