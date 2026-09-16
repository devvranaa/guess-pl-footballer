import fs from "node:fs/promises";

// 1. Hall of Fame Legends & Superstars
const LEGENDS = [
    "Mohamed Salah",
    "Son Heung-min",
    "Kevin De Bruyne",
    "Harry Kane",
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
    "Roy Keane",
    "David Beckham",
    "Ashley Cole",
    "Gary Neville",
    "Sol Campbell",
    "Ruud van Nistelrooy",
    "Sadio Mané",
    "Cesc Fàbregas",
    "Michael Owen",
    "Trent Alexander-Arnold",
    "Bruno Fernandes",
    "Rodri",
    "Bernardo Silva",
    "Gabriel Magalhães",
    "Jarrod Bowen",
    "Emiliano Martínez",
    "David Raya",
    "Ederson",
    "Rúben Dias",
    "Kyle Walker",
    "John Stones",
    "Kieran Trippier",
    "Gabriel Martinelli",
    "Gabriel Jesus",
    "Diogo Jota",
    "Luis Díaz",
    "Darwin Núñez",
    "Alejandro Garnacho",
    "Casemiro",
    "Anthony Gordon",
    "Bruno Guimarães",
    "Savinho",
    "Dominic Solanke",
    "Pedro Neto",
    "Manuel Ugarte",
    "Moisés Caicedo",
    "Levi Colwill",
    "Marc Cucurella",
    "Mikel Merino",
    "Murillo",
    "Kaoru Mitoma",
    "João Pedro",
    "Papiss Cissé",
    "Demba Ba",
    "Hatem Ben Arfa",
    "Tugay Kerimoğlu",
    "Yakubu",
    "Clint Dempsey",
    "Geovanni",
    "Laurent Robert",
    "Roque Santa Cruz",
    "Asamoah Gyan",
    "Pajtim Kasami",
    "Yannick Bolasie",
    "Wilfried Zaha",
    "Benni McCarthy",
    "Stiliyan Petrov",
    "Nolberto Solano",
    "Kevin Phillips",
    "Shola Ameobi",
    "Brede Hangeland",
    "Jussi Jääskeläinen",
    "Thomas Sørensen",
    "Sylvain Distin",
    "Charlie Adam",
    "Grant Holt",
    "Duncan Ferguson",
    "Juninho Paulista",
    "Fabricio Coloccini",
    "Mark Viduka",
    "Jon Walters",
    "Ryan Shawcross",
    "Christopher Samba",
    "Amr Zaki",
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