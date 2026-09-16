export interface Footballer {
  id: number;
  name: string;
  nationality: string;
  position: string;
  iconicClub: string;
  tier: 1 | 2 | 3 | 4;
  bonusClues: [string, string, string, string]; // 1: Youth/Trivia, 2: Stat/Milestone, 3: Style/Number, 4: Club reveal
}

export const PLAYERS: Footballer[] = [
  // Tier 1: Icons
  {
    id: 1,
    name: "Erling Haaland",
    nationality: "Norway",
    position: "Forward",
    iconicClub: "Manchester City",
    tier: 1,
    bonusClues: [
      "Began his senior professional career at Bryne FK before developing under Ole Gunnar Solskjær at Molde.",
      "Scored 86 goals in 89 games for Borussia Dortmund and set the all-time Premier League single-season record with 36 goals.",
      "Wears shirt #9, feared for superhuman physical strength, blitzing pace, and a meditative lotus celebration.",
      "Current superstar striker for Manchester City.",
    ],
  },
  {
    id: 2,
    name: "Mohamed Salah",
    nationality: "Egypt",
    position: "Forward",
    iconicClub: "Liverpool",
    tier: 1,
    bonusClues: [
      "Started his career in Egypt with Al Mokawloon before moving to Europe with Swiss side FC Basel in 2012.",
      "Had an earlier Premier League spell with Chelsea before thriving in Serie A with Roma; broke the 38-game Premier League scoring record in 2017-18.",
      "Wears shirt #11, iconic left-footed inside forward famed for curling top-corner finishes and his yoga tree pose celebration.",
      "The Egyptian King of Liverpool.",
    ],
  },
  {
    id: 3,
    name: "Thierry Henry",
    nationality: "France",
    position: "Forward",
    iconicClub: "Arsenal",
    tier: 1,
    bonusClues: [
      "Graduated from the prestigious INF Clairefontaine academy and began his senior club career at AS Monaco under Arsène Wenger.",
      "Won 4 Premier League Golden Boots, led the 2003–04 'Invincibles' undefeated season, and is his club's all-time record goalscorer.",
      "Wears shirt #14, renowned for blistering pace, swagger, and his trademark side-footed curled finish inside the far post.",
      "All-time legendary forward for Arsenal.",
    ],
  },
  {
    id: 4,
    name: "Wayne Rooney",
    nationality: "England",
    position: "Forward",
    iconicClub: "Manchester United",
    tier: 1,
    bonusClues: [
      "Burst onto the scene as a 16-year-old schoolboy sensation with an iconic 30-yard curler against Arsenal in October 2002.",
      "Won 5 Premier League titles, a Champions League, and became the all-time record goalscorer for his club with 253 goals.",
      "Wears shirt #10 (and previously #8), famous for bulldog tenacity, wonder strikes, and an unforgettable overhead bicycle kick in the derby.",
      "All-time top scorer and talisman for Manchester United.",
    ],
  },

  // Tier 2: Elite & Breakouts
  {
    id: 5,
    name: "Bukayo Saka",
    nationality: "England",
    position: "Forward",
    iconicClub: "Arsenal",
    tier: 2,
    bonusClues: [
      "Joined his club's Hale End academy at age seven and made his senior first-team debut in the Europa League as a 17-year-old.",
      "Won back-to-back England Men's Player of the Year awards (2021–22, 2022–23) and an FA Cup in 2020.",
      "Wears shirt #7, dynamic right-winger known for balance, elite 1v1 dribbling, and affectionately nicknamed 'Little Chilli'.",
      "Star winger and academy graduate for Arsenal.",
    ],
  },
  {
    id: 6,
    name: "Oscar Bobb",
    nationality: "Norway",
    position: "Forward",
    iconicClub: "Fulham",
    tier: 2,
    bonusClues: [
      "Spent youth development years in Portugal at Porto's youth ranks and Vålerenga before signing for Manchester City's academy in 2019.",
      "Scored a sensational 91st-minute stoppage-time winner against Newcastle in Jan 2024 to win Premier League Goal of the Month.",
      "Wears shirt #52 / #11, silky Norwegian winger celebrated for intricate close control, rapid agility, and deceptive body feints.",
      "Completed a blockbuster Premier League transfer from Manchester City to Fulham.",
    ],
  },
  {
    id: 7,
    name: "Cole Palmer",
    nationality: "England",
    position: "Midfielder",
    iconicClub: "Chelsea",
    tier: 2,
    bonusClues: [
      "Rose through Manchester City's academy from under-8 level and scored in both the 2023 FA Community Shield and UEFA Super Cup.",
      "Exploded in his debut campaign at Stamford Bridge with over 20 Premier League goals, winning Premier League Young Player of the Season.",
      "Wears shirt #20, ice-cold penalty taker and creative talisman known for his signature shivering 'Cold' celebration.",
      "Playmaker and talisman for Chelsea.",
    ],
  },
  {
    id: 8,
    name: "Son Heung-min",
    nationality: "South Korea",
    position: "Forward",
    iconicClub: "Tottenham Hotspur",
    tier: 2,
    bonusClues: [
      "Moved to Germany as a 16-year-old to join Hamburger SV's youth academy before shining at Bayer Leverkusen.",
      "Won the 2020 FIFA Puskás Award for an 80-meter solo goal and shared the 2021–22 Premier League Golden Boot with 23 non-penalty goals.",
      "Wears shirt #7, lethal two-footed finisher who serves as club captain and celebrates goals with his iconic 'camera snapshot' pose.",
      "Club captain and star forward for Tottenham Hotspur.",
    ],
  },

  // Tier 3: Legends
  {
    id: 9,
    name: "Alan Shearer",
    nationality: "England",
    position: "Forward",
    iconicClub: "Newcastle United",
    tier: 3,
    bonusClues: [
      "Began his top-flight career with Southampton, famously scoring a hat-trick on his full league debut at age 17 against Arsenal.",
      "Fired Blackburn Rovers to the 1994–95 Premier League title and remains the all-time Premier League top scorer with 260 goals.",
      "Wears shirt #9, feared for bullet headers, thunderous volleys, and his signature one-arm raised running celebration.",
      "Iconic hometown hero and record goalscorer for Newcastle United.",
    ],
  },
  {
    id: 10,
    name: "Frank Lampard",
    nationality: "England",
    position: "Midfielder",
    iconicClub: "Chelsea",
    tier: 3,
    bonusClues: [
      "Developed through West Ham United's youth academy where his father had been a legend and assistant coach.",
      "The Premier League's highest-scoring midfielder of all time (177 goals) and his club's all-time record goalscorer with 211 goals.",
      "Wears shirt #8, renowned for extraordinary stamina, box-to-box engine, and late ghosting runs into the penalty box.",
      "All-time record goalscorer and midfield legend for Chelsea.",
    ],
  },
  {
    id: 11,
    name: "Steven Gerrard",
    nationality: "England",
    position: "Midfielder",
    iconicClub: "Liverpool",
    tier: 3,
    bonusClues: [
      "Joined his boyhood club at age nine, overcoming youth injuries to make his first-team debut in November 1998.",
      "Captained his side to the historic 2005 Champions League 'Miracle of Istanbul' and the unforgettable 2006 FA Cup final.",
      "Wears shirt #8, legendary talisman famed for inspirational leadership, crunching tackles, and 35-yard rocket strikes.",
      "Iconic captain and heart of Liverpool.",
    ],
  },
  {
    id: 12,
    name: "Eden Hazard",
    nationality: "Belgium",
    position: "Forward",
    iconicClub: "Chelsea",
    tier: 3,
    bonusClues: [
      "Won Ligue 1 Player of the Year in back-to-back seasons with Lille before famously tweeting 'I'm signing for the champion's league winner'.",
      "Won 2 Premier League titles, 2 Europa Leagues, and the 2014–15 PFA Players' Player of the Year award in England.",
      "Wears shirt #10, master of low center-of-gravity dribbling, explosive hip turns, and uncatchable flair.",
      "Mesmerizing magician and winger for Chelsea.",
    ],
  },

  // Tier 4: Cult Heroes
  {
    id: 13,
    name: "Michu",
    nationality: "Spain",
    position: "Forward",
    iconicClub: "Swansea City",
    tier: 4,
    bonusClues: [
      "Signed for just £2 million from Rayo Vallecano in the summer of 2012 in what is hailed as one of the biggest bargains in Premier League history.",
      "Scored 18 Premier League goals in his debut 2012–13 season and inspired his club to win the 2013 League Cup.",
      "Wears shirt #9, known for languid movement, deadly finishing, and his ear-twisting hand-gesture celebration (Erling Haaland's boyhood idol).",
      "Cult hero and Spanish sensation for Swansea City.",
    ],
  },
  {
    id: 14,
    name: "Peter Crouch",
    nationality: "England",
    position: "Forward",
    iconicClub: "Stoke City",
    tier: 4,
    bonusClues: [
      "Represented seven different Premier League clubs across two decades, amassing over 100 Premier League goals.",
      "Holds the Premier League all-time record for the most headed goals in history (53 headed goals).",
      "Stands 6 ft 7 in (2.01 m), celebrated for deceptively silky volleys, scissor kicks, and his famous 'robot dance' celebration.",
      "Beloved cult icon of Stoke City and the Premier League.",
    ],
  },
  {
    id: 15,
    name: "Rory Delap",
    nationality: "Republic of Ireland",
    position: "Midfielder",
    iconicClub: "Stoke City",
    tier: 4,
    bonusClues: [
      "Was an accomplished javelin champion in his youth in Cumbria, which gave him unprecedented upper-body throwing mechanics.",
      "Turned standard throw-ins into flat, 40-meter guided missiles that terrorized top-four defenses under Tony Pulis.",
      "Wears shirt #24, famous for vigorously drying the ball with a towel before catapulting supersonic trajectory throw-ins into the 6-yard box.",
      "The legendary long-throw specialist for Stoke City.",
    ],
  },
  {
    id: 16,
    name: "Adel Taarabt",
    nationality: "Morocco",
    position: "Midfielder",
    iconicClub: "Queens Park Rangers",
    tier: 4,
    bonusClues: [
      "Arrived in England via Tottenham Hotspur before taking the Championship and Premier League by storm at Loftus Road.",
      "Won the 2010–11 Championship Player of the Year, single-handedly captaining his club back into the top flight.",
      "Wears shirt #7, notorious for audacious nutmegs, unplayable street flair, elastico tricks, and unpredictable genius on the pitch.",
      "The ultimate street footballer and cult icon of Queens Park Rangers.",
    ],
  },
];
