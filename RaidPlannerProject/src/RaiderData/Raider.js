import { setValues } from '../SheetsAPI/SheetsAPI'

class Raider {
    constructor(name, rawCompletionStates, cell) {
        this.name = name;
        this.completionStates = {};
        this.cell = cell;

        if (rawCompletionStates.length !== 0) {
            rawCompletionStates.split(',').forEach(raidState => {
                let raidStateSplit = raidState.split('-');
                this.completionStates[raidStateSplit[0]] = raidStateSplit[1];
            });
        }
    }

    setRaidCompleted(raid, completed) {
        let id = raid.acronym;
        this.completionStates[id] = completed;

        setValues("Teams", [this.cell], this.getSerializedCompletionStates(), () => { });
    }

    getRaidCompleted(id) {
        if (!this.completionStates[id] || this.completionStates[id] === "false") {
            return false;
        } else {
            return true;
        }
    }

    getSerializedCompletionStates() {
        let serialized = this.name + "=";
        for (let key in this.completionStates) {
            serialized += `${key}-${this.completionStates[key]},`;
        }
        serialized = serialized.replace(/,+$/, '');
        return serialized;
    }
}

export default Raider;