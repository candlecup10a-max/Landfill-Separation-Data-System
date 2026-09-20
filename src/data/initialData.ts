import { CategoryDefinition, CategoryId, WasteItem, ItemImage } from '../types';

export const CATEGORIES_CONFIG: CategoryDefinition[] = [
  {
    id: 'plastic',
    name: 'Plastic Materials',
    shortName: 'Plastics',
    fileName: 'plastic.json',
    fileType: 'json',
    chuteNumber: 1,
    iconName: 'Boxes',
    color: {
      primary: '#10b981',
      badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      bg: 'bg-emerald-950/20',
      border: 'border-emerald-800/40',
      glow: 'shadow-emerald-500/20',
      accent: 'text-emerald-400',
      text: 'text-emerald-300',
    },
    description: 'Polymers, thermoplastics & resin types (PET, HDPE, PVC, LDPE, PP, PS, ABS).',
    materialsList: [
      'PET / PETE (#1)',
      'HDPE (#2)',
      'PVC / Vinyl (#3)',
      'LDPE (#4)',
      'PP Polypropylene (#5)',
      'PS Polystyrene (#6)',
      'ABS / Polycarbonate (Other #7)',
      'PLA Bioplastic',
      'Polyurethane',
    ],
  },
  {
    id: 'iron_aluminum',
    name: 'Iron & Aluminum Products',
    shortName: 'Metals',
    fileName: 'iron-aluminium.csv',
    fileType: 'csv',
    chuteNumber: 2,
    iconName: 'Wrench',
    color: {
      primary: '#f59e0b',
      badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      bg: 'bg-amber-950/20',
      border: 'border-amber-800/40',
      glow: 'shadow-amber-500/20',
      accent: 'text-amber-400',
      text: 'text-amber-300',
    },
    description: 'Ferrous iron goods & non-ferrous aluminum cans, profiles, sheets, and hardware.',
    materialsList: [
      'Cast Iron',
      'Wrought Iron',
      'Structural Steel / Iron',
      'Aluminum 6061',
      'Aluminum Foil / Cans',
      'Extruded Aluminum Profile',
      'Galvanized Iron',
      'Die-cast Aluminum Alloy',
    ],
  },
  {
    id: 'glass',
    name: 'Glass Materials',
    shortName: 'Glass',
    fileName: 'glass.csv',
    fileType: 'csv',
    chuteNumber: 3,
    iconName: 'Wine',
    color: {
      primary: '#06b6d4',
      badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      bg: 'bg-cyan-950/20',
      border: 'border-cyan-800/40',
      glow: 'shadow-cyan-500/20',
      accent: 'text-cyan-400',
      text: 'text-cyan-300',
    },
    description: 'Silica, borosilicate, soda-lime containers, laboratory ware, flat & optical glass.',
    materialsList: [
      'Soda-Lime Glass (Clear/Flint)',
      'Amber / Green Container Glass',
      'Borosilicate Glass (Heat Resistant)',
      'Tempered Glass',
      'Laminated Safety Glass',
      'Optical Glass / Quartz',
      'Fiberglass / Glass Wool',
    ],
  },
  {
    id: 'paper_cardboard',
    name: 'Paper / Cardboard & Wood',
    shortName: 'Paper & Wood',
    fileName: 'wood.csv',
    fileType: 'csv',
    chuteNumber: 4,
    iconName: 'Package',
    color: {
      primary: '#eab308',
      badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
      bg: 'bg-yellow-950/20',
      border: 'border-yellow-800/40',
      glow: 'shadow-yellow-500/20',
      accent: 'text-yellow-400',
      text: 'text-yellow-300',
    },
    description: 'Cellulose fibers, corrugated boxes, pulp packaging, hardwoods, softwoods & timber.',
    materialsList: [
      'Corrugated Cardboard',
      'Kraft Paper / Wood Pulp Paper',
      'Solid Cardboard / Grayboard',
      'Softwood (Pine, Fir, Spruce)',
      'Hardwood (Oak, Beech, Maple, Walnut)',
      'Plywood & Composite MDF',
      'Bamboo & Reed',
    ],
  },
  {
    id: 'textile',
    name: 'Textile Materials',
    shortName: 'Textiles',
    fileName: 'textile.csv',
    fileType: 'csv',
    chuteNumber: 5,
    iconName: 'Shirt',
    color: {
      primary: '#8b5cf6',
      badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      bg: 'bg-purple-950/20',
      border: 'border-purple-800/40',
      glow: 'shadow-purple-500/20',
      accent: 'text-purple-400',
      text: 'text-purple-300',
    },
    description: 'Woven & non-woven fabrics, apparel, industrial tarps, natural & synthetic fibers.',
    materialsList: [
      '100% Cotton Fabric',
      'Denim Cotton Blend',
      'Polyester Synthetic Fiber',
      'Nylon / Polyamide',
      'Wool & Animal Fibers',
      'Linen / Hemp Fabric',
      'Non-woven Polypropylene (Medical)',
      'Spandex / Lycra',
    ],
  },
  {
    id: 'general_waste',
    name: 'General Waste (Unclassified / Refuse)',
    shortName: 'General Waste',
    fileName: 'empty',
    fileType: 'empty',
    chuteNumber: 6,
    iconName: 'Trash2',
    color: {
      primary: '#94a3b8',
      badge: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
      bg: 'bg-slate-900/40',
      border: 'border-slate-700/50',
      glow: 'shadow-slate-500/10',
      accent: 'text-slate-300',
      text: 'text-slate-300',
    },
    description: 'Composite packaging, unidentifiable items, hazardous or non-recyclable landfill refuse.',
    materialsList: [
      'Mixed Multi-layer Composite',
      'Contaminated Waste',
      'Hazardous Material',
      'Rubber / Ceramic Hybrid',
      'Sanitary & Medical Refuse',
      'Unidentified Unknown Object',
    ],
  },
];

