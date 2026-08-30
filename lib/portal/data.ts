/**
 * The demo restaurant: Harbor & Vine, ~3 months on Tagout.
 * makeSeed() builds a fresh copy on every login so the demo always resets.
 */

export type Role = "Server" | "Bartender" | "Host" | "Line cook" | "Prep" | "Busser";

export type Staff = {
  id: string;
  name: string;
  first: string;
  role: Role;
  phone: string;
  photo: string | null; // /portal/avatars/*.webp, null = no photo yet
  color: string; // fallback avatar tint
  keyholder?: boolean;
  minor?: boolean;
  yesRate: number; // 0-1, how often they say yes to pickups
  hoursWeek: number; // scheduled hours this week
  status: "active" | "invited" | "pending";
  availNote: string;
};

export type Shift = {
  id: string;
  staffId: string;
  day: number; // 0=Mon
  start: string;
  end: string;
  role: Role;
  state: "published" | "draft" | "open" | "covering";
  section?: string;
};

export type Punch = {
  id: string;
  staffId: string;
  inAt: string; // "10:58 AM"
  outAt: string | null; // null = on the clock
  inMins: number; // minutes since midnight, for live math
  outMins: number | null;
  breakMins: number;
  approved: boolean;
};

export type RunStep = { label: string; detail?: string; state: "done" | "live" | "todo" };
export type Bubble = { from: "tag" | "them"; who?: string; text: string };
export type CoverageRun = {
  id: string;
  title: string;
  sub: string;
  state: "live" | "covered" | "handed-off";
  steps: RunStep[];
  thread: Bubble[];
  outcome?: string;
  when: string;
};

export type FeedEvent = {
  id: string;
  kind: "cover" | "swap" | "clock" | "headsup" | "onboard" | "rule";
  who: string | null; // staffId
  text: string;
  sub?: string;
  when: string;
  fresh?: boolean;
};

export type Rule = {
  id: string;
  name: string;
  plain: string; // GM-plain explanation
  group: "Hours & pay" | "Compliance" | "How Tagout asks" | "Approvals";
  on: boolean;
  value?: string;
  options?: string[]; // when set, the GM can change the value, not just the switch
  lastUsed: string;
};

export type TimeOff = {
  id: string;
  staffId: string;
  range: string;
  reason: string;
  state: "pending" | "approved" | "denied";
};

export type HouseEvent = { id: string; day: number; label: string; note: string };

export type Note = { id: string; text: string; when: string };

export type Table = { id: string; label: string; section: string; shape: "round" | "square"; seats: number };
export type RotationMode = "even" | "seniority" | "training";

export type PortalState = {
  houseName: string;
  gmFirst: string;
  autopilot: "suggest" | "ask-first" | "full";
  paused: boolean; // GM hit the big red switch: Tagout stops texting until turned back on
  tables: Table[];
  rotation: RotationMode;
  floorBalanced: boolean;
  staff: Staff[];
  shifts: Shift[];
  punches: Punch[];
  runs: CoverageRun[];
  feed: FeedEvent[];
  rules: Rule[];
  timeOff: TimeOff[];
  events: HouseEvent[];
  notes: Note[];
  weekPublished: boolean;
  stats: { coveredPct: number; repliesToday: number; laborWeek: number; covers90d: number; medianCoverMins: number };
};

