export interface Footballer {
  id: number;
  name: string;
  nationality: string;
  position: string;
  club: string;
  bonusClues: string[];
}

export const PLAYERS: Footballer[] = [
  {
    id: 1,
    name: "Erling Haaland",
    nationality: "Norway",
    position: "Forward",
    club: "Manchester City",
    bonusClues: [
      "Began his senior professional career at Bryne FK before developing under Ole Gunnar Solskjær at Molde.",
      "Scored 86 goals in 89 games for Borussia Dortmund and won a continental treble in his debut season in England.",
      "Wears shirt #9, renowned for explosive sprinting power, clinical finishing, and a meditative lotus celebration.",
      "Plays for Manchester City.",
    ],
  },
  {
    id: 2,
    name: "Mohamed Salah",
    nationality: "Egypt",
    position: "Forward",
    club: "Liverpool",
    bonusClues: [
      "Started his career in Egypt with Al Mokawloon before moving to Europe with Swiss side FC Basel in 2012.",
      "Had an earlier Premier League spell with Chelsea before thriving in Serie A with Fiorentina and Roma; later won the Champions League and Premier League.",
      "Wears shirt #11, prolific left-footed inside forward famous for curling strikes into the top corner and a yoga tree pose celebration.",
      "Plays for Liverpool.",
    ],
  },
  {
    id: 3,
    name: "Bukayo Saka",
    nationality: "England",
    position: "Forward",
    club: "Arsenal",
    bonusClues: [
      "Joined his club's Hale End academy at age seven and made his senior first-team debut in the Europa League as a 17-year-old.",
      "Won back-to-back England Men's Player of the Year awards (2021–22, 2022–23) and an FA Cup in 2020.",
      "Wears shirt #7, dynamic right-winger known for balance, elite 1v1 dribbling, and affectionately nicknamed 'Little Chilli'.",
      "Plays for Arsenal.",
    ],
  },
  {
    id: 4,
    name: "Kevin De Bruyne",
    nationality: "Belgium",
    position: "Midfielder",
    club: "Manchester City",
    bonusClues: [
      "Started his professional journey at Genk before a stint at Chelsea and winning Bundesliga Player of the Year with Wolfsburg.",
      "Two-time PFA Players' Player of the Year who tied the all-time Premier League single-season assist record with 20 assists in 2019–20.",
      "Wears shirt #17, world-renowned playmaker famous for laser-guided through balls and whipped low crosses into the corridor of uncertainty.",
      "Plays for Manchester City.",
    ],
  },
  {
    id: 5,
    name: "Son Heung-min",
    nationality: "South Korea",
    position: "Forward",
    club: "Tottenham Hotspur",
    bonusClues: [
      "Moved to Germany as a 16-year-old to join Hamburger SV's youth academy before shining at Bayer Leverkusen.",
      "Won the 2020 FIFA Puskás Award for an 80-meter solo goal and shared the 2021–22 Premier League Golden Boot with 23 non-penalty goals.",
      "Wears shirt #7, lethal two-footed finisher who serves as club captain and celebrates goals with his iconic 'camera snapshot' pose.",
      "Plays for Tottenham Hotspur.",
    ],
  },
];
