import type {
  ChecklistItem,
  CityLocation,
  EmergencyContact,
  FacilityCategory,
  NationalHotline,
  ReminderItem,
  SafeFacility,
  SafetyGuide,
  UserProfile,
} from '../types/kalinga';

export const PHILIPPINE_CITIES: CityLocation[] = [
  { name: 'Quezon City', region: 'Metro Manila', lat: 14.676, lng: 121.0437 },
  { name: 'Manila', region: 'Metro Manila', lat: 14.5995, lng: 120.9842 },
  { name: 'Marikina', region: 'Metro Manila', lat: 14.6507, lng: 121.1029 },
  { name: 'Makati', region: 'Metro Manila', lat: 14.5547, lng: 121.0244 },
  { name: 'Pasig', region: 'Metro Manila', lat: 14.5764, lng: 121.0851 },
  { name: 'Taguig', region: 'Metro Manila', lat: 14.5176, lng: 121.0509 },
  { name: 'Cebu City', region: 'Central Visayas', lat: 10.3157, lng: 123.8854 },
  { name: 'Davao City', region: 'Davao Region', lat: 7.1907, lng: 125.4553 },
  { name: 'Iloilo City', region: 'Western Visayas', lat: 10.7202, lng: 122.5621 },
  { name: 'Baguio City', region: 'Cordillera (CAR)', lat: 16.4023, lng: 120.596 },
  { name: 'Tacloban City', region: 'Eastern Visayas', lat: 11.2543, lng: 124.9617 },
  { name: 'Cagayan de Oro', region: 'Northern Mindanao', lat: 8.4542, lng: 124.6319 },
  { name: 'Legazpi City', region: 'Bicol Region', lat: 13.1391, lng: 123.7438 },
  { name: 'Naga City', region: 'Bicol Region', lat: 13.6218, lng: 123.1948 },
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: '',
  city: 'Quezon City',
  householdSize: '',
  householdNotes: '',
  priorities: ['typhoon-flood', 'earthquake-fire'],
  localDrrmoName: 'Barangay / City DRRMO Desk',
  localDrrmoNumber: '',
  theme: 'dark',
  notificationsEnabled: false,
  offlineGuidesSaved: true,
  onboardingCompleted: false,
};