// Raw Text Datasets Provided by User
export const RAW_PLASTIC_JSON = `{
  "plastic_classification_system": {
    "version": "1.0",
    "standards_aligned": ["ISO 1043", "ASTM D7611", "OECD Plastics Outlook", "UNEP"],
    "resin_identification_codes": [
      {
        "code": 1,
        "abbreviation": "PET / PETE",
        "full_name": "Polyethylene Terephthalate",
        "recyclability": "High",
        "common_uses": ["Water/Soda bottles", "Food jars", "Polyester clothing fibers", "Thermoform trays"]
      },
      {
        "code": 2,
        "abbreviation": "HDPE",
        "full_name": "High-Density Polyethylene",
        "recyclability": "High",
        "common_uses": ["Milk jugs", "Detergent bottles", "Shampoo bottles", "Water pipes", "Grocery bags"]
      },
      {
        "code": 3,
        "abbreviation": "PVC / V",
        "full_name": "Polyvinyl Chloride",
        "recyclability": "Low",
        "common_uses": ["Plumbing pipes", "Window frames", "Siding", "Blood bags", "Wire insulation", "Vinyl flooring"]
      },
      {
        "code": 4,
        "abbreviation": "LDPE",
        "full_name": "Low-Density Polyethylene",
        "recyclability": "Moderate",
        "common_uses": ["Squeeze bottles", "Bread bags", "Frozen food packaging", "Agricultural film", "Bubble wrap"]
      },
      {
        "code": 5,
        "abbreviation": "PP",
        "full_name": "Polypropylene",
        "recyclability": "Moderate",
        "common_uses": ["Yogurt tubs", "Medicine bottles", "Bottle caps", "Automotive parts", "Straws", "Thermal underwear"]
      },
      {
        "code": 6,
        "abbreviation": "PS / EPS",
        "full_name": "Polystyrene / Expanded Polystyrene",
        "recyclability": "Low",
        "common_uses": ["Disposable cups/plates", "Styrofoam packaging", "CD cases", "Egg cartons", "Building insulation"]
      },
      {
        "code": 7,
        "abbreviation": "OTHER",
        "full_name": "Other Plastics (Polycarbonate, ABS, Nylon, PLA, Multi-layer)",
        "recyclability": "Low to Very Low",
        "common_uses": ["Eyeglasses", "Electronics housings", "3D printing filament (PLA)", "Baby bottles", "Multi-layer food pouches"]
      }
    ],
    "market_sectors": [
      {
        "sector_id": "SEC_01",
        "sector_name": "Rigid Packaging",
        "subcategories": [
          {
            "category_id": "PKG_RIG_01",
            "category_name": "Beverage Containers",
            "item_examples": ["Water bottles", "Carbonated soft drink bottles", "Milk jugs", "Juice cartons (plastic-lined)"]
          },
          {
            "category_id": "PKG_RIG_02",
            "category_name": "Food Containers & Tubs",
            "item_examples": ["Yogurt tubs", "Margarine tubs", "Clamshell food boxes", "Deli containers", "Trays"]
          },
          {
            "category_id": "PKG_RIG_03",
            "category_name": "Household & Personal Care Bottles",
            "item_examples": ["Shampoo bottles", "Liquid soap dispensers", "Detergent jugs", "Cleaning spray bottles"]
          },
          {
            "category_id": "PKG_RIG_04",
            "category_name": "Caps, Closures & Fitments",
            "item_examples": ["Screw caps", "Flip-top lids", "Pump dispensers", "Trigger sprayers"]
          },
          {
            "category_id": "PKG_RIG_05",
            "category_name": "Industrial Packaging (Rigid)",
            "item_examples": ["Drums", "Pails & Buckets", "Intermediate Bulk Containers (IBCs)", "Crates"]
          }
        ]
      },
      {
        "sector_id": "SEC_02",
        "sector_name": "Flexible Packaging",
        "subcategories": [
          {
            "category_id": "PKG_FLX_01",
            "category_name": "Bags & Sacks",
            "item_examples": ["Single-use shopping bags", "Trash/Garbage bags", "Produce bags", "Ziplock bags"]
          },
          {
            "category_id": "PKG_FLX_02",
            "category_name": "Films & Wraps",
            "item_examples": ["Cling film/Plastic wrap", "Shrink wrap", "Stretch film/Pallet wrap", "Bubble wrap"]
          },
          {
            "category_id": "PKG_FLX_03",
            "category_name": "Pouches & Sachets",
            "item_examples": ["Stand-up pouches", "Retort pouches", "Snack/Chip bags", "Condiment sachets"]
          }
        ]
      },
      {
        "sector_id": "SEC_03",
        "sector_name": "Building & Construction",
        "subcategories": [
          {
            "category_id": "CON_01",
            "category_name": "Pipes & Fittings",
            "item_examples": ["PVC drainage pipes", "HDPE water supply pipes", "Conduit pipes", "PEX heating pipes"]
          },
          {
            "category_id": "CON_02",
            "category_name": "Profiles & Structures",
            "item_examples": ["Window frames", "Vinyl siding", "Plastic decking", "Door frames"]
          },
          {
            "category_id": "CON_03",
            "category_name": "Insulation & Membranes",
            "item_examples": ["EPS foam boards", "XPS insulation", "Vapor barriers", "Roofing membranes"]
          }
        ]
      },
      {
        "sector_id": "SEC_04",
        "sector_name": "Automotive & Transportation",
        "subcategories": [
          {
            "category_id": "AUT_01",
            "category_name": "Exterior Components",
            "item_examples": ["Bumpers", "Headlight lenses", "Grilles", "Side mirrors", "Trim panels"]
          },
          {
            "category_id": "AUT_02",
            "category_name": "Interior Components",
            "item_examples": ["Dashboards", "Door panels", "Seat foam (Polyurethane)", "Center consoles"]
          },
          {
            "category_id": "AUT_03",
            "category_name": "Under-the-Hood & Fluid Systems",
            "item_examples": ["Fuel tanks", "Engine covers", "Air intake manifolds", "Fluid reservoirs"]
          }
        ]
      },
      {
        "sector_id": "SEC_05",
        "sector_name": "Electrical & Electronics (E&E)",
        "subcategories": [
          {
            "category_id": "ELE_01",
            "category_name": "Device Housings & Enclosures",
            "item_examples": ["TV casings", "Laptop/Computer cases", "Smartphone bodies", "Router boxes"]
          },
          {
            "category_id": "ELE_02",
            "category_name": "Wiring & Insulation",
            "item_examples": ["Cable jacketing", "Wire insulation", "Connectors", "Switch plates"]
          },
          {
            "category_id": "ELE_03",
            "category_name": "Home Appliances",
            "item_examples": ["Refrigerator liners", "Washing machine tubs", "Vacuum cleaner bodies", "Coffee maker parts"]
          }
        ]
      },
      {
        "sector_id": "SEC_06",
        "sector_name": "Textiles, Clothing & Fibers",
        "subcategories": [
          {
            "category_id": "TEX_01",
            "category_name": "Apparel & Garments",
            "item_examples": ["Polyester shirts", "Nylon jackets", "Spandex activewear", "Fleece outerwear"]
          },
          {
            "category_id": "TEX_02",
            "category_name": "Household Textiles",
            "item_examples": ["Synthetic carpets", "Curtains", "Upholstery fabric", "Bedding fibers"]
          },
          {
            "category_id": "TEX_03",
            "category_name": "Technical & Industrial Textiles",
            "item_examples": ["Ropes & Cordage", "Tarpaulins", "Non-woven wipes", "Geotextiles"]
          }
        ]
      },
      {
        "sector_id": "SEC_07",
        "sector_name": "Medical & Healthcare",
        "subcategories": [
          {
            "category_id": "MED_01",
            "category_name": "Disposables & Consumables",
            "item_examples": ["Syringes", "IV tubing & bags", "Blood bags", "Catheters", "Petri dishes"]
          },
          {
            "category_id": "MED_02",
            "category_name": "Personal Protective Equipment (PPE)",
            "item_examples": ["Surgical masks (polypropylene)", "Nitrile/Vinyl gloves", "Gowns", "Face shields"]
          },
          {
            "category_id": "MED_03",
            "category_name": "Medical Devices & Packaging",
            "item_examples": ["Blister packs for pills", "Inhalers", "Diagnostic kit housings", "Prosthetics"]
          }
        ]
      },
      {
        "sector_id": "SEC_08",
        "sector_name": "Consumer Goods & Housewares",
        "subcategories": [
          {
            "category_id": "CON_G_01",
            "category_name": "Kitchenware & Tableware",
            "item_examples": ["Food storage containers", "Plastic cutlery", "Cutting boards", "Drinking cups"]
          },
          {
            "category_id": "CON_G_02",
            "category_name": "Toys & Recreation",
            "item_examples": ["Building blocks (LEGO - ABS)", "Dolls", "Inflatable pools", "Sporting goods"]
          },
          {
            "category_id": "CON_G_03",
            "category_name": "Furniture & Storage",
            "item_examples": ["Plastic chairs/tables", "Storage bins/totes", "Hangers", "Laundry baskets"]
          }
        ]
      },
      {
        "sector_id": "SEC_09",
        "sector_name": "Agriculture & Horticulture",
        "subcategories": [
          {
            "category_id": "AGR_01",
            "category_name": "Agricultural Films",
            "item_examples": ["Mulch film", "Greenhouse film", "Silage stretch film", "Tunnel film"]
          },
          {
            "category_id": "AGR_02",
            "category_name": "Irrigation & Horticulture",
            "item_examples": ["Drip irrigation tape", "Nursery pots", "Plant trays", "Fertilizer sacks"]
          }
        ]
      }
    ]
  }
}`;

