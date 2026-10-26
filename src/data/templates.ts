import { EventState, EventType } from '../types';

export const STARTERS: Record<EventType, {
  title: string;
  budget: number;
  guests: number;
  city: string;
  notes: string;
  categories: { name: string; pct: number }[];
  schedule: { time: string; event: string; lead: string; location?: string }[];
  tasks: { text: string; weeks: number }[];
  vendors: { name: string; cat: string; quote: number; status: 'To Contact' | 'Quoted' | 'Booked' | 'Paid'; note?: string }[];
  guestsList: { name: string; count: number; rsvp: 'Confirmed' | 'Pending' | 'Declined'; diet: 'Veg' | 'Non-Veg' | 'Jain' | 'Vegan' | 'Halal' | 'Gluten-Free' | 'Any'; notes?: string; table?: string }[];
  ideas: { title: string; tag: 'Decor' | 'Food' | 'Activity' | 'Gift' | 'Music' | 'Tech'; detail: string }[];
}> = {
  wedding: {
    title: "Aarav & Maya's Royal Wedding Celebration",
    budget: 1200000,
    guests: 250,
    city: "Udaipur",
    notes: "Heritage palace vibe, fusion Rajasthani & Punjabi culinary counters, evening Sangeet with dance performances and acoustic welcoming.",
    categories: [
      { name: "Venue & Palace Booking", pct: 32 },
      { name: "Catering & Live Chaat Stations", pct: 28 },
      { name: "Decor, Floral & Brass Ambient Lights", pct: 12 },
      { name: "Photography & Cinematic 4K Film", pct: 10 },
      { name: "Bridal/Groom Attire & Styling", pct: 8 },
      { name: "DJ, Sound System & Sangeet Artists", pct: 6 },
      { name: "Contingency & Emergency Reserve", pct: 4 }
    ],
    schedule: [
      { time: "09:00 AM", event: "Vendor Check-in & Floral Stage Setup", lead: "Decorator", location: "Grand Courtyard" },
      { time: "11:30 AM", event: "Baraat Assembly, Dhol & Welcome Mocktails", lead: "Family", location: "Main Gate" },
      { time: "01:00 PM", event: "Gourmet Royal Lunch Buffet Opens", lead: "Caterer", location: "Dining Pavilion" },
      { time: "04:30 PM", event: "High Tea, Sunset Cocktails & Photo Lounge", lead: "Hospitality Lead", location: "Lakeside Terrace" },
      { time: "07:30 PM", event: "Grand Sangeet & Choreographed Family Dances", lead: "Emcee & DJ", location: "Heritage Ballroom" },
      { time: "10:30 PM", event: "Late Night Street Food Carts & Afterparty", lead: "Host", location: "Poolside Lawn" }
    ],
    tasks: [
      { text: "Confirm muhurat date and execute venue lease contract", weeks: 20 },
      { text: "Shortlist caterers and schedule full menu tasting", weeks: 14 },
      { text: "Send digital Save-the-Date video invites via WhatsApp", weeks: 12 },
      { text: "Book photography team & schedule pre-wedding sunset shoot", weeks: 10 },
      { text: "Lock bridal and groom outfits with final alterations", weeks: 6 },
      { text: "Rehearse Sangeet dance sequences with family members", weeks: 3 },
      { text: "Finalize guaranteed headcount & dietary split with caterer", weeks: 1 },
      { text: "Distribute day-of run sheets and contact directory to key leads", weeks: 0 }
    ],
    vendors: [
      { name: "Umaid Haveli Palace Grounds", cat: "Venue", quote: 384000, status: "Booked", note: "Advance 50% paid, generator backup included" },
      { name: "Royal Flavours Culinary Guild", cat: "Catering", quote: 336000, status: "Quoted", note: "Taste test approved, 8 live counters included" },
      { name: "Studio Stories Cinematic Photo", cat: "Photography", quote: 120000, status: "Booked", note: "Includes 2 reels + drone coverage" },
      { name: "Marigold Dreams Decor", cat: "Decor", quote: 144000, status: "To Contact", note: "Traditional brass lamps & eco-friendly florals" }
    ],
    guestsList: [
      { name: "Sharma Family", count: 4, rsvp: "Confirmed", diet: "Veg", notes: "VIP Front Row Seating", table: "Table 1" },
      { name: "Kapoor Family", count: 2, rsvp: "Pending", diet: "Non-Veg", notes: "Airport pickup requested", table: "Table 2" },
      { name: "Rohan & Riya Mehta", count: 2, rsvp: "Confirmed", diet: "Jain", notes: "College friends", table: "Table 4" },
      { name: "Anita & Vikram Oberoi", count: 3, rsvp: "Confirmed", diet: "Veg", notes: "Staying at palace suites", table: "Table 1" }
    ],
    ideas: [
      { title: "Personalized QR Audio Message Book", tag: "Activity", detail: "Guests scan table QR codes to leave 30-sec heartfelt voice notes for the couple." },
      { title: "Live Chaat & Kulfi Nitro Bar", tag: "Food", detail: "Interactive street-food carts during cocktail hour to keep high energy and crowd engagement." },
      { title: "Customized Sunglass Favors for Sangeet", tag: "Gift", detail: "Neon retro shades printed with hashtag #AaravMaya for the dance floor." },
      { title: "Live String Quartet for Baraat Entrance", tag: "Music", detail: "Fusion acoustic strings playing Bollywood melodies as guests arrive." }
    ]
  },

  birthday: {
    title: "Meera's 30th Boho Birthday Picnic & Brunch",
    budget: 160000,
    guests: 50,
    city: "Bengaluru",
    notes: "Outdoor botanical garden brunch, aesthetic bohemian rugs, acoustic guitarist, artisanal grazing charcuterie boards, signature spritzers.",
    categories: [
      { name: "Botanical Lawn Venue Rental", pct: 25 },
      { name: "Artisanal Catering & Custom Tiered Cake", pct: 35 },
      { name: "Boho Decor, Low Tables & Macrame Tents", pct: 18 },
      { name: "Acoustic Musician & Portable Sound", pct: 12 },
      { name: "Photography & Polaroid Photo Booth", pct: 6 },
      { name: "Drinks Reserve & Contingency", pct: 4 }
    ],
    schedule: [
      { time: "11:00 AM", event: "Lawn setup with boho rugs, floor cushions & low tables", lead: "Decorator", location: "Garden Lawn" },
      { time: "12:30 PM", event: "Guests arrive, floral welcome spritzers served", lead: "Host", location: "Bar Gazebo" },
      { time: "01:30 PM", event: "Cake cutting ceremony & candid Polaroid station", lead: "Host", location: "Picnic Tent" },
      { time: "02:00 PM", event: "Live acoustic indie set & gourmet brunch buffet", lead: "Musician", location: "Shaded Deck" },
      { time: "04:30 PM", event: "Garden lawn games (Giant Jenga & Cornhole)", lead: "Co-host", location: "Lawn" }
    ],
    tasks: [
      { text: "Confirm botanical lawn booking and rain contingency marquee", weeks: 6 },
      { text: "Finalize guest count and send RSVP link with dietary options", weeks: 4 },
      { text: "Design custom two-tier Earl Grey lavender celebration cake", weeks: 3 },
      { text: "Order custom photo backdrop and Polaroid guestbook album", weeks: 2 },
      { text: "Curate afternoon chill acoustic playlist for DJ transitions", weeks: 1 }
    ],
    vendors: [
      { name: "Green Meadows Botanical Sanctuary", cat: "Venue", quote: 40000, status: "Booked", note: "Includes garden lighting and lawn care" },
      { name: "The Pastry Studio Artisan Bakery", cat: "Cake", quote: 8500, status: "Booked", note: "Earl Grey & floral botanicals" },
      { name: "Boho Nest Styling Co.", cat: "Decor", quote: 28800, status: "Quoted", note: "Rugs, rattan lanterns, low wooden tables" }
    ],
    guestsList: [
      { name: "Ananya & Kabir", count: 2, rsvp: "Confirmed", diet: "Veg", notes: "Bringing acoustic backup amp", table: "Rug 1" },
      { name: "Vikram & Sneha", count: 2, rsvp: "Confirmed", diet: "Non-Veg", notes: "", table: "Rug 2" },
      { name: "Pooja Hegde", count: 1, rsvp: "Confirmed", diet: "Vegan", notes: "Vegan almond milk dessert", table: "Rug 1" }
    ],
    ideas: [
      { title: "DIY Floral Spritz & Mocktail Infusion Bar", tag: "Food", detail: "Guests craft bespoke drinks with edible rose petals, thyme sprigs, and artisanal sodas." },
      { title: "Instant Polaroid Guestbook Table", tag: "Activity", detail: "Guests snap instant retro photos, tape them into a leather album with handwritten messages." },
      { title: "Succulent Favors with Name Calligraphy", tag: "Gift", detail: "Mini potted succulents double as personalized table seating placecards." }
    ]
  },

  anniversary: {
    title: "Raj & Sunita's 25th Silver Jubilee Gala",
    budget: 650000,
    guests: 120,
    city: "Mumbai",
    notes: "Elegant silver and white twilight theme, jazz trio, nostalgic memory timeline gallery, fine dining 4-course banquet.",
    categories: [
      { name: "Rooftop Sea-View Banquet Hall", pct: 30 },
      { name: "4-Course Fine Dining & Cocktail Bar", pct: 32 },
      { name: "Silver & Candlelight Floral Decor", pct: 15 },
      { name: "Jazz Band, Saxophonist & Sound", pct: 10 },
      { name: "Cinematic Videography & Photo Wall", pct: 8 },
      { name: "Champagne Toast & Contingency", pct: 5 }
    ],
    schedule: [
      { time: "05:30 PM", event: "Memory Lane Photo Gallery & Cocktail Hour", lead: "Hospitality Lead", location: "Foyer Lounge" },
      { time: "07:00 PM", event: "Vow Renewal Ceremony & Silver Ring Exchange", lead: "Family Emcee", location: "Sunset Deck" },
      { time: "07:45 PM", event: "Grand Champagne Toast & Family Speeches", lead: "Best Friend", location: "Main Hall" },
      { time: "08:30 PM", event: "Fine Dining Plated Banquet Opens", lead: "Executive Chef", location: "Main Hall" },
      { time: "09:30 PM", event: "Retro 90s & Classic Jazz Dancing", lead: "Band Leader", location: "Dance Floor" }
    ],
    tasks: [
      { text: "Digitize 25 years of vintage family photographs for gallery", weeks: 8 },
      { text: "Confirm rooftop banquet contract and AV projection screens", weeks: 6 },
      { text: "Design commemorative silver return gifts with monogram", weeks: 4 },
      { text: "Coordinate secret family video surprise tribute", weeks: 2 },
      { text: "Final seating chart and wine pairing confirmation", weeks: 1 }
    ],
    vendors: [
      { name: "Sea Crest Horizon Rooftop", cat: "Venue", quote: 195000, status: "Booked", note: "Includes stage lighting and outdoor deck" },
      { name: "Velvet Fork Fine Catering", cat: "Catering", quote: 208000, status: "Booked", note: "4-course curated menu" },
      { name: "Bombay Jazz Collective", cat: "Music", quote: 65000, status: "Quoted", note: "Saxophone, keyboard, double bass" }
    ],
    guestsList: [
      { name: "Dr. Ashok & Meena Roy", count: 2, rsvp: "Confirmed", diet: "Veg", notes: "Vow renewal witnesses", table: "Silver Table" },
      { name: "Sameer & Devika", count: 2, rsvp: "Confirmed", diet: "Non-Veg", notes: "Giving evening toast", table: "Table 1" }
    ],
    ideas: [
      { title: "25-Year Nostalgia Timeline Wall", tag: "Decor", detail: "A gallery exhibition of photos from each year of marriage from 2001 to 2026." },
      { title: "Signature 'Silver Sparkle' Cocktail", tag: "Food", detail: "Gin or elderflower mocktail infused with edible silver luster dust." },
      { title: "Monogrammed Silver Keepsake Boxes", tag: "Gift", detail: "Custom engraved silver trinket boxes filled with gourmet artisanal chocolates." }
    ]
  },

  corporate: {
    title: "Apex Horizon Tech Leadership Summit & Gala",
    budget: 950000,
    guests: 180,
    city: "Hyderabad",
    notes: "High-impact tech summit followed by celebratory award gala, dual stage AV projection, networking cocktail lounge, seated dinner.",
    categories: [
      { name: "Convention Center Auditorium & Lounge", pct: 30 },
      { name: "High-End AV, LED Wall & Staging", pct: 22 },
      { name: "Gourmet Multi-Cuisine Dinner & Canapés", pct: 26 },
      { name: "Keynote Speaker & Emcee", pct: 10 },
      { name: "Event Production & Digital Badges", pct: 7 },
      { name: "Contingency & Technical Backup", pct: 5 }
    ],
    schedule: [
      { time: "01:30 PM", event: "Delegate Registration & Digital Badge Collection", lead: "Reception Desk", location: "Grand Foyer" },
      { time: "02:30 PM", event: "Opening Keynote: Future of Autonomous Tech", lead: "Keynote Speaker", location: "Auditorium" },
      { time: "04:15 PM", event: "Networking Coffee & Innovation Demo Stations", lead: "Event Host", location: "Expo Hall" },
      { time: "06:30 PM", event: "Annual Excellence Awards Ceremony", lead: "Executive Team", location: "Main Stage" },
      { time: "08:00 PM", event: "Cocktail Reception & Executive Plated Dinner", lead: "Caterer", location: "Dining Pavilion" }
    ],
    tasks: [
      { text: "Book convention venue with high-speed 1Gbps redundant internet", weeks: 12 },
      { text: "Confirm keynote speakers and sign appearance riders", weeks: 10 },
      { text: "Publish RSVP portal and coordinate speaker travel bookings", weeks: 8 },
      { text: "Finalize LED wall motion graphics and award trophy engraving", weeks: 3 },
      { text: "Dry run AV rehearsal and teleprompter testing", weeks: 1 }
    ],
    vendors: [
      { name: "Cyber Heights Convention Arena", cat: "Venue", quote: 285000, status: "Booked", note: "Auditorium + 2 breakout halls" },
      { name: "Apex Visual Staging Solutions", cat: "AV Production", quote: 209000, status: "Booked", note: "Dual 4K LED screens + digital audio" },
      { name: "Grand Meridian Executive Catering", cat: "Catering", quote: 247000, status: "Quoted", note: "Plated 3-course dinner" }
    ],
    guestsList: [
      { name: "Siddharth Rao (VP Engineering)", count: 1, rsvp: "Confirmed", diet: "Veg", notes: "Keynote Speaker", table: "VIP 1" },
      { name: "Elena Vasquez (Director Product)", count: 1, rsvp: "Confirmed", diet: "Non-Veg", notes: "Award Nominee", table: "VIP 1" }
    ],
    ideas: [
      { title: "NFC Smart Networking Badges", tag: "Tech", detail: "Delegates tap badges together to instantaneously swap LinkedIn contact details." },
      { title: "Live Infographic Sketch Artist", tag: "Activity", detail: "An illustrator live-draws keynote insights on a digital wall during presentations." },
      { title: "Curated Executive Tech Gift Kit", tag: "Gift", detail: "Matte black wireless power bank and leather notebook embossed with summit insignia." }
    ]
  },

  community: {
    title: "Diwali Community Lights Festival & Carnival",
    budget: 450000,
    guests: 350,
    city: "Delhi",
    notes: "Vibrant neighborhood community festival, live folk music, artisan handicraft bazaar, traditional sweets mela, rangoli competition.",
    categories: [
      { name: "Community Grounds & Stage Tent", pct: 28 },
      { name: "Artisan Food Stalls & Mithai Counters", pct: 30 },
      { name: "Fairy Lights, Lanterns & Floral Gate", pct: 18 },
      { name: "Folk Dancers, Sound & Stage PA", pct: 12 },
      { name: "Security, Waste Management & Permits", pct: 7 },
      { name: "Contingency Fund", pct: 5 }
    ],
    schedule: [
      { time: "03:00 PM", event: "Artisan Handicraft Bazaar & Sweets Stalls Open", lead: "Bazaar Lead", location: "Community Grounds" },
      { time: "04:30 PM", event: "Grand Community Rangoli Competition", lead: "Culture Committee", location: "Central Plaza" },
      { time: "06:00 PM", event: "Ceremonial 1000-Diya Lighting & Prayers", lead: "Elders Committee", location: "Stage Lawn" },
      { time: "07:00 PM", event: "Live Folk Music, Dhol & Cultural Performances", lead: "Stage Manager", location: "Main Stage" },
      { time: "09:00 PM", event: "Eco-Friendly Laser Light & Music Spectacular", lead: "Tech Lead", location: "Skyline Lawn" }
    ],
    tasks: [
      { text: "Secure municipal grounds permit and fire clearance", weeks: 8 },
      { text: "Coordinate artisan vendor stalls and food hygiene licenses", weeks: 6 },
      { text: "Book electrical generator and warm golden fairy light rigging", weeks: 4 },
      { text: "Register entries for rangoli and youth talent competitions", weeks: 2 },
      { text: "Setup waste segregation stations and volunteer orientation", weeks: 1 }
    ],
    vendors: [
      { name: "Shanti Community Park Grounds", cat: "Venue", quote: 126000, status: "Booked", note: "Permits approved" },
      { name: "Laxmi Caterers & Halwai Union", cat: "Catering", quote: 135000, status: "Booked", note: "Live jalebi & chaat counters" },
      { name: "Illumina Festoon Light Rigging", cat: "Decor", quote: 81000, status: "To Contact", note: "10,000 warm white micro LEDs" }
    ],
    guestsList: [
      { name: "Verma Family", count: 5, rsvp: "Confirmed", diet: "Veg", notes: "Participating in Rangoli contest", table: "Stall 1" },
      { name: "Gupta Family", count: 4, rsvp: "Confirmed", diet: "Veg", notes: "Volunteer coordinator", table: "Stall 3" }
    ],
    ideas: [
      { title: "Grand 1000-Diya Lighting Pattern", tag: "Activity", detail: "Community members collectively light clay lamps arranged in sacred geometric mandalas." },
      { title: "Live Jalebi & Rabri Live Counter", tag: "Food", detail: "Fresh hot jalebis piped before guests served with chilled saffron rabri." },
      { title: "Clay Diya Painting Workshop for Kids", tag: "Activity", detail: "Children paint terracotta diyas to take home and decorate their doorways." }
    ]
  },

  party: {
    title: "Summer Solstice Garden Soiree",
    budget: 120000,
    guests: 40,
    city: "Goa",
    notes: "Sunset beach villa lawn, tropical mocktails & cocktails, wood-fired pizza oven, chilled house music beats, bonfire pit.",
    categories: [
      { name: "Beach Villa Lawn Rental", pct: 30 },
      { name: "Live Wood-Fired Pizza & Tapas", pct: 35 },
      { name: "Fairy Lights, Lanterns & Firepit", pct: 15 },
      { name: "Sunset DJ & Acoustic Speaker Setup", pct: 12 },
      { name: "Contingency & Ice Reserve", pct: 8 }
    ],
    schedule: [
      { time: "04:30 PM", event: "Guest arrivals & chilled tropical welcome drinks", lead: "Host", location: "Lawn" },
      { time: "05:45 PM", event: "Golden hour sunset photos by the beachside", lead: "Photographer", location: "Beach Deck" },
      { time: "07:00 PM", event: "Fresh artisanal wood-fired pizzas served hot", lead: "Pizza Chef", location: "Garden Oven" },
      { time: "08:30 PM", event: "Bonfire pit lighting, acoustic sing-along & dancing", lead: "Host", location: "Firepit" }
    ],
    tasks: [
      { text: "Confirm villa lawn rental and beach gate access", weeks: 4 },
      { text: "Book wood-fired mobile pizza caterer and menu choices", weeks: 3 },
      { text: "Rent string lights, low wooden seating, and firepit wood", weeks: 2 },
      { text: "Buy specialty beverage mixes, fresh fruit and ice", weeks: 1 }
    ],
    vendors: [
      { name: "Casa Bella Beach Villa", cat: "Venue", quote: 36000, status: "Booked", note: "Includes lawn and pool deck" },
      { name: "Artisan Crust Mobile Ovens", cat: "Catering", quote: 42000, status: "Booked", note: "4 pizza varieties + garlic breads" }
    ],
    guestsList: [
      { name: "Sameer & Tanya", count: 2, rsvp: "Confirmed", diet: "Veg", notes: "Bringing acoustic guitar" },
      { name: "Zoya", count: 1, rsvp: "Confirmed", diet: "Non-Veg", notes: "" }
    ],
    ideas: [
      { title: "DIY S'mores Bar by the Firepit", tag: "Food", detail: "Marshmallows, artisanal graham crackers and dark chocolate skewers over open flames." },
      { title: "Sunset Polaroids on Twine Wall", tag: "Activity", detail: "Guests peg their instant photos along fairy-lit jute twine strings." }
    ]
  },

  other: {
    title: "Special Celebration & Gathering",
    budget: 200000,
    guests: 60,
    city: "Mumbai",
    notes: "A memorable gathering celebrating special milestones with great cuisine, ambient decor, and meaningful moments.",
    categories: [
      { name: "Venue Booking & Layout", pct: 30 },
      { name: "Catering & Refreshments", pct: 35 },
      { name: "Decor & Lighting", pct: 15 },
      { name: "Entertainment & Sound", pct: 12 },
      { name: "Contingency Fund", pct: 8 }
    ],
    schedule: [
      { time: "11:00 AM", event: "Setup & Sound Check", lead: "Host", location: "Main Hall" },
      { time: "12:00 PM", event: "Guest Arrival & Welcome Refreshments", lead: "Reception", location: "Entrance" },
      { time: "01:00 PM", event: "Main Celebration & Speeches", lead: "Host", location: "Stage" },
      { time: "01:45 PM", event: "Lunch Buffet & Socializing", lead: "Caterer", location: "Dining Area" }
    ],
    tasks: [
      { text: "Confirm venue and deposit", weeks: 6 },
      { text: "Send invitations to all guests", weeks: 4 },
      { text: "Finalize menu and dietary selections", weeks: 2 },
      { text: "Final headcount check", weeks: 1 }
    ],
    vendors: [
      { name: "Celebration Hall", cat: "Venue", quote: 60000, status: "Booked", note: "Includes tables and chairs" }
    ],
    guestsList: [
      { name: "Guest of Honor", count: 2, rsvp: "Confirmed", diet: "Veg", notes: "Front row" }
    ],
    ideas: [
      { title: "Guest Memory Book", tag: "Activity", detail: "A beautiful guestbook for signatures, advice, and blessings." }
    ]
  }
};

