import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import { Image } from 'react-bootstrap';

function RaidRoulette(props) {

    const handleClick = () => setRaid(props.teamStats.getRandomLeastPlayedRaid(false, true));
    const [raid, setRaid] = useState(null);
    return (<>
        {raid != null &&
            <>
                <h2>{raid.name + " - " + raid.subtitle}</h2>
                <h3>{`from ${raid.parentSet.identifier} in ${raid.parentTier.name}`}</h3>
                <div><Image src={raid.imageUrl}></Image></div>
            </>
        }

        {raid == null &&
            <>
                <h2>???</h2>
                <h3>{`from ??? in ???`}</h3>
                <Image></Image>
            </>
        }
        <Button onClick={handleClick}>Get random raid</Button></>)
}

export default RaidRoulette;