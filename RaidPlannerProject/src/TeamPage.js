import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';

import RaidChecklist from './RaidSchedules/RaidChecklist';
import TeamStatsDisplay from "./TeamComponents/TeamStatsDisplay";
import RaidRoulette from "./TeamComponents/RaidRoulette";

import Raider from './RaiderData/Raider';
import TeamStats from "./RaiderData/TeamStats";

import { RaidNames } from './RaidConstants'

import { getValues } from './SheetsAPI/SheetsAPI'

class RaidSet {
    constructor(tiers, identifier) {
        this.tiers = tiers;
        this.identifier = identifier;

        tiers.forEach(tier => {
            tier.raidDefs.forEach(raid => {
                raid.parentSet = this;
            });
        });
    }
}

class RaidTier {
    constructor(name, raidDefs, hardPrefix, printNames, hideHardMode) {
        this.name = name;
        this.raidDefs = raidDefs;
        this.hardPrefix = hardPrefix;
        this.printNames = printNames;
        this.hideHardMode = hideHardMode;
    }
}

class RaidDefinition {
    constructor(name, subtitle, acronym) {
        this.name = name;
        this.subtitle = subtitle;
        this.acronym = acronym != null ? acronym : name;
        this.acronymHard = "#" + this.acronym;
    }
}

const TeamPage = () => {
    const { teamId } = useParams();

    const [teamName, setTeamName] = React.useState("Loading...");
    const [raiders, setRaiders] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        getValues("Teams", null, true, (results) => {
            let index = results["values"][0].indexOf(teamId);

            let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let column = index + 1;
            getValues("Teams", `A${column}:Z${column}`, false, (teamResult) => {
                setTeamName(teamResult["values"][0][1]);

                let tmpRaiders = [];
                for (let raiderIndex = 3; raiderIndex < teamResult["values"][0].length; raiderIndex++) {
                    let row = alphabet[raiderIndex];
                    const raiderData = teamResult["values"][0][raiderIndex];
                    let raiderDataSplit = raiderData.split('=');
                    let raider = new Raider(raiderDataSplit[0], raiderDataSplit[1], row + column);
                    tmpRaiders.push(raider);
                }
                setRaiders(tmpRaiders);

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
                raidsIndex[raid.acronymHard] = raid;
            });
        });
    });

    let teamStats = new TeamStats(raiders, raidSets, raidsIndex);

    return (
        <div>
            <Modal show={isLoading}
                centered
                backdrop="static"
                keyboard={false}>
                <Modal.Body>Loading...</Modal.Body>
            </Modal>
            <h1 className="team-name">{teamName}</h1>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header><h2>Progress overview</h2></Accordion.Header>
                    <Accordion.Body>
                        <TeamStatsDisplay raiders={raiders} teamStats={teamStats}></TeamStatsDisplay>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                    <Accordion.Header><h2>Raid roulette</h2></Accordion.Header>
                    <Accordion.Body>
                        <RaidRoulette></RaidRoulette>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                    <Accordion.Header><h2>Progress tracker</h2></Accordion.Header>
                    <Accordion.Body>
                        <RaidChecklist tierName={RaidNames[0]} raidSet={arrRaids} raiders={raiders}></RaidChecklist>
                        <RaidChecklist tierName={RaidNames[1]} raidSet={heavenswardRaids} raiders={raiders}></RaidChecklist>
                        <RaidChecklist tierName={RaidNames[2]} raidSet={stormbloodRaids} raiders={raiders}></RaidChecklist>
                        <RaidChecklist tierName={RaidNames[3]} raidSet={shadowbringerRaids} raiders={raiders}></RaidChecklist>
                        <RaidChecklist tierName={RaidNames[4]} raidSet={endwalkerRaids} raiders={raiders}></RaidChecklist>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
}