export const RAW_IRON_ALUMINIUM_CSV = `ID,Category,Item_Name,Material
1,Tools,Hammer,Iron
2,Tools,Anvil,Iron
3,Kitchenware,Cast Iron Skillet,Iron
4,Kitchenware,Dutch Oven,Iron
5,Construction,Nails,Iron
6,Construction,Screws,Iron
7,Construction,Bolts,Iron
8,Construction,Nuts,Iron
9,Hardware,Hinges,Iron
10,Hardware,Door Latches,Iron
11,Hardware,Padlocks,Iron
12,Furniture,Bed Frame,Iron
13,Furniture,Curtain Rods,Iron
14,Furniture,Shelving Brackets,Iron
15,Furniture,Garden Bench,Iron
16,Hardware,Wrought Iron Gate,Iron
17,Construction,Rebar,Iron
18,Construction,I-Beam,Iron
19,Tools,Wrench,Iron
20,Tools,Pliers,Iron
21,Tools,Crowbar,Iron
22,Tools,Chains,Iron
23,Automotive,Engine Block,Iron
24,Automotive,Brake Rotor,Iron
25,Automotive,Crankshaft,Iron
26,Automotive,Axle,Iron
27,Hardware,Mailbox,Iron
28,Hardware,Signpost,Iron
29,Tools,Sledgehammer,Iron
30,Tools,Axe,Iron
31,Tools,Shovel,Iron
32,Tools,Rake,Iron
33,Tools,Hoe,Iron
34,Construction,Manhole Cover,Iron
35,Hardware,Fireplace Grate,Iron
36,Kitchenware,Griddle,Iron
37,Fitness,Dumbbells,Iron
38,Hardware,Coat Hooks,Iron
39,Construction,Fence Panel,Iron
40,Automotive,Suspension Spring,Iron
41,Hardware,Storage Locker,Iron
42,Tools,Toolbox,Iron
43,Hardware,Safe,Iron
44,Furniture,Filing Cabinet,Iron
45,Hardware,Candle Holder,Iron
46,Hardware,Patio Heater,Iron
47,Hardware,Barbecue Grill,Iron
48,Construction,Structural Column,Iron
49,Tools,Wood Chisel,Iron
50,Tools,Vice,Iron
51,Packaging,Soda Can,Aluminum
52,Packaging,Foil,Aluminum
53,Kitchenware,Pie Pan,Aluminum
54,Kitchenware,Baking Sheet,Aluminum
55,Construction,Ladder,Aluminum
56,Construction,Window Frame,Aluminum
57,Construction,Door Frame,Aluminum
58,Transport,Bicycle Frame,Aluminum
59,Automotive,Car Rim,Aluminum
60,Automotive,Piston,Aluminum
61,Automotive,Radiator,Aluminum
62,Electronics,Heat Sink,Aluminum
63,Electronics,Laptop Chassis,Aluminum
64,Electronics,Smartphone Body,Aluminum
65,Camping,Camping Stove,Aluminum
66,Camping,Camping Chair,Aluminum
67,Camping,Tent Pole,Aluminum
68,Hardware,Carabiner,Aluminum
69,Hardware,Flashlight,Aluminum
70,Photography,Tripod,Aluminum
71,Electronics,Satellite Dish,Aluminum
72,Aviation,Aircraft Skin,Aluminum
73,Aviation,Aircraft Structural Rib,Aluminum
74,Marine,Boat Hull,Aluminum
75,Marine,Mast,Aluminum
76,Construction,Gutter,Aluminum
77,Construction,Siding,Aluminum
78,Construction,Roofing Sheet,Aluminum
79,Furniture,Folding Table,Aluminum
80,Travel,Suitcase,Aluminum
81,Music,Instrument Case,Aluminum
82,Signage,Traffic Sign,Aluminum
83,Automotive,License Plate,Aluminum
84,Kitchenware,Colander,Aluminum
85,Kitchenware,Measuring Cup,Aluminum
86,Kitchenware,Whisk,Aluminum
87,Kitchenware,Spatula,Aluminum
88,Camping,Tent Peg,Aluminum
89,Transport,Bike Handlebar,Aluminum
90,Transport,Bike Pedal,Aluminum
91,Electronics,Drone Frame,Aluminum
92,Photography,Camera Cage,Aluminum
93,Electronics,Computer Case,Aluminum
94,Electronics,LED Housing,Aluminum
95,Hardware,Street Light Housing,Aluminum
96,Construction,Electrical Conduit,Aluminum
97,Aviation,Propeller,Aluminum
98,Sporting Goods,Baseball Bat,Aluminum
99,Kitchenware,Mixing Bowl,Aluminum
100,Hardware,Blind Slats,Aluminum`;

