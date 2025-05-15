import {Button} from "@/components/ui/button"
import {ThemeProvider} from "@/components/ThemeProvider.tsx";

function App() {
    async function handleImportRecentGames() {
        const entries = [];
        let paginationTokenValue = "";

        for (let i = 0; i < 5; i++) {
            const response = await fetch("https://www.geoguessr.com/api/v4/feed/private?count=26" + paginationTokenValue);
            const responseObject = await response.json();
            entries.push(...responseObject.entries);

            const paginationToken = responseObject.paginationToken;
            if (paginationToken == null) {
                break;
            }

            paginationTokenValue = "&paginationToken=" + paginationToken;
        }

        const response = await fetch("http://localhost:8080/import-games", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ entries: entries})
        });

        console.log("/import-games: " + response.status + " " + response.statusText + ": " + await response.text());
    }

    return (
        <ThemeProvider defaultTheme={"dark"} storageKey={"vite-ui-theme"}>
            <div className={"flex flex-col items-center justify-center w-50 h-50"}>
                <Button onClick={handleImportRecentGames}>Import recent games</Button>
            </div>
        </ThemeProvider>
    )
}

export default App