const av = (n: string) => `/portal/avatars/${n}.webp`;

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function makeSeed(): PortalState {
  const staff: Staff[] = [
    { id: "marisa", name: "Marisa Torres", first: "Marisa", role: "Server", phone: "(561) 555-0184", photo: av("marisa"), color: "#0ecf7f", yesRate: 0.89, hoursWeek: 31, status: "active", availNote: "Not Sundays" },
    { id: "jake", name: "Jake Reyes", first: "Jake", role: "Server", phone: "(561) 555-0119", photo: av("jake"), color: "#7c6cf6", yesRate: 0.62, hoursWeek: 34, status: "active", availNote: "Anytime" },
    { id: "katie", name: "Katie Shaw", first: "Katie", role: "Server", phone: "(561) 555-0177", photo: av("katie"), color: "#f4b53f", yesRate: 0.74, hoursWeek: 28, status: "active", availNote: "No doubles" },
    { id: "devon", name: "Devon King", first: "Devon", role: "Busser", phone: "(561) 555-0152", photo: av("devon"), color: "#ff7a68", yesRate: 0.91, hoursWeek: 26, status: "active", availNote: "Wants more hours" },
    { id: "dana", name: "Dana Whitfield", first: "Dana", role: "Server", phone: "(561) 555-0146", photo: av("dana"), color: "#0ecf7f", yesRate: 0.55, hoursWeek: 22, status: "active", availNote: "In school Tue/Thu" },
    { id: "luis", name: "Luis Mendoza", first: "Luis", role: "Prep", phone: "(561) 555-0128", photo: av("luis"), color: "#7c6cf6", yesRate: 0.83, hoursWeek: 36, status: "active", availNote: "Mornings only" },
    { id: "sasha", name: "Sasha Bell", first: "Sasha", role: "Server", phone: "(561) 555-0139", photo: av("sasha"), color: "#f4b53f", yesRate: 0.7, hoursWeek: 30, status: "active", availNote: "Anytime" },
    { id: "sam", name: "Sam Okafor", first: "Sam", role: "Bartender", phone: "(561) 555-0163", photo: av("sam"), color: "#ff7a68", keyholder: true, yesRate: 0.66, hoursWeek: 38, status: "active", availNote: "Closes only" },
    { id: "erin", name: "Erin Castillo", first: "Erin", role: "Host", phone: "(561) 555-0171", photo: av("erin"), color: "#0ecf7f", minor: true, yesRate: 0.8, hoursWeek: 16, status: "active", availNote: "17 · school nights out by 10" },
    { id: "rosa", name: "Rosa Vega", first: "Rosa", role: "Line cook", phone: "(561) 555-0195", photo: av("rosa"), color: "#7c6cf6", keyholder: true, yesRate: 0.77, hoursWeek: 39, status: "active", availNote: "Not Mondays" },
    { id: "tyler", name: "Tyler James", first: "Tyler", role: "Server", phone: "(561) 555-0102", photo: null, color: "#0ecf7f", yesRate: 0, hoursWeek: 0, status: "invited", availNote: "Invite sent 2:14 PM · waiting on YES" },
    { id: "alex", name: "Alex Price", first: "Alex", role: "Busser", phone: "(561) 555-0187", photo: null, color: "#f4b53f", yesRate: 0, hoursWeek: 12, status: "pending", availNote: "Replied YES · picking photo & availability" },
  ];

  // A believable week: dinner-heavy, Friday stacked.
  const S = (id: string, staffId: string, day: number, start: string, end: string, role: Role, state: Shift["state"] = "published", section?: string): Shift =>
    ({ id, staffId, day, start, end, role, state, section });
  const shifts: Shift[] = [
    S("s1", "marisa", 0, "5:00 PM", "11:00 PM", "Server", "published", "Patio"),
    S("s2", "marisa", 2, "5:00 PM", "11:00 PM", "Server", "published", "Main"),
    S("s3", "marisa", 4, "5:00 PM", "11:00 PM", "Server", "covering", "Main"),
    S("s4", "marisa", 5, "11:00 AM", "5:00 PM", "Server", "published", "Patio"),
    S("s5", "jake", 0, "11:00 AM", "5:00 PM", "Server", "published", "Main"),
    S("s6", "jake", 1, "11:00 AM", "5:00 PM", "Server"),
    S("s7", "jake", 3, "5:00 PM", "11:00 PM", "Server", "published", "Bar side"),
    S("s8", "jake", 4, "5:00 PM", "11:00 PM", "Server", "published", "Patio"),
    S("s9", "jake", 6, "11:00 AM", "5:00 PM", "Server"),
    S("s10", "katie", 1, "5:00 PM", "11:00 PM", "Server"),
    S("s11", "katie", 2, "5:00 PM", "11:00 PM", "Server", "published", "Patio"),
    S("s12", "katie", 5, "5:00 PM", "11:00 PM", "Server", "published", "Main"),
    S("s13", "devon", 0, "5:00 PM", "11:00 PM", "Busser"),
    S("s14", "devon", 2, "11:00 AM", "5:00 PM", "Busser"),
    S("s15", "devon", 3, "11:00 AM", "5:00 PM", "Busser"),
    S("s16", "devon", 5, "5:00 PM", "11:00 PM", "Busser"),
    S("s17", "dana", 2, "5:00 PM", "11:00 PM", "Server", "published", "Bar side"),
    S("s18", "dana", 5, "11:00 AM", "5:00 PM", "Server"),
    S("s19", "luis", 0, "8:00 AM", "2:00 PM", "Prep"),
    S("s20", "luis", 1, "8:00 AM", "2:00 PM", "Prep"),
    S("s21", "luis", 2, "8:00 AM", "2:00 PM", "Prep"),
    S("s22", "luis", 3, "8:00 AM", "2:00 PM", "Prep"),
    S("s23", "luis", 4, "8:00 AM", "2:00 PM", "Prep"),
    S("s24", "luis", 5, "8:00 AM", "2:00 PM", "Prep"),
    S("s25", "sasha", 1, "5:00 PM", "11:00 PM", "Server"),
    S("s26", "sasha", 3, "5:00 PM", "11:00 PM", "Server"),
    S("s27", "sasha", 4, "11:00 AM", "5:00 PM", "Server"),
    S("s28", "sasha", 6, "11:00 AM", "5:00 PM", "Server"),
    S("s29", "sam", 2, "4:00 PM", "12:00 AM", "Bartender"),
    S("s30", "sam", 3, "4:00 PM", "12:00 AM", "Bartender"),
    S("s31", "sam", 4, "4:00 PM", "12:00 AM", "Bartender"),
    S("s32", "sam", 5, "4:00 PM", "12:00 AM", "Bartender"),
    S("s33", "erin", 4, "5:00 PM", "10:00 PM", "Host"),
    S("s34", "erin", 5, "11:00 AM", "5:00 PM", "Host"),
    S("s35", "erin", 6, "11:00 AM", "4:00 PM", "Host"),
    S("s36", "rosa", 1, "2:00 PM", "10:00 PM", "Line cook"),
    S("s37", "rosa", 2, "2:00 PM", "10:00 PM", "Line cook"),
    S("s38", "rosa", 3, "2:00 PM", "10:00 PM", "Line cook"),
    S("s39", "rosa", 4, "2:00 PM", "10:00 PM", "Line cook"),
    S("s40", "rosa", 5, "2:00 PM", "10:00 PM", "Line cook"),
    S("s41", "alex", 4, "5:00 PM", "11:00 PM", "Busser"),
    S("s42", "alex", 5, "5:00 PM", "11:00 PM", "Busser"),
    // Sunday brunch gap Tagout is quietly working on:
    S("s43", "dana", 6, "10:00 AM", "4:00 PM", "Server", "open"),
  ];

  const punches: Punch[] = [
    { id: "p1", staffId: "luis", inAt: "7:54 AM", outAt: "2:03 PM", inMins: 474, outMins: 843, breakMins: 30, approved: true },
    { id: "p2", staffId: "rosa", inAt: "1:56 PM", outAt: null, inMins: 836, outMins: null, breakMins: 0, approved: false },
    { id: "p3", staffId: "sam", inAt: "3:58 PM", outAt: null, inMins: 958, outMins: null, breakMins: 0, approved: false },
    { id: "p4", staffId: "marisa", inAt: "4:52 PM", outAt: null, inMins: 1012, outMins: null, breakMins: 0, approved: false },
    { id: "p5", staffId: "jake", inAt: "4:55 PM", outAt: null, inMins: 1015, outMins: null, breakMins: 0, approved: false },
    { id: "p6", staffId: "erin", inAt: "4:58 PM", outAt: null, inMins: 1018, outMins: null, breakMins: 0, approved: false },
    { id: "p7", staffId: "devon", inAt: "10:41 AM", outAt: "4:12 PM", inMins: 641, outMins: 972, breakMins: 20, approved: false },
  ];

  const runs: CoverageRun[] = [
    {
      id: "r-live",
      title: "Friday close · Dana dropped it",
      sub: "5–11 PM server shift, Main dining",
      state: "live",
      when: "Started 4:41 PM",
      steps: [
        { label: "Dana dropped Friday close", detail: "4:41 PM · reason: sitter fell through", state: "done" },
        { label: "Ranked everyone eligible", detail: "6 can work it · sorted by hours, availability, real yes-rate", state: "done" },
        { label: "Texting Marisa", detail: "she's 1st: 31 hrs, says yes 9 times out of 10", state: "live" },
        { label: "Then Sasha, then Jake", detail: "one at a time, never a group blast", state: "todo" },
        { label: "You approve, board updates", state: "todo" },
      ],
      thread: [
        { from: "tag", text: "Hey Marisa, it's Tagout for Harbor & Vine. Dana dropped Friday close, 5–11 PM. You'd end the week at 37 hrs. Want it?" },
      ],
    },
    {
      id: "r-1",
      title: "Sunday brunch host · covered",
      sub: "Erin's swap, caught before publish",
      state: "covered",
      when: "Yesterday",
      outcome: "Covered in 11 min · Katie confirmed",
      steps: [
        { label: "Erin asked to swap Sunday", detail: "family thing", state: "done" },
        { label: "Katie said yes", detail: "2nd ask · stayed under 40", state: "done" },
        { label: "You tapped Approve", detail: "board updated, both got confirmations", state: "done" },
      ],
      thread: [
        { from: "them", who: "erin", text: "any chance i can swap sunday? family thing 🙏" },
        { from: "tag", text: "On it. Checking who's free and under hours." },
        { from: "tag", text: "Katie can take Sunday if you cover her Tuesday close. Deal?" },
        { from: "them", who: "erin", text: "deal!! thank you" },
      ],
    },
    {
      id: "r-3",
      title: "Sunday brunch server · handed to you",
      sub: "The one that shows what happens when everyone says no",
      state: "handed-off",
      when: "Last Sunday",
      outcome: "All 5 eligible passed · you got the dial list at 8:12 AM · you called Rosa, marked it covered",
      steps: [
        { label: "Priya's old shift opened when she left", detail: "7 AM Sunday, brunch server", state: "done" },
        { label: "Asked all 5 eligible, one at a time", detail: "4 passed, 1 never answered", state: "done" },
        { label: "Handed you the dial list, early", detail: "names + numbers at 8:12 AM, not 10:55", state: "done" },
        { label: "You called Rosa, marked it covered", detail: "Tagout confirmed her by text and updated the board", state: "done" },
      ],
      thread: [
        { from: "tag", text: "Heads-up: I've asked everyone eligible for Sunday brunch and nobody can take it. Here's your dial list: Rosa (561) 555-0195 · Sam (561) 555-0163 · Katie (561) 555-0177. Reply COVERED <name> when someone's in." },
        { from: "them", who: "you", text: "covered rosa" },
        { from: "tag", text: "Got it. Rosa's on Sunday 10–4, board's updated, and she just got her confirmation. Nice save 🤝" },
      ],
    },
    {
      id: "r-2",
      title: "Tuesday patio · voluntary cut",
      sub: "Rain flipped the forecast",
      state: "covered",
      when: "Tuesday",
      outcome: "2 volunteers in 9 min · saved ~$118 labor",
      steps: [
        { label: "Rain forecast for service", detail: "patio covers projected to drop", state: "done" },
        { label: "Offered voluntary cuts", detail: "first replies win, nobody forced", state: "done" },
        { label: "Jake & Devon took the night", state: "done" },
      ],
      thread: [
        { from: "tag", text: "Rain tonight and the patio's booked light. Anyone want the evening off? Two spots, first come." },
        { from: "them", who: "jake", text: "me 🙋" },
        { from: "tag", text: "You got it. Enjoy the night, Jake." },
      ],
    },
  ];

  const feed: FeedEvent[] = [
    { id: "f1", kind: "cover", who: "marisa", text: "Tagout is texting Marisa about Dana's Friday close", sub: "1st of 6 eligible · asked at 4:41 PM", when: "4:41 PM" },
    { id: "f2", kind: "clock", who: "erin", text: "Erin clocked in for host, 4:58 PM", sub: "2 min early", when: "4:58 PM" },
    { id: "f3", kind: "rule", who: "katie", text: "Blocked a swap that would clopen Katie", sub: "close Sat + open Sun · asked her first instead", when: "3:22 PM" },
    { id: "f4", kind: "onboard", who: "tyler", text: "Invite texted to Tyler James", sub: "he replies YES, he's on the roster", when: "2:14 PM" },
    { id: "f5", kind: "swap", who: "erin", text: "Erin ↔ Katie Sunday swap approved", sub: "you tapped Approve · both confirmed by text", when: "Yesterday" },
    { id: "f6", kind: "headsup", who: "dana", text: "Heads-up: Dana has dropped 3 straight Fridays", sub: "kept private · pattern + history in her file", when: "Yesterday" },
    { id: "f7", kind: "cover", who: "jake", text: "Rained-out patio: Jake & Devon took voluntary cuts", sub: "saved ~$118 in labor", when: "Tuesday" },
  ];

  const rules: Rule[] = [
    // Hours & pay
    { id: "ot", group: "Hours & pay", name: "Overtime cap", plain: "Nobody gets offered a shift that would push them past the cap. Hard stop, not a warning after payroll.", on: true, value: "40 hrs/week", options: ["38 hrs/week", "40 hrs/week", "45 hrs/week"], lastUsed: "Kept Sam off Friday close (would've hit 44)" },
    { id: "maxasks", group: "Hours & pay", name: "Don't burn out the yes-people", plain: "Caps how many extra-shift asks any one person gets per week, so your most reliable people don't carry every gap.", on: true, value: "3 asks/week", options: ["2 asks/week", "3 asks/week", "No limit"], lastUsed: "Skipped Devon on Thursday, he'd hit 3" },
    { id: "cuts", group: "Hours & pay", name: "Slow-night voluntary cuts", plain: "When a night books light, Tagout can offer voluntary cuts. First replies win, nobody gets forced off.", on: true, value: "Offer automatically", options: ["Offer automatically", "Only when I ask"], lastUsed: "Tuesday's rained-out patio, saved ~$118" },
    // Compliance
    { id: "minor", group: "Compliance", name: "Minor curfew", plain: "Erin is 17. On school nights she's never offered anything past curfew. State rules, handled.", on: true, value: "Out by 10 PM", options: ["Out by 9 PM", "Out by 10 PM", "Out by 11 PM"], lastUsed: "Friday host shift ends 10 PM sharp" },
    { id: "breaks", group: "Compliance", name: "Break reminders", plain: "Anyone past six hours without a 30-minute break gets flagged on their timecard before you approve it.", on: true, value: "30 min by hour 6", options: ["30 min by hour 5", "30 min by hour 6", "Off"], lastUsed: "Flagged Devon's 20-minute break today" },
    { id: "keys", group: "Compliance", name: "Keyholders open & close", plain: "Opens and closes only go to people who can unlock the door: Sam and Rosa.", on: true, value: "2 keyholders", lastUsed: "Sunday open offered to Rosa first" },
    { id: "clopen", group: "Compliance", name: "No accidental clopens", plain: "Closing then opening the next morning needs a real night's rest between. Tagout asks the person before it ever books one.", on: true, value: "10 hr gap", options: ["8 hr gap", "10 hr gap", "12 hr gap"], lastUsed: "Blocked Katie's Sat/Sun clopen, 3:22 PM" },
    // How Tagout asks
    { id: "quiet", group: "How Tagout asks", name: "Quiet hours", plain: "No texts during quiet hours unless it's a same-morning emergency.", on: true, value: "9:30 PM to 7 AM", options: ["9 PM to 8 AM", "9:30 PM to 7 AM", "10 PM to 6 AM"], lastUsed: "Held Sunday asks until 7:01 AM" },
    { id: "spacing", group: "How Tagout asks", name: "Time per person", plain: "How long each person gets to answer before Tagout moves down the list.", on: true, value: "15 min each", options: ["10 min each", "15 min each", "30 min each"], lastUsed: "Moved from Marisa to Sasha at the 15" },
    { id: "escalate", group: "How Tagout asks", name: "When you get the dial list", plain: "Tagout always asks everyone eligible. This sets how early you also get names and numbers to dial yourself.", on: true, value: "1 hr before shift", options: ["2 hrs before shift", "1 hr before shift", "Only if the list runs dry"], lastUsed: "Sunday brunch: list handed over at 8:12 AM" },
    { id: "fair", group: "How Tagout asks", name: "Fair first dibs", plain: "Extra shifts go to whoever asked for more hours first, then by who actually says yes. No favorites.", on: true, value: "Devon flagged: wants hours", lastUsed: "Devon got first ask on Tuesday pickup" },
    // Approvals
    { id: "swaps", group: "Approvals", name: "Swaps that pass every rule", plain: "When a swap clears hours, roles, and rest rules, Tagout can finish it alone or still bring it to you.", on: true, value: "Still ask me", options: ["Auto-approve", "Still ask me"], lastUsed: "Erin and Katie's Sunday swap came to you first" },
    { id: "training", group: "Approvals", name: "New-hire training window", plain: "New hires don't get solo shifts until they've been on the floor long enough. Tagout pairs them with a trainer instead.", on: true, value: "First 2 weeks", options: ["First week", "First 2 weeks", "First month"], lastUsed: "Tyler will pair with Marisa once he's onboarded" },
  ];

  const timeOff: TimeOff[] = [
    { id: "t1", staffId: "sasha", range: "Sep 12–14", reason: "Sister's wedding", state: "pending" },
    { id: "t2", staffId: "devon", range: "Sep 3", reason: "DMV appointment", state: "pending" },
    { id: "t3", staffId: "rosa", range: "Aug 21", reason: "Doctor", state: "approved" },
  ];

  const events: HouseEvent[] = [
    { id: "e1", day: 4, label: "45-top · 7 PM", note: "Rehearsal dinner, patio. Tagout staffed +2 servers." },
    { id: "e2", day: 5, label: "Live music", note: "Bar side runs heavy after 8." },
  ];

  const notes: Note[] = [
    { id: "n1", text: "86 the swordfish until Thursday's delivery.", when: "Yesterday 9:12 PM" },
    { id: "n2", text: "New patio heaters arrive Monday. Devon offered to assemble.", when: "Tuesday" },
  ];

  return {
    houseName: "Harbor & Vine",
    gmFirst: "Jordan",
    autopilot: "ask-first",
    paused: false,
    rotation: "even",
    floorBalanced: false,
    tables: [
      { id: "t1", label: "1", section: "Main", shape: "round", seats: 4 },
      { id: "t2", label: "2", section: "Main", shape: "square", seats: 2 },
      { id: "t3", label: "3", section: "Main", shape: "round", seats: 6 },
      { id: "t4", label: "4", section: "Main", shape: "square", seats: 4 },
      { id: "t5", label: "5", section: "Main", shape: "round", seats: 4 },
      { id: "t6", label: "6", section: "Bar side", shape: "square", seats: 2 },
      { id: "t7", label: "7", section: "Bar side", shape: "square", seats: 2 },
      { id: "t8", label: "8", section: "Bar side", shape: "round", seats: 4 },
      { id: "t9", label: "9", section: "Bar side", shape: "square", seats: 2 },
      { id: "t10", label: "10", section: "Patio", shape: "round", seats: 4 },
      { id: "t11", label: "11", section: "Patio", shape: "round", seats: 4 },
      { id: "t12", label: "12", section: "Patio", shape: "square", seats: 6 },
      { id: "t13", label: "13", section: "Patio", shape: "round", seats: 2 },
      { id: "t14", label: "14", section: "Patio", shape: "square", seats: 8 },
    ],
    staff,
    shifts,
    punches,
    runs,
    feed,
    rules,
    timeOff,
    events,
    notes,
    weekPublished: true,
    stats: { coveredPct: 100, repliesToday: 14, laborWeek: 6240, covers90d: 47, medianCoverMins: 9 },
  };
}
