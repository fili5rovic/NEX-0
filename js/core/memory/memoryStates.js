const MEMORY_STATES = {}


export function addMemoryStates(states) {
    const keys = Object.keys(states)
    for(const key of keys) {
        MEMORY_STATES[key] = states[key];
    }
}

export function getMemoryState(name) {
    return MEMORY_STATES[name];
}