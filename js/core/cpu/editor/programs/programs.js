export function getProgram(name) {
    return PROGRAMS[name]?.code;
}

export function addInitialPrograms(initialPrograms) {
    for(const program of initialPrograms) {
        addProgram(program.name, program.code);
    }
}

function addProgram(name, code) {
    PROGRAMS[name] = { code: code };
}


const PROGRAMS = {}