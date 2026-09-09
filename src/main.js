const landBtn = document.getElementById("landBtn");
const portfolioBtn = document.getElementById("portfolioBtn");

console.log(landBtn);
console.log(portfolioBtn);

function switch_active_btn() {
    landBtn.classList.toggle("active");
    portfolioBtn.classList.toggle("active");
}

portfolioBtn.onclick = () => {
    switch_active_btn();
};
landBtn.onclick = () => {
    switch_active_btn();
};