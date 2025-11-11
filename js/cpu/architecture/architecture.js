const Architectures = {
    'one-addr': {
        'operations': [
            'add', 'sub', 'mul', 'div', 'mod',
            'load', 'store',
            'neg', 'inc', 'dec',
            'jmp', 'jz', 'jnz', 'jg', 'jge', 'jl', 'jle',
            'nop', 'halt'
        ]
    }
}

export function archFromString(name) {
    return Architectures[name];
}