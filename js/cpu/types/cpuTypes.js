export const CpuTypes = {
    'cpu1': {
        'displayName': 'Intel 4004',
        'arch': 'one-addr',
        'executionTime': 300
    },
    'cpu2': {
        'displayName': 'test',
        'arch': 'one-addr',
        'executionTime': 100
    }
}

export function getCpuTypeForAttribute(dataTypeAttr) {
    if(!dataTypeAttr) {
        console.warn('Attribute is undefined. Defaulting to first cpu.');
        return CpuTypes[Object.keys(CpuTypes)[0]];
    }

    return CpuTypes[dataTypeAttr];
}