function BuildArrRaids() {
    let tier1Raids = [
        new RaidDefinition("T1", "Turn 1"),
        new RaidDefinition("T2", "Turn 2"),
        new RaidDefinition("T3", "Turn 3"),
        new RaidDefinition("T4", "Turn 4"),
        new RaidDefinition("T5", "Turn 5"),
    ];

    let tier2Raids = [
        new RaidDefinition("T6", "Turn 1"),
        new RaidDefinition("T7", "Turn 2"),
        new RaidDefinition("T8", "Turn 3"),
        new RaidDefinition("T9", "Turn 4"),
    ];

    let tier3Raids = [
        new RaidDefinition("T10", "Turn 1"),
        new RaidDefinition("T12", "Turn 2"),
        new RaidDefinition("T13", "Turn 3"),
        new RaidDefinition("T14", "Turn 4"),
    ];

    let trials = [
        new RaidDefinition("Ultima's Bane", "Ultima Weapon", "UB"),
        new RaidDefinition("The Howling Eye", "Garuda", "HE"),
        new RaidDefinition("The Navel", "Titan", "NAV"),
        new RaidDefinition("The Bowl of Embers", "Ifrit", "BoE"),
        new RaidDefinition("Thornmarch", "Good King Moggle Mog XII", "GKMM"),
        new RaidDefinition("The Whorleater", "Leviathan", "WE"),
        new RaidDefinition("The Striking Tree", "Ramuh", "ST"),
        new RaidDefinition("Akh Afah Amphitheatre", "Shiva", "AAA"),
    ]

    let tiers = [
        new RaidTier("THE FIRST COIL", tier1Raids, "Savage", true, true),
        new RaidTier("THE SECOND COIL", tier2Raids, "Savage", false),
        new RaidTier("THE FINAL COIL", tier3Raids, "Savage", false, true),
        new RaidTier("TRIALS", trials, "Extreme", false),
    ];

    return new RaidSet(tiers, RaidNames[0]);
}

function BuildHeavenswardRaids() {
    let tier1Raids = [
        new RaidDefinition("A1S", "Fist of the Father"),
        new RaidDefinition("A2S", "Cuff of the Father"),
        new RaidDefinition("A3S", "Arm of the Father"),
        new RaidDefinition("A4S", "Burden of the Father"),
    ];

    let tier2Raids = [
        new RaidDefinition("A5S", "Fist of the Son"),
        new RaidDefinition("A6S", "Cuff of the Son"),
        new RaidDefinition("A7S", "Arm of the Son"),
        new RaidDefinition("A8S", "Burden of the Son"),
    ];

    let tier3Raids = [
        new RaidDefinition("A9S", "Eyes of the Creator"),
        new RaidDefinition("A10S", "Breath of the Creator"),
        new RaidDefinition("A11S", "Heart of the Creator"),
        new RaidDefinition("A12S", "Soul of the Creator"),
    ];

    let trials = [
        new RaidDefinition("Thok ast Thok", "Ravana", "TaT"),
        new RaidDefinition("The Limitless Blue", "Bismarck", "Bi"),
        new RaidDefinition("The Singularity Reactor", "King Thordan", "KT"),
        new RaidDefinition("The Final Steps of Faith", "Nidhogg", "FSoF"),
        new RaidDefinition("Containment Bay S1T7", "Sephirot", "CBS1"),
        new RaidDefinition("Containment Bay P1T6", "Sophia", "CBP1"),
        new RaidDefinition("Containment Bay Z1T9", "Zurvan", "CBZ1"),
    ]

    let tiers = [
        new RaidTier("GORDIAS", tier1Raids, "Savage", true),
        new RaidTier("MIDAS", tier2Raids, "Savage", false),
        new RaidTier("THE CREATOR", tier3Raids, "Savage", false),
        new RaidTier("TRIALS", trials, "Extreme", false),
    ];
    return new RaidSet(tiers, RaidNames[1]);
}

