export function initTitleButtonListener(cpuElem) {
    const titleBtn = cpuElem.querySelector('.cpu-title');
    const sideBar = cpuElem.querySelector('.cpu-sidebar');

    titleBtn.addEventListener('click', () => {
        if (sideBar.style.display === "none" || !sideBar.style.display) {
            sideBar.style.display = "block";
        } else {
            sideBar.style.display = "none";
        }
    });
}