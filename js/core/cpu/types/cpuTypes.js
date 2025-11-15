const CpuTypes = {}

export function addCpuTypes(types) {
    const keys = Object.keys(types)
    for(const key of keys) {
        CpuTypes[key] = types[key];
    }
}

export function getCpuTypeForAttribute(dataTypeAttr) {
    if(!dataTypeAttr) {
        console.warn('Attribute is undefined. Defaulting to first cpu.');
        return CpuTypes[Object.keys(CpuTypes)[0]];
    }

    return CpuTypes[dataTypeAttr];
}
