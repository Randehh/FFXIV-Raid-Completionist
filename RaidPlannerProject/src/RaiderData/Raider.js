import { setValues } from '../SheetsAPI/SheetsAPI'

class Raider {
    constructor(name, rawCompletionStates, cell) {
        this.name = name;
        this.completionStates = {};
        this.cell = cell;

        if (rawCompletionStates.length !== 0){
            rawCompletionStates.split(',').forEach(raidState => {
                let raidStateSplit = raidState.split('-');
                this.completionStates[raidStateSplit[0]] = raidStateSplit[1];
            });
        }
    }

    setRaidCompleted(raid, completed, isHardMode) {
        let id = isHardMode ? raid.acronymHard : raid.acronym;
        this.completionStates[id] = completed;

        setValues("Teams", this.cell, this.getSerializedCompletionStates(), () => {});
    }

    getRaidCompleted(id) {
        if (!this.completionStates[id] || this.completionStates[id] === "false") {
            return false;
        } else {
            return true;
        }
    }

    getSerializedCompletionStates(){
        let serialized = this.name + "=";
        for (let key in this.completionStates) {
            console.log("key " + key + " has value " + this.completionStates[key]);
            serialized += `${key}-${this.completionStates[key]},`;
        }
        serialized = serialized.replace(/,+$/, '');
        console.log(serialized);
        return serialized;
    }
}

export default Raider;