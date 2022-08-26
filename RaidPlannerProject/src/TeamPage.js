import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';

import RaidChecklist from './RaidSchedules/RaidChecklist';
import TeamStatsDisplay from "./TeamComponents/TeamStatsDisplay";
import RaidRoulette from "./TeamComponents/RaidRoulette";

import TeamData from "./RaiderData/TeamData";
import Raider from './RaiderData/Raider';
import TeamStats from "./RaiderData/TeamStats";
import TeamSettings from "./TeamComponents/TeamSettings";

import { RaidNames } from './RaidConstants'

import { getValues } from './SheetsAPI/SheetsAPI'

class RaidSet {
    constructor(tiers, identifier) {
        this.tiers = tiers;
        this.identifier = identifier;

        tiers.forEach(tier => {
            tier.raidDefs.forEach(raid => {
                raid.parentTier = tier;
                raid.parentSet = this;
            });

            tier.raidHardDefs.forEach(raid => {
                raid.parentTier = tier;
                raid.parentSet = this;
            });
        });
    }
}

class RaidTier {
    constructor(name, raidDefs, hardPrefix, hardSuffix, printNames, hideHardMode) {
        this.name = name;
        this.raidDefs = raidDefs;
        this.raidHardDefs = [];
        this.hardPrefix = hardPrefix;
        this.printNames = printNames;

        if (!hideHardMode || hideHardMode == false) {
            raidDefs.forEach(raid => {
                this.raidHardDefs.push(new RaidDefinition(raid.name + hardSuffix, raid.subtitle, "#" + raid.acronym, raid.imageUrl));
            });
        }
    }
}

class RaidDefinition {
    constructor(name, subtitle, acronym, imageUrl) {
        this.name = name;
        this.subtitle = subtitle;
        this.acronym = acronym != null ? acronym : name;
        this.imageUrl = imageUrl;
    }
}

