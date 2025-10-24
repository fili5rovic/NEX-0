import {System} from "./system.js";
import {DataLoader} from "./util/data-loader.js";

DataLoader.init().then(()=>{
    System.getInstance().generateHTML();
})
