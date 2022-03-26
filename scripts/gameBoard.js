
console.log("test");

function refresh_localplayer_hand() {
    const cards = document.getElementById("player-hand-container-inner");
    for (let i = 0; i < cards.childElementCount; i++) {
        const child = cards.children[i];

        const rot = i * 12.25 - 25;
        child.style["transform"] = "translate(-50%, -50%) rotate(" + rot + "deg)";
        child.style["margin-left"] = i * 25 - (cards.childElementCount * 10);
        child.style["margin-top"] = i * 4;
    }
}

for (const abilityButton of document.getElementsByClassName("ability-button")) {
    abilityButton.addEventListener("mouseover", () => {
        const buttonPos = abilityButton.getBoundingClientRect();

        document.getElementById("ability-label").style.opacity = 1;
        document.getElementById("ability-label").style.left = buttonPos.left - 144;
        document.getElementById("ability-label").style.top = buttonPos.top - 48;
    });

    abilityButton.addEventListener("mouseout", () => {
        document.getElementById("ability-label").style.opacity = 0;
    });
}

refresh_localplayer_hand();