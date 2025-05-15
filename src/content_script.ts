function observeNewElements() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node instanceof Element) {
                    switch (node.className) {
                        case "game-finished_container__HOD2O": // party game end
                        case "result-overlay_overlayContent__K7s9N": // single player end
                        case "duels-game-finished_root__drF6A": // solo duels new ui end
                        case "game-finished-ranked_container__bfJMV": // team duels old ui end
                            chrome.runtime.sendMessage({type: "game_finished"}).then();
                            break;
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

observeNewElements();