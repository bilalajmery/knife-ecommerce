import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const statesData = [
    {
        name: "Alabama",
        code: "AL",
        cities: ["Abbeville", "Adamsville", "Addison", "Akron", "Alabaster", "Albertville", "Alexander City", "Aliceville", "Allgood", "Altoona", "Andalusia", "Anderson", "Anniston", "Arab", "Ardmore", "Argo", "Ariton", "Arley", "Ashford", "Ashland", "Ashville", "Athens", "Atmore", "Attalla", "Auburn", "Autaugaville", "Avon", "Babbie", "Baileyton", "Banks", "Bay Minette", "Bayou La Batre", "Bear Creek", "Beatrice", "Beaverton", "Belk", "Benton", "Berry", "Bessemer", "Billingsley", "Birmingham", "Black", "Blountsville", "Blue Springs", "Boaz", "Boligee", "Bon Air", "Brantley", "Brent", "Brewton", "Bridgeport", "Brighton", "Brilliant", "Brookside", "Brookwood", "Brundidge", "Butler", "Calera", "Camden", "Camp Hill", "Carbon Hill", "Cardiff", "Carolina", "Carrollton", "Castleberry", "Cedar Bluff", "Center Point", "Centre", "Centreville", "Chatom", "Chelsea", "Cherokee", "Chickasaw", "Childersburg", "Citronelle", "Clanton", "Clay", "Clayhatchee", "Clayton", "Cleveland", "Clio", "Coaling", "Coffee Springs", "Coffeeville", "Coker", "Collinsville", "Columbia", "Columbiana", "Coosada", "Cordova", "Cottonwood", "County Line", "Courtland", "Cowarts", "Creola", "Crossville", "Cuba", "Cullman", "Dadeville", "Daleville", "Daphne", "Dauphin Island", "Daviston", "Dayton", "Deatsville", "Decatur", "Demopolis", "Detroit", "Dodge City", "Dora", "Dothan", "Double Springs", "Douglas", "Dozier", "Dutton", "East Brewton", "Eclectic", "Edwardsville", "Elba", "Elberta", "Eldridge", "Elkmont", "Elmore", "Emelle", "Enterprise", "Epes", "Ethelsville", "Eufaula", "Eutaw", "Eva", "Evergreen", "Excel", "Fairfield", "Fairhope", "Fairview", "Falkville", "Faunsdale", "Fayette", "Five Points", "Flomaton", "Florala", "Florence", "Foley", "Forkland", "Fort Deposit", "Fort Payne", "Franklin", "Frisco City", "Fultondale", "Fyffe", "Gadsden", "Gainesville", "Gantt", "Garden City", "Gardendale", "Gaylesville", "Geiger", "Geneva", "Glen Allen", "Glencoe", "Glenwood", "Good Hope", "Goodwater", "Gordo", "Goshen", "Grant", "Graysville", "Greensboro", "Greenville", "Grimes", "Grove Hill", "Guin", "Gulf Shores", "Guntersville", "Gurley", "Hackleburg", "Haleburg", "Haleyville", "Hamilton", "Hammondville", "Hanceville", "Harpersville", "Hartford", "Hartselle", "Hayden", "Hayneville", "Hazel Green", "Headland", "Heath", "Heflin", "Helena", "Henagar", "Highland Lake", "Hillsboro", "Hobson City", "Hodges", "Hokes Bluff", "Holly Pond", "Hollywood", "Homewood", "Hoover", "Hueytown", "Huntsville", "Hurtsboro", "Hytop", "Ider", "Indian Springs Village", "Irondale", "Jackson", "Jackson's Gap", "Jacksonville", "Jasper", "Jemison", "Kansas", "Kellyton", "Kennedy", "Killen", "Kimberly", "Kinsey", "Kinston", "La Fayette", "Lake View", "Lakeview", "Lanett", "Langston", "Leeds", "Leesburg", "Leighton", "Lester", "Level Plains", "Lincoln", "Linden", "Lineville", "Lipscomb", "Lisman", "Littleville", "Livingston", "Loachapoka", "Lockhart", "Locust Fork", "Louisville", "Lowndesboro", "Loxley", "Luverne", "Lynn", "Madison", "Madrid", "Magnolia Springs", "Malvern", "Maplesville", "Margaret", "Marion", "Maytown", "McIntosh", "McKenzie", "McMullen", "Mentone", "Midfield", "Midland City", "Midway", "Millbrook", "Millport", "Millry", "Mobile", "Monroeville", "Montevallo", "Montgomery", "Moody", "Mooresville", "Morris", "Mosses", "Moulton", "Mountain Brook", "Mount Vernon", "Mulga", "Munford", "Muscle Shoals", "Myrtlewood", "Napier Field", "Natural Bridge", "Nauvoo", "Nectar", "Needham", "New Brockton", "New Hope", "New Site", "Newbern", "Newton", "Newville", "North Courtland", "North Johns", "Northport", "Notasulga", "Oak Grove", "Oak Hill", "Oakman", "Odenville", "Ohatchee", "Oneonta", "Onycha", "Opelika", "Opp", "Orange Beach", "Orrville", "Owens Cross Roads", "Oxford", "Ozark", "Paint Rock", "Parrish", "Pelham", "Pell City", "Pennington", "Perdido Beach", "Petrey", "Phenix City", "Phil Campbell", "Pickensville", "Piedmont", "Pike Road", "Pinckard", "Pine Apple", "Pine Hill", "Pine Ridge", "Pinson", "Pisgah", "Pleasant Grove", "Point Clear", "Prattville", "Priceville", "Prichard", "Providence", "Ragland", "Rainbow City", "Rainsville", "Ranburne", "Red Bay", "Red Level", "Reece City", "Reform", "Rehobeth", "Repton", "Ridgeville", "River Falls", "Riverside", "Riverview", "Roanoke", "Robertsdale", "Rockford", "Rogersville", "Rosa", "Russellville", "Rutledge", "St. Florian", "St. Stephens", "Samson", "Sand Rock", "Sanford", "Saraland", "Sardis City", "Satsuma", "Scottsboro", "Section", "Selma", "Sheffield", "Shiloh", "Shorter", "Silas", "Silverhill", "Sipsey", "Skyline", "Slocomb", "Smiths Station", "Snead", "Somerville", "Southside", "Spanish Fort", "Springville", "Steele", "Stevenson", "Sulligent", "Sumiton", "Summerdale", "Susan Moore", "Sweet Water", "Sylacauga", "Sylvan Springs", "Talladega", "Talladega Springs", "Tallassee", "Tarrant", "Taylor", "Theodore", "Thomaston", "Thomasville", "Thorsby", "Town Creek", "Toxey", "Trafford", "Triana", "Trinity", "Troy", "Trussville", "Tuscaloosa", "Tuscumbia", "Tuskegee", "Twin", "Union Grove", "Union Springs", "Uniontown", "Valley", "Valley Head", "Vance", "Vernon", "Vestavia Hills", "Vina", "Vincent", "Vredenburgh", "Wadley", "Waldo", "Walnut Grove", "Warrior", "Waterloo", "Waverly", "Weaver", "Webb", "Wedowee", "West Blocton", "West Point", "Westover", "Wetumpka", "White Hall", "Wilsonville", "Wilton", "Winfield", "Woodland", "Woodstock", "Woodville", "Yellow Bluff", "York"]
    },
    {
        name: "Alaska",
        code: "AK",
        cities: ["Adak", "Akiachak", "Akiak", "Akutan", "Alakanuk", "Aleknagik", "Allakaket", "Anaktuvuk Pass", "Anchor Point", "Anchorage", "Anderson", "Angoon", "Aniak", "Anvik", "Arctic Village", "Atka", "Atqasuk", "Bethel", "Big Lake", "Brevig Mission", "Buckland", "Cantwell", "Central", "Chefornak", "Chevak", "Chicken", "Chignik", "Chignik Lagoon", "Chignik Lake", "Chitina", "Chugiak", "Circle", "Clam Gulch", "Clarks Point", "Cold Bay", "College", "Cooper Landing", "Copper Center", "Cordova", "Craig", "Crooked Creek", "Deering", "Delta Junction", "Denali", "Dillingham", "Dutch Harbor", "Eek", "Egegik", "Eielson AFB", "Ekwok", "Elim", "Emmonak", "Ester", "Fairbanks", "False Pass", "Fort Yukon", "Galena", "Gambell", "Goodnews Bay", "Gustavus", "Haines", "Healy", "Homer", "Hoonah", "Hooper Bay", "Houston", "Huslia", "Hydaburg", "Juneau", "Kake", "Kaktovik", "Kalifornsky", "Kenai", "Ketchikan", "Kiana", "Kivalina", "Kodiak", "Kotzebue", "Koyuk", "Koyukuk", "Lake Minchumina", "Larsen Bay", "Lower Kalskag", "Manokotak", "Marshall", "McGrath", "Meadow Lakes", "Mekoryuk", "Metlakatla", "Mountain Village", "Nenana", "New Stuyahok", "Nightmute", "Nikolai", "Nome", "Nondalton", "Noorvik", "North Pole", "Nuiqsut", "Nulato", "Nunam Iqua", "Ouzinkie", "Palmer", "Pilot Point", "Port Alexander", "Port Heiden", "Port Lions", "Prudhoe Bay", "Quinhagak", "Ruby", "Seldovia", "Seward", "Shageluk", "Shishmaref", "Sitka", "Skagway", "Soldotna", "St. Paul", "Talkeetna", "Tanaina", "Tanana", "Togiak", "Unalaska", "Valdez", "Wasilla", "White Mountain", "Wrangell", "Yakutat"]
    },
    { name: "Arizona", code: "AZ", cities: ["Phoenix", "Tucson", "Mesa"] },
    { name: "Arkansas", code: "AR", cities: ["Little Rock", "Fort Smith", "Fayetteville"] },
    { name: "California", code: "CA", cities: ["Los Angeles", "San Francisco", "San Diego"] },
    { name: "Colorado", code: "CO", cities: ["Denver", "Colorado Springs", "Aurora"] },
    { name: "Connecticut", code: "CT", cities: ["Bridgeport", "New Haven", "Hartford"] },
    { name: "Delaware", code: "DE", cities: ["Wilmington", "Dover", "Newark"] },
    { name: "Florida", code: "FL", cities: ["Miami", "Orlando", "Tampa"] },
    { name: "Georgia", code: "GA", cities: ["Atlanta", "Augusta", "Columbus"] },
    { name: "Hawaii", code: "HI", cities: ["Honolulu", "Hilo", "Kailua"] },
    { name: "Idaho", code: "ID", cities: ["Boise", "Meridian", "Nampa"] },
    { name: "Illinois", code: "IL", cities: ["Chicago", "Aurora", "Joliet"] },
    { name: "Indiana", code: "IN", cities: ["Indianapolis", "Fort Wayne", "Evansville"] },
    { name: "Iowa", code: "IA", cities: ["Des Moines", "Cedar Rapids", "Davenport"] },
    { name: "Kansas", code: "KS", cities: ["Wichita", "Overland Park", "Kansas City"] },
    { name: "Kentucky", code: "KY", cities: ["Louisville", "Lexington", "Bowling Green"] },
    { name: "Louisiana", code: "LA", cities: ["New Orleans", "Baton Rouge", "Shreveport"] },
    { name: "Maine", code: "ME", cities: ["Portland", "Lewiston", "Bangor"] },
    { name: "Maryland", code: "MD", cities: ["Baltimore", "Columbia", "Germantown"] },
    { name: "Massachusetts", code: "MA", cities: ["Boston", "Worcester", "Springfield"] },
    { name: "Michigan", code: "MI", cities: ["Detroit", "Grand Rapids", "Warren"] },
    { name: "Minnesota", code: "MN", cities: ["Minneapolis", "St. Paul", "Rochester"] },
    { name: "Mississippi", code: "MS", cities: ["Jackson", "Gulfport", "Southaven"] },
    { name: "Missouri", code: "MO", cities: ["Kansas City", "St. Louis", "Springfield"] },
    { name: "Montana", code: "MT", cities: ["Billings", "Missoula", "Great Falls"] },
    { name: "Nebraska", code: "NE", cities: ["Omaha", "Lincoln", "Bellevue"] },
    { name: "Nevada", code: "NV", cities: ["Las Vegas", "Henderson", "Reno"] },
    { name: "New Hampshire", code: "NH", cities: ["Manchester", "Nashua", "Concord"] },
    { name: "New Jersey", code: "NJ", cities: ["Newark", "Jersey City", "Paterson"] },
    { name: "New Mexico", code: "NM", cities: ["Albuquerque", "Las Cruces", "Rio Rancho"] },
    { name: "New York", code: "NY", cities: ["New York City", "Buffalo", "Rochester"] },
    { name: "North Carolina", code: "NC", cities: ["Charlotte", "Raleigh", "Greensboro"] },
    { name: "North Dakota", code: "ND", cities: ["Fargo", "Bismarck", "Grand Forks"] },
    { name: "Ohio", code: "OH", cities: ["Columbus", "Cleveland", "Cincinnati"] },
    { name: "Oklahoma", code: "OK", cities: ["Oklahoma City", "Tulsa", "Norman"] },
    { name: "Oregon", code: "OR", cities: ["Portland", "Salem", "Eugene"] },
    { name: "Pennsylvania", code: "PA", cities: ["Philadelphia", "Pittsburgh", "Allentown"] },
    { name: "Rhode Island", code: "RI", cities: ["Providence", "Warwick", "Cranston"] },
    { name: "South Carolina", code: "SC", cities: ["Charleston", "Columbia", "North Charleston"] },
    { name: "South Dakota", code: "SD", cities: ["Sioux Falls", "Rapid City", "Aberdeen"] },
    { name: "Tennessee", code: "TN", cities: ["Nashville", "Memphis", "Knoxville"] },
    { name: "Texas", code: "TX", cities: ["Houston", "San Antonio", "Dallas"] },
    { name: "Utah", code: "UT", cities: ["Salt Lake City", "West Valley City", "Provo"] },
    { name: "Vermont", code: "VT", cities: ["Burlington", "South Burlington", "Rutland"] },
    { name: "Virginia", code: "VA", cities: ["Virginia Beach", "Norfolk", "Chesapeake"] },
    { name: "Washington", code: "WA", cities: ["Seattle", "Spokane", "Tacoma"] },
    { name: "West Virginia", code: "WV", cities: ["Charleston", "Huntington", "Morgantown"] },
    { name: "Wisconsin", code: "WI", cities: ["Milwaukee", "Madison", "Green Bay"] },
    { name: "Wyoming", code: "WY", cities: ["Cheyenne", "Casper", "Laramie"] }
];

