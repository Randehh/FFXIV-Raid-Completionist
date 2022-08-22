
class Raider {

    constructor(name) {
        this.name = name;
        this.completionStates = {};
    }

    setRaidCompleted(id, completed) {
        this.completionStates[id] = completed;
    }

    getRaidCompleted(id) {
        if (!this.completionStates[id]) {
            return false;
        } else {
            return true;
        }
    }
}

export default Raider;