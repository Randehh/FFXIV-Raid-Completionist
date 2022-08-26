class TeamData {
    constructor(teamId, teamName, raiders, sheetRow, lastRaiderColumn) {
        this.teamId = teamId;
        this.teamName = teamName;
        this.raiders = raiders;
        this.sheetRow = sheetRow;
        this.lastRaiderColumn = lastRaiderColumn;
    }

    getTeamNamesArray() {
        return this.raiders.map(raider => raider.name);
    }

    getTeamNames() {
        let names = "";
        this.raiders.forEach(raider => {
            names += raider.name + "\n";
        });
        return names;
    }
}

export default TeamData;