export const DEFAULT_CHECKLIST_ITEMS: ChecklistItem[] = [
  // Emergency Essentials (all explicitly requested items)
  {
    id: 'ess-water',
    title: 'Drinking water',
    description: 'At least 4 liters per person per day for 3 days, stored in sealed containers.',
    category: 'Emergency Essentials',
    priorityFocus: ['typhoon-flood', 'earthquake-fire', 'family-children'],
    recommended: true,
  },
  {
    id: 'ess-food',
    title: 'Ready-to-eat food',
    description: 'Canned goods, biscuits, energy bars, and easy-open packs that require no cooking.',
    category: 'Emergency Essentials',
    priorityFocus: ['typhoon-flood', 'family-children'],
    recommended: true,
  },
  {
    id: 'ess-flashlight',
    title: 'Flashlight',
    description: 'Water-resistant LED flashlight or headlamp ready for nighttime power outages.',
    category: 'Emergency Essentials',
    priorityFocus: ['typhoon-flood', 'earthquake-fire'],
    recommended: true,
  },
  {
    id: 'ess-batteries',
    title: 'Batteries',
    description: 'Extra AA, AAA, or D batteries stored in a dry resealable pouch.',
    category: 'Emergency Essentials',
    priorityFocus: ['typhoon-flood'],
  },
  {
    id: 'ess-powerbank',
    title: 'Power bank',
    description: 'Fully charged 10,000mAh+ power bank with compatible charging cables.',
    category: 'Emergency Essentials',
    priorityFocus: ['typhoon-flood', 'earthquake-fire'],
    recommended: true,
  },
  {
    id: 'ess-first-aid',
    title: 'First-aid supplies',
    description: 'Bandages, antiseptic wipes, gauze, oral rehydration salts, and pain relievers.',
    category: 'Emergency Essentials',
    priorityFocus: ['earthquake-fire', 'family-children', 'seniors-medical'],
    recommended: true,
  },
  {
    id: 'ess-hygiene',
    title: 'Hygiene supplies',
    description: 'Alcohol, soap, wet wipes, toothbrushes, sanitary pads, and tissue packs.',
    category: 'Emergency Essentials',
    priorityFocus: ['family-children', 'typhoon-flood'],
  },
  {
    id: 'ess-whistle',
    title: 'Whistle',
    description: 'Loud emergency whistle to signal responders if trapped or separated.',
    category: 'Emergency Essentials',
    priorityFocus: ['earthquake-fire'],
    recommended: true,
  },
  {
    id: 'ess-documents',
    title: 'Important documents',
    description: 'Waterproof pouch with IDs, birth certificates, PhilHealth/SSS cards, and land titles.',
    category: 'Emergency Essentials',
    priorityFocus: ['typhoon-flood', 'earthquake-fire'],
    recommended: true,
  },
  {
    id: 'ess-cash',
    title: 'Emergency cash',
    description: 'Small denominations and coins in case ATMs and digital payments go offline.',
    category: 'Emergency Essentials',
    priorityFocus: ['typhoon-flood', 'earthquake-fire'],
  },
  {
    id: 'ess-clothing',
    title: 'Extra clothing',
    description: 'Dry change of clothes, sturdy closed-toe shoes, and lightweight blanket per member.',
    category: 'Emergency Essentials',
    priorityFocus: ['typhoon-flood', 'family-children'],
  },

  // Basic Necessities
  {
    id: 'bas-radio',
    title: 'Portable AM/FM radio',
    description: 'Battery-powered or hand-crank radio to monitor PAGASA and local advisories.',
    category: 'Basic Necessities',
    priorityFocus: ['typhoon-flood'],
    recommended: true,
  },
  {
    id: 'bas-medicines',
    title: 'Maintenance medicines',
    description: 'At least a 7-day supply of daily prescriptions, inhalers, and medical notes.',
    category: 'Basic Necessities',
    priorityFocus: ['seniors-medical'],
    recommended: true,
  },
  {
    id: 'bas-rain-gear',
    title: 'Raincoats or ponchos',
    description: 'Compact waterproof rain gear for safe movement during monsoon or typhoon rains.',
    category: 'Basic Necessities',
    priorityFocus: ['typhoon-flood'],
  },
  {
    id: 'bas-multitool',
    title: 'Manual can opener & utility tool',
    description: 'Essential for opening canned food and shutting off basic household utilities.',
    category: 'Basic Necessities',
    priorityFocus: ['earthquake-fire'],
  },
  {
    id: 'bas-trash-bags',
    title: 'Heavy-duty plastic bags',
    description: 'Useful for waterproofing electronics, sanitation, and emergency waste disposal.',
    category: 'Basic Necessities',
    priorityFocus: ['typhoon-flood'],
  },

  // Communication & Planning
  {
    id: 'com-contacts-saved',
    title: 'Emergency contacts saved',
    description: 'Personal contacts and local DRRMO hotlines stored offline and written on paper.',
    category: 'Communication & Planning',
    priorityFocus: ['family-children', 'seniors-medical'],
    recommended: true,
  },
  {
    id: 'com-meeting-spot',
    title: 'Family meeting location established',
    description: 'Agreed landmark outside your home and outside your neighborhood if separated.',
    category: 'Communication & Planning',
    priorityFocus: ['family-children', 'earthquake-fire'],
    recommended: true,
  },
  {
    id: 'com-evac-plan',
    title: 'Evacuation plan reviewed',
    description: 'Verified primary and alternate walking routes to your nearest Barangay evacuation center.',
    category: 'Communication & Planning',
    priorityFocus: ['typhoon-flood', 'earthquake-fire'],
    recommended: true,
  },
  {
    id: 'com-docs-secured',
    title: 'Important documents secured',
    description: 'Physical copies sealed in waterproof bags and digital backups stored safely.',
    category: 'Communication & Planning',
    priorityFocus: ['typhoon-flood'],
  },
  {
    id: 'com-household-briefed',
    title: 'Household members informed of the emergency plan',
    description: 'Everyone knows where the go-bag is kept and how to shut off LPG and main breakers.',
    category: 'Communication & Planning',
    priorityFocus: ['family-children', 'seniors-medical'],
  },
];

