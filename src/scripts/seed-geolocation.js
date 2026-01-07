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
    {
        name: "Arizona",
        code: "AZ",
        cities: ["Aguila", "Ajo", "Amado", "Anthem", "Apache Junction", "Arizona City", "Ash Fork", "Avondale", "Bagdad", "Bapchule", "Benson", "Bisbee", "Black Canyon City", "Blue", "Bouse", "Bowie", "Buckeye", "Bullhead City", "Cameron", "Camp Verde", "Carefree", "Casa Grande", "Catalina", "Cave Creek", "Chandler", "Chinle", "Chino Valley", "Chloride", "Clarkdale", "Colorado City", "Coolidge", "Cottonwood", "Dateland", "Douglas", "Duncan", "Eagar", "Ehrenberg", "El Mirage", "Elgin", "Eloy", "Flagstaff", "Florence", "Fountain Hills", "Fredonia", "Gadsden", "Ganado", "Gila Bend", "Gilbert", "Glendale", "Globe", "Gold Camp", "Graham", "Green Valley", "Guadalupe", "Hayden", "Holbrook", "Jerome", "Kearny", "Kingman", "Lake Havasu City", "Laveen", "Litchfield Park", "Marana", "Maricopa", "Mesa", "Nogales", "Oro Valley", "Page", "Payson", "Peoria", "Pima", "Pinetop-Lakeside", "Prescott", "Prescott Valley", "Quartzsite", "Queen Creek", "Safford", "San Luis", "Scottsdale", "Sedona", "Show Low", "Sierra Vista", "Somerton", "Snowflake", "Springerville", "St. Johns", "Superior", "Sun City", "Sun City West", "Surprise", "Taylor", "Tempe", "Thatcher", "Tolleson", "Tombstone", "Tucson", "Tusayan", "Vail", "Wickenburg", "Williams", "Willcox", "Wilcox", "Winslow", "Yuma"]
    },
    {
        name: "Arkansas",
        code: "AR",
        cities: ["Adona", "Alco", "Alexander", "Alicia", "Alma", "Almyra", "Alpena", "Altheimer", "Altus", "Amagon", "Amity", "Arkadelphia", "Arkansas City", "Armorel", "Ash Flat", "Ashdown", "Atkins", "Aubrey", "Augusta", "Austin", "Avoca", "Bald Knob", "Barling", "Batesville", "Bauxite", "Bay", "Bearden", "Beebe", "Bella Vista", "Belleville", "Benton", "Bentonville", "Bergman", "Berryville", "Big Flat", "Biggers", "Black Oak", "Black Rock", "Blevins", "Blytheville", "Bono", "Booneville", "Bradford", "Bradley", "Brinkley", "Brookland", "Bryant", "Buckner", "Bull Shoals", "Cabot", "Calico Rock", "Calion", "Camden", "Caraway", "Carlisle", "Carthage", "Casa", "Cave City", "Cave Springs", "Cedarville", "Centerton", "Charleston", "Cherokee Village", "Cherry Valley", "Clarendon", "Clarksville", "Clinton", "Coal Hill", "Concord", "Conway", "Corning", "Cotter", "Cotton Plant", "Crossett", "Dardanelle", "De Queen", "De Witt", "Decatur", "Dermott", "Des Arc", "Diamond City", "Dierks", "Dover", "Dumas", "Earle", "El Dorado", "Elaine", "Elkins", "Elm Springs", "England", "Eudora", "Eureka Springs", "Fairfield Bay", "Farmington", "Fayetteville", "Flippin", "Fordyce", "Forrest City", "Fort Smith", "Fouke", "Fountain Hill", "Fountain Lake", "Gassville", "Gentry", "Gilbert", "Gillett", "Glenwood", "Gosnell", "Gravette", "Green Forest", "Greenbrier", "Greenland", "Greenway", "Greenwood", "Harrison", "Helena-West Helena", "Hope", "Hot Springs", "Hoxie", "Hughes", "Huntsville", "Jacksonville", "Jasper", "Jonesboro", "Kingsland", "Lake Village", "Leachville", "Little Rock", "Lonoke", "Maumelle", "Melbourne", "Mena", "Monticello", "Morrilton", "Mountain Home", "Newport", "North Little Rock", "Osceola", "Paragould", "Piggott", "Pine Bluff", "Prairie Grove", "Rogers", "Russellville", "Searcy", "Shirley", "Siloam Springs", "Springdale", "Stuttgart", "Texarkana", "Van Buren", "West Memphis", "Wynne", "Yellville"]
    },
    {
        name: "California",
        code: "CA",
        cities: ["Acton", "Adelanto", "Agoura Hills", "Alameda", "Alamo", "Albany", "Alhambra", "Aliso Viejo", "Altadena", "Alto", "Alturas", "Alviso", "Amador City", "American Canyon", "Anaheim", "Anderson", "Antioch", "Apple Valley", "Arcadia", "Arroyo Grande", "Artesia", "Arvin", "Atascadero", "Atherton", "Atwater", "Auburn", "Avalon", "Azusa", "Bakersfield", "Baldwin Park", "Barstow", "Beaumont", "Bellflower", "Belmont", "Belridge", "Benicia", "Beverly Hills", "Big Bear Lake", "Bishop", "Blue Lake", "Blythe", "Bradbury", "Brawley", "Brea", "Brentwood", "Buena Park", "Burbank", "Calabasas", "Calexico", "California City", "Camarillo", "Campbell", "Carlsbad", "Carmel-by-the-Sea", "Carpinteria", "Ceres", "Chico", "Chino", "Chula Vista", "Citrus Heights", "Claremont", "Clearlake", "Clovis", "Coachella", "Colfax", "Colton", "Compton", "Concord", "Corcoran", "Corte Madera", "Costa Mesa", "Cotati", "Covina", "Crescent City", "Culver City", "Cupertino", "Cypress", "Daly City", "Davis", "Del Mar", "Del Rey Oaks", "Dinuba", "Downey", "Dublin", "East Palo Alto", "El Cajon", "El Centro", "El Monte", "El Segundo", "Encinitas", "Escalon", "Fairfield", "Folsom", "Fontana", "Foster City", "Fountain Valley", "Fremont", "Fresno", "Fullerton", "Gilroy", "Glendale", "Glendora", "Goleta", "Grand Terrace", "Grass Valley", "Hanford", "Hawthorne", "Hayward", "Hesperia", "Hollister", "Hollywood", "Huntington Beach", "Imperial", "Indian Wells", "Indio", "Inglewood", "Irvine", "La Habra", "La Mesa", "La Mirada", "La Puente", "La Quinta", "La Verne", "Laguna Beach", "Lake Elsinore", "Lake Forest", "Lancaster", "Lathrop", "Lemon Grove", "Lodi", "Lompoc", "Long Beach", "Los Altos", "Los Angeles", "Madera", "Mammoth Lakes", "Manhattan Beach", "Manteca", "Marina", "Martinez", "Marysville", "Menifee", "Menlo Park", "Merced", "Mill Valley", "Milpitas", "Modesto", "Monrovia", "Montebello", "Monterey", "Monterey Park", "Moorpark", "Moreno Valley", "Morgan Hill", "Mountain View", "Murrieta", "Napa", "National City", "Newark", "Newport Beach", "Norco", "Norwalk", "Novato", "Oakland", "Oceanside", "Ojai", "Oildale", "Ontario", "Orange", "Orinda", "Oroville", "Oakley", "Pacifica", "Palo Alto", "Palmdale", "Palm Desert", "Palomar", "Palo Cedro", "Perris", "Petaluma", "Pico Rivera", "Pinole", "Pittsburg", "Placentia", "Pleasant Hill", "Pleasanton", "Pomona", "Port Hueneme", "Rancho Cordova", "Rancho Cucamonga", "Redlands", "Redondo Beach", "Redding", "Redwood City", "Reedley", "Rialto", "Richmond", "Riverside", "Rocklin", "Rosemead", "Sacramento", "Salinas", "San Bernardino", "San Bruno", "San Carlos", "San Diego", "San Francisco", "San Jose", "San Leandro", "San Luis Obispo", "San Marcos", "San Mateo", "Santa Ana", "Santa Barbara", "Santa Clara", "Santa Clarita", "Santa Cruz", "Santa Maria", "Santee", "Saratoga", "Seal Beach", "Solano Beach", "Solvang", "Sonoma", "South San Francisco", "Stockton", "Sunnyvale", "Susanville", "Temecula", "Thousand Oaks", "Torrance", "Tracy", "Turlock", "Twentynine Palms", "Union City", "Upland", "Vacaville", "Vallejo", "Victorville", "Vista", "Walnut Creek", "Watsonville", "West Covina", "West Sacramento", "Whittier", "Willits", "Yorba Linda", "Yuba City", "Yucaipa", "Yucaipa-Calimesa"]
    },
    {
        name: "Colorado",
        code: "CO",
        cities: ["Agate", "Akron", "Alamosa", "Alma", "Antonito", "Arvada", "Aspen", "Ault", "Aurora", "Avon", "Baca Grande", "Baker", "Bayfield", "Beacon", "Bellvue", "Berthoud", "Black Hawk", "Blanca", "Boulder", "Bow Mar", "Branson", "Breckenridge", "Broomfield", "Buena Vista", "Calhan", "Cañon City", "Canon City", "Carbondale", "Castle Rock", "Cedaredge", "Center", "Centennial", "Central City", "Cheyenne Wells", "Chipita Park", "Clifton", "Colorado Springs", "Columbine", "Columbine Valley", "Commerce City", "Conifer", "Conifer Park", "Cortez", "Costilla", "Craig", "Crescent Junction", "Crook", "Crowley", "Dacono", "De Beque", "Deer Trail", "Del Norte", "Delta", "Denver", "Dillon", "Dolores", "Dominguez Canyon", "Durango", "Eads", "Eaton", "Eldora", "Elizabeth", "Empire", "Englewood", "Erie", "Estes Park", "Evans", "Fairplay", "Federal Heights", "Firestone", "Fruita", "Fountain", "Fort Collins", "Fort Lupton", "Fort Morgan", "Fowler", "Fraser", "Frederick", "Fruita", "Galeton", "Garfield", "Georgetown", "Glenwood Springs", "Golden", "Granada", "Grand Junction", "Greeley", "Green Mountain Falls", "Greenwood Village", "Gunnison", "Gypsum", "Haxtun", "Hayden", "Henderson", "Highlands Ranch", "Hillrose", "Holyoke", "Hotchkiss", "Hudson", "Idaho Springs", "Ignacio", "Jefferson", "Johnstown", "Keensburg", "Keenesburg", "Kersey", "Kit Carson", "La Jara", "La Salle", "Lafayette", "Lakeside", "Lakewood", "Lamar", "Leadville", "Limon", "Littleton", "Livermore", "Lochbuie", "Log Lane Village", "Longmont", "Loveland", "Lyons", "Manitou Springs", "Mancos", "Manzanola", "Marble", "Mead", "Merino", "Milliken", "Minturn", "Montrose", "Monument", "Monte Vista", "Mountain View", "Naturita", "Nederland", "New Castle", "Northglenn", "Norwood", "Nunn", "Oak Creek", "Olathe", "Olney Springs", "Orchard City", "Ordway", "Ouray", "Pagosa Springs", "Parker", "Peyton", "Pierce", "Pine", "Pinewood Springs", "Poncha Springs", "Ponderosa Park", "Powderhorn", "Productora", "Rangely", "Raymer", "Red Cliff", "Redlands", "Ridgway", "Rifle", "Rockvale", "Rocky Ford", "Romeo", "Rosita", "Saguache", "Salida", "San Luis", "Sanford", "Seibert", "Severance", "Sheridan", "Silver Cliff", "Silver Plume", "Snowmass Village", "South Fork", "Springfield", "Steamboat Springs", "Sterling", "Stratmoor", "Stratton", "Superior", "Swink", "Telluride", "Thornton", "Timnath", "Twin Lakes", "Vail", "Vega", "Walden", "Walsenburg", "Ward", "Wellington", "Westcliffe", "Westminster", "Windsor", "Woodland Park", "Yampa"]
    },
    {
        name: "Connecticut",
        code: "CT",
        cities: ["Ansonia", "Arlington", "Avon", "Bantam", "Beacon Falls", "Bethany", "Bethel", "Bethlehem", "Bloomfield", "Bozrah", "Branford", "Bridgeport", "Bridgewater", "Bristol", "Brookfield", "Brooklyn", "Burton", "Canaan", "Canterbury", "Canton", "Chapel Hill", "Chaplin", "Cheshire", "Chester", "Clinton", "Colchester", "Columbia", "Cornwall", "Coventry", "Cromwell", "Danbury", "Darien", "Deep River", "Derby", "Durham", "East Granby", "East Hartford", "East Haven", "East Lyme", "East Windsor", "Eastford", "Easton", "Ellington", "Enfield", "Fairfield", "Farmington", "Franklin", "Glastonbury", "Goshen", "Granby", "Greenwich", "Griswold", "Groton", "Guilford", "Hartford", "Harwinton", "Hebron", "Kensington", "Kent", "Ledyard", "Lisbon", "Litchfield", "Lyme", "Madison", "Manchester", "Meriden", "Middlebury", "Middlefield", "Middletown", "Milford", "Monroe", "Montville", "Morris", "Naugatuck", "New Britain", "New Canaan", "New Fairfield", "New Hartford", "New Haven", "New London", "New Milford", "New Preston", "Newington", "Norfolk", "North Branford", "North Canaan", "North Haven", "North Stonington", "Norwalk", "Norwich", "Old Lyme", "Old Saybrook", "Oxford", "Pawcatuck", "Plainfield", "Plainville", "Plymouth", "Portland", "Preston", "Prospect", "Putnam", "Redding", "Ridgefield", "Rocky Hill", "Salem", "Salisbury", "Scotland", "Shelton", "Sherman", "Shoreline", "Simsbury", "Somers", "Southbury", "Southington", "Sprague", "Stamford", "Sterling", "Stonington", "Stratford", "Suffield", "Thomaston", "Thompson", "Tolland", "Torrington", "Trumbull", "Union", "Vernon", "Wallingford", "Waterbury", "Waterford", "Watertown", "West Hartford", "West Haven", "Westbrook", "Wethersfield", "Willington", "Wilton", "Windsor", "Windsor Locks", "Winchester", "Woodbridge", "Woodbury", "Wolcott", "Windsor"]
    },
    {
        name: "Delaware",
        code: "DE",
        cities: ["Arden", "Ardentown", "Bellefonte", "Bethany Beach", "Bethel", "Blades", "Bridgeville", "Brookside", "Camden", "Claymont", "Dagsboro", "Delmar", "Dover", "Elsmere", "Elkton", "Fenwick Island", "Frederica", "Georgetown", "Glasgow", "Harrington", "Hartly", "Henlopen Acres", "Hockessin", "Laurel", "Lewes", "Millsboro", "Milford", "Middletown", "Newark", "New Castle", "Ocean View", "Rehoboth Beach", "Seaford", "Selbyville", "Slaughter Beach", "Smyrna", "Sussex", "Townsend", "Wilmington", "Wyoming"]
    },
    {
        name: "Florida",
        code: "FL",
        cities: ["Alachua", "Altamonte Springs", "Apalachicola", "Arcadia", "Atlantic Beach", "Auburndale", "Bartow", "Belle Glade", "Bellview", "Boca Raton", "Boynton Beach", "Bradenton", "Brooksville", "Cape Coral", "Cocoa", "Cocoa Beach", "Coral Gables", "Coral Springs", "Crestview", "Daytona Beach", "Deerfield Beach", "Delray Beach", "Destin", "Doral", "Dunedin", "Eustis", "Fort Lauderdale", "Fort Myers", "Fort Pierce", "Fort Walton Beach", "Gainesville", "Green Cove Springs", "Haines City", "Hallandale Beach", "Hialeah", "Hollywood", "Homestead", "Jacksonville", "Kissimmee", "Key West", "Lake City", "Lakeland", "Largo", "Leesburg", "Longwood", "Lynn Haven", "Madison", "Margate", "Marianna", "Melbourne", "Miami", "Miami Beach", "Milton", "Mount Dora", "Naples", "New Port Richey", "North Miami", "North Miami Beach", "Ocala", "Ocoee", "Okeechobee", "Oldsmar", "Orlando", "Ormond Beach", "Oviedo", "Palatka", "Palm Bay", "Palm Beach Gardens", "Palm Coast", "Panama City", "Pensacola", "Plant City", "Plantation", "Pompano Beach", "Port Charlotte", "Port Orange", "Port St. Lucie", "Punta Gorda", "Sarasota", "Sebastian", "St. Augustine", "St. Cloud", "St. Petersburg", "Sanford", "Spring Hill", "Tallahassee", "Tamarac", "Tampa", "Tarpon Springs", "Vero Beach", "Wauchula", "West Palm Beach", "Winter Garden", "Winter Haven", "Winter Park", "Winter Springs"]
    },
    {
        name: "Georgia",
        code: "GA",
        cities: ["Acworth", "Adel", "Alpharetta", "Americus", "Athens", "Atlanta", "Augusta", "Austell", "Avondale Estates", "Bainbridge", "Baldwin", "Ball Ground", "Barnesville", "Belvedere Park", "Blairsville", "Blue Ridge", "Bogart", "Braselton", "Brunswick", "Buford", "Calhoun", "Camilla", "Cartersville", "Cedartown", "Chamblee", "Clarkesville", "Clarkston", "Cleveland", "College Park", "Columbus", "Conyers", "Covington", "Cumming", "Dacula", "Dahlonega", "Decatur", "Dublin", "East Point", "Eatonton", "Elberton", "Fairburn", "Fayetteville", "Flowery Branch", "Fort Valley", "Fulton", "Gainesville", "Grayson", "Hinesville", "Hiram", "Hinesville", "Jackson", "Jesup", "Jonesboro", "Kennesaw", "Kingsland", "LaGrange", "Lilburn", "Lithia Springs", "Lithonia", "Macon", "Milledgeville", "Monroe", "Morrow", "Norcross", "North Augusta", "Norwood", "Peachtree City", "Pelham", "Perry", "Pooler", "Powder Springs", "Rome", "Roswell", "Savannah", "Sandy Springs", "Senoia", "Statesboro", "Stone Mountain", "Suwanee", "Tallapoosa", "Tifton", "Toccoa", "Union City", "Valdosta", "Vidalia", "Warner Robins", "Winder", "Woodstock"
        ]
    },
    {
        name: "Hawaii",
        code: "HI",
        cities: ["Aiea", "Ewa Beach", "Haiku", "Haleiwa", "Hanalei", "Hanamaulu", "Hanapepe", "Hanawi", "Hana", "Hawi", "Hilo", "Honokaa", "Honolulu", "Ka‘a‘awa", "Kaaawa", "Kailua", "Kailua-Kona", "Kaneohe", "Kapaa", "Kapaau", "Kaupo", "Keaau", "Kealakekua", "Kekaha", "Kihei", "Kula", "Lahaina", "Lanai City", "Lawai", "Maalaea", "Makaha", "Makakilo", "Makawao", "Makiki", "Mililani", "Naalehu", "Nanakuli", "Pahoa", "Paia", "Pearl City", "Waianae", "Waialua", "Waialae", "Waialua", "Waianae", "Waikane", "Waikoloa", "Wailea", "Waimanalo", "Waimea", "Wailuku", "Wahiawa", "Wahiawa Heights", "Waipahu", "Waipio", "Waipio Acres", "Wailua", "Wailua Homesteads", "Waimea Town"
        ]
    },
    {
        name: "Idaho",
        code: "ID",
        cities: ["Aberdeen", "American Falls", "Ammon", "Arco", "Ashton", "Athol", "Burley", "Buhl", "Caldwell", "Cambridge", "Challis", "Coeur d'Alene", "Cottonwood", "Council", "Dalton Gardens", "Driggs", "Emmett", "Filer", "Firth", "Fruitland", "Garden City", "Garden Valley", "Glenns Ferry", "Grangeville", "Hailey", "Hagerman", "Hayden", "Hayden Lake", "Homedale", "Idaho City", "Idaho Falls", "Inkom", "Iona", "Jerome", "Kellogg", "King Hill", "Kuna", "Lapwai", "Lewiston", "Lindon", "Moscow", "Mullan", "Murray", "Meridian", "Mountain Home", "New Meadows", "Nampa", "Orofino", "Parma", "Payette", "Pocatello", "Post Falls", "Rathdrum", "Rigby", "Riggins", "Sandpoint", "Shoshone", "Smelterville", "Spirit Lake", "St. Anthony", "Soda Springs", "Stanley", "Sugar City", "Troy", "Twin Falls", "Victor", "Wallace", "Weiser", "Wendell", "Weston", "Idaho City"
        ]
    },
    {
        name: "Illinois",
        code: "IL",
        cities: ["Addison", "Algonquin", "Alton", "Arlington Heights", "Aurora", "Bartonville", "Belleville", "Belvidere", "Berwyn", "Bloomington", "Blue Island", "Bolingbrook", "Buffalo Grove", "Calumet City", "Carbondale", "Carol Stream", "Champaign", "Chicago", "Chicago Heights", "Chicago Ridge", "Cicero", "Crystal Lake", "Decatur", "DeKalb", "Des Plaines", "Dolton", "East Dundee", "Elgin", "Elmhurst", "Elmwood Park", "Evanston", "Evergreen Park", "Fairview Heights", "Flossmoor", "Forest Park", "Forest View", "Frankfort", "Galesburg", "Glendale Heights", "Glenview", "Granite City", "Harvey", "Highland Park", "Hoffman Estates", "Hometown", "Homewood", "Huntley", "Joliet", "La Grange", "La Grange Park", "Lake Forest", "Lake in the Hills", "Lake Zurich", "Lansing", "Lemont", "Libertyville", "Lincoln", "Lisle", "Lockport", "Lombard", "Macomb", "Mahomet", "Mokena", "Montgomery", "Morton", "Mount Prospect", "Naperville", "Niles", "Normal", "Oak Brook", "Oak Park", "Orland Park", "Oswego", "Ottawa", "Palatine", "Park Ridge", "Peoria", "Peru", "Quincy", "Rolling Meadows", "Rock Island", "Rockford", "Romeoville", "Saint Charles", "Schaumburg", "Skokie", "Springfield", "Streamwood", "Tinley Park", "Urbana", "Waukegan", "West Chicago", "Westmont", "Wheaton", "Wheeling", "Wilmette", "Wood Dale", "Woodridge", "Waukegan"
        ]
    },
    {
        name: "Indiana",
        code: "IN",
        cities: ["Anderson", "Angola", "Avon", "Bedford", "Beech Grove", "Beverly Shores", "Bloomington", "Brazil", "Carmel", "Chesterton", "Columbus", "Connersville", "Crawfordsville", "Crown Point", "Cumberland", "Decatur", "Dyer", "East Chicago", "Elkhart", "Evansville", "Fishers", "Fort Wayne", "Frankfort", "Franklin", "Gary", "Georgetown", "Greenfield", "Greencastle", "Greensburg", "Griffith", "Hammond", "Hobart", "Indianapolis", "Jeffersonville", "Kokomo", "La Porte", "Lafayette", "Lawrence", "Lebanon", "Logansport", "Marion", "Michigan City", "Mishawaka", "Monon", "Monticello", "Munster", "Nappanee", "New Albany", "New Castle", "Noblesville", "North Vernon", "Portage", "Richmond", "Schererville", "Shelbyville", "South Bend", "Sullivan", "Terre Haute", "Valparaiso", "Warsaw", "Westfield", "Whiting", "Winamac", "Zionsville"
        ]
    },
    {
        name: "Iowa",
        code: "IA",
        cities: ["Adel", "Ames", "Ankeny", "Atlantic", "Bettendorf", "Burlington", "Cedar Falls", "Cedar Rapids", "Clinton", "Clive", "Council Bluffs", "Coralville", "Creston", "Davenport", "Decorah", "Des Moines", "Dubuque", "Eldridge", "Emmetsburg", "Fort Dodge", "Glenwood", "Grimes", "Hiawatha", "Indianola", "Iowa City", "Jefferson", "Marshalltown", "Mason City", "Muscatine", "Newton", "North Liberty", "Ottumwa", "Pella", "Sioux City", "Urbandale", "Vinton", "Waterloo", "West Des Moines", "West Liberty", "Waverly", "Webster City", "West Burlington", "Clive", "Dyersville"
        ]
    },
    {
        name: "Kansas",
        code: "KS",
        cities: ["Abilene", "Arkansas City", "Atchison", "Augusta", "Baldwin City", "Basehor", "Bel Aire", "Beloit", "Bonner Springs", "Coffeyville", "Colby", "Concordia", "Derby", "Dodge City", "Emporia", "Fort Scott", "Garden City", "Great Bend", "Hays", "Hutchinson", "Independence", "Junction City", "Kansas City", "Lansing", "Leavenworth", "Lenexa", "LeRoy", "Liberty", "Manhattan", "McPherson", "Mulvane", "Newton", "Olathe", "Overland Park", "Paola", "Parsons", "Pittsburg", "Prairie Village", "Shawnee", "Shawnee Mission", "Topeka", "Tyler", "Valley Center", "Wichita", "Winfield"
        ]
    },
    {
        name: "Kentucky",
        code: "KY",
        cities: ["Ashland", "Barbourville", "Bardstown", "Bowling Green", "Campbellsville", "Covington", "Cynthiana", "Danville", "Elizabethtown", "Falmouth", "Florence", "Fort Thomas", "Frankfort", "Georgetown", "Hazard", "Hopkinsville", "La Grange", "Lexington", "London", "Louisville", "Madisonville", "Maysville", "Morehead", "Mount Sterling", "Murray", "Nicholasville", "Owensboro", "Paducah", "Paris", "Pikeville", "Radcliff", "Richmond", "Russellville", "Shelbyville", "Somerset", "St. Matthews", "Versailles", "Winchester"]
    },
    {
        name: "Louisiana",
        code: "LA",
        cities: ["Abbeville", "Alexandria", "Baker", "Bastrop", "Baton Rouge", "Bogalusa", "Bossier City", "Breaux Bridge", "Brookhaven", "Cameron", "Carencro", "Central", "Chalmette", "Crowley", "Denham Springs", "Donaldsonville", "Duson", "Eunice", "Gretna", "Hammond", "Harahan", "Haughton", "Homer", "Houma", "Jennings", "Kenner", "Lafayette", "Lake Charles", "Luling", "Mandeville", "Monroe", "Morgan City", "New Iberia", "New Orleans", "Opelousas", "Pineville", "Ponchatoula", "Ruston", "Shreveport", "Slidell", "Sulphur", "West Monroe", "Winnfield"]
    },
    {
        name: "Maine",
        code: "ME",
        cities: ["Augusta", "Bangor", "Bath", "Biddeford", "Brunswick", "Calais", "Caribou", "Dexter", "Ellsworth", "Farmington", "Fort Kent", "Gardiner", "Houlton", "Kittery", "Lewiston", "Lincoln", "Lisbon", "Machias", "Old Town", "Orono", "Portland", "Presque Isle", "Rockland", "Saco", "Sanford", "South Portland", "Topsham", "Waterville", "Westbrook", "Windham", "York"]
    },
    {
        name: "Maryland",
        code: "MD",
        cities: ["Aberdeen", "Annapolis", "Arbutus", "Baltimore", "Bel Air", "Bowie", "Brentwood", "Brooklyn Park", "Calvert City", "Cambridge", "Catonsville", "Cockeysville", "Columbia", "Crofton", "Ellicott City", "Frederick", "Gaithersburg", "Germantown", "Greenbelt", "Hagerstown", "Havre de Grace", "Hyattsville", "La Plata", "Lanham", "Laurel", "Middletown", "Milford Mill", "Mitchellville", "Montgomery Village", "North Bethesda", "Owings Mills", "Pikesville", "Rockville", "Salisbury", "Silver Spring", "Towson", "Waldorf", "Westminster", "White Marsh", "Wicomico", "Wheaton", "Woodsboro"]
    },
    {
        name: "Massachusetts",
        code: "MA",
        cities: ["Acton", "Arlington", "Athol", "Attleboro", "Auburn", "Barnstable", "Beverly", "Boston", "Brockton", "Brookline", "Cambridge", "Chelmsford", "Chelsea", "Chicopee", "Danvers", "Everett", "Fall River", "Fitchburg", "Framingham", "Gardner", "Gloucester", "Haverhill", "Holyoke", "Lawrence", "Leominster", "Longmeadow", "Lowell", "Lynn", "Malden", "Medford", "Melrose", "Methuen", "Milford", "Milton", "Natick", "Newton", "North Adams", "Northampton", "Norwood", "Pittsfield", "Quincy", "Revere", "Salem", "Saugus", "Somerville", "Springfield", "Taunton", "Waltham", "Watertown", "Westfield", "West Springfield", "Weston", "Weymouth", "Whitman", "Winchester", "Woburn", "Worcester"]
    },
    {
        name: "Michigan",
        code: "MI",
        cities: ["Adrian", "Albion", "Alpena", "Ann Arbor", "Auburn Hills", "Battle Creek", "Bay City", "Benton Harbor", "Bloomfield Hills", "Cadillac", "Calumet", "Clawson", "Clinton Township", "Coldwater", "Dearborn", "Dearborn Heights", "Detroit", "Dowagiac", "East Lansing", "Ecorse", "Escanaba", "Farmington", "Farmington Hills", "Flint", "Frankenmuth", "Fraser", "Grand Blanc", "Grand Haven", "Grand Rapids", "Grandville", "Grosse Pointe", "Grosse Pointe Farms", "Grosse Pointe Park", "Grosse Pointe Woods", "Hampton Township", "Hamtramck", "Harrison Township", "Highland Park", "Holland", "Howell", "Inkster", "Jackson", "Lansing", "Lathrup Village", "Lincoln Park", "Livonia", "Madison Heights", "Midland", "Monroe", "Mount Clemens", "Muskegon", "Novi", "Oak Park", "Okemos", "Port Huron", "Portage", "Rochester", "Rochester Hills", "Romulus", "Roseville", "Royal Oak", "Saginaw", "Saint Clair Shores", "Saline", "Southfield", "Southgate", "Sterling Heights", "Taylor", "Troy", "Trenton", "Utica", "Warren", "Wayne", "West Bloomfield", "Westland", "Wyandotte", "Ypsilanti"]
    },
    {
        name: "Minnesota",
        code: "MN",
        cities: ["Ada", "Albert Lea", "Alexandria", "Anoka", "Apple Valley", "Austin", "Baxter", "Bemidji", "Bloomington", "Brainerd", "Brooklyn Center", "Brooklyn Park", "Buffalo", "Burnsville", "Cottage Grove", "Crookston", "Crystal", "Detroit Lakes", "Duluth", "Eagan", "Edina", "Elk River", "Ely", "Faribault", "Farmington", "Fergus Falls", "Forest Lake", "Fridley", "Grand Rapids", "Hastings", "Hopkins", "International Falls", "Inver Grove Heights", "Isanti", "Lanesboro", "Little Falls", "Mankato", "Maple Grove", "Maplewood", "Marshall", "Minneapolis", "Minnetonka", "Monticello", "Moorhead", "New Brighton", "New Ulm", "Northfield", "Norwood Young America", "Owatonna", "Pine City", "Red Wing", "Richfield", "Rochester", "Roseville", "Saint Cloud", "Saint Louis Park", "Saint Paul", "Savage", "Shakopee", "South Saint Paul", "Stillwater", "Thief River Falls", "Vadnais Heights", "Virginia", "Waite Park", "West St. Paul", "White Bear Lake", "Willmar", "Winona", "Woodbury"]
    },
    {
        name: "Mississippi",
        code: "MS",
        cities: ["Aberdeen", "Biloxi", "Brookhaven", "Clarksdale", "Clinton", "Columbus", "Corinth", "Crystal Springs", "Greenville", "Gulfport", "Hattiesburg", "Horn Lake", "Jackson", "Laurel", "Meridian", "Natchez", "Ocean Springs", "Oxford", "Pascagoula", "Pearl", "Philadelphia", "Picayune", "Richland", "Ridgeland", "Southaven", "Starkville", "Tupelo", "Vicksburg", "West Point", "Yazoo City"]
    },
    {
        name: "Missouri",
        code: "MO",
        cities: ["Arnold", "Belton", "Blue Springs", "Branson", "Cape Girardeau", "Chesterfield", "Columbia", "Florissant", "Independence", "Jefferson City", "Joplin", "Kansas City", "Kirksville", "Lee's Summit", "Liberty", "Maryland Heights", "O'Fallon", "St. Charles", "St. Joseph", "St. Louis", "St. Peters", "Springfield", "St. Ann", "St. Louis County", "St. Robert", "University City", "Warrensburg", "Webster Groves", "Wildwood", "Wentzville"]
    },
    {
        name: "Montana",
        code: "MT",
        cities: ["Billings", "Bozeman", "Butte", "Columbia Falls", "Great Falls", "Helena", "Kalispell", "Livingston", "Miles City", "Missoula", "Polson", "Whitefish", "Havre", "Glendive", "Lewistown", "Cut Bank", "Hardin", "Roundup", "Scobey", "Sidney"]
    },
    {
        name: "Nebraska",
        code: "NE",
        cities: ["Alliance", "Auburn", "Beatrice", "Bellevue", "Blair", "Columbus", "Elkhorn", "Fremont", "Grand Island", "Kearney", "Lincoln", "McCook", "Milford", "Norfolk", "North Platte", "Omaha", "Plattsmouth", "Scottsbluff", "South Sioux City", "Seward", "Valley", "York"]
    },
    {
        name: "Nevada",
        code: "NV",
        cities: ["Carson City", "Elko", "Ely", "Enterprise", "Fallon", "Henderson", "Las Vegas", "Laughlin", "Mesquite", "North Las Vegas", "Pahrump", "Reno", "Sparks", "West Wendover", "Winnemucca"]
    },
    {
        name: "New Hampshire",
        code: "NH",
        cities: ["Concord", "Derry", "Dover", "Exeter", "Franklin", "Keene", "Laconia", "Manchester", "Nashua", "Portsmouth", "Rochester", "Salem", "Somersworth", "Tilton", "Wolfeboro"]
    },
    {
        name: "New Jersey",
        code: "NJ",
        cities: ["Bayonne", "Camden", "Cherry Hill", "East Orange", "Elizabeth", "Edison", "Hoboken", "Jersey City", "Lakewood", "Newark", "New Brunswick", "Paterson", "Passaic", "Plainfield", "Trenton", "Union City", "Vineland", "Woodbridge"]
    },
    {
        name: "New Mexico",
        code: "NM",
        cities: ["Albuquerque", "Carlsbad", "Clovis", "Farmington", "Gallup", "Hobbs", "Las Cruces", "Los Alamos", "Rio Rancho", "Roswell", "Santa Fe", "Silver City", "Taos"]
    },
    {
        name: "New York",
        code: "NY",
        cities: ["Albany", "Binghamton", "Buffalo", "Cheektowaga", "Colonie", "Corning", "Glens Falls", "Ithaca", "New York City", "Niagara Falls", "Poughkeepsie", "Rochester", "Schenectady", "Syracuse", "Troy", "Utica", "White Plains", "Yonkers", "Hempstead", "Brooklyn", "Queens", "Bronx", "Staten Island", "Manhattan"]
    },
    {
        name: "North Carolina",
        code: "NC",
        cities: ["Asheville", "Burlington", "Cary", "Charlotte", "Concord", "Durham", "Fayetteville", "Gastonia", "Greensboro", "Greenville", "Hickory", "High Point", "Jacksonville", "Raleigh", "Rocky Mount", "Wilmington", "Wilson", "Winston-Salem"]
    },
    {
        name: "North Dakota",
        code: "ND",
        cities: ["Bismarck", "Fargo", "Grand Forks", "Minot", "West Fargo", "Mandan", "Jamestown", "Dickinson", "Williston", "Valley City", "Devils Lake"]
    },
    {
        name: "Ohio",
        code: "OH",
        cities: ["Akron", "Canton", "Cincinnati", "Cleveland", "Columbus", "Dayton", "Elyria", "Euclid", "Fairfield", "Hamilton", "Kettering", "Lorain", "Mansfield", "Marion", "Middletown", "Newark", "Parma", "Springfield", "Toledo", "Youngstown", "Westerville"]
    },
    {
        name: "Oklahoma",
        code: "OK",
        cities: ["Broken Arrow", "Edmond", "Enid", "Midwest City", "Moore", "Norman", "Oklahoma City", "Stillwater", "Tulsa", "Lawton", "Bartlesville", "Muskogee"]
    },
    {
        name: "Oregon",
        code: "OR",
        cities: ["Beaverton", "Bend", "Eugene", "Gresham", "Hillsboro", "Keizer", "Medford", "Milwaukie", "Portland", "Salem", "Springfield", "Tigard", "Corvallis", "Albany"]
    },
    {
        name: "Pennsylvania",
        code: "PA",
        cities: ["Allentown", "Bethlehem", "Erie", "Harrisburg", "Lancaster", "Philadelphia", "Pittsburgh", "Reading", "Scranton", "State College", "Wilkes-Barre", "York"]
    },
    {
        name: "Rhode Island",
        code: "RI",
        cities: ["Bristol", "Coventry", "Cranston", "Cumberland", "East Providence", "Hopkinton", "Johnston", "Middletown", "Narragansett", "Newport", "North Kingstown", "Pawtucket", "Portsmouth", "Providence", "Richmond", "Smithfield", "Warwick", "West Warwick", "Woonsocket"]
    },
    {
        name: "South Carolina",
        code: "SC",
        cities: ["Anderson", "Aiken", "Beaufort", "Bluffton", "Charleston", "Columbia", "Conway", "Florence", "Fort Mill", "Greenville", "Hilton Head Island", "Mauldin", "Mount Pleasant", "Myrtle Beach", "North Charleston", "Rock Hill", "Spartanburg", "Sumter", "Summerville", "Walterboro"]
    },
    {
        name: "South Dakota",
        code: "SD",
        cities: ["Aberdeen", "Brookings", "Huron", "Mitchell", "Pierre", "Rapid City", "Sioux Falls", "Spearfish", "Watertown", "Yankton"]
    },
    {
        name: "Tennessee",
        code: "TN",
        cities: ["Chattanooga", "Clarksville", "Columbia", "Cookeville", "Franklin", "Jackson", "Johnson City", "Kingsport", "Knoxville", "Lebanon", "Murfreesboro", "Nashville", "Memphis", "Sevierville", "Smyrna", "Tullahoma"]
    },
    {
        name: "Texas",
        code: "TX",
        cities: ["Abilene", "Amarillo", "Arlington", "Austin", "Beaumont", "Brownsville", "Carrollton", "College Station", "Corpus Christi", "Dallas", "Denton", "El Paso", "Fort Worth", "Frisco", "Garland", "Grand Prairie", "Houston", "Irving", "Killeen", "Laredo", "Lewisville", "McAllen", "Mesquite", "Midland", "Odessa", "Plano", "Richardson", "San Angelo", "San Antonio", "Sugar Land", "Temple", "Tyler", "Waco", "Waxahachie", "Plano"]
    },
    {
        name: "Utah",
        code: "UT",
        cities: ["Brigham City", "Centerville", "Clearfield", "Layton", "Logan", "Murray", "Orem", "Ogden", "Provo", "Saint George", "Salt Lake City", "Sandy", "South Jordan", "Taylorsville", "West Jordan", "West Valley City"]
    },
    {
        name: "Vermont",
        code: "VT",
        cities: ["Barre", "Burlington", "Essex Junction", "Middlebury", "Montpelier", "Rutland", "Saint Albans", "South Burlington", "Vergennes", "Winooski"]
    },
    {
        name: "Virginia",
        code: "VA",
        cities: ["Alexandria", "Arlington", "Chesapeake", "Fairfax", "Falls Church", "Hampton", "Herndon", "Lynchburg", "Newport News", "Norfolk", "Portsmouth", "Richmond", "Roanoke", "Virginia Beach", "Williamsburg"]
    },
    {
        name: "Washington",
        code: "WA",
        cities: ["Bellevue", "Everett", "Kent", "Kirkland", "Olympia", "Redmond", "Renton", "Seattle", "Shoreline", "Spokane", "Tacoma", "Vancouver", "Yakima"]
    },
    {
        name: "West Virginia",
        code: "WV",
        cities: ["Beckley", "Charleston", "Clarksburg", "Huntington", "Martinsburg", "Morgantown", "Parkersburg", "Weirton", "Wheeling"]
    },
    {
        name: "Wisconsin",
        code: "WI",
        cities: ["Appleton", "Eau Claire", "Fond du Lac", "Green Bay", "Janesville", "Kenosha", "La Crosse", "Madison", "Milwaukee", "Oshkosh", "Racine", "Sheboygan", "Waukesha", "Wausau"]
    },
    {
        name: "Wyoming",
        code: "WY",
        cities: ["Casper", "Cheyenne", "Cody", "Evanston", "Gillette", "Laramie", "Lander", "Rawlins", "Rock Springs", "Sheridan", "Powell", "Green River"]
    }
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
            const existingCities = await City.find({ state: state._id }).select("name").lean();
            const existingCityNames = new Set(existingCities.map(c => c.name));

            const citiesToInsert = [];
            for (const cityName of stateItem.cities) {
                if (!cityName || existingCityNames.has(cityName)) continue;

                citiesToInsert.push({
                    name: cityName,
                    state: state._id,
                    country: usCountry._id,
                    isActive: true
                });
            }

            if (citiesToInsert.length > 0) {
                const batchSize = 100;
                for (let i = 0; i < citiesToInsert.length; i += batchSize) {
                    const batch = citiesToInsert.slice(i, i + batchSize);
                    await City.insertMany(batch);
                    console.log(`  Added ${batch.length} cities to ${stateItem.name} (Batch ${i / batchSize + 1})`);
                }
            } else {
                console.log(`  No new cities to add for ${stateItem.name}`);
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
