import {addInitialPrograms} from "../core/cpu/editor/programs/programs.js";

export async function loadLevel(name) {
    const levelContainer = document.getElementById('level-container');
    if(!levelContainer) {
        console.log('No level container present...')
        return;
    }

    const data = await loadJSON(`/json/levels/${name}.json`);

    if (data) {
        addInitialPrograms(data.initialPrograms);
        levelContainer.innerHTML = generateHtmlFromData(data);
    }
}

async function loadJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        return null;
    }
    return response.json();
}

function generateHtmlFromData(data) {
    const desc = data.description;

    let cpusHtml = '';
    for(let cpu of data.cpus) {
        const id = cpu.id ? `id="${cpu.id}"` : '';
        const program = cpu.dataProgram ? `data-program="${cpu.dataProgram}"` : '';
        const locked = cpu.locked ? `data-locked` : '';

        cpusHtml += `<div ${id} class="cpu" data-cpu-type="${cpu.type}" ${program} ${locked}></div>\n`;
    }

    let memHtml = '';
    for(let mem of data.memory) {
        memHtml += `<div class="mem" data-mem-size="${mem.size}"></div>`
    }

    return `<h3>${data.title}</h3>
<p>${desc}</p>
            <div style="display: flex; justify-content: center; gap: 40px;">
                ${cpusHtml}\n
                ${memHtml}
            </div>`
}