export const SAFETY_GUIDES: SafetyGuide[] = [
  {
    id: 'earthquake',
    title: 'Earthquake Safety',
    subtitle: 'Drop, Cover, and Hold On — structural & tsunami awareness',
    authoritySource: 'Reference: PHIVOLCS & NDRRMC',
    imagePath: '/src/assets/images/guide_earthquake_kit_1795172190785.jpg',
    summary:
      'Strong earthquakes occur without warning. Securing heavy furniture ahead of time and knowing immediate protective actions save lives.',
    sections: [
      {
        phase: 'Before an Earthquake',
        steps: [
          'Bolt tall bookshelves, cabinets, and appliances to sturdy walls; place heavy items on lower shelves.',
          'Identify safe spots in every room: under a sturdy table or against an interior structural wall away from glass.',
          'Keep sturdy closed-toe shoes and a flashlight beside your bed in case shaking happens at night.',
        ],
      },
      {
        phase: 'During Shaking',
        steps: [
          'DROP onto your hands and knees before shaking knocks you down.',
          'COVER your head and neck beneath a sturdy desk or table. Stay away from windows, mirrors, and hanging objects.',
          'HOLD ON to your shelter until shaking completely stops. Do not use elevators.',
          'If outdoors, move calmly to an open area clear of buildings, trees, streetlights, and power lines.',
        ],
      },
      {
        phase: 'After Shaking & Safe Evacuation',
        steps: [
          'Expect aftershocks and check yourself and household members for injuries before moving.',
          'Evacuate damaged buildings using stairs; bring your Go-Bag and watch for fallen debris or live wires.',
          'If you are near the coast and feel strong or long-lasting shaking, move immediately to higher ground without waiting for a formal tsunami warning.',
          'Smell gas? Shut off the LPG valve or main gas line and leave the area immediately.',
        ],
      },
    ],
  },
  {
    id: 'typhoon',
    title: 'Typhoon Readiness',
    subtitle: 'Tropical Cyclone Wind Signals & pre-landfall preparation',
    authoritySource: 'Reference: DOST-PAGASA & NDRRMC',
    imagePath: '/src/assets/images/guide_typhoon_flood_1795172191264.jpg',
    summary:
      'Typhoons bring destructive winds, heavy rainfall, and storm surges. Early preparation before Tropical Cyclone Wind Signals escalate reduces risk.',
    sections: [
      {
        phase: 'Preparation Before Landfall',
        steps: [
          'Inspect roof sheets, gutters, and drainage channels; trim dead tree branches near power lines or roofs.',
          'Charge phones, power banks, and rechargeable lamps; store drinking water and ready-to-eat food.',
          'Secure outdoor items (plants, signage, tools) that could become windborne projectiles.',
        ],
      },
      {
        phase: 'Monitoring Official Advisories',
        steps: [
          'Follow DOST-PAGASA Tropical Cyclone Bulletins and your local LGU DRRMO announcements.',
          'Verify storm surge warnings if living in low-lying coastal barangays.',
          'Keep your battery-powered radio accessible in case mobile data and electricity go down.',
        ],
      },
      {
        phase: 'Indoors & Evacuation Reminders',
        steps: [
          'Stay indoors away from glass windows during intense winds; never step outside during the calm "eye" of the storm.',
          'Evacuate early when local officials issue pre-emptive or forced evacuation orders—do not wait for floodwaters to rise.',
          'Unplug non-essential appliances during severe lightning or voltage fluctuations.',
        ],
      },
    ],
  },
  {
    id: 'flood',
    title: 'Flood Response',
    subtitle: 'Safe evacuation, avoiding floodwater & protecting essentials',
    authoritySource: 'Reference: NDRRMC & DOH',
    imagePath: '/src/assets/images/guide_typhoon_flood_1795172191264.jpg',
    summary:
      'Flash floods and urban flooding can turn streets into hidden hazards carrying electrical currents, open manholes, and waterborne pathogens.',
    sections: [
      {
        phase: 'Flood Preparedness',
        steps: [
          'Elevate electrical appliances, important documents, and medications to upper shelves or second floors.',
          'Learn your barangay flood markers and identify high-ground evacuation routes before monsoon rains arrive.',
        ],
      },
      {
        phase: 'Evacuation & Avoiding Floodwater',
        steps: [
          'Never walk, wade, or drive through moving floodwater—just 15 cm of fast water can knock an adult down.',
          'Avoid downed power lines and submerged electrical posts; switch off the main breaker only if dry and safe to reach.',
          'If floodwater contact is unavoidable, wash thoroughly with soap and clean water and consult a health center regarding leptospirosis prophylaxis.',
        ],
      },
      {
        phase: 'Protecting Belongings & Recovery',
        steps: [
          'Seal mobile phones, cash, and IDs inside double waterproof pouches.',
          'Discard food and drinking water that touched floodwater; boil or purify water if municipal supply integrity is uncertain.',
        ],
      },
    ],
  },
  {
    id: 'fire',
    title: 'Fire Safety',
    subtitle: 'Prevention, low-crawl smoke escape & immediate response',
    authoritySource: 'Reference: Bureau of Fire Protection (BFP)',
    imagePath: '/src/assets/images/guide_fire_landslide_1795172192176.jpg',
    summary:
      'Smoke and toxic fumes spread faster than flames. Practiced escape routes and clear electrical habits prevent most residential fires.',
    sections: [
      {
        phase: 'Fire Prevention Reminders',
        steps: [
          'Never overload electrical extension cords ("octopus connections") and inspect frayed appliance wires.',
          'Keep matches, lighters, and candles away from curtains and children; extinguish candles before sleeping.',
          'Check LPG hoses and regulators regularly with soapy water for leaks—never use an open flame to test.',
        ],
      },
      {
        phase: 'Safe Evacuation Steps',
        steps: [
          'Alert everyone immediately ("Sunog!") and get out—never stop to pack valuables.',
          'Crawl low beneath smoke where air is clearer; cover nose and mouth with a damp cloth if available.',
          'Test closed doors with the back of your hand before opening; if hot, use an alternate exit.',
          'If clothes catch fire: STOP, DROP to the ground, and ROLL to smother flames.',
        ],
      },
      {
        phase: 'Emergency Response',
        steps: [
          'Once safely outside at your family meeting spot, call 911 or your local BFP station—never re-enter a burning structure.',
          'Use an ABC fire extinguisher only on small contained fires and only when your exit path is clear behind you.',
        ],
      },
    ],
  },
  {
    id: 'landslide',
    title: 'Landslide Awareness',
    subtitle: 'Recognizing slope warning signs & rapid evacuation',
    authoritySource: 'Reference: DENR-MGB & PHIVOLCS',
    imagePath: '/src/assets/images/guide_fire_landslide_1795172192176.jpg',
    summary:
      'Prolonged heavy rainfall or earthquakes destabilize saturated hillsides and steep slopes. Recognizing early warning signs buys critical time.',
    sections: [
      {
        phase: 'Warning Signs to Watch',
        steps: [
          'New cracks or bulges appearing on paved roads, concrete walls, foundations, or hillside ground.',
          'Doors or windows sticking suddenly, or tilting trees, fences, and utility poles.',
          'Clear hillside springs suddenly turning muddy, or unusual rumbling sounds of shifting rocks.',
        ],
      },
      {
        phase: 'Evacuation & Avoiding Hazardous Areas',
        steps: [
          'Move away from the path of a slide or debris flow immediately—do not stay inside to gather belongings.',
          'Stay away from steep slopes, river valleys, and drainage channels during and immediately after intense rainstorms.',
          'Listen for barangay sirens or LGU pre-emptive evacuation notices in geohazard zones.',
        ],
      },
    ],
  },
  {
    id: 'power-outage',
    title: 'Power Outage Readiness',
    subtitle: 'Safe lighting, food safety & backup communication',
    authoritySource: 'Reference: DOE & NDRRMC',
    imagePath: '/src/assets/images/guide_earthquake_kit_1795172190785.jpg',
    summary:
      'Extended brownouts after storms or earthquakes require safe non-flame lighting, proper food storage, and disciplined phone battery management.',
    sections: [
      {
        phase: 'Essential Preparations & Safe Lighting',
        steps: [
          'Use battery-powered LED flashlights, lanterns, or solar lamps instead of open-flame candles to prevent accidental fires.',
          'Unplug sensitive appliances and electronics to protect them from power surges when electricity returns.',
        ],
      },
      {
        phase: 'Food, Water & Communication Plans',
        steps: [
          'Keep refrigerator and freezer doors closed as much as possible; eat perishable food first before relying on canned goods.',
          'Switch phones to low-power mode, reduce screen brightness, and send concise SMS updates rather than long calls to preserve battery.',
          'Never run fuel generators indoors, in garages, or near open windows due to deadly carbon monoxide buildup.',
        ],
      },
    ],
  },
];