export const RAW_GLASS_CSV = `ID,Category
1,Drinking Glasses
2,Wine Glasses
3,Champagne Flutes
4,Beer Mugs
5,Shot Glasses
6,Whiskey Tumblers
7,Highball Glasses
8,Water Pitchers
9,Carafes
10,Decanters
11,Glass Jars
12,Storage Containers
13,Mixing Bowls
14,Measuring Cups
15,Casserole Dishes
16,Teapots
17,Sugar Bowls
18,Creamers
19,Butter Dishes
20,Salt Shakers
21,Pepper Mills
22,Oil Cruets
23,Ramekins
24,Gravy Boats
25,Cookie Jars
26,Blender Jars
27,French Press Carafes
28,Vases
29,Picture Frames
30,Candle Holders
31,Mirrors
32,Figurines
33,Paperweights
34,Ornaments
35,Terrariums
36,Wall Clocks
37,Table Lamps
38,Chandeliers
39,Sun Catchers
40,Sculptures
41,Cabinet Knobs
42,Coasters
43,Ash Trays
44,Incense Burners
45,Potpourri Bowls
46,Windows
47,Glass Blocks
48,Glass Doors
49,Skylights
50,Shower Screens
51,Glass Railings
52,Glass Shelves
53,Partitions
54,Backsplashes
55,Eyeglasses
56,Sunglasses
57,Magnifying Glasses
58,Camera Lenses
59,Smartphone Screens
60,Watch Faces
61,Telescope Lenses
62,Microscope Slides
63,Prisms
64,Binoculars
65,Beakers
66,Test Tubes
67,Flasks
68,Pipettes
69,Petri Dishes
70,Burettes
71,Vials
72,Ampoules
73,Microscope Cover Slips
74,Graduated Cylinders
75,Windshields
76,Side Mirrors
77,Headlight Covers
78,Gauge Covers
79,Glass Beads
80,Glass Wool
81,Fiberglass
82,Glass Tubing
83,Perfume Bottles
84,Nail Polish Bottles
85,Lotion Bottles
86,Glass Nail Files
87,Dropper Bottles
88,Marbles
89,Stained Glass Panels
90,Aquariums
91,Glass Syringes
92,Glass Rods
93,Glass Floats
94,Glass Funnels
95,Stirring Rods
96,Glass Tiles
97,Glass Buttons
98,Glass Decals
99,Glass Pendants
100,Glass Straws`;

export const RAW_WOOD_CSV = `ID,Category,Sub-Category,Item Name,Primary Wood Type
1,Construction,Structural,Timber Beam,Pine
2,Construction,Flooring,Parquet Flooring,Oak
3,Furniture,Seating,Dining Chair,Walnut
4,Furniture,Storage,Bookcase,Mahogany
5,Kitchenware,Utensils,Spatula,Beech
6,Kitchenware,Dining,Salad Bowl,Acacia
7,Art & Decor,Sculptures,Hand-carved Figurine,Cedar
8,Art & Decor,Frames,Picture Frame,Cherry
9,Musical Instruments,String,Acoustic Guitar,Spruce
10,Musical Instruments,Percussion,Cajon,Birch
11,Toys & Games,Building,Wooden Blocks,Maple
12,Toys & Games,Puzzles,Jigsaw Puzzle,Plywood
13,Stationery,Writing,Pencil,Cedar
14,Stationery,Organization,Desk Organizer,Bamboo
15,Industrial,Logistics,Shipping Pallet,Pine
16,Industrial,Tools,Hammer Handle,Hickory
17,Construction,Exterior,Decking Plank,Teak
18,Furniture,Tables,Coffee Table,Mango
19,Kitchenware,Storage,Spice Rack,Pine
20,Art & Decor,Ornamentation,Wall Mask,Ebony
21,Musical Instruments,Keys,Piano Case,Rosewood
22,Toys & Games,Vehicles,Toy Train,Beech
23,Stationery,Art Supplies,Easel,Pine
24,Industrial,Utility,Matchsticks,Poplar
25,Construction,Interior,Crown Molding,MDF/Composite
26,Furniture,Bedding,Bed Frame,Oak
27,Kitchenware,Cutting,Cutting Board,Bamboo
28,Art & Decor,Decor,Candle Holder,Olive Wood
29,Musical Instruments,Wind,Recorder,Maple
30,Toys & Games,Games,Chess Set,Boxwood
31,Stationery,Writing,Fountain Pen Body,Walnut
32,Industrial,Construction,Shuttering Plywood,Fir
33,Construction,Doors,Interior Door,Pine
34,Furniture,Office,Standing Desk,Bamboo
35,Kitchenware,Serving,Serving Tray,Walnut
36,Art & Decor,Mirrors,Mirror Frame,Gilded Wood
37,Musical Instruments,Percussion,Drum Shell,Maple
38,Toys & Games,Educational,Abacus,Pine
39,Stationery,Storage,Pen Holder,Cedar
40,Industrial,Hardware,Dowel Rods,Birch
41,Construction,Fencing,Picket Fence,Cedar
42,Furniture,Shelving,Floating Shelf,Oak
43,Kitchenware,Utensils,Mortar and Pestle,Olive Wood
44,Art & Decor,Religious,Crucifix,Mahogany
45,Musical Instruments,String,Violin Body,Spruce
46,Toys & Games,Dolls,Dollhouse,Plywood
47,Stationery,Paper,Wood Pulp Paper,Softwood
48,Industrial,Flooring,Industrial Block,Hardwood
49,Construction,Roofing,Shingles,Cedar
50,Furniture,Storage,Wardrobe,Pine`;

