import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Event from "../models/event.models.js";
import Seat from "../models/seat.models.js";

dotenv.config();

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
const COLS = 12;

const DUMMY_EVENTS = [
  {
    name: "Coldplay: Music of the Spheres World Tour",
    date: new Date("2025-08-15T19:00:00.000Z"),
    venue: "Narendra Modi Stadium, Ahmedabad",
    totalSeats: 50,
    category: "Music",
    description: "Experience the most spectacular light show on earth with Coldplay live.",
    imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800",
  },
  {
    name: "Arijit Singh Live in Concert",
    date: new Date("2025-09-05T19:30:00.000Z"),
    venue: "MMRDA Grounds, Mumbai",
    totalSeats: 50,
    category: "Music",
    description: "An enchanting night of soulful Bollywood music with India's favourite vocalist.",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
  },
  {
    name: "Diljit Dosanjh: Dil-Luminati Tour",
    date: new Date("2025-10-12T20:00:00.000Z"),
    venue: "JLN Stadium, New Delhi",
    totalSeats: 50,
    category: "Music",
    description: "Punjab's biggest global superstar brings the party to India.",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
  },
  {
    name: "AR Rahman: Harmony of Nations",
    date: new Date("2025-11-01T18:30:00.000Z"),
    venue: "Palace Grounds, Bengaluru",
    totalSeats: 50,
    category: "Music",
    description: "Oscar-winning maestro AR Rahman performs his greatest hits live.",
    imageUrl: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=800",
  },
  {
    name: "Ed Sheeran: Mathematics Tour",
    date: new Date("2025-12-10T19:00:00.000Z"),
    venue: "D.Y. Patil Stadium, Navi Mumbai",
    totalSeats: 50,
    category: "Music",
    description: "Ed Sheeran returns to India for an intimate acoustic evening.",
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
  },
  {
    name: "Electronic Euphoria — EDM Night",
    date: new Date("2025-08-22T21:00:00.000Z"),
    venue: "Mahalaxmi Race Course, Mumbai",
    totalSeats: 50,
    category: "Music",
    description: "Martin Garrix, Hardwell & KSHMR headline India's biggest EDM festival.",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
  },
  {
    name: "Shankar-Ehsaan-Loy Live",
    date: new Date("2025-07-18T19:00:00.000Z"),
    venue: "Bandra Fort Amphitheatre, Mumbai",
    totalSeats: 50,
    category: "Music",
    description: "A musical journey through 3 decades of Bollywood's greatest compositions.",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800",
  },
  {
    name: "Nucleya Bass Yatra 2025",
    date: new Date("2025-09-27T21:00:00.000Z"),
    venue: "Koramangala Indoor Stadium, Bengaluru",
    totalSeats: 50,
    category: "Music",
    description: "India's bass king Nucleya performs a mind-bending set of original music.",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
  },
  {
    name: "Sunburn Arena ft. Tiësto",
    date: new Date("2025-10-04T22:00:00.000Z"),
    venue: "HITEX Exhibition Centre, Hyderabad",
    totalSeats: 50,
    category: "Music",
    description: "Legendary DJ Tiësto takes over Sunburn Arena for one epic night.",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
  },
  {
    name: "Asha Bhosle: 90 Years of Music",
    date: new Date("2025-11-15T18:00:00.000Z"),
    venue: "Siri Fort Auditorium, New Delhi",
    totalSeats: 50,
    category: "Music",
    description: "A tribute concert celebrating 90 extraordinary years of music legend Asha Bhosle.",
    imageUrl: "https://images.unsplash.com/photo-1488554378835-f7acf46e6c98?w=800",
  },
  {
    name: "Indian Ocean: 35th Anniversary Tour",
    date: new Date("2025-08-30T19:30:00.000Z"),
    venue: "Hard Rock Cafe, Bengaluru",
    totalSeats: 50,
    category: "Music",
    description: "India's iconic fusion rock band celebrates 35 years of groundbreaking music.",
    imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800",
  },
  {
    name: "Kailash Kher: Kailasa Live",
    date: new Date("2025-12-20T19:00:00.000Z"),
    venue: "Nehru Centre, Mumbai",
    totalSeats: 50,
    category: "Music",
    description: "Sufi rock legend Kailash Kher performs his most beloved songs.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
  },
  {
    name: "Shreya Ghoshal: Unplugged",
    date: new Date("2025-07-25T19:00:00.000Z"),
    venue: "Ravindra Natya Mandir, Mumbai",
    totalSeats: 50,
    category: "Music",
    description: "A rare, intimate unplugged evening with Bollywood's nightingale.",
    imageUrl: "https://images.unsplash.com/photo-1499415479124-43c32433a620?w=800",
  },
  {
    name: "Amit Trivedi: Songs of Cinema",
    date: new Date("2025-09-13T19:30:00.000Z"),
    venue: "Phoenix Palladium, Mumbai",
    totalSeats: 50,
    category: "Music",
    description: "Composer extraordinaire Amit Trivedi performs Bollywood hits live on stage.",
    imageUrl: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=800",
  },
  {
    name: "Raghu Dixit Project Live",
    date: new Date("2025-10-25T20:00:00.000Z"),
    venue: "Blue Frog, Mumbai",
    totalSeats: 50,
    category: "Music",
    description: "An electrifying fusion of folk and rock with the Raghu Dixit Project.",
    imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800",
  },
  {
    name: "IPL Finals 2025",
    date: new Date("2025-06-01T14:00:00.000Z"),
    venue: "Wankhede Stadium, Mumbai",
    totalSeats: 50,
    category: "Sports",
    description: "The grand finale of the Indian Premier League 2025 season.",
    imageUrl: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800",
  },
  {
    name: "Pro Kabaddi League Grand Finale",
    date: new Date("2025-11-20T18:30:00.000Z"),
    venue: "EKA Arena, Ahmedabad",
    totalSeats: 50,
    category: "Sports",
    description: "Watch India's most electrifying kabaddi teams battle for the trophy.",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800",
  },
  {
    name: "India vs Australia: ODI Series Match 3",
    date: new Date("2025-09-14T09:30:00.000Z"),
    venue: "M. Chinnaswamy Stadium, Bengaluru",
    totalSeats: 50,
    category: "Sports",
    description: "The ultimate cricket showdown between two powerhouses in ODI format.",
    imageUrl: "https://images.unsplash.com/photo-1540747913346-19212a4b423a?w=800",
  },
  {
    name: "Indian Super League Derby: Mumbai vs Bengaluru",
    date: new Date("2025-10-08T19:30:00.000Z"),
    venue: "Mumbai Football Arena, Mumbai",
    totalSeats: 50,
    category: "Sports",
    description: "The fiercest rivalry in Indian football reaches its boiling point.",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800",
  },
  {
    name: "Badminton World Federation India Open",
    date: new Date("2025-07-12T10:00:00.000Z"),
    venue: "K.D. Jadhav Wrestling Hall, New Delhi",
    totalSeats: 50,
    category: "Sports",
    description: "Watch world-class badminton players compete for the India Open crown.",
    imageUrl: "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=800",
  },
  {
    name: "Formula E India Grand Prix",
    date: new Date("2025-12-06T14:00:00.000Z"),
    venue: "Buddh International Circuit, Greater Noida",
    totalSeats: 50,
    category: "Sports",
    description: "Electric speed at its finest — the ABB FIA Formula E World Championship.",
    imageUrl: "https://images.unsplash.com/photo-1558985250-27a406d64cb3?w=800",
  },
  {
    name: "Wrestlemania India Invitational",
    date: new Date("2025-08-03T15:00:00.000Z"),
    venue: "Thyagaraj Stadium, New Delhi",
    totalSeats: 50,
    category: "Sports",
    description: "India's premier professional wrestling event featuring top talent.",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800",
  },
  {
    name: "Chess Olympiad Open Tournament",
    date: new Date("2025-09-22T09:00:00.000Z"),
    venue: "Chennai Trade Centre, Chennai",
    totalSeats: 50,
    category: "Sports",
    description: "Watch grandmasters duel at the board in this open invitation tournament.",
    imageUrl: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=800",
  },
  {
    name: "Mumbai Marathon 2025 — Expo & Ceremony",
    date: new Date("2026-01-18T06:00:00.000Z"),
    venue: "CSMT Grounds, Mumbai",
    totalSeats: 50,
    category: "Sports",
    description: "Join the celebration at Asia's largest marathon — opening ceremony & expo.",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
  },
  {
    name: "Premiere Padel India Masters",
    date: new Date("2025-11-08T11:00:00.000Z"),
    venue: "NSCI Dome, Mumbai",
    totalSeats: 50,
    category: "Sports",
    description: "The fastest-growing racket sport comes to India with world-class talent.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  },
  {
    name: "Standup Night with Zakir Khan",
    date: new Date("2025-07-20T20:00:00.000Z"),
    venue: "Chhatrapati Shivaji Hall, Pune",
    totalSeats: 50,
    category: "Comedy",
    description: "A hilarious evening with the Sakht Launda himself.",
    imageUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800",
  },
  {
    name: "Biswa Kalyan Rath: Biswa Mast Aadmi",
    date: new Date("2025-08-09T20:30:00.000Z"),
    venue: "Siri Fort Auditorium, New Delhi",
    totalSeats: 50,
    category: "Comedy",
    description: "Nerdy, sharp, witty — Biswa is back with an all-new stand-up special.",
    imageUrl: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800",
  },
  {
    name: "Kenny Sebastian: Don't Be That Guy",
    date: new Date("2025-10-17T20:00:00.000Z"),
    venue: "Jamshed Bhabha Theatre, Mumbai",
    totalSeats: 50,
    category: "Comedy",
    description: "India's most relatable comedian is back with fresh observations about life.",
    imageUrl: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=800",
  },
  {
    name: "Abhishek Upmanyu: Thoda Pakao",
    date: new Date("2025-09-06T20:00:00.000Z"),
    venue: "Stein Auditorium, New Delhi",
    totalSeats: 50,
    category: "Comedy",
    description: "The most talked-about comedian of 2025 with an hour of pure laughter.",
    imageUrl: "https://images.unsplash.com/photo-1485178575877-1a13bf489dfe?w=800",
  },
  {
    name: "Comedy Nights: The Roast Edition",
    date: new Date("2025-11-29T21:00:00.000Z"),
    venue: "Canvas Laugh Club, Mumbai",
    totalSeats: 50,
    category: "Comedy",
    description: "India's top comedians take turns roasting each other — no one is safe.",
    imageUrl: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800",
  },
  {
    name: "Kunal Kamra: Main Pareshaan Hoon",
    date: new Date("2025-12-14T20:00:00.000Z"),
    venue: "G5A Warehouse, Mumbai",
    totalSeats: 50,
    category: "Comedy",
    description: "Kunal Kamra brings his trademark political satire and wit to the stage.",
    imageUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800",
  },
  {
    name: "Ladies Compartment — All Women Comedy Night",
    date: new Date("2025-10-31T20:30:00.000Z"),
    venue: "MyMuse Studio, Bengaluru",
    totalSeats: 50,
    category: "Comedy",
    description: "An uproarious all-women comedy lineup — shatter stereotypes one punchline at a time.",
    imageUrl: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=800",
  },
  {
    name: "Open Mic Spectacular — 25 Comedians",
    date: new Date("2025-08-16T19:00:00.000Z"),
    venue: "The Comedy Store India, Mumbai",
    totalSeats: 50,
    category: "Comedy",
    description: "25 rising stand-up stars battle it out on one stage for laughs and glory.",
    imageUrl: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800",
  },
  {
    name: "Mughal-E-Azam: The Musical",
    date: new Date("2025-09-19T19:00:00.000Z"),
    venue: "Prithvi Theatre, Mumbai",
    totalSeats: 50,
    category: "Theatre",
    description: "The epic love story of Salim and Anarkali reimagined as a Broadway-style musical.",
    imageUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800",
  },
  {
    name: "Hamlet — Directed by Anurag Kashyap",
    date: new Date("2025-10-03T19:30:00.000Z"),
    venue: "NCPA, Mumbai",
    totalSeats: 50,
    category: "Theatre",
    description: "A bold, contemporary reimagining of Shakespeare's greatest tragedy.",
    imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800",
  },
  {
    name: "Tumhari Amrita — 30th Anniversary Show",
    date: new Date("2025-11-07T19:00:00.000Z"),
    venue: "Shanmukhananda Hall, Mumbai",
    totalSeats: 50,
    category: "Theatre",
    description: "The iconic two-hander play with Shabana Azmi celebrates 30 years on stage.",
    imageUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800",
  },
  {
    name: "Black Comedy Improv Night",
    date: new Date("2025-08-23T20:00:00.000Z"),
    venue: "The Hive, Bengaluru",
    totalSeats: 50,
    category: "Theatre",
    description: "Unscripted, unrehearsed, and completely unpredictable — pure improv comedy theatre.",
    imageUrl: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800",
  },
  {
    name: "Ramayana: The Epic — Shadow Puppet Show",
    date: new Date("2025-12-24T17:00:00.000Z"),
    venue: "Crafts Museum Amphitheatre, New Delhi",
    totalSeats: 50,
    category: "Theatre",
    description: "A mesmerising retelling of the Ramayana through traditional shadow puppetry.",
    imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800",
  },
  {
    name: "The Lion King India Tour",
    date: new Date("2025-09-28T15:00:00.000Z"),
    venue: "G.D. Birla Sabhaghar, Kolkata",
    totalSeats: 50,
    category: "Theatre",
    description: "Disney's award-winning The Lion King musical comes to India for the first time.",
    imageUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800",
  },
  {
    name: "Monologues of a Housewife",
    date: new Date("2025-07-12T19:30:00.000Z"),
    venue: "Ranga Shankara, Bengaluru",
    totalSeats: 50,
    category: "Theatre",
    description: "A powerful solo performance exploring the inner life of an Indian homemaker.",
    imageUrl: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800",
  },
  {
    name: "Google I/O Extended India",
    date: new Date("2025-07-05T09:00:00.000Z"),
    venue: "Bangalore International Exhibition Centre",
    totalSeats: 50,
    category: "Tech",
    description: "The official extended event for Google I/O — sessions, workshops, and demos.",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
  },
  {
    name: "India AI Summit 2025",
    date: new Date("2025-10-22T09:30:00.000Z"),
    venue: "Bharat Mandapam, New Delhi",
    totalSeats: 50,
    category: "Tech",
    description: "India's premier AI conference with visionaries, researchers, and policymakers.",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
  },
  {
    name: "JSConf India 2025",
    date: new Date("2025-11-28T09:00:00.000Z"),
    venue: "The Lalit, Bengaluru",
    totalSeats: 50,
    category: "Tech",
    description: "A two-day deep dive into the JavaScript ecosystem with world-class speakers.",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
  },
  {
    name: "Startup Mahakumbh 2025",
    date: new Date("2026-02-14T10:00:00.000Z"),
    venue: "Bharat Mandapam, New Delhi",
    totalSeats: 50,
    category: "Tech",
    description: "Asia's largest startup ecosystem event — pitch, network, and get funded.",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
  },
  {
    name: "PyCon India 2025",
    date: new Date("2025-09-20T09:00:00.000Z"),
    venue: "IIIT Hyderabad Campus",
    totalSeats: 50,
    category: "Tech",
    description: "India's largest annual gathering of the Python programming community.",
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",
  },
  {
    name: "Mumbai Street Food Festival",
    date: new Date("2025-10-18T11:00:00.000Z"),
    venue: "Juhu Beach, Mumbai",
    totalSeats: 50,
    category: "Food",
    description: "300+ street food stalls, live cooking battles, and celebrity chef showdowns.",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
  },
  {
    name: "India Craft Beer Festival",
    date: new Date("2025-11-22T14:00:00.000Z"),
    venue: "High Grounds, Bengaluru",
    totalSeats: 50,
    category: "Food",
    description: "Taste 100+ craft beers from 40 Indian microbreweries in one place.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  },
  {
    name: "Culinary Masters Masterclass — Gordon Ramsay",
    date: new Date("2025-12-05T11:00:00.000Z"),
    venue: "JW Marriott Ballroom, Mumbai",
    totalSeats: 50,
    category: "Food",
    description: "A once-in-a-lifetime masterclass with the world's most famous chef.",
    imageUrl: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800",
  },
  {
    name: "Goa International Food & Music Festival",
    date: new Date("2025-12-28T12:00:00.000Z"),
    venue: "Calangute Beach Grounds, Goa",
    totalSeats: 50,
    category: "Food",
    description: "Three days of world cuisine, cocktails, and live beach music.",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
  },
  {
    name: "Delhi Nagaland Food Trail",
    date: new Date("2025-09-06T11:00:00.000Z"),
    venue: "Dilli Haat, New Delhi",
    totalSeats: 50,
    category: "Food",
    description: "Explore the rich flavours and culture of Northeast India at Dilli Haat.",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
  },
];

const generateSeats = (eventId, price) => {
  const seats = [];
  for (const row of ROWS) {
    for (let col = 1; col <= COLS; col++) {
      const rand = Math.random();
      let status = "available";
      if (rand > 0.9) {
        status = "reserved";
      } else if (rand > 0.6) {
        status = "booked";
      }

      seats.push({ eventId, seatNumber: `${row}${col}`, status, price });
    }
  }
  return seats;
};

const seed = async () => {
  await connectDB();
  console.log("🌱  Starting seed...\n");

  await Event.deleteMany({});
  await Seat.deleteMany({});
  console.log("🗑   Cleared existing Events and Seats.\n");

  const eventsWithPrices = DUMMY_EVENTS.map(event => ({
    ...event,
    totalSeats: ROWS.length * COLS,
    ticketPrice: Math.floor(Math.random() * 15 + 5) * 100 // Between 500 and 2000
  }));

  const events = await Event.insertMany(eventsWithPrices);
  console.log(`✅  Inserted ${events.length} events.\n`);

  let totalSeats = 0;
  for (const event of events) {
    const seats = generateSeats(event._id, event.ticketPrice);
    await Seat.insertMany(seats);
    totalSeats += seats.length;
    console.log(`   [${event.category.padEnd(8)}] ${seats.length} seats → "${event.name}"`);
  }

  console.log(`\n✅  Total seats created : ${totalSeats}`);
  console.log(`🎉  Seed complete — ${events.length} events ready!\n`);

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  mongoose.disconnect();
  process.exit(1);
});