export const FACILITY_CATEGORIES: Array<FacilityCategory | 'All'> = [
  'All',
  'Evacuation Centers',
  'Hospitals',
  'Clinics',
  'Fire Stations',
  'Police Stations',
  'Disaster-Response Offices',
  'Pharmacies',
];

export const SAMPLE_FACILITIES: SafeFacility[] = [
  {
    id: 'fac-evac-1',
    name: 'Sample Barangay Covered Court Evacuation Center',
    category: 'Evacuation Centers',
    address: 'Sample Civic Compound, Quezon City (Verify with LGU DRRMO)',
    city: 'Quezon City',
    contactLabel: 'Sample Directory Entry — Confirm with Barangay Hall',
    lat: 14.676,
    lng: 121.0437,
    notes: 'Sample reference listing representing a designated multi-purpose evacuation hall.',
    isSample: true,
  },
  {
    id: 'fac-hosp-1',
    name: 'Sample District General Hospital',
    category: 'Hospitals',
    address: 'Sample Medical Ave, Quezon City (Verify live ER status)',
    city: 'Quezon City',
    contactLabel: 'Sample Entry — Dial 911 for live emergency dispatch',
    lat: 14.651,
    lng: 121.049,
    notes: 'Sample hospital placeholder. Confirm real nearest emergency room via local directory.',
    isSample: true,
  },
  {
    id: 'fac-clinic-1',
    name: 'Sample Community Health Clinic',
    category: 'Clinics',
    address: 'Sample Mabini St, Marikina (Sample Reference)',
    city: 'Marikina',
    contactLabel: 'Sample Entry — Verify Barangay Health Station hours',
    lat: 14.6507,
    lng: 121.1029,
    notes: 'Sample primary care and first-aid triage clinic listing.',
    isSample: true,
  },
  {
    id: 'fac-fire-1',
    name: 'Sample Municipal Fire Sub-Station',
    category: 'Fire Stations',
    address: 'Sample Rizal Blvd, Manila (Sample Reference)',
    city: 'Manila',
    contactLabel: 'National Emergency Dispatch: 911 (Verify local BFP desk)',
    lat: 14.5995,
    lng: 120.9842,
    notes: 'Sample fire response facility entry. Always use official 911 or verified local BFP trunkline.',
    isSample: true,
  },
  {
    id: 'fac-police-1',
    name: 'Sample Community Police Assistance Desk',
    category: 'Police Stations',
    address: 'Sample Ayala Corridor, Makati (Sample Reference)',
    city: 'Makati',
    contactLabel: 'National Emergency Dispatch: 911 (Verify local PNP desk)',
    lat: 14.5547,
    lng: 121.0244,
    notes: 'Sample police station reference entry for safety coordination.',
    isSample: true,
  },
  {
    id: 'fac-drrmo-1',
    name: 'Sample City Disaster Risk Reduction Office',
    category: 'Disaster-Response Offices',
    address: 'Sample City Hall Annex, Pasig (Sample Reference)',
    city: 'Pasig',
    contactLabel: 'Configure your verified LGU DRRMO line in Circle of Safety',
    lat: 14.5764,
    lng: 121.0851,
    notes: 'Sample DRRMO coordination center entry for hazard advisories and relief coordination.',
    isSample: true,
  },
  {
    id: 'fac-pharm-1',
    name: 'Sample 24-Hour Community Pharmacy',
    category: 'Pharmacies',
    address: 'Sample Osmena Blvd, Cebu City (Sample Reference)',
    city: 'Cebu City',
    contactLabel: 'Sample Entry — Verify operating hours before travel',
    lat: 10.3157,
    lng: 123.8854,
    notes: 'Sample pharmacy placeholder for maintenance medication and first-aid restocking.',
    isSample: true,
  },
  {
    id: 'fac-evac-2',
    name: 'Sample High-Ground School Evacuation Site',
    category: 'Evacuation Centers',
    address: 'Sample Session Rd Vicinity, Baguio City (Sample Reference)',
    city: 'Baguio City',
    contactLabel: 'Sample Directory Entry — Confirm with Barangay Hall',
    lat: 16.4023,
    lng: 120.596,
    notes: 'Sample elevated school campus listing for typhoon and landslide evacuation.',
    isSample: true,
  },
  {
    id: 'fac-hosp-2',
    name: 'Sample Regional Medical Center',
    category: 'Hospitals',
    address: 'Sample Bajada District, Davao City (Sample Reference)',
    city: 'Davao City',
    contactLabel: 'National Emergency Dispatch: 911',
    lat: 7.1907,
    lng: 125.4553,
    notes: 'Sample regional hospital listing. Always confirm live emergency room availability.',
    isSample: true,
  },
];

