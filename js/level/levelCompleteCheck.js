let currData;


export function setLevelData(data) {
    currData = data;
}

export function checkLevelCompletion() {
    if(!currData) {
        console.error("Level not loaded");
        return;
    }

    for(const condition of currData.completionConditions) {
        if(condition.type === 'memory_value') {

        }
    }
}

