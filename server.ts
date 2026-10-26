import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for generating structured AI Event Plan
app.post('/api/ai/plan', async (req, res) => {
  const { name, type, budget, guests, city, notes } = req.body;
  const totalB = Number(budget) || 500000;
  const guestCount = Number(guests) || 100;

  try {
    if (process.env.GEMINI_API_KEY) {
      const prompt = `You are a world-class luxury celebration and event producer. Generate a detailed, realistic, and complete event plan.
Event Name: ${name || 'Celebration'}
Type: ${type || 'wedding'}
Total Budget: ${totalB}
Guest Count: ${guestCount}
City/Location: ${city || 'India'}
Vision & Preferences: ${notes || 'Memorable, vibrant experience with great food and entertainment'}.

Provide a JSON object with:
1. "categories": array of 6-8 budget categories with "name" (descriptive category title) and "pct" (percentage integer summing to 100).
2. "tasks": array of 6-9 chronological milestone tasks with "text" (actionable instruction) and "weeks" (number of weeks before the event, descending from e.g. 16 down to 0).
3. "schedule": array of 5-8 day-of timeline cues with "time" (e.g. "10:30 AM"), "event" (activity description), "lead" (role/person responsible), and "location" (room/area).
4. "vendors": array of 4-6 recommended vendor categories with "name" (suggested company/profile name), "cat" (category), "quote" (estimated amount in local currency matching budget split), "status" (one of: "To Contact", "Quoted", "Booked"), "note" (special requirement).
5. "ideas": array of 4 creative ideas with "title" (engaging concept title), "tag" (one of: "Decor", "Food", "Activity", "Gift", "Music", "Tech"), "detail" (clear 1-2 sentence description).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              categories: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    pct: { type: Type.NUMBER }
                  },
                  required: ['name', 'pct']
                }
              },
              tasks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    weeks: { type: Type.NUMBER }
                  },
                  required: ['text', 'weeks']
                }
              },
              schedule: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING },
                    event: { type: Type.STRING },
                    lead: { type: Type.STRING },
                    location: { type: Type.STRING }
                  },
                  required: ['time', 'event', 'lead']
                }
              },
              vendors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    cat: { type: Type.STRING },
                    quote: { type: Type.NUMBER },
                    status: { type: Type.STRING },
                    note: { type: Type.STRING }
                  },
                  required: ['name', 'cat', 'quote', 'status']
                }
              },
              ideas: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    tag: { type: Type.STRING },
                    detail: { type: Type.STRING }
                  },
                  required: ['title', 'tag', 'detail']
                }
              }
            },
            required: ['categories', 'tasks', 'schedule', 'vendors', 'ideas']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, plan: parsed, source: 'gemini' });
    }
  } catch (err) {
    console.warn('Gemini API call failed, using intelligent simulation fallback:', err);
  }

  // Domain-smart algorithmic fallback
  const simulated = generateSmartFallbackPlan(type, totalB, guestCount, city, notes);
  res.json({ success: true, plan: simulated, source: 'fallback' });
});

// Helper for WhatsApp / Email Invitation Generator
app.post('/api/ai/invite', async (req, res) => {
  const { name, type, date, city, notes, guests, tone } = req.body;

  try {
    if (process.env.GEMINI_API_KEY) {
      const prompt = `Draft 3 distinct invitation options for an upcoming event:
Event Name: ${name || 'Celebration'}
Type: ${type || 'event'}
Date: ${date || 'Upcoming'}
Location: ${city || 'Special Venue'}
Host Vision/Notes: ${notes || 'Join us to celebrate'}
Tone preference: ${tone || 'Warm, elegant, and celebratory'}

Return a JSON with:
{
  "whatsapp": "A formatted WhatsApp message with appropriate celebratory emojis, bold text using asterisks, clear event time/place cues, and an RSVP note.",
  "email": "A formal, beautifully written email invitation with subject line and complete body text.",
  "sms": "A concise, elegant 2-sentence SMS reminder with date, venue, and quick RSVP call-to-action."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, invites: parsed, source: 'gemini' });
    }
  } catch (err) {
    console.warn('Gemini invite generation failed, using template fallback:', err);
  }

  const d = date ? new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Date TBA';
  const whatsapp = `🎉 *YOU'RE CORDIALLY INVITED!* 🎉\n\nJoin us as we celebrate *${name || 'Our Special Occasion'}*!\n\n📅 *Date:* ${d}\n📍 *Venue:* ${city || 'Venue to be announced'}\n\n${notes ? `✨ *Note from Host:* ${notes}\n\n` : ''}Kindly RSVP at your earliest convenience to assist with seating and catering arrangements.\n\nWe look forward to raising a toast together! 🥂`;

  const email = `Subject: Invitation: Celebrating ${name || 'Our Milestone'} on ${d}\n\nDear Friends and Family,\n\nIt is our great pleasure to invite you to celebrate ${name || 'this milestone'} with us. We are gathering to create cherished memories, enjoy wonderful cuisine, and toast to new beginnings.\n\nEvent Details:\nDate: ${d}\nLocation: ${city || 'Special Venue'}\n\nPlease let us know if you will be able to join us by confirming your RSVP.\n\nWarmest regards,\nThe Host`;

  const sms = `You're invited to celebrate ${name || 'our special day'} on ${d} in ${city || 'town'}. Please RSVP: We can't wait to see you!`;

  res.json({ success: true, invites: { whatsapp, email, sms }, source: 'fallback' });
});