const TeamPage = () => {
    const { teamId } = useParams();

    const [isLoading, setIsLoading] = React.useState(true);
    const [teamData, setTeamData] = React.useState(new TeamData("", "Loading...", []));

    useEffect(() => {
        getValues("Teams", null, true, (results) => {
            let index = results["values"][0].indexOf(teamId);

            let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let row = index + 1;
            getValues("Teams", `A${row}:Z${row}`, false, (teamResult) => {
                let teamName = teamResult["values"][0][1]

                let raiders = [];
                let finalRaiderIndex = 0;
                let raidersToShow = teamResult["values"][0][2];
                for (let raiderIndex = 3; raiderIndex < teamResult["values"][0].length; raiderIndex++) {
                    let column = alphabet[raiderIndex];
                    const raiderData = teamResult["values"][0][raiderIndex];
                    let raiderDataSplit = raiderData.split('=');
                    if (raidersToShow.includes(raiderDataSplit[0])) {
                        let raider = new Raider(raiderDataSplit[0], raiderDataSplit[1], column + row);
                        raiders.push(raider);
                    }

                    finalRaiderIndex = raiderIndex;
                }

                setTeamData(new TeamData(teamId, teamName, raiders, row, finalRaiderIndex));

                setIsLoading(false);
            });
        })
    }, ["teamId"]);

    let arrRaids = BuildArrRaids();
    let heavenswardRaids = BuildHeavenswardRaids();
    let stormbloodRaids = BuildStormbloodRaids();
    let shadowbringerRaids = BuildShadowbringersRaids();
    let endwalkerRaids = BuildEndwalkerRaids();

    let raidSets = [arrRaids, heavenswardRaids, stormbloodRaids, shadowbringerRaids, endwalkerRaids];

    let raidsIndex = {};
    raidSets.forEach(raidSet => {
        raidSet.tiers.forEach(raidTier => {
            raidTier.raidDefs.forEach(raid => {
                raidsIndex[raid.acronym] = raid;
            });
            raidTier.raidHardDefs.forEach(raid => {
                raidsIndex[raid.acronym] = raid;
            });
        });
    });

    let teamStats = new TeamStats(teamData.raiders, raidSets, raidsIndex);

    return (
        <div>
            <Modal show={isLoading}
                centered
                backdrop="static"
                keyboard={false}>
                <Modal.Body>Loading...</Modal.Body>
            </Modal>
            <h1 className="team-name">{teamData.teamName}</h1>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header><h2>Progress overview</h2></Accordion.Header>
                    <Accordion.Body>
                        <TeamStatsDisplay raiders={teamData.raiders} teamStats={teamStats}></TeamStatsDisplay>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                    <Accordion.Header><h2>Raid roulette</h2></Accordion.Header>
                    <Accordion.Body>
                        <RaidRoulette teamStats={teamStats}></RaidRoulette>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                    <Accordion.Header><h2>Progress tracker</h2></Accordion.Header>
                    <Accordion.Body>
                        <RaidChecklist tierName={RaidNames[0]} raidSet={arrRaids} raiders={teamData.raiders}></RaidChecklist>
                        <RaidChecklist tierName={RaidNames[1]} raidSet={heavenswardRaids} raiders={teamData.raiders}></RaidChecklist>
                        <RaidChecklist tierName={RaidNames[2]} raidSet={stormbloodRaids} raiders={teamData.raiders}></RaidChecklist>
                        <RaidChecklist tierName={RaidNames[3]} raidSet={shadowbringerRaids} raiders={teamData.raiders}></RaidChecklist>
                        <RaidChecklist tierName={RaidNames[4]} raidSet={endwalkerRaids} raiders={teamData.raiders}></RaidChecklist>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                    <Accordion.Header><h2>Settings</h2></Accordion.Header>
                    <Accordion.Body>
                        <TeamSettings teamData={teamData}></TeamSettings>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
}

function BuildArrRaids() {
    let tier1Raids = [
        new RaidDefinition("T1", "Turn 1", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/b6/b61ea6da77ad12dcff2586ff8ee5f981bf197a0e.png?n6.2"),
        new RaidDefinition("T2", "Turn 2", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/9f/9f60c5972be902aab84f1dd8a3bdb1f9dd5f8e20.png?n6.2"),
        new RaidDefinition("T3", "Turn 3", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/7f/7f90cb1fa059ebb6d73b6830823724f315ede769.png?n6.2"),
        new RaidDefinition("T4", "Turn 4", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/6a/6a5f0732b4b9ce23aa9246b22acbe4cf0559cdea.png?n6.2"),
        new RaidDefinition("T5", "Turn 5", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/69/69e256c803a89ee01b9c8ee78aed6bba75a5fd70.png?n6.2"),
    ];

    let tier2Raids = [
        new RaidDefinition("T6", "Turn 1", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/f5/f5b8bd604d28a05c98e25190e06eee28a1067012.png?n6.2"),
        new RaidDefinition("T7", "Turn 2", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/87/87b2194678098844b564d53e065c38c45d0fe862.png?n6.2"),
        new RaidDefinition("T8", "Turn 3", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/49/494d31d95fe1b070289dfb2d2b95932854458bad.png?n6.2"),
        new RaidDefinition("T9", "Turn 4", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/db/dba461713ad7e3423e9f7d9b98d0bbaa3f0636a9.png?n6.2"),
    ];

    let tier3Raids = [
        new RaidDefinition("T10", "Turn 1", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/7d/7d68cfe62dc895a980d0a08a01ffc65d6e753a77.png?n6.2"),
        new RaidDefinition("T12", "Turn 2", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/15/157f3447db5a214a742665b21840b0ce71051b33.png?n6.2"),
        new RaidDefinition("T13", "Turn 3", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/eb/ebaadb1c87e11526510b661a62064ae0e392900f.png?n6.2"),
        new RaidDefinition("T14", "Turn 4", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/c1/c1e2d8b0995fc79b98cecce0af09775df0220a58.png?n6.2"),
    ];

    let trials = [
        new RaidDefinition("Ultima's Bane", "Ultima Weapon", "UB", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/be/be3299c0f00598ec296ad4b56ac25ab371b10ebb.png?n6.2"),
        new RaidDefinition("The Howling Eye", "Garuda", "HE", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/95/959c9fbbfc127c6b2bafb3ab90a0e298fb15345a.png?n6.2"),
        new RaidDefinition("The Navel", "Titan", "NAV", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/93/9372b0ae476a9c2373bf6ff92efd6739f67a08f8.png?n6.2"),
        new RaidDefinition("The Bowl of Embers", "Ifrit", "BoE", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/42/42a5036b2e857b2da12bfc427e2071e38727afb2.png?n6.2"),
        new RaidDefinition("Thornmarch", "Good King Moggle Mog XII", "GKMM", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/d9/d977ce80569a1762c85f6f93f8df49d490ac0bec.png?n6.2"),
        new RaidDefinition("The Whorleater", "Leviathan", "WE", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/b8/b8948fe9d813d9b1e28e024e586967d9264231fe.png?n6.2"),
        new RaidDefinition("The Striking Tree", "Ramuh", "ST", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/99/9991f6ecd4f8b861d5b24155948d70b20c631f69.png?n6.2"),
        new RaidDefinition("Akh Afah Amphitheatre", "Shiva", "AAA", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/4a/4ad9464dbfdcdfd68beb4e0400256d54700c87a2.png?n6.2"),
    ]

    let tiers = [
        new RaidTier("THE FIRST COIL", tier1Raids, "Savage", "S", true, true),
        new RaidTier("THE SECOND COIL", tier2Raids, "Savage", "S", false),
        new RaidTier("THE FINAL COIL", tier3Raids, "Savage", "S", false, true),
        new RaidTier("TRIALS", trials, "Extreme", " (EX)", false),
    ];

    return new RaidSet(tiers, RaidNames[0]);
}

function BuildHeavenswardRaids() {
    let tier1Raids = [
        new RaidDefinition("A1", "Fist of the Father", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/89/89bf954b38b70d4d9bd2b7a02ff2e029ee6d09f8.png?n6.2"),
        new RaidDefinition("A2", "Cuff of the Father", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/9e/9ecd1cff06f2bd7f53c147f03d56d20fbfa45d21.png?n6.2"),
        new RaidDefinition("A3", "Arm of the Father", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/47/47925fc8d470ee7c6cd2079a4d967670b1ed89b4.png?n6.2"),
        new RaidDefinition("A4", "Burden of the Father", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/a5/a5519f5017d7ec5286e4ac296fed3dbbbb4fda1b.png?n6.2"),
    ];

    let tier2Raids = [
        new RaidDefinition("A5", "Fist of the Son", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/ef/efe35428cbdcfcbe7d2f7d62855d2106ea633356.png?n6.2"),
        new RaidDefinition("A6", "Cuff of the Son", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/01/01cbb00da1fe632ddc7b4ef25f3cd2a35f04e50f.png?n6.2"),
        new RaidDefinition("A7", "Arm of the Son", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/bb/bbd45c0d28c979c27619ab464bfcd12dfe5e9733.png?n6.2"),
        new RaidDefinition("A8", "Burden of the Son", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/0d/0de9d4f0d7c3f6b2901ec8dae41d5d211ff2810a.png?n6.2"),
    ];

    let tier3Raids = [
        new RaidDefinition("A9", "Eyes of the Creator", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/2a/2ae2f19152a7a37bce35ac620ee82f689b49a669.png?n6.2"),
        new RaidDefinition("A10", "Breath of the Creator", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/14/140831b51813fa5bb339eda3e727b17553ddbd07.png?n6.2"),
        new RaidDefinition("A11", "Heart of the Creator", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/c7/c737eaf2d2905fe87797a0d8438928001fff47ff.png?n6.2"),
        new RaidDefinition("A12", "Soul of the Creator", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/b5/b524b7ab88eee718b19fbc80601bc98aa6be41db.png?n6.2"),
    ];

    let trials = [
        new RaidDefinition("Thok ast Thok", "Ravana", "TaT", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/7c/7cb11f04a84be46de4fab2bd8fe91e2bd507065e.png?n6.2"),
        new RaidDefinition("The Limitless Blue", "Bismarck", "Bi", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/d4/d4e1086911e97cd7fd9255fb9c500d69f103bec9.png?n6.2"),
        new RaidDefinition("The Singularity Reactor", "King Thordan", "KT", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/9c/9cd22553abbec793f0a93fc33d833b44dc565408.png?n6.2"),
        new RaidDefinition("The Final Steps of Faith", "Nidhogg", "FSoF", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/9e/9ecd6dc6e893e39c18c5444fff3ff7d48fc53039.png?n6.2"),
        new RaidDefinition("Containment Bay S1T7", "Sephirot", "CBS1", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/f3/f3fdd0d726b2103598e8db0fad33b229f2242943.png?n6.2"),
        new RaidDefinition("Containment Bay P1T6", "Sophia", "CBP1", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/c2/c292c93da52d530f99438b782c7f2f3f6762975a.png?n6.2"),
        new RaidDefinition("Containment Bay Z1T9", "Zurvan", "CBZ1", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/86/86457584b68e8c8354ca75b8c6ef22d6249e7035.png?n6.2"),
    ]

    let tiers = [
        new RaidTier("GORDIAS", tier1Raids, "Savage", "S", true),
        new RaidTier("MIDAS", tier2Raids, "Savage", "S", false),
        new RaidTier("THE CREATOR", tier3Raids, "Savage", "S", false),
        new RaidTier("TRIALS", trials, "Extreme", " (EX)", false),
    ];
    return new RaidSet(tiers, RaidNames[1]);
}

function BuildStormbloodRaids() {
    let tier1Raids = [
        new RaidDefinition("O1", "V1.0", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/71/71146eb23c2562e5eef15d829ad07888ae310008.png?n6.2"),
        new RaidDefinition("O2", "V2.0", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/e3/e362372cbfc0d468f2269dd70d3c3b857f092712.png?n6.2"),
        new RaidDefinition("O3", "V3.0", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/3e/3e9caad0626f11effad56972367d96b22a694bca.png?n6.2"),
        new RaidDefinition("O4", "V4.0", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/99/9960c3a18d23384096a114d374ef91905536f9f2.png?n6.2"),
    ];

    let tier2Raids = [
        new RaidDefinition("O5", "V1.0", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/e2/e2a2629d60290b05e0e591f88ef35304649be2f4.png?n6.2"),
        new RaidDefinition("O6", "V2.0", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/51/51880ba8b5f70cfe8804e93e96b156d44cf18082.png?n6.2"),
        new RaidDefinition("O7", "V3.0", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/58/589513e7f0f54593e22970524357927eefc1050f.png?n6.2"),
        new RaidDefinition("O8", "V4.0", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/1b/1b5ed55cecb1ea7e26f0a8aacb0f7a462fdb7336.png?n6.2"),
    ];

    let tier3Raids = [
        new RaidDefinition("O9", "V1.0", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/2b/2b2573fc792c5493fe8307821f8ab64038a6a1f3.png?n6.2"),
        new RaidDefinition("O10", "V2.0", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/0f/0f44aa3fa96dab6d56ced954754cd5d5fede0063.png?n6.2"),
        new RaidDefinition("O11", "V3.0", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/e1/e1984cbea4f17b01ff5859577aae25d0e632487a.png?n6.2"),
        new RaidDefinition("O12", "V4.0", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/5a/5aba5479271ced72f5871940bee670f6b588520b.png?n6.2"),
    ];

    let trials = [
        new RaidDefinition("The Pool of Tribute", "Susano", "PoT", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/c5/c5031bcd4d85dc90eba137744dc3655f93bb1a80.png?n6.2"),
        new RaidDefinition("Emanation", "Lakshmi", "E", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/25/25b93a945cd826831ed9ae29372d76b91cab0c16.png?n6.2"),
        new RaidDefinition("The Royal Menagerie", "Shinryu", "RM", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/3d/3d68f00c8a9b60f3ed1a94c4b242e2a92e5aa8b0.png?n6.2"),
        new RaidDefinition("Castrum Fluminis", "Tsukuyomi", "CF", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/cb/cb71ed931b14d2d96b5f85c144e554cf0c3069cd.png?n6.2"),
        new RaidDefinition("The Great Hunt", "Rathalos", "GH", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/f5/f55ac86ec9365557004d6afddf1430aab9844d5d.png?n6.2"),
        new RaidDefinition("The Jade Stoa", "Byakko", "JS", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/7f/7fc9a1dfdf8c75a5590b048f587574da36657e12.png?n6.2"),
        new RaidDefinition("Hells' Kier", "Suzaku", "HK", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/02/02c3c87aaafa2e265a8413bb510609adb4b0abc3.png?n6.2"),
        new RaidDefinition("The Wreath of Snakes", "Seiryu", "WoS", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/a2/a2505410d17c40ab6074111a3ad1b471b1f95726.png?n6.2"),
    ]

    let tiers = [
        new RaidTier("DELTASCAPE", tier1Raids, "Savage", "S", true),
        new RaidTier("OMEGASCAPE", tier2Raids, "Savage", "S", false),
        new RaidTier("ALPHASCAPE", tier3Raids, "Savage", "S", false),
        new RaidTier("TRIALS", trials, "Extreme", " (EX)", false),
    ];

    return new RaidSet(tiers, RaidNames[2]);
}

function BuildShadowbringersRaids() {
    let tier1Raids = [
        new RaidDefinition("E1", "Resurrection", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/1f/1fed360e736cb131ddbcf1b3c62554a3c170333c.png?n6.2"),
        new RaidDefinition("E2", "Descent", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/28/28043cfd25c994b50907bce001d09b590c3e3263.png?n6.2"),
        new RaidDefinition("E3", "Inundation", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/b9/b9992f9044be44646e16abeae21d23fd4d166119.png?n6.2"),
        new RaidDefinition("E4", "Sepulture", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/ba/ba801f3e8610f0a0c5c6b45358e163265dae1767.png?n6.2"),
    ];

    let tier2Raids = [
        new RaidDefinition("E5", "Fulmination", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/be/be65093b55bb22d8e99eca186807d8fedc8bfeae.png?n6.2"),
        new RaidDefinition("E6", "Furor", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/36/368cd449551e53b55df7abc20863b4ffa50f64cc.png?n6.2"),
        new RaidDefinition("E7", "Iconoclasm", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/c1/c114f1ab9c531e5297dfc5c8dbafe12aec0dbe25.png?n6.2"),
        new RaidDefinition("E8", "Refulgence", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/b5/b58da76fcc33fb333c3e4c3e75b65ffd36bededa.png?n6.2"),
    ];

    let tier3Raids = [
        new RaidDefinition("E9", "Umbra", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/43/4318cf7f4273f57046293ad2c370a738b020376a.png?n6.2"),
        new RaidDefinition("E10", "Litany", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/4f/4f5c7b7e1d9a91abadf27f8ffb6f997cf05f6874.png?n6.2"),
        new RaidDefinition("E11", "Anamorphosis", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/77/77c96d33dcd6a907693378f74a546310a3df744f.png?n6.2"),
        new RaidDefinition("E12", "Eternity", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/8d/8d0e3a1716978576f8b926d696fef587e08c28a6.png?n6.2"),
    ];

    let trials = [
        new RaidDefinition("The Dancing Plague", "Titania", "DP", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/9d/9de43bfb4a9f0bf9080e3ebc005eb7c59c6b4b64.png?n6.2"),
        new RaidDefinition("The Crown of the Immaculate", "Innocence", "CotI", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/24/24c1ae6fe9dcc7957104c34b0d67f558fe202373.png?n6.2"),
        new RaidDefinition("The Dying Gasp", "Hades", "DG", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/29/299a9776c908d9f79e02278f5daa79af8597107b.png?n6.2"),
        new RaidDefinition("The Seat of Sacrifice", "Warrior of Light", "SoS", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/ca/caf3bdf90c39b151164996f3c93c35980e26da26.png?n6.2"),
        new RaidDefinition("Cinder Drift", "Ruby Weapon", "CD", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/76/76d9249c93d15deb68608787ad499db1331ff46b.png?n6.2"),
        new RaidDefinition("Castrum Marinum", "Emerald Weapon", "CM", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/d8/d8b946c32fc3398494cd38052a3da9a32bd05156.png?n6.2"),
        new RaidDefinition("The Cloud Deck", "Diamond Weapon", "CD", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/7c/7c65dff1944976fd540f6cbe2fc0e3e2667475fe.png?n6.2"),
    ]

    let tiers = [
        new RaidTier("EDEN'S GATE", tier1Raids, "Savage", "S", true),
        new RaidTier("EDEN'S VERSE", tier2Raids, "Savage", "S", false),
        new RaidTier("EDEN'S PROMISE", tier3Raids, "Savage", "S", false),
        new RaidTier("TRIALS", trials, "Extreme", " (EX)", false),
    ];
    return new RaidSet(tiers, RaidNames[3]);
}

function BuildEndwalkerRaids() {
    let tier1Raids = [
        new RaidDefinition("P1", "The First Circle", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/d6/d61e2377329c43273343b06d899057c541de11ba.png?n6.2"),
        new RaidDefinition("P2", "The Second Circle", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/20/201b8a49323380744366f32ed7d4b0075474cb88.png?n6.2"),
        new RaidDefinition("P3", "The Third Circle", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/51/51cd545b315cc7513a884806b16d26755216050d.png?n6.2"),
        new RaidDefinition("P4", "The Fourth Circle", null, "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/c3/c35d22c8f131658e59b7e7b691122651ffb04bb6.png?n6.2"),
    ];

    let trials = [
        new RaidDefinition("The Dark Inside", "Zodiark", "DI", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/e2/e2ebc1a3df7648a0074ecb0cb1cf741849c37668.png?n6.2"),
        new RaidDefinition("The Mothercrystal", "Hydaelyn", "MC", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/e2/e2ec2caaf9d38a611feaf41b83140caf33c1a1f9.png?n6.2"),
        new RaidDefinition("The Final Day", "The Endsinger", "FD", "https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/e2/e2c18103a676f3819656848241b162d89927d90a.png?n6.2"),
    ]

    let tiers = [
        new RaidTier("ASPHODELOS", tier1Raids, "Savage", "S", true),
        new RaidTier("TRIALS", trials, "Extreme", " (EX)", false),
    ];
    return new RaidSet(tiers, RaidNames[4]);
}

export default TeamPage;