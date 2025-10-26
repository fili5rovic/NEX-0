export const CpuTypes = {
    'cpu1': {
        'arch': 'one-addr',
        'executionTime': 1000
    },
    'cpu2': {
        'arch': 'one-addr',
        'executionTime': 100
    }
}

export function getCpuTypeForAttribute(dataTypeAttr) {
    if(!dataTypeAttr) {
        return CpuTypes[Object.keys(CpuTypes)[0]];
    }

    return CpuTypes[dataTypeAttr];
}
