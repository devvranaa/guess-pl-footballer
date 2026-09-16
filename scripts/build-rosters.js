import fs from "node:fs/promises";

// 1. Our Hall of Fame Legends (players who aren't in this season's FPL)
const LEGENDS = [
    "Thierry Henry",
    "Alan Shearer",
    "Wayne Rooney",
    "Frank Lampard",
    "Steven Gerrard",
    "Didier Drogba",
    "Sergio Agüero",
    "Eden Hazard",
    "Cristiano Ronaldo",
    "Paul Scholes",
    "Patrick Vieira",
    "Peter Schmeichel",
    "Petr Čech",
    "John Terry",
    "Rio Ferdinand",
    "Nemanja Vidić",
    "Vincent Kompany",
    "David Silva",
    "Yaya Touré",
    "Dennis Bergkamp",
    "Eric Cantona",
    "Robin van Persie",
    "Peter Crouch",
    "Michu",
    "Adel Taarabt",
    "Dimitri Payet",
    "Jay-Jay Okocha",
    "Tim Cahill",
    "Morten Gamst Pedersen",
    "Rory Delap",
];

async function generateRoster() {
    console.log("⚽ Fetching active Premier League players from FPL API...");

    // 2. Fetch the live FPL data
    const response = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/");
    const data = await response.json();

    // 3. Extract just the full names of active players
    const activeNames = data.elements.map(
        (player) => `${player.first_name} ${player.second_name}`
    );

    // 4. Combine active players + legends, and remove any duplicates
    const allNames = Array.from(new Set([...activeNames, ...LEGENDS])).sort();

    console.log(`✅ Collected ${activeNames.length} active players.`);
    console.log(`🏆 Added ${LEGENDS.length} all-time legends.`);
    console.log(`📦 Total searchable players: ${allNames.length}`);

    // 5. Save directly into our src/data folder
    await fs.writeFile(
        "src/data/searchNames.json",
        JSON.stringify(allNames, null, 2),
        "utf-8"
    );

    console.log("🎉 Saved to src/data/searchNames.json successfully!");
}

generateRoster();