export const RAW_TEXTILE_CSV = `ID,Item_Category,Industry_Sector
1,T-Shirts,Apparel
2,Jeans,Apparel
3,Dresses,Apparel
4,Skirts,Apparel
5,Blouses,Apparel
6,Suits,Apparel
7,Blazers,Apparel
8,Sweaters,Apparel
9,Hoodies,Apparel
10,Coats,Apparel
11,Jackets,Apparel
12,Vests,Apparel
13,Shorts,Apparel
14,Leggings,Apparel
15,Tracksuits,Apparel
16,Pajamas,Apparel
17,Robes,Apparel
18,Underwear,Apparel
19,Socks,Apparel
20,Swimwear,Apparel
21,Scarves,Accessories
22,Ties,Accessories
23,Gloves,Accessories
24,Hats,Accessories
25,Caps,Accessories
26,Belts (Fabric),Accessories
27,Handbags,Accessories
28,Backpacks,Accessories
29,Wallets (Fabric),Accessories
30,Umbrellas (Fabric Canopy),Accessories
31,Hairbands,Accessories
32,Bandanas,Accessories
33,Shawls,Accessories
34,Veils,Accessories
35,Suspenders,Accessories
36,Mittens,Accessories
37,Wristbands,Accessories
38,Headbands,Accessories
39,Pouches,Accessories
40,Tote Bags,Accessories
41,Bed Sheets,Home Textiles
42,Pillowcases,Home Textiles
43,Duvet Covers,Home Textiles
44,Comforters,Home Textiles
45,Blankets,Home Textiles
46,Quilts,Home Textiles
47,Throw Pillows,Home Textiles
48,Curtains,Home Textiles
49,Drapes,Home Textiles
50,Tablecloths,Home Textiles
51,Napkins,Home Textiles
52,Place Mats,Home Textiles
53,Towels,Home Textiles
54,Bathrobes,Home Textiles
55,Bathmats,Home Textiles
56,Rugs,Home Textiles
57,Carpets,Home Textiles
58,Upholstery Covers,Home Textiles
59,Mattress Protectors,Home Textiles
60,Tea Towels,Home Textiles
61,Tents,Technical/Industrial
62,Sleeping Bags,Technical/Industrial
63,Tarps,Technical/Industrial
64,Awnings,Technical/Industrial
65,Flags,Technical/Industrial
66,Banners,Technical/Industrial
67,Sails,Technical/Industrial
68,Parachutes,Technical/Industrial
69,Geotextiles,Technical/Industrial
70,Conveyor Belts,Technical/Industrial
71,Fire Hoses,Technical/Industrial
72,Industrial Filters,Technical/Industrial
73,Safety Nets,Technical/Industrial
74,Seat Covers,Automotive
75,Headliners,Automotive
76,Airbags,Automotive
77,Car Floor Mats,Automotive
78,Insulation Batting,Automotive
79,Rope,Technical/Industrial
80,Cordage,Technical/Industrial
81,Surgical Gowns,Medical
82,Face Masks (Fabric),Medical
83,Bandages,Medical
84,Compression Stockings,Medical
85,Medical Drapes,Medical
86,Hospital Linens,Medical
87,Orthopedic Braces,Medical
88,Baby Slings,Specialty
89,Diapers (Cloth),Specialty
90,Bibs,Specialty
91,Costumes,Specialty
92,Mascot Suits,Specialty
93,Wigs (Synthetic Fiber),Specialty
94,Felt Crafts,Specialty
95,Embroidery Hoops (Fabric Base),Specialty
96,Tapestries,Specialty
97,Wall Hangings,Specialty
98,Patches,Specialty
99,Book Covers (Fabric),Specialty
100,Shoe Laces,Apparel`;

