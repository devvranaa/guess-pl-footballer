export interface Footballer {
  id: number;
  name: string;
  club: string;
  nationality: string;
  position: string;
  bonusClues: string[];
}

export const PLAYERS: Footballer[] = [
  {
    id: 1,
    name: "Erling Haaland",
    club: "Manchester City",
    nationality: "Norway",
    position: "Forward",
    bonusClues: [
      "Broke the record for most goals scored in a single 38-game Premier League season (36 goals).",
      "Previously played for Borussia Dortmund and Red Bull Salzburg.",
      "Won the continental treble (Premier League, FA Cup, Champions League) in his debut season in England.",
    ],
  },
  {
    id: 2,
    name: "Mohamed Salah",
    club: "Liverpool",
    nationality: "Egypt",
    position: "Forward",
    bonusClues: [
      "Nicknamed 'The Egyptian King' by the Anfield faithful.",
      "Scored 32 Premier League goals in the 2017–18 campaign to win his first Premier League Golden Boot.",
      "Previously played in the Premier League for Chelsea before thriving in Serie A with Fiorentina and Roma.",
    ],
  },
  {
    id: 3,
    name: "Bukayo Saka",
    club: "Arsenal",
    nationality: "England",
    position: "Forward",
    bonusClues: [
      "Graduated from the club's Hale End academy and affectionately nicknamed 'Little Chilli'.",
      "Named England Men's Player of the Year in both 2021–22 and 2022–23.",
      "Wears the number 7 shirt and primarily operates as a left-footed right winger.",
    ],
  },
  {
    id: 4,
    name: "Kevin De Bruyne",
    club: "Manchester City",
    nationality: "Belgium",
    position: "Midfielder",
    bonusClues: [
      "Tied Thierry Henry's single-season Premier League assist record with 20 assists in 2019–20.",
      "Two-time Premier League Player of the Season and two-time PFA Players' Player of the Year.",
      "Signed from VfL Wolfsburg in 2015 after earlier spells with Genk, Chelsea, and Werder Bremen.",
    ],
  },
  {
    id: 5,
    name: "Son Heung-min",
    club: "Tottenham Hotspur",
    nationality: "South Korea",
    position: "Forward",
    bonusClues: [
      "Won the Premier League Golden Boot for the 2021–22 season with 23 goals without scoring a single penalty.",
      "Won the 2020 FIFA Puskás Award for an iconic solo goal against Burnley.",
      "Appointed club captain in 2023 following Harry Kane's departure.",
    ],
  },
];
