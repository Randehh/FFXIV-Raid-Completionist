import { sample } from "lodash";

class TeamStats{
    raidIndex = {};
    raiderCounts = {};
    totalCounts = {};
    normalCompletedCounts = {};
    hardCompletedCounts = {};

    constructor(raiders, raidSets, raidIndex){
        this.raidIndex = raidIndex;

        let raiderCounts = {};
        let totalCounts = {};
        let normalCompletedCounts = {};
        let hardCompletedCounts = {};

        let superNormalTotal = 0;
        let superHardTotal = 0;

        raiders.forEach(raider => {
            let c = {};
            raidSets.forEach(set => {
                let totalNormal = 0;
                let totalHard = 0;
                let setCountNormal = 0;
                let setCountHard = 0;
                set.tiers.forEach(tier => {
                    tier.raidDefs.forEach(raid => {
                        if (raider.getRaidCompleted(raid.acronym)) {
                            setCountNormal++;
                            normalCompletedCounts[raid.acronym] = normalCompletedCounts[raid.acronym] == null ? 0 : normalCompletedCounts[raid.acronym]+ 1;
                        }
                        if (raider.getRaidCompleted(raid.acronymHard)) {
                            setCountHard++;
                            hardCompletedCounts[raid.acronymHard] = hardCompletedCounts[raid.acronymHard] == null ? 0 : hardCompletedCounts[raid.acronymHard]+ 1;
                        }

                        totalNormal++;
                        if (!tier.hideHardMode) {
                            totalHard++;
                        }
                    });
                });
                c[set.identifier] = {
                    normal: setCountNormal,
                    hard: setCountHard
                };

                if (!totalCounts[set.identifier]) {
                    totalCounts[set.identifier] = {
                        normal: totalNormal,
                        hard: totalHard,
                    }

                    superNormalTotal += totalNormal;
                    superHardTotal += totalHard;
                }
            });
            raiderCounts[raider.name] = c;
        });

        totalCounts["TOTAL"] = {
            normal: superNormalTotal,
            hard: superHardTotal,
        }

        this.raiderCounts = raiderCounts;
        this.totalCounts = totalCounts;
        this.normalCompletedCounts = normalCompletedCounts;
        this.hardCompletedCounts = hardCompletedCounts;

        this.getRandomLeastPlayedRaid(false, true);
    }

    getRandomLeastPlayedRaid(normalMode, hardMode){
        let arrayToPick = [];
        if(normalMode == true && hardMode == true){
            arrayToPick = Object.entries(this.normalCompletedCounts).concat(Object.entries(this.hardCompletedCounts));
        }else if(normalMode == true){
            arrayToPick = Object.entries(this.normalCompletedCounts);
        }else if(hardMode == true){
            arrayToPick = Object.entries(this.hardCompletedCounts);
        }else{
            return "";
        }
        let sorted = arrayToPick.sort((a, b) => a[1] - b[1]);
        let sliced = sorted.slice(sorted.length / 2);
        let raidId = sample(sliced);
        let raid = this.raidIndex[raidId[0]];
        return raid;
    }
}

export default TeamStats;