function BuildStormbloodRaids() {
    let tier1Raids = [
        new RaidDefinition("O1S", "V1.0"),
        new RaidDefinition("O2S", "V2.0"),
        new RaidDefinition("O3S", "V3.0"),
        new RaidDefinition("O4S", "V4.0"),
    ];

    let tier2Raids = [
        new RaidDefinition("O5S", "V1.0"),
        new RaidDefinition("O6S", "V2.0"),
        new RaidDefinition("O7S", "V3.0"),
        new RaidDefinition("O8S", "V4.0"),
    ];

    let tier3Raids = [
        new RaidDefinition("O9S", "V1.0"),
        new RaidDefinition("O10S", "V2.0"),
        new RaidDefinition("O11S", "V3.0"),
        new RaidDefinition("O12S", "V4.0"),
    ];

    let trials = [
        new RaidDefinition("The Pool of Tribute", "Susano", "PoT"),
        new RaidDefinition("Emanation", "Lakshmi", "E"),
        new RaidDefinition("The Royal Menagerie", "Shinryu", "RM"),
        new RaidDefinition("Castrum Fluminis", "Tsukuyomi", "CF"),
        new RaidDefinition("The Great Hunt", "Rathalos", "GH"),
        new RaidDefinition("Hells' Kier", "Suzaku", "HK"),
        new RaidDefinition("The Wreath of Snakes", "Seiryu", "WoS"),
        new RaidDefinition("Kugane Ohashi", "Yojimbo", "KO"),
    ]

    let tiers = [
        new RaidTier("DELTASCAPE", tier1Raids, "Savage", true),
        new RaidTier("OMEGASCAPE", tier2Raids, "Savage", false),
        new RaidTier("ALPHASCAPE", tier3Raids, "Savage", false),
        new RaidTier("TRIALS", trials, "Extreme", false),
    ];

    return new RaidSet(tiers, RaidNames[2]);
}

function BuildShadowbringersRaids() {
    let tier1Raids = [
        new RaidDefinition("E1S", "Resurrection"),
        new RaidDefinition("E2S", "Descent"),
        new RaidDefinition("E3S", "Inundation"),
        new RaidDefinition("E4S", "Sepulture"),
    ];

    let tier2Raids = [
        new RaidDefinition("E5S", "Fulmination"),
        new RaidDefinition("E6S", "Furor"),
        new RaidDefinition("E7S", "Iconoclasm"),
        new RaidDefinition("E8S", "Refulgence"),
    ];

    let tier3Raids = [
        new RaidDefinition("E9S", "Umbra"),
        new RaidDefinition("E10S", "Litany"),
        new RaidDefinition("E11S", "Anamorphosis"),
        new RaidDefinition("E12S", "Eternity"),
    ];

    let trials = [
        new RaidDefinition("The Dancing Plague", "Titania", "DP"),
        new RaidDefinition("The Crown of the Immaculate", "Innocence", "CotI"),
        new RaidDefinition("The Dying Gasp", "Hades", "DG"),
        new RaidDefinition("The Seat of Sacrifice", "Warrior of Light", "SoS"),
        new RaidDefinition("Cinder Drift", "Ruby Weapon", "CD"),
        new RaidDefinition("Castrum Marinum", "Emerald Weapon", "CM"),
        new RaidDefinition("The Cloud Deck", "Diamond Weapon", "CD"),
    ]

    let tiers = [
        new RaidTier("EDEN'S GATE", tier1Raids, "Savage", true),
        new RaidTier("EDEN'S VERSE", tier2Raids, "Savage", false),
        new RaidTier("EDEN'S PROMISE", tier3Raids, "Savage", false),
        new RaidTier("TRIALS", trials, "Extreme", false),
    ];
    return new RaidSet(tiers, RaidNames[3]);
}

function BuildEndwalkerRaids() {
    let tier1Raids = [
        new RaidDefinition("P1S", "The First Circle"),
        new RaidDefinition("P2S", "The Second Circle"),
        new RaidDefinition("P3S", "The Third Circle"),
        new RaidDefinition("P4S", "The Fourth Circle"),
    ];

    let trials = [
        new RaidDefinition("The Dark Inside", "Zodiark", "DI"),
        new RaidDefinition("The Mothercrystal", "Hydaelyn", "MC"),
        new RaidDefinition("The Final Day", "The Endsinger", "FD"),
    ]

    let tiers = [
        new RaidTier("ASPHODELOS", tier1Raids, "Savage", true),
        new RaidTier("TRIALS", trials, "Extreme", false),
    ];
    return new RaidSet(tiers, RaidNames[4]);
}

export default TeamPage;