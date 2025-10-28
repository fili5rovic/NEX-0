export const ARITHMETIC_OPERATIONS =  {
    'add': (a, b) => a + b,
    'sub': (a, b) => a - b,
    'mul': (a, b) => a * b,
    'div': (a, b) => Math.floor(a / b),
    'mod': (a, b) => a % b,
    'and': (a, b) => a & b,
    'or':  (a, b) => a | b,
    'xor': (a, b) => a ^ b,
}

export const UNARY_OPERATIONS = {
    'neg': (a) => -a,
    'inc': (a) => a + 1,
    'dec': (a) => a - 1,
    'not': (a) => ~a,
    'shl': (a) => a << 1,
    'shr': (a) => a >> 1,
};

const PSW_FLAGS = {
    ZERO:     0b0001,
    NEGATIVE: 0b0010,
    CARRY:    0b0100,
    OVERFLOW: 0b1000,
};

export const JUMP_CONDITIONS = {
    'jmp': () => true,
    'jz':  (psw) => (psw & PSW_FLAGS.ZERO) !== 0,
    'jnz': (psw) => (psw & PSW_FLAGS.ZERO) === 0,
    'jg':  (psw) => {return (psw & PSW_FLAGS.ZERO) === 0 && (psw & PSW_FLAGS.NEGATIVE) === 0;},
    'jge': (psw) => {return (psw & PSW_FLAGS.NEGATIVE) === 0;},
    'jl':  (psw) => {return (psw & PSW_FLAGS.NEGATIVE) !== 0;},
    'jle': (psw) => {return (psw & PSW_FLAGS.NEGATIVE) !== 0 || (psw & PSW_FLAGS.ZERO) !== 0;},
};