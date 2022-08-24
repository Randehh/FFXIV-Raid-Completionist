import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';


function RaidRoulette(props) {

    const handleClick = () => setRaid(props.teamStats.getRandomLeastPlayedRaid(false, true));
    const [raid, setRaid] = useState(null);
    return (<>
        {raid != null &&
            <>
                <h2>{raid.name + " - " + raid.subtitle}</h2>
                <h3>{`from ${raid.parentSet.identifier}`}</h3>
            </>
        }
        <Button onClick={handleClick}>Get random raid</Button></>)
}

export default RaidRoulette;