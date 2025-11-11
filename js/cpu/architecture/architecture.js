const Architectures = {
    'one-addr': {
        'keywords': [
            'add', 'sub', 'mul', 'div', 'mod',
            'load', 'store',
            'neg', 'inc', 'dec', 'nop', 'halt',
            'jmp', 'jz', 'jnz', 'jg', 'jge', 'jl', 'jle'
        ]
    }
}

export function archFromString(name) {
    return Architectures[name];
}