export function getProgram(name) {
    return PROGRAMS[name]?.code;
}


const PROGRAMS = {
    'test' : {
        code : `LOAD #5\nLOOP: DEC\nJNZ LOOP`
    }
}