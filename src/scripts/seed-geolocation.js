import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const statesData = [
    {
        name: "Alabama",
        code: "AL",
        salesTax: 4.00,
        cities: ["Abbeville", "Adamsville", "Addison", "Akron", "Alabaster", "Albertville", "Alexander City", "Aliceville", "Allgood", "Altoona", "Andalusia", "Anderson", "Anniston", "Arab", "Ardmore", "Argo", "Ariton", "Arley", "Ashford", "Ashland", "Ashville", "Athens", "Atmore", "Attalla", "Auburn", "Autaugaville", "Avon", "Babbie", "Baileyton", "Banks", "Bay Minette", "Bayou La Batre", "Bear Creek", "Beatrice", "Beaverton", "Belk", "Benton", "Berry", "Bessemer", "Billingsley", "Birmingham", "Black", "Blountsville", "Blue Springs", "Boaz", "Boligee", "Bon Air", "Brantley", "Brent", "Brewton", "Bridgeport", "Brighton", "Brilliant", "Brookside", "Brookwood", "Brundidge", "Butler", "Calera", "Camden", "Camp Hill", "Carbon Hill", "Cardiff", "Carolina", "Carrollton", "Castleberry", "Cedar Bluff", "Center Point", "Centre", "Centreville", "Chatom", "Chelsea", "Cherokee", "Chickasaw", "Childersburg", "Citronelle", "Clanton", "Clay", "Clayhatchee", "Clayton", "Cleveland", "Clio", "Coaling", "Coffee Springs", "Coffeeville", "Coker", "Collinsville", "Columbia", "Columbiana", "Coosada", "Cordova", "Cottonwood", "County Line", "Courtland", "Cowarts", "Creola", "Crossville", "Cuba", "Cullman", "Dadeville", "Daleville", "Daphne", "Dauphin Island", "Daviston", "Dayton", "Deatsville", "Decatur", "Demopolis", "Detroit", "Dodge City", "Dora", "Dothan", "Double Springs", "Douglas", "Dozier", "Dutton", "East Brewton", "Eclectic", "Edwardsville", "Elba", "Elberta", "Eldridge", "Elkmont", "Elmore", "Emelle", "Enterprise", "Epes", "Ethelsville", "Eufaula", "Eutaw", "Eva", "Evergreen", "Excel", "Fairfield", "Fairhope", "Fairview", "Falkville", "Faunsdale", "Fayette", "Five Points", "Flomaton", "Florala", "Florence", "Foley", "Forkland", "Fort Deposit", "Fort Payne", "Franklin", "Frisco City", "Fultondale", "Fyffe", "Gadsden", "Gainesville", "Gantt", "Garden City", "Gardendale", "Gaylesville", "Geiger", "Geneva", "Glen Allen", "Glencoe", "Glenwood", "Good Hope", "Goodwater", "Gordo", "Goshen", "Grant", "Graysville", "Greensboro", "Greenville", "Grimes", "Grove Hill", "Guin", "Gulf Shores", "Guntersville", "Gurley", "Hackleburg", "Haleburg", "Haleyville", "Hamilton", "Hammondville", "Hanceville", "Harpersville", "Hartford", "Hartselle", "Hayden", "Hayneville", "Hazel Green", "Headland", "Heath", "Heflin", "Helena", "Henagar", "Highland Lake", "Hillsboro", "Hobson City", "Hodges", "Hokes Bluff", "Holly Pond", "Hollywood", "Homewood", "Hoover", "Hueytown", "Huntsville", "Hurtsboro", "Hytop", "Ider", "Indian Springs Village", "Irondale", "Jackson", "Jackson's Gap", "Jacksonville", "Jasper", "Jemison", "Kansas", "Kellyton", "Kennedy", "Killen", "Kimberly", "Kinsey", "Kinston", "La Fayette", "Lake View", "Lakeview", "Lanett", "Langston", "Leeds", "Leesburg", "Leighton", "Lester", "Level Plains", "Lincoln", "Linden", "Lineville", "Lipscomb", "Lisman", "Littleville", "Livingston", "Loachapoka", "Lockhart", "Locust Fork", "Louisville", "Lowndesboro", "Loxley", "Luverne", "Lynn", "Madison", "Madrid", "Magnolia Springs", "Malvern", "Maplesville", "Margaret", "Marion", "Maytown", "McIntosh", "McKenzie", "McMullen", "Mentone", "Midfield", "Midland City", "Midway", "Millbrook", "Millport", "Millry", "Mobile", "Monroeville", "Montevallo", "Montgomery", "Moody", "Mooresville", "Morris", "Mosses", "Moulton", "Mountain Brook", "Mount Vernon", "Mulga", "Munford", "Muscle Shoals", "Myrtlewood", "Napier Field", "Natural Bridge", "Nauvoo", "Nectar", "Needham", "New Brockton", "New Hope", "New Site", "Newbern", "Newton", "Newville", "North Courtland", "North Johns", "Northport", "Notasulga", "Oak Grove", "Oak Hill", "Oakman", "Odenville", "Ohatchee", "Oneonta", "Onycha", "Opelika", "Opp", "Orange Beach", "Orrville", "Owens Cross Roads", "Oxford", "Ozark", "Paint Rock", "Parrish", "Pelham", "Pell City", "Pennington", "Perdido Beach", "Petrey", "Phenix City", "Phil Campbell", "Pickensville", "Piedmont", "Pike Road", "Pinckard", "Pine Apple", "Pine Hill", "Pine Ridge", "Pinson", "Pisgah", "Pleasant Grove", "Point Clear", "Prattville", "Priceville", "Prichard", "Providence", "Ragland", "Rainbow City", "Rainsville", "Ranburne", "Red Bay", "Red Level", "Reece City", "Reform", "Rehobeth", "Repton", "Ridgeville", "River Falls", "Riverside", "Riverview", "Roanoke", "Robertsdale", "Rockford", "Rogersville", "Rosa", "Russellville", "Rutledge", "St. Florian", "St. Stephens", "Samson", "Sand Rock", "Sanford", "Saraland", "Sardis City", "Satsuma", "Scottsboro", "Section", "Selma", "Sheffield", "Shiloh", "Shorter", "Silas", "Silverhill", "Sipsey", "Skyline", "Slocomb", "Smiths Station", "Snead", "Somerville", "Southside", "Spanish Fort", "Springville", "Steele", "Stevenson", "Sulligent", "Sumiton", "Summerdale", "Susan Moore", "Sweet Water", "Sylacauga", "Sylvan Springs", "Talladega", "Talladega Springs", "Tallassee", "Tarrant", "Taylor", "Theodore", "Thomaston", "Thomasville", "Thorsby", "Town Creek", "Toxey", "Trafford", "Triana", "Trinity", "Troy", "Trussville", "Tuscaloosa", "Tuscumbia", "Tuskegee", "Twin", "Union Grove", "Union Springs", "Uniontown", "Valley", "Valley Head", "Vance", "Vernon", "Vestavia Hills", "Vina", "Vincent", "Vredenburgh", "Wadley", "Waldo", "Walnut Grove", "Warrior", "Waterloo", "Waverly", "Weaver", "Webb", "Wedowee", "West Blocton", "West Point", "Westover", "Wetumpka", "White Hall", "Wilsonville", "Wilton", "Winfield", "Woodland", "Woodstock", "Woodville", "Yellow Bluff", "York"]
    },
    { name: "Alaska", code: "AK", salesTax: 0.00, cities: ["Anchorage", "Juneau", "Fairbanks"] },
    { name: "Arizona", code: "AZ", salesTax: 5.60, cities: ["Phoenix", "Tucson", "Mesa"] },
    { name: "Arkansas", code: "AR", salesTax: 6.50, cities: ["Little Rock", "Fort Smith", "Fayetteville"] },
    { name: "California", code: "CA", salesTax: 7.25, cities: ["Los Angeles", "San Francisco", "San Diego"] },
    { name: "Colorado", code: "CO", salesTax: 2.90, cities: ["Denver", "Colorado Springs", "Aurora"] },
    { name: "Connecticut", code: "CT", salesTax: 6.35, cities: ["Bridgeport", "New Haven", "Hartford"] },
    { name: "Delaware", code: "DE", salesTax: 0.00, cities: ["Wilmington", "Dover", "Newark"] },
    { name: "Florida", code: "FL", salesTax: 6.00, cities: ["Miami", "Orlando", "Tampa"] },
    { name: "Georgia", code: "GA", salesTax: 4.00, cities: ["Atlanta", "Augusta", "Columbus"] },
    { name: "Hawaii", code: "HI", salesTax: 4.00, cities: ["Honolulu", "Hilo", "Kailua"] },
    { name: "Idaho", code: "ID", salesTax: 6.00, cities: ["Boise", "Meridian", "Nampa"] },
    { name: "Illinois", code: "IL", salesTax: 6.25, cities: ["Chicago", "Aurora", "Joliet"] },
    { name: "Indiana", code: "IN", salesTax: 7.00, cities: ["Indianapolis", "Fort Wayne", "Evansville"] },
    { name: "Iowa", code: "IA", salesTax: 6.00, cities: ["Des Moines", "Cedar Rapids", "Davenport"] },
    { name: "Kansas", code: "KS", salesTax: 6.50, cities: ["Wichita", "Overland Park", "Kansas City"] },
    { name: "Kentucky", code: "KY", salesTax: 6.00, cities: ["Louisville", "Lexington", "Bowling Green"] },
    { name: "Louisiana", code: "LA", salesTax: 5.00, cities: ["New Orleans", "Baton Rouge", "Shreveport"] },
    { name: "Maine", code: "ME", salesTax: 5.50, cities: ["Portland", "Lewiston", "Bangor"] },
    { name: "Maryland", code: "MD", salesTax: 6.00, cities: ["Baltimore", "Columbia", "Germantown"] },
    { name: "Massachusetts", code: "MA", salesTax: 6.25, cities: ["Boston", "Worcester", "Springfield"] },
    { name: "Michigan", code: "MI", salesTax: 6.00, cities: ["Detroit", "Grand Rapids", "Warren"] },
    { name: "Minnesota", code: "MN", salesTax: 6.875, cities: ["Minneapolis", "St. Paul", "Rochester"] },
    { name: "Mississippi", code: "MS", salesTax: 7.00, cities: ["Jackson", "Gulfport", "Southaven"] },
    { name: "Missouri", code: "MO", salesTax: 4.225, cities: ["Kansas City", "St. Louis", "Springfield"] },
    { name: "Montana", code: "MT", salesTax: 0.00, cities: ["Billings", "Missoula", "Great Falls"] },
    { name: "Nebraska", code: "NE", salesTax: 5.50, cities: ["Omaha", "Lincoln", "Bellevue"] },
    { name: "Nevada", code: "NV", salesTax: 4.60, cities: ["Las Vegas", "Henderson", "Reno"] },
    { name: "New Hampshire", code: "NH", salesTax: 0.00, cities: ["Manchester", "Nashua", "Concord"] },
    { name: "New Jersey", code: "NJ", salesTax: 6.625, cities: ["Newark", "Jersey City", "Paterson"] },
    { name: "New Mexico", code: "NM", salesTax: 5.125, cities: ["Albuquerque", "Las Cruces", "Rio Rancho"] },
    { name: "New York", code: "NY", salesTax: 4.00, cities: ["New York City", "Buffalo", "Rochester"] },
    { name: "North Carolina", code: "NC", salesTax: 4.75, cities: ["Charlotte", "Raleigh", "Greensboro"] },
    { name: "North Dakota", code: "ND", salesTax: 5.00, cities: ["Fargo", "Bismarck", "Grand Forks"] },
    { name: "Ohio", code: "OH", salesTax: 5.75, cities: ["Columbus", "Cleveland", "Cincinnati"] },
    { name: "Oklahoma", code: "OK", salesTax: 4.50, cities: ["Oklahoma City", "Tulsa", "Norman"] },
    { name: "Oregon", code: "OR", salesTax: 0.00, cities: ["Portland", "Salem", "Eugene"] },
    { name: "Pennsylvania", code: "PA", salesTax: 6.00, cities: ["Philadelphia", "Pittsburgh", "Allentown"] },
    { name: "Rhode Island", code: "RI", salesTax: 7.00, cities: ["Providence", "Warwick", "Cranston"] },
    { name: "South Carolina", code: "SC", salesTax: 6.00, cities: ["Charleston", "Columbia", "North Charleston"] },
    { name: "South Dakota", code: "SD", salesTax: 4.50, cities: ["Sioux Falls", "Rapid City", "Aberdeen"] },
    { name: "Tennessee", code: "TN", salesTax: 7.00, cities: ["Nashville", "Memphis", "Knoxville"] },
    { name: "Texas", code: "TX", salesTax: 6.25, cities: ["Houston", "San Antonio", "Dallas"] },
    { name: "Utah", code: "UT", salesTax: 6.10, cities: ["Salt Lake City", "West Valley City", "Provo"] },
    { name: "Vermont", code: "VT", salesTax: 6.00, cities: ["Burlington", "South Burlington", "Rutland"] },
    { name: "Virginia", code: "VA", salesTax: 5.65, cities: ["Virginia Beach", "Norfolk", "Chesapeake"] },
    { name: "Washington", code: "WA", salesTax: 6.50, cities: ["Seattle", "Spokane", "Tacoma"] },
    { name: "West Virginia", code: "WV", salesTax: 6.00, cities: ["Charleston", "Huntington", "Morgantown"] },
    { name: "Wisconsin", code: "WI", salesTax: 5.00, cities: ["Milwaukee", "Madison", "Green Bay"] },
    { name: "Wyoming", code: "WY", salesTax: 4.00, cities: ["Cheyenne", "Casper", "Laramie"] }
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
                    taxPercentage: stateItem.salesTax,
                    isActive: true
                });
                console.log(`Created state: ${stateItem.name}`);
            } else {
                // Update tax percentage if it exists
                state.taxPercentage = stateItem.salesTax;
                await state.save();
                console.log(`Updated state: ${stateItem.name} tax to ${stateItem.salesTax}%`);
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
