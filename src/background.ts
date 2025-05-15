const CLIENT = "?client=geo-stats";
const DUELS_ID_LENGTH = 36;
const GAMES_ID_LENGTH = 16;
const GAMES_HTTP_REQUEST = "https://www.geoguessr.com/api/v3/games/";
const DUELS_HTTP_REQUEST = "https://game-server.geoguessr.com/api/duels/";

const tabGameIds = new Map<number, string>();

chrome.webRequest.onCompleted.addListener(
    async (details) => {
        const url = details.url;

        if (url.endsWith(CLIENT)) {
            return;
        }

        if (url.startsWith(GAMES_HTTP_REQUEST)) {
            tabGameIds.set(details.tabId, url.substring(GAMES_HTTP_REQUEST.length, GAMES_HTTP_REQUEST.length + GAMES_ID_LENGTH));
        } else if (url.startsWith(DUELS_HTTP_REQUEST)) {
            tabGameIds.set(details.tabId, url.substring(DUELS_HTTP_REQUEST.length, DUELS_HTTP_REQUEST.length + DUELS_ID_LENGTH));
        }
    },
    {urls: [GAMES_HTTP_REQUEST + "*", DUELS_HTTP_REQUEST + "*"]}
);

chrome.runtime.onMessage.addListener(async (message, sender) => {
    if (message.type !== "game_finished") {
        return false;
    }

    const tabId = sender.tab?.id;

    if (tabId) {
        const gameId = tabGameIds.get(tabId);

        if (gameId?.length === DUELS_ID_LENGTH) {
            const response = await fetch(`http://127.0.0.1:8080/duels-game/${gameId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log("/duels-game: " + response.status + " " + response.statusText + ": " + await response.text());

        } else if (gameId?.length === GAMES_ID_LENGTH) {
            const response = await fetch(`http://127.0.0.1:8080/solo-game/${gameId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log("/solo-game: " + response.status + " " + response.statusText + ": " + await response.text());
        }

        tabGameIds.delete(tabId);
    }

    return true;
});

chrome.tabs.onRemoved.addListener((tabId) => {
    tabGameIds.delete(tabId);
});