// Helper for AI Budget Doctor & Cost Optimization
app.post('/api/ai/budget-doctor', async (req, res) => {
  const { name, type, budget, guests, budgetRows } = req.body;
  const totalB = Number(budget) || 500000;
  const guestCount = Number(guests) || 100;

  try {
    if (process.env.GEMINI_API_KEY) {
      const prompt = `You are a seasoned event financial strategist and wedding planner.
Event Name: ${name || 'Event'}
Type: ${type || 'wedding'}
Total Budget: ${totalB}
Guest Count: ${guestCount}
Per Guest Cost: ${guestCount > 0 ? Math.round(totalB / guestCount) : 0}
Current Budget Categories & Allocations:
${JSON.stringify(budgetRows || [], null, 2)}

Provide high-value, practical financial analysis in JSON:
{
  "healthAssessment": "A concise assessment of whether the budget is realistic, tight, or well-funded.",
  "topSavingsTips": [
    "Tip 1 explaining specific vendor renegotiations or menu strategy",
    "Tip 2 explaining decor or rental alternatives",
    "Tip 3 explaining bar or beverage cost optimization"
  ],
  "hiddenCostsToWatch": [
    "Specific hidden fee 1 (e.g. venue corkage, electricity load charges)",
    "Specific hidden fee 2 (e.g. sound decibel overtime, generator fuel)"
  ],
  "rebalancingRecommendations": "Specific recommendation on which category to trim or augment."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, advice: parsed, source: 'gemini' });
    }
  } catch (err) {
    console.warn('Gemini budget doctor failed, using smart fallback:', err);
  }

  const perGuest = guestCount > 0 ? Math.round(totalB / guestCount) : 0;
  res.json({
    success: true,
    advice: {
      healthAssessment: `With a budget of ${totalB.toLocaleString('en-IN')} across ${guestCount} guests, your average spend is approx ${perGuest.toLocaleString('en-IN')} per guest. This provides strong operational flexibility for a polished celebration.`,
      topSavingsTips: [
        "Pre-book fixed curated beverage packages rather than open consumption bars to prevent unexpected 20-30% beverage surges.",
        "Repurpose morning ceremony florals for evening dining tables and photobooth backdrops instead of ordering separate sets.",
        "Bundle photography and cinematic 4K video under a single production house to negotiate 10-15% package discounts."
      ],
      hiddenCostsToWatch: [
        "Venue electricity load & heavy equipment surcharge if bringing external sound/LED walls.",
        "Overtime labor charges and sound cutoff penalty fees if celebrations extend past midnight."
      ],
      rebalancingRecommendations: "Keep a minimum 5% unallocated emergency liquid buffer for last-minute guest additions, staff tips, or transportation."
    },
    source: 'fallback'
  });
});

// Helper for AI Vendor Questionnaire
app.post('/api/ai/vendor-checklist', async (req, res) => {
  const { type, city } = req.body;

  try {
    if (process.env.GEMINI_API_KEY) {
      const prompt = `Generate a comprehensive vendor contract and interview questionnaire for a ${type || 'event'} in ${city || 'India'}.
Provide 4 critical categories (Venue, Catering, Decor & Production, Photo & Video). For each, give 3 must-ask, non-obvious questions to avoid scams, surprise fees, or day-of disasters.
Return JSON format:
{
  "categories": [
    {
      "category": "Venue & Facility",
      "questions": ["Question 1", "Question 2", "Question 3"],
      "contractRedFlags": ["Red flag 1", "Red flag 2"]
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, checklist: parsed, source: 'gemini' });
    }
  } catch (err) {
    console.warn('Gemini vendor checklist failed, using fallback:', err);
  }

  res.json({
    success: true,
    checklist: {
      categories: [
        {
          category: "Venue & Hospitality",
          questions: [
            "What is the exact sound cutoff curfew, and does the venue have valid police/fire clearances?",
            "Are outside caterers or decorators allowed, and is there an external vendor royalty charge?",
            "Is 100% DG generator power backup included, and what is the switchover time during a blackout?"
          ],
          contractRedFlags: [
            "Absence of a force majeure clause covering extreme weather or power failure.",
            "Clauses allowing venue to host overlapping events in adjacent lawns sharing the same entrance."
          ]
        },
        {
          category: "Catering & Banquet",
          questions: [
            "What is the guaranteed live chef-to-guest and uniformed server ratio for the buffet?",
            "How do you handle a sudden +10% guest surge on the day, and what is the buffer plate cost?",
            "Are food tastings, live chafing stations, and premium mineral water bottles included in per-plate pricing?"
          ],
          contractRedFlags: [
            "Extra fees billed after event for food heating gas cylinders or basic cutlery washing.",
            "Refusal to provide ingredient source verification or live hygiene inspection."
          ]
        },
        {
          category: "Photography & Cinema",
          questions: [
            "Exactly which lead photographer and cinematographer will be present on-site (named in contract)?",
            "What is the exact turnaround timeline for teasers, reels, full cinematic film, and raw unedited archives?",
            "Do you bring dual-camera backup bodies and simultaneous dual SD-card slot recording?"
          ],
          contractRedFlags: [
            "Vague delivery timelines stating 'delivery within 6-12 months'.",
            "Hidden extra costs for color grading, drone pilot permits, or SSD hard drive copies."
          ]
        },
        {
          category: "Sound, DJ & Production",
          questions: [
            "Does the sound package include line-array speakers, stage monitors, and wireless handheld mics with backup batteries?",
            "Will a dedicated sound engineer remain at the mixing console throughout the event?",
            "Can we review and pre-approve the 'do-not-play' list and entry music cues?"
          ],
          contractRedFlags: [
            "Equipment quotes that exclude necessary cabling, rigging, and voltage stabilizers."
          ]
        }
      ]
    },
    source: 'fallback'
  });
});

function generateSmartFallbackPlan(type: string, budget: number, guests: number, city: string, notes: string) {
  const b = budget || 500000;
  return {
    categories: [
      { name: "Venue & Grounds Booking", pct: 32 },
      { name: "Catering & Signature Live Counters", pct: 30 },
      { name: "Decor, Floral & Ambient Illumination", pct: 15 },
      { name: "Photography & Cinematic 4K Film", pct: 10 },
      { name: "Entertainment, Sound & Emcee", pct: 8 },
      { name: "Contingency & Emergency Reserve", pct: 5 }
    ],
    tasks: [
      { text: "Confirm and sign venue lease contract with rain backup", weeks: 12 },
      { text: "Conduct comprehensive food tasting and lock menu items", weeks: 9 },
      { text: "Send digital RSVP invitations via WhatsApp and email", weeks: 6 },
      { text: "Confirm photography shotlist and song entrance cues with DJ", weeks: 3 },
      { text: "Finalize guaranteed guest count with caterer", weeks: 1 },
      { text: "Conduct day-of vendor run-through and handover cue sheets", weeks: 0 }
    ],
    schedule: [
      { time: "09:30 AM", event: "Vendor arrival, floral stage delivery & sound check", lead: "Lead Coordinator", location: "Main Hall" },
      { time: "11:30 AM", event: "Guest arrivals, signature welcome refreshments & music", lead: "Hospitality Lead", location: "Lawn / Foyer" },
      { time: "01:00 PM", event: "Main celebration, commemorative ceremony & photo sessions", lead: "Host / MC", location: "Main Stage" },
      { time: "02:00 PM", event: "Gourmet banquet buffet opens with live interactive stations", lead: "Caterer", location: "Dining Pavilion" },
      { time: "03:45 PM", event: "Afternoon social hour, acoustic music & dessert treats", lead: "Emcee", location: "Courtyard" }
    ],
    vendors: [
      { name: `${city || 'Grand'} Royale Venue & Lawns`, cat: "Venue", quote: Math.round(b * 0.32), status: "Booked", note: "Includes power backup and parking" },
      { name: "Epicurean Signature Catering", cat: "Catering", quote: Math.round(b * 0.30), status: "Quoted", note: "Live counters and uniformed service" },
      { name: "Lumiere Lens Visual Productions", cat: "Photography", quote: Math.round(b * 0.10), status: "To Contact", note: "2 photographers + 1 drone operator" },
      { name: "Florabundance Decor & Styling", cat: "Decor", quote: Math.round(b * 0.15), status: "To Contact", note: "Themed floral arch and lighting" }
    ],
    ideas: [
      { title: "Personalized Audio Guestbook Phone", tag: "Activity", detail: "Guests pick up a vintage rotary telephone and record candid voice blessings." },
      { title: "Bespoke Mocktail & Spritzer Bar", tag: "Food", detail: "Crafted signature drinks named after personal memories and favorite destinations." },
      { title: "QR Instant Photo Cloud", tag: "Tech", detail: "A shared live gallery where guests upload smartphone candid photos directly onto the projector screen." },
      { title: "Customized Keepsake Favors", tag: "Gift", detail: "Artisanal scented soy candles or handcrafted sweets in personalized keepsake boxes." }
    ]
  };
}

// Development vs Production serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