const seedGeolocation = async () => {
    try {
        const { default: dbConnect } = await import("../lib/db.js");
        const { default: Country } = await import("../models/Country.js");
        const { default: State } = await import("../models/State.js");
        const { default: City } = await import("../models/City.js");

        await dbConnect();
        console.log("Connected to database...");

        // 1. Seed United States
        console.log("Seeding Country: United States...");
        let usCountry = await Country.findOne({ code: "US" });
        if (!usCountry) {
            usCountry = await Country.create({
                name: "United States",
                code: "US",
                isActive: true
            });
            console.log("Created United States.");
        } else {
            console.log("United States already exists.");
        }

        // 2. Seed States and Cities
        console.log("Seeding States and Cities...");
        for (const stateItem of statesData) {
            // Find or create state
            let state = await State.findOne({ code: stateItem.code, country: usCountry._id });
            if (!state) {
                state = await State.create({
                    name: stateItem.name,
                    code: stateItem.code,
                    country: usCountry._id,
                    isActive: true
                });
                console.log(`Created state: ${stateItem.name}`);
            } else {
                console.log(`State already exists: ${stateItem.name}`);
            }

            // Seed Cities for this state
            for (const cityName of stateItem.cities) {
                const existingCity = await City.findOne({ name: cityName, state: state._id });
                if (!existingCity) {
                    await City.create({
                        name: cityName,
                        state: state._id,
                        country: usCountry._id,
                        isActive: true
                    });
                    console.log(`  Added city: ${cityName} to ${stateItem.name}`);
                }
            }
        }

        console.log("Geolocation seeding completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding geolocation data:", error);
        process.exit(1);
    }
};

seedGeolocation();
