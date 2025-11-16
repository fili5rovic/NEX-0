import {system} from "../system.js";

let currData;


export function setLevelData(data) {
    currData = data;
}

export function checkLevelCompletion() {
    if(!currData) {
        console.error("Level not loaded");
        return false;
    }

    for(const condition of currData.completionConditions) {
        if(condition.type === 'memory_value' && condition.targetId === 'mem_shared') {
            const sharedMem = system.sharedMemory
            if(!sharedMem)
                continue;
            const memVal = sharedMem.get(condition.location);
            console.log(memVal)
            console.log(condition.expectedValue);
            if(memVal !== condition.expectedValue)
                return false;
        } else if(condition.type === 'register_value') {
        }
    }
    return true;
}