export const OFFICIAL_NATIONAL_HOTLINES: NationalHotline[] = [
  {
    id: 'hotline-911',
    agency: 'National Emergency Hotline',
    number: '911',
    description: 'Integrated police, fire, and emergency medical dispatch across the Philippines.',
    scope: 'Nationwide 24/7',
  },
  {
    id: 'hotline-redcross',
    agency: 'Philippine Red Cross',
    number: '143',
    description: 'Emergency medical, rescue, and disaster relief assistance.',
    scope: 'Nationwide 24/7',
  },
  {
    id: 'hotline-ndrrmc',
    agency: 'NDRRMC Operations Center',
    number: '(02) 8911-5061',
    description: 'National Disaster Risk Reduction and Management Council coordination desk.',
    scope: 'National Trunkline',
  },
  {
    id: 'hotline-bfp',
    agency: 'Bureau of Fire Protection (NCR)',
    number: '(02) 8426-0219',
    description: 'Fire emergency reporting and rescue coordination.',
    scope: 'Verify local station',
  },
];

export const DEFAULT_CONTACTS: EmergencyContact[] = [
  {
    id: 'sample-contact-1',
    name: 'Sample Household Contact (Edit or Replace)',
    role: 'Primary Family Member',
    phone: '+63 917 000 0000',
    isPriority: true,
    notes: 'Replace this sample entry with a real trusted family member or neighbor.',
  },
];

