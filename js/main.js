import {System} from "./system.js";
import {DataLoader} from "./util/dataLoader.js";

DataLoader.init().then(()=>{
    System.getInstance().generateHTML();
})
