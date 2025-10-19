const regTable = document.getElementById('regs-table');

export function displayRegs(cpu) {
    const trs = regTable.querySelectorAll('tr');
    for (let i = 0; i < trs.length; i++) {
        const tr = trs[i];
        tr.children[1].innerText = (i == 0 ? cpu.getAcc() : cpu.getReg(i-1));
    }
}