export const DAILY_TIPS: string[] = [
  'Check bottled water and canned food expiration dates every six months and rotate older stock into daily meals.',
  'Keep a laminated card with your family emergency numbers inside your Go-Bag in case your phone battery runs out.',
  'Practice "Drop, Cover, and Hold On" with children and seniors in each main room of your home.',
  'Store copies of government IDs, PhilHealth cards, and birth certificates inside a sealed waterproof zip pouch.',
  'Keep your power bank above 80% charge whenever PAGASA tracks a Low Pressure Area or Tropical Cyclone.',
  'Agree on two family meeting spots: one just outside your home for fires, and one outside your barangay for floods or earthquakes.',
];

export const COMMUNITY_ADVISORIES = [
  {
    id: 'adv-pagasa',
    title: 'Verify Tropical Cyclone Bulletins via DOST-PAGASA',
    body: 'Always cross-check storm tracks, rainfall warnings, and wind signals with official PAGASA channels and your local LGU DRRMO before traveling.',
    source: 'Preparedness Reminder · Official Channel Guidance',
  },
  {
    id: 'adv-phivolcs',
    title: 'Aftershock & Tsunami Awareness',
    body: 'In coastal communities, strong or prolonged ground shaking is itself a natural warning to move immediately to higher ground.',
    source: 'PHIVOLCS Standard Safety Principle',
  },
];

export const DEFAULT_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-supplies',
    title: 'Check your emergency supplies',
    description: 'Inspect water seals, food expiration dates, and first-aid stock.',
    frequency: 'monthly',
    enabled: true,
    lastCheckedAt: null,
  },
  {
    id: 'rem-plan',
    title: 'Review your family emergency plan',
    description: 'Confirm meeting spots and evacuation routes with everyone at home.',
    frequency: 'monthly',
    enabled: true,
    lastCheckedAt: null,
  },
  {
    id: 'rem-powerbank',
    title: 'Charge your power bank',
    description: 'Top up backup power banks and test flashlight batteries.',
    frequency: 'weekly',
    enabled: true,
    lastCheckedAt: null,
  },
  {
    id: 'rem-contacts',
    title: 'Check important emergency contact numbers',
    description: 'Verify your Circle of Safety and local Barangay DRRMO hotlines.',
    frequency: 'biweekly',
    enabled: true,
    lastCheckedAt: null,
  },
];
