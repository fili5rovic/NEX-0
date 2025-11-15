import {system} from "./system.js";
import {loadLevel} from "./level/levelLoader.js";

await loadLevel('testLevel')
system.generateHTML();
