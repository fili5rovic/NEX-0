const regTable = document.getElementById('regs-table');

export function displayRegs(cpu) {
    const tds = regTable.querySelectorAll('td');
    for (let i = 0; i < tds.length; i++) {
        const td = tds[i];
        td.innerText = (i == 0 ? cpu.getAcc() : cpu.getReg(i-1));
    }
}