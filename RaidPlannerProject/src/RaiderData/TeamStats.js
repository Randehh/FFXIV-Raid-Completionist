class TeamStats{
    raiderCounts = {};
    totalCounts = {};

    constructor(raiders, raidSets){
        let raiderCounts = {};
        let totalCounts = {};

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
                        }
                        if (raider.getRaidCompleted(raid.acronymHard)) {
                            setCountHard++;
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
    }
}

export default TeamStats;