// Helper to generate SVG placeholder multi-angle racur images
export function generateRacurSvgUrl(
  title: string,
  angle: string,
  categoryColor: string = '#10b981',
  shape: 'bottle' | 'can' | 'box' | 'cylinder' | 'sheet' | 'garment' | 'custom' = 'bottle'
): string {
  const bg = '#0f172a';
  const text = '#e2e8f0';
  
  let shapeSvg = '';
  if (shape === 'bottle') {
    if (angle === 'front' || angle === 'back') {
      shapeSvg = `<path d="M90,140 L90,100 L100,80 L100,35 L120,35 L120,80 L130,100 L130,140 Z" fill="${categoryColor}" fill-opacity="0.35" stroke="${categoryColor}" stroke-width="3" />
      <rect x="97" y="24" width="26" height="12" rx="2" fill="${categoryColor}" />
      <line x1="90" y1="110" x2="130" y2="110" stroke="${categoryColor}" stroke-dasharray="2 2"/>`;
    } else if (angle === 'side') {
      shapeSvg = `<path d="M95,140 L95,100 L102,80 L102,35 L118,35 L118,80 L125,100 L125,140 Z" fill="${categoryColor}" fill-opacity="0.4" stroke="${categoryColor}" stroke-width="3" />
      <rect x="100" y="24" width="20" height="12" rx="2" fill="${categoryColor}" />`;
    } else if (angle === 'top' || angle === 'bottom') {
      shapeSvg = `<circle cx="110" cy="85" r="45" fill="${categoryColor}" fill-opacity="0.25" stroke="${categoryColor}" stroke-width="3" />
      <circle cx="110" cy="85" r="18" fill="${categoryColor}" fill-opacity="0.6" stroke="${categoryColor}" stroke-width="2" />
      <circle cx="110" cy="85" r="6" fill="#ffffff" />`;
    } else { // isometric / detail
      shapeSvg = `<ellipse cx="110" cy="50" rx="30" ry="12" fill="${categoryColor}" fill-opacity="0.4" stroke="${categoryColor}" stroke-width="2"/>
      <path d="M80,50 L80,120 A30,12 0 0,0 140,120 L140,50 Z" fill="${categoryColor}" fill-opacity="0.3" stroke="${categoryColor}" stroke-width="2"/>
      <ellipse cx="110" cy="120" rx="30" ry="12" fill="none" stroke="${categoryColor}" stroke-width="2"/>`;
    }
  } else if (shape === 'can') {
    if (angle === 'top' || angle === 'bottom') {
      shapeSvg = `<circle cx="110" cy="85" r="45" fill="${categoryColor}" fill-opacity="0.3" stroke="${categoryColor}" stroke-width="3" />
      <ellipse cx="110" cy="75" rx="14" ry="8" fill="#ffffff" fill-opacity="0.8"/>
      <circle cx="110" cy="85" r="5" fill="${categoryColor}" />`;
    } else {
      shapeSvg = `<rect x="80" y="40" width="60" height="95" rx="6" fill="${categoryColor}" fill-opacity="0.3" stroke="${categoryColor}" stroke-width="3" />
      <line x1="80" y1="55" x2="140" y2="55" stroke="${categoryColor}" stroke-width="1.5"/>
      <line x1="80" y1="120" x2="140" y2="120" stroke="${categoryColor}" stroke-width="1.5"/>`;
    }
  } else if (shape === 'box') {
    shapeSvg = `<polygon points="110,35 155,55 110,75 65,55" fill="${categoryColor}" fill-opacity="0.4" stroke="${categoryColor}" stroke-width="2"/>
    <polygon points="65,55 110,75 110,135 65,115" fill="${categoryColor}" fill-opacity="0.25" stroke="${categoryColor}" stroke-width="2"/>
    <polygon points="155,55 110,75 110,135 155,115" fill="${categoryColor}" fill-opacity="0.35" stroke="${categoryColor}" stroke-width="2"/>`;
  } else if (shape === 'garment') {
    shapeSvg = `<path d="M85,45 L100,55 L120,55 L135,45 L155,60 L140,78 L130,72 L130,135 L90,135 L90,72 L80,78 L65,60 Z" fill="${categoryColor}" fill-opacity="0.35" stroke="${categoryColor}" stroke-width="3" />`;
  } else {
    shapeSvg = `<circle cx="110" cy="85" r="40" fill="${categoryColor}" fill-opacity="0.3" stroke="${categoryColor}" stroke-width="2" />
    <path d="M85,85 L135,85 M110,60 L110,110" stroke="${categoryColor}" stroke-width="2" />`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 180" width="220" height="180">
    <rect width="100%" height="100%" fill="${bg}" rx="8"/>
    <defs>
      <pattern id="grid_${angle}" width="15" height="15" patternUnits="userSpaceOnUse">
        <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#334155" stroke-width="0.75" stroke-opacity="0.4"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid_${angle})" rx="8"/>
    <g transform="translate(0, 0)">
      ${shapeSvg}
    </g>
    <rect x="8" y="8" width="55" height="18" rx="4" fill="#020617" fill-opacity="0.8" stroke="${categoryColor}" stroke-width="1"/>
    <text x="35" y="21" fill="${categoryColor}" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">${angle.toUpperCase()}</text>
    <text x="110" y="165" fill="${text}" font-family="sans-serif" font-size="10" font-weight="600" text-anchor="middle">${title.length > 22 ? title.substring(0, 20) + '…' : title}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Helper to create standard set of multi-racur images for an item
export function createStandardRacurSet(
  name: string,
  categoryColor: string,
  shape: 'bottle' | 'can' | 'box' | 'cylinder' | 'sheet' | 'garment' | 'custom' = 'bottle'
): ItemImage[] {
  const angles: { angle: 'front' | 'side' | 'top' | 'isometric' | 'bottom' | 'detail'; label: string }[] = [
    { angle: 'front', label: 'Front Angle (0° Azimuth)' },
    { angle: 'side', label: 'Side Profile (90° Azimuth)' },
    { angle: 'top', label: 'Overhead Top-Down (90° Elevation)' },
    { angle: 'isometric', label: 'Isometric (45° Perspective)' },
    { angle: 'bottom', label: 'Base / Footprint View' },
  ];

  return angles.map((a, i) => ({
    id: `img_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
    angle: a.angle,
    angleLabel: a.label,
    url: generateRacurSvgUrl(name, a.angle, categoryColor, shape),
    isCustomUpload: false,
    timestamp: new Date().toISOString(),
    caption: `${a.label} capture for AI training`,
  }));
}

// Initial Registered Items Catalog across the 6 categories
export const INITIAL_REGISTERED_ITEMS: WasteItem[] = [
  // PLASTIC CATEGORY
  {
    id: 'PLS-001',
    name: 'PET Spring Water Bottle 500ml',
    categoryId: 'plastic',
    barcode: '079357319402',
    material: 'PET / PETE (#1)',
    heightCm: 21.0,
    widthCm: 6.5,
    depthCm: 6.5,
    weightGrams: 19.5,
    subCategory: 'Beverage Containers',
    industrySector: 'Rigid Packaging',
    recyclabilityRating: 'High',
    images: createStandardRacurSet('PET Water Bottle 500ml', '#10b981', 'bottle'),
    notes: 'Clear transparent PET bottle with blue HDPE cap. High spectral reflectivity.',
    sourceDatasetRowId: 'PKG_RIG_01',
    createdAt: '2026-08-15T09:30:00Z',
    updatedAt: '2026-08-15T09:30:00Z',
  },
  {
    id: 'PLS-002',
    name: 'HDPE Laundry Detergent Jug 2L',
    categoryId: 'plastic',
    barcode: '037000128453',
    material: 'HDPE (#2)',
    heightCm: 29.5,
    widthCm: 16.0,
    depthCm: 11.5,
    weightGrams: 115.0,
    subCategory: 'Household & Personal Care Bottles',
    industrySector: 'Rigid Packaging',
    recyclabilityRating: 'High',
    images: createStandardRacurSet('HDPE Detergent Jug 2L', '#10b981', 'bottle'),
    notes: 'Opaque blue HDPE blow-molded container with integrated handle.',
    sourceDatasetRowId: 'PKG_RIG_03',
    createdAt: '2026-08-16T11:20:00Z',
    updatedAt: '2026-08-16T11:20:00Z',
  },
  {
    id: 'PLS-003',
    name: 'PP Yogurt Tub 500g',
    categoryId: 'plastic',
    barcode: '052000329104',
    material: 'PP Polypropylene (#5)',
    heightCm: 12.0,
    widthCm: 11.5,
    depthCm: 11.5,
    weightGrams: 28.0,
    subCategory: 'Food Containers & Tubs',
    industrySector: 'Rigid Packaging',
    recyclabilityRating: 'Moderate',
    images: createStandardRacurSet('PP Yogurt Tub 500g', '#10b981', 'cylinder'),
    notes: 'White injection molded polypropylene cup with snap-on lid.',
    sourceDatasetRowId: 'PKG_RIG_02',
    createdAt: '2026-08-18T14:10:00Z',
    updatedAt: '2026-08-18T14:10:00Z',
  },
  {
    id: 'PLS-004',
    name: 'PVC Drainage Pipe Segment 50mm',
    categoryId: 'plastic',
    barcode: '841234509124',
    material: 'PVC / Vinyl (#3)',
    heightCm: 35.0,
    widthCm: 5.0,
    depthCm: 5.0,
    weightGrams: 180.0,
    subCategory: 'Pipes & Fittings',
    industrySector: 'Building & Construction',
    recyclabilityRating: 'Low',
    images: createStandardRacurSet('PVC Pipe 50mm', '#10b981', 'cylinder'),
    notes: 'Rigid grey unplasticized polyvinyl chloride pipe section.',
    sourceDatasetRowId: 'CON_01',
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z',
  },

  // IRON / ALUMINUM CATEGORY
  {
    id: 'MET-001',
    name: 'Aluminum Soda Can 330ml',
    categoryId: 'iron_aluminum',
    barcode: '049000042566',
    material: 'Aluminum Foil / Cans',
    heightCm: 11.5,
    widthCm: 6.6,
    depthCm: 6.6,
    weightGrams: 14.2,
    subCategory: 'Packaging',
    industrySector: 'Beverage & Consumer Goods',
    recyclabilityRating: 'High',
    images: createStandardRacurSet('Aluminum Soda Can 330ml', '#f59e0b', 'can'),
    notes: 'Standard 2-piece drawn and ironed aluminum beverage can with stay-on tab.',
    sourceDatasetRowId: 51,
    createdAt: '2026-08-15T10:15:00Z',
    updatedAt: '2026-08-15T10:15:00Z',
  },
  {
    id: 'MET-002',
    name: 'Cast Iron Skillet 26cm',
    categoryId: 'iron_aluminum',
    barcode: '075536301201',
    material: 'Cast Iron',
    heightCm: 5.2,
    widthCm: 26.0,
    depthCm: 42.0,
    weightGrams: 2350.0,
    subCategory: 'Kitchenware',
    industrySector: 'Cookware',
    recyclabilityRating: 'High',
    images: createStandardRacurSet('Cast Iron Skillet 26cm', '#f59e0b', 'custom'),
    notes: 'Heavy ferrous cast iron pan. Highly magnetic sensor signature.',
    sourceDatasetRowId: 3,
    createdAt: '2026-08-16T12:45:00Z',
    updatedAt: '2026-08-16T12:45:00Z',
  },
  {
    id: 'MET-003',
    name: 'Aluminum Extruded Window Frame Bracket',
    categoryId: 'iron_aluminum',
    material: 'Aluminum 6061',
    heightCm: 18.0,
    widthCm: 4.5,
    depthCm: 3.2,
    weightGrams: 210.0,
    subCategory: 'Construction',
    industrySector: 'Architectural Hardware',
    recyclabilityRating: 'High',
    images: createStandardRacurSet('Aluminum Window Frame', '#f59e0b', 'custom'),
    notes: 'Anodized 6061-T6 aluminum extrusion profile with mounting holes.',
    sourceDatasetRowId: 56,
    createdAt: '2026-08-19T08:20:00Z',
    updatedAt: '2026-08-19T08:20:00Z',
  },

  // GLASS CATEGORY
  {
    id: 'GLS-001',
    name: 'Green Wine Bottle Bordeaux 750ml',
    categoryId: 'glass',
    material: 'Amber / Green Container Glass',
    heightCm: 30.0,
    widthCm: 7.5,
    depthCm: 7.5,
    weightGrams: 460.0,
    subCategory: 'Wine Glasses & Bottles',
    industrySector: 'Beverage Packaging',
    recyclabilityRating: 'High',
    images: createStandardRacurSet('Green Wine Bottle 750ml', '#06b6d4', 'bottle'),
    notes: 'Antique green soda-lime glass container bottle with punt indentation.',
    sourceDatasetRowId: 2,
    createdAt: '2026-08-15T14:10:00Z',
    updatedAt: '2026-08-15T14:10:00Z',
  },
  {
    id: 'GLS-002',
    name: 'Clear Glass Food Jar with Lid Thread 350ml',
    categoryId: 'glass',
    material: 'Soda-Lime Glass (Clear/Flint)',
    heightCm: 12.5,
    widthCm: 7.2,
    depthCm: 7.2,
    weightGrams: 215.0,
    subCategory: 'Glass Jars & Storage',
    industrySector: 'Food Storage',
    recyclabilityRating: 'High',
    images: createStandardRacurSet('Glass Food Jar 350ml', '#06b6d4', 'cylinder'),
    notes: 'Clear flint glass jar for preserves, non-magnetic, optical transparency index 1.52.',
    sourceDatasetRowId: 11,
    createdAt: '2026-08-17T16:00:00Z',
    updatedAt: '2026-08-17T16:00:00Z',
  },
  {
    id: 'GLS-003',
    name: 'Borosilicate Laboratory Beaker 250ml',
    categoryId: 'glass',
    material: 'Borosilicate Glass (Heat Resistant)',
    heightCm: 9.5,
    widthCm: 7.0,
    depthCm: 7.0,
    weightGrams: 105.0,
    subCategory: 'Laboratory Ware',
    industrySector: 'Scientific Glassware',
    recyclabilityRating: 'Moderate',
    images: createStandardRacurSet('Borosilicate Beaker 250ml', '#06b6d4', 'cylinder'),
    notes: 'Pyrex-grade borosilicate 3.3 glassware with pouring spout.',
    sourceDatasetRowId: 65,
    createdAt: '2026-08-21T09:40:00Z',
    updatedAt: '2026-08-21T09:40:00Z',
  },

  // PAPER / CARDBOARD & WOOD CATEGORY
  {
    id: 'WOD-001',
    name: 'Corrugated Shipping Box (Single Wall C-Flute)',
    categoryId: 'paper_cardboard',
    material: 'Corrugated Cardboard',
    heightCm: 25.0,
    widthCm: 35.0,
    depthCm: 25.0,
    weightGrams: 240.0,
    subCategory: 'Industrial Logistics',
    industrySector: 'Packaging',
    recyclabilityRating: 'High',
    images: createStandardRacurSet('Corrugated Shipping Box', '#eab308', 'box'),
    notes: 'Brown kraft unbleached cellulose corrugated box, easily compressed.',
    sourceDatasetRowId: 15,
    createdAt: '2026-08-15T15:20:00Z',
    updatedAt: '2026-08-15T15:20:00Z',
  },
  {
    id: 'WOD-002',
    name: 'Solid Pine Timber Plank 50cm',
    categoryId: 'paper_cardboard',
    material: 'Softwood (Pine, Fir, Spruce)',
    heightCm: 50.0,
    widthCm: 10.0,
    depthCm: 4.5,
    weightGrams: 980.0,
    subCategory: 'Construction Structural',
    industrySector: 'Lumber & Building',
    recyclabilityRating: 'High',
    images: createStandardRacurSet('Pine Timber Plank', '#eab308', 'box'),
    notes: 'Kiln-dried Scots pine wooden block with natural grain pattern.',
    sourceDatasetRowId: 1,
    createdAt: '2026-08-18T13:30:00Z',
    updatedAt: '2026-08-18T13:30:00Z',
  },
  {
    id: 'WOD-003',
    name: 'Wood Pulp Office Paper Ream Wrapping (A4)',
    categoryId: 'paper_cardboard',
    material: 'Kraft Paper / Wood Pulp Paper',
    heightCm: 29.7,
    widthCm: 21.0,
    depthCm: 5.0,
    weightGrams: 500.0,
    subCategory: 'Stationery Paper',
    industrySector: 'Office Supplies',
    recyclabilityRating: 'High',
    images: createStandardRacurSet('Wood Pulp Paper Ream', '#eab308', 'box'),
    notes: 'Bleached chemical pulp paper package, 100% biodegradable cellulose.',
    sourceDatasetRowId: 47,
    createdAt: '2026-08-22T11:00:00Z',
    updatedAt: '2026-08-22T11:00:00Z',
  },

  // TEXTILE CATEGORY
  {
    id: 'TEX-001',
    name: '100% Cotton Crewneck T-Shirt (Size L)',
    categoryId: 'textile',
    material: '100% Cotton Fabric',
    heightCm: 72.0,
    widthCm: 54.0,
    depthCm: 0.8,
    weightGrams: 165.0,
    subCategory: 'T-Shirts',
    industrySector: 'Apparel',
    recyclabilityRating: 'High',
    images: createStandardRacurSet('Cotton T-Shirt L', '#8b5cf6', 'garment'),
    notes: 'Single jersey knit natural cotton fabric, flexible deformable profile.',
    sourceDatasetRowId: 1,
    createdAt: '2026-08-15T16:00:00Z',
    updatedAt: '2026-08-15T16:00:00Z',
  },
  {
    id: 'TEX-002',
    name: 'Denim Jeans Pant Trouser',
    categoryId: 'textile',
    material: 'Denim Cotton Blend',
    heightCm: 104.0,
    widthCm: 42.0,
    depthCm: 1.5,
    weightGrams: 620.0,
    subCategory: 'Jeans',
    industrySector: 'Apparel',
    recyclabilityRating: 'High',
    images: createStandardRacurSet('Denim Jeans', '#8b5cf6', 'garment'),
    notes: 'Indigo-dyed twill weave denim with metal rivets and zipper.',
    sourceDatasetRowId: 2,
    createdAt: '2026-08-18T10:15:00Z',
    updatedAt: '2026-08-18T10:15:00Z',
  },
  {
    id: 'TEX-003',
    name: 'Industrial Polypropylene Geotextile Tarp',
    categoryId: 'textile',
    material: 'Polyester Synthetic Fiber',
    heightCm: 150.0,
    widthCm: 150.0,
    depthCm: 0.3,
    weightGrams: 420.0,
    subCategory: 'Tarps & Technical',
    industrySector: 'Technical/Industrial',
    recyclabilityRating: 'Moderate',
    images: createStandardRacurSet('Polypropylene Tarp', '#8b5cf6', 'sheet'),
    notes: 'Heavy-duty woven synthetic tarp with reinforced edge grommets.',
    sourceDatasetRowId: 63,
    createdAt: '2026-08-20T14:45:00Z',
    updatedAt: '2026-08-20T14:45:00Z',
  },

  // GENERAL WASTE CATEGORY (starts empty or minimal example to demonstrate unclassified waste routing)
  {
    id: 'WST-001',
    name: 'Multi-layer Foil Snack Chip Bag (Composite Film)',
    categoryId: 'general_waste',
    material: 'Mixed Multi-layer Composite',
    heightCm: 22.0,
    widthCm: 16.0,
    depthCm: 4.0,
    weightGrams: 18.0,
    subCategory: 'Non-Recyclable Packaging',
    industrySector: 'Composite Refuse',
    recyclabilityRating: 'Non-Recyclable',
    images: createStandardRacurSet('Foil Chip Bag', '#94a3b8', 'custom'),
    notes: 'Inseparable multi-material laminate (BoPP plastic + metallized aluminum coating). Routed to Landfill Chute #6.',
    sourceDatasetRowId: 'WST_REFUSE_01',
    createdAt: '2026-08-22T15:30:00Z',
    updatedAt: '2026-08-22T15:30:00Z',
  },
];
