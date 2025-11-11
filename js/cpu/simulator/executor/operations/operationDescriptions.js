export const OPERATION_DESCRIPTIONS = {
    'add': 'Adds two numbers',
    'sub': 'Subtracts second number from first',
    'mul': 'Multiplies two numbers',
    'div': 'Divides first number by second',
    'mod': 'Computes remainder of division',
    'and': 'Bitwise AND of two numbers',
    'or':  'Bitwise OR of two numbers',
    'xor': 'Bitwise XOR of two numbers',

    'neg': 'Negates the value',
    'inc': 'Increments value by 1',
    'dec': 'Decrements value by 1',
    'not': 'Bitwise NOT (inverts all bits)',
    'shl': 'Shifts bits left by 1',
    'shr': 'Shifts bits right by 1',

    'nop': 'No operation',
    'halt': 'Stops CPU execution',

    'jmp': 'Unconditional jump',
    'jz':  'Jump if zero (PSW.Z = 1)',
    'jnz': 'Jump if not zero (PSW.Z = 0)',
    'jg':  'Jump if greater (PSW.Z = 0 and PSW.N = 0)',
    'jge': 'Jump if greater or equal (PSW.N = 0)',
    'jl':  'Jump if less (PSW.N = 1)',
    'jle': 'Jump if less or equal (PSW.N = 1 or PSW.Z = 1)',
};

export function descForString(operation) {
    return OPERATION_DESCRIPTIONS[operation];
}