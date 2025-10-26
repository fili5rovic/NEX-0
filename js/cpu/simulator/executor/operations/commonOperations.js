export const ARITHMETIC_OPERATIONS =  {
    'add': (acc, op) => acc + op,
    'sub': (acc, op) => acc - op,
    'mul': (acc, op) => acc * op,
    'div': (acc, op) => Math.floor(acc / op),
    'mod': (acc, op) => acc % op,
    'and': (acc, op) => acc & op,
    'or':  (acc, op) => acc | op,
    'xor': (acc, op) => acc ^ op,
}

export const UNARY_OPERATIONS = {
    'neg': (acc) => -acc,
    'inc': (acc) => acc + 1,
    'dec': (acc) => acc - 1,
    'not': (acc) => ~acc,
    'shl': (acc) => acc << 1,
    'shr': (acc) => acc >> 1,
};

export const SPECIAL_OPERATIONS = {
    'nop': () => {},
    'halt': (cpu) => cpu.sendHalt(),
};

const PSW_FLAGS = {
    ZERO:     0b0001,
    NEGATIVE: 0b0010,
    CARRY:    0b0100,
    OVERFLOW: 0b1000,
};

export const JUMP_CONDITIONS = {
    'jmp': (psw) => true,
    'jz':  (psw) => (psw & PSW_FLAGS.ZERO) !== 0,
    'jnz': (psw) => (psw & PSW_FLAGS.ZERO) === 0,
    'jg':  (psw) => {return (psw & PSW_FLAGS.ZERO) === 0 && (psw & PSW_FLAGS.NEGATIVE) === 0;},
    'jge': (psw) => {return (psw & PSW_FLAGS.NEGATIVE) === 0;},
    'jl':  (psw) => {return (psw & PSW_FLAGS.NEGATIVE) !== 0;},
    'jle': (psw) => {return (psw & PSW_FLAGS.NEGATIVE) !== 0 || (psw & PSW_FLAGS.ZERO) !== 0;},
};