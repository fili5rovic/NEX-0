export const regConfigs = {
    'one-addr': [
        {
            "group": "general",
            "directly-addressable": "true",
            "registers": [
                {"name": "R0"},
                {"name": "R1"},
                {"name": "R2"},
                {"name": "R3"},
                {"name": "R4"},
                {"name": "R5"},
                {"name": "R6"},
                {"name": "R7"}
            ]
        },
        {
            "group": "special",
            "directly-addressable": "false",
            "registers": [
                {"name": "ACC", "colspan": 4},
                {"name": "PSW", "colspan": 4, "displayName": "PSW<br>V C N Z", "radix": 2, "binaryWidth": 4}
            ]
        }
    ]
}

export function regsConfigForArch(type) {
    return regConfigs[type];
}