export const COLORS = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F59E0B', // Amber
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#10B981', // Emerald
  '#F43F5E', // Rose
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#64748B'  // Slate
];

export function buildStateFromTemplate(type: EventType, customTitle?: string): EventState {
  const tpl = STARTERS[type] || STARTERS.wedding;
  const future = new Date();
  future.setDate(future.getDate() + 45);

  const totalB = tpl.budget;
  let allocated = 0;
  const budgetRows = tpl.categories.map((c, i) => {
    let amt = Math.round((c.pct / 100) * totalB / 1000) * 1000;
    if (i === tpl.categories.length - 1) amt = Math.max(0, totalB - allocated);
    allocated += amt;
    return {
      id: Math.random().toString(36).substring(2, 9),
      name: c.name,
      planned: amt,
      spent: Math.round(amt * 0.2),
      color: COLORS[i % COLORS.length]
    };
  });

  return {
    theme: 'light',
    name: customTitle || tpl.title,
    type,
    date: future.toISOString().split('T')[0],
    guests: tpl.guests,
    budget: tpl.budget,
    currency: '₹',
    city: tpl.city,
    notes: tpl.notes,
    activeTab: 'budget',
    budgetRows,
    tasks: tpl.tasks.map(t => ({
      id: Math.random().toString(36).substring(2, 9),
      text: t.text,
      weeks: t.weeks,
      done: false
    })),
    schedule: tpl.schedule.map(s => ({
      id: Math.random().toString(36).substring(2, 9),
      time: s.time,
      event: s.event,
      lead: s.lead,
      location: s.location
    })),
    vendors: tpl.vendors.map(v => ({
      id: Math.random().toString(36).substring(2, 9),
      ...v
    })),
    guestList: tpl.guestsList.map(g => ({
      id: Math.random().toString(36).substring(2, 9),
      ...g
    })),
    ideas: tpl.ideas.map(i => ({
      id: Math.random().toString(36).substring(2, 9),
      ...i
    }))
  };
}
