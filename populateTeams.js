import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Admin SDK with default credentials (e.g. if using gcloud auth)
initializeApp({
  credential: applicationDefault()
});

const db = getFirestore();

const teams = [
  { id: "arizona_cardinals", name: "Arizona Cardinals" },
  { id: "atlanta_falcons", name: "Atlanta Falcons" },
  { id: "baltimore_ravens", name: "Baltimore Ravens" },
  { id: "buffalo_bills", name: "Buffalo Bills" },
  { id: "carolina_panthers", name: "Carolina Panthers" },
  { id: "chicago_bears", name: "Chicago Bears" },
  { id: "cincinnati_bengals", name: "Cincinnati Bengals" },
  { id: "cleveland_browns", name: "Cleveland Browns" },
  { id: "dallas_cowboys", name: "Dallas Cowboys" },
  { id: "denver_broncos", name: "Denver Broncos" },
  { id: "detroit_lions", name: "Detroit Lions" },
  { id: "green_bay_packers", name: "Green Bay Packers" },
  { id: "houston_texans", name: "Houston Texans" },
  { id: "indianapolis_colts", name: "Indianapolis Colts" },
  { id: "jacksonville_jaguars", name: "Jacksonville Jaguars" },
  { id: "kansas_city_chiefs", name: "Kansas City Chiefs" },
  { id: "las_vegas_raiders", name: "Las Vegas Raiders" },
  { id: "los_angeles_chargers", name: "Los Angeles Chargers" },
  { id: "los_angeles_rams", name: "Los Angeles Rams" },
  { id: "miami_dolphins", name: "Miami Dolphins" },
  { id: "minnesota_vikings", name: "Minnesota Vikings" },
  { id: "new_england_patriots", name: "New England Patriots" },
  { id: "new_orleans_saints", name: "New Orleans Saints" },
  { id: "new_york_giants", name: "New York Giants" },
  { id: "new_york_jets", name: "New York Jets" },
  { id: "philadelphia_eagles", name: "Philadelphia Eagles" },
  { id: "pittsburgh_steelers", name: "Pittsburgh Steelers" },
  { id: "san_francisco_49ers", name: "San Francisco 49ers" },
  { id: "seattle_seahawks", name: "Seattle Seahawks" },
  { id: "tampa_bay_buccaneers", name: "Tampa Bay Buccaneers" },
  { id: "tennessee_titans", name: "Tennessee Titans" },
  { id: "washington_commanders", name: "Washington Commanders" }
];

async function populateTeams() {
  for (const team of teams) {
    await db.collection("teams").doc(team.id).set({
      name: team.name,
      bid: 0,
      owner: "",
      timestamp: new Date()
    });
    console.log(`✅ Added ${team.name}`);
  }

  console.log("🎉 Done populating all teams.");
}

populateTeams();