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
    'jz':  'Jump if zero flag is set',
    'jnz': 'Jump if zero flag is not set',
    'jg':  'Jump if greater (not zero and not negative)',
    'jge': 'Jump if greater or equal (not negative)',
    'jl':  'Jump if less (negative flag set)',
    'jle': 'Jump if less or equal (negative or zero flag set)',
};

export function descForString(operation) {
    return OPERATION_DESCRIPTIONS[operation];
}