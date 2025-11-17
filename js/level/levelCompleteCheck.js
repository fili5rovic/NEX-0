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
    if(!currData.completionConditions) {
        console.log("Completion conditions not specified for this level")
        return false;
    }

    return currData.completionConditions.every(condition => {
        if(typeof condition.expectedValue !== 'number') {
            console.error(`Invalid expectedValue type: ${typeof condition.expectedValue}`);
            return false;
        }

        if(condition.type === 'memory_value' && condition.targetId === 'mem_shared') {
            const memVal = system.sharedMemory?.get(condition.location);
            return memVal === condition.expectedValue
        } else if(condition.type === 'register_value') {
            const cpu = system.cpuGenerator.cpuMap.get(condition.targetId);
            return cpu?.getReg(condition.location) === condition.expectedValue;
        }
        return true;
    })
}

