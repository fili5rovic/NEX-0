# Level Configuration Documentation

## Overview

Level configuration files define the structure and behavior of CPU simulator levels. They are JSON files that specify memory layout, CPU configurations, initial states, available programs, and completion conditions.

## File Structure
```json
{
  "version": 1,
  "id": "level-001",
  "title": "Level Title",
  "description": "Level description",
  "memory": [],
  "cpus": [],
  "memoryStates": {},
  "newCpuTypes": {},
  "initialPrograms": [],
  "completionConditions": []
}
```

## Top-Level Fields

### `version` (number, required)
Configuration file format version. Currently only version `1` is supported.

### `id` (string, required)
Unique identifier for the level. Should follow the pattern `level-XXX` where XXX is a zero-padded number.<br>
If you are making custom levels, they should follow pattern `{your_unique_identifier}_custom_level-XXX`

**Example:** `"level-001"`, `"level-042"`, `"fili5_custom_level-053"`

### `title` (string, required)
Display name of the level shown to users.

### `description` (string, required)
Detailed description explaining the level's purpose and learning objectives.

---

## Memory Configuration

### `memory` (array, required)

Defines memory modules available in the level. Each memory object has:

#### `id` (string, required)
Unique identifier for this memory module. Used to reference the memory in completion conditions.

**Example:** `"mem_shared"`, `"mem_private"`

#### `size` (string, required)
Memory dimensions in format `"rows x columns"`.

**Example:** `"32x8"` creates a memory with 256 cells (32 rows × 8 columns)

#### `initialState` (string, optional)
Reference to a memory state defined in `memoryStates`. If omitted, memory starts with all zeros.

**Example:**
```json
"memory": [
  {
    "id": "mem_shared",
    "size": "32x8",
    "initialState": "initial1"
  }
]
```

---

## CPU Configuration

### `cpus` (array, required)

Defines the CPUs available in the level. Each CPU object has:

#### `id` (string, required)
Unique identifier for this CPU instance. Used to reference the CPU in completion conditions.

#### `type` (string, required)
Reference to a CPU type (either built-in or defined in `newCpuTypes`).

#### `dataProgram` (string, optional)
Reference to a program from `initialPrograms` to load into this CPU at startup.

#### `locked` (boolean, optional)
If `true`, the user cannot edit the CPU's program. Default is `false`.

**Example:**
```json
"cpus": [
  {
    "id": "cpu1",
    "type": "cpu1",
    "dataProgram": "test",
    "locked": true
  },
  {
    "id": "cpu2",
    "type": "cpu1"
  }
]
```

---

## Memory States

### `memoryStates` (object, optional)

Defines named memory states that can be referenced by memory modules.

**Format:** Object where keys are state names and values are objects mapping memory addresses (as strings) to numeric values.

**Example:**
```json
"memoryStates": {
  "initial1": {
    "3": 4,
    "5": 2
  },
  "fibonacci": {
    "0": 1,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 5
  }
}
```

This sets memory address 3 to value 4, and address 5 to value 2.

---

## CPU Types

### `newCpuTypes` (object, optional)

Defines new CPU types or overrides existing ones for this level.

Each CPU type has:

#### `displayName` (string, required)
Human-readable CPU name shown in the UI.

#### `arch` (string, required)
Architecture type. Currently supported: `"one-addr"`

#### `invalidInstructions` (array of strings, optional)
List of instructions that this CPU cannot execute. Users attempting to use these instructions will get an error.

#### `executionTime` (number, required)
Time in milliseconds for each instruction execution step.

**Example:**
```json
"newCpuTypes": {
  "cpu1": {
    "displayName": "Intel 4004",
    "arch": "one-addr",
    "invalidInstructions": ["sub", "add"],
    "executionTime": 300
  },
  "cpu2": {
    "displayName": "Fast CPU",
    "arch": "one-addr",
    "executionTime": 100
  }
}
```

---

## Initial Programs

### `initialPrograms` (array, optional)

Defines programs that can be loaded into CPUs at level start.

Each program has:

#### `name` (string, required)
Unique identifier for the program, referenced by CPU's `dataProgram` field.

#### `code` (string, required)
Assembly code for the program. Use `\n` for line breaks.

**Example:**
```json
"initialPrograms": [
  {
    "name": "test",
    "code": "LOAD #5\nLOOP: DEC\nJNZ LOOP"
  },
  {
    "name": "counter",
    "code": "LOAD #0\nSTORE 100\nLOOP: LOAD 100\nINC\nSTORE 100\nJMP LOOP"
  }
]
```

---

## Completion Conditions

### `completionConditions` (array, optional)

Defines the conditions that must be met for the level to be considered complete. All conditions must be satisfied simultaneously.

Each condition has:

#### `type` (string, required)
Type of condition to check. Supported values:
- `"memory_value"` - Check a specific memory location
- `"register_value"` - Check a CPU register value

#### `targetId` (string, required)
Identifier of the target to check:
- For `memory_value`: ID of the memory module (e.g., `"mem_shared"`)
- For `register_value`: ID of the CPU (e.g., `"cpu2"`)

#### `location` (string, required)
Location within the target to check:
- For `memory_value`: Memory address as a string (e.g., `"5"`)
- For `register_value`: Register name (e.g., `"ACC"`, `"PC"`, `"MAR"`)

#### `expectedValue` (number, required)
The numeric value expected at the specified location for the condition to be satisfied.

**Example:**
```json
"completionConditions": [
  {
    "type": "memory_value",
    "targetId": "mem_shared",
    "location": "5",
    "expectedValue": 5
  },
  {
    "type": "register_value",
    "targetId": "cpu2",
    "location": "ACC",
    "expectedValue": 5
  }
]
```

In this example, the level is complete when:
1. Memory address 5 in `mem_shared` contains the value 5, AND
2. The ACC register of `cpu2` contains the value 5

---

## Complete Example
```json
{
  "version": 1,
  "id": "level-001",
  "title": "Educational simulator for multiprocessor systems",
  "description": "Run multiple CPUs simultaneously, visualize parallel execution, and explore how processors share memory and coordinate tasks.",
  "memory": [
    {
      "id": "mem_shared",
      "size": "32x8",
      "initialState": "initial1"
    }
  ],
  "cpus": [
    {
      "id": "cpu1",
      "type": "cpu1",
      "dataProgram": "test",
      "locked": true
    },
    {
      "id": "cpu2",
      "type": "cpu1"
    }
  ],
  "memoryStates": {
    "initial1": {
      "3": 4,
      "5": 2
    }
  },
  "newCpuTypes": {
    "cpu1": {
      "displayName": "Intel 4004",
      "arch": "one-addr",
      "invalidInstructions": ["sub", "add"],
      "executionTime": 300
    }
  },
  "initialPrograms": [
    {
      "name": "test",
      "code": "LOAD #5\nLOOP: DEC\nJNZ LOOP"
    }
  ],
  "completionConditions": [
    {
      "type": "memory_value",
      "targetId": "mem_shared",
      "location": "5",
      "expectedValue": 5
    },
    {
      "type": "register_value",
      "targetId": "cpu2",
      "location": "ACC",
      "expectedValue": 5
    }
  ]
}
```