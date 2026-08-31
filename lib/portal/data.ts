/**
 * The demo restaurant: Harbor & Vine, ~3 months on Tagout.
 * makeSeed() builds a fresh copy on every login so the demo always resets.
 */

export type Role = "Manager" | "Server" | "Bartender" | "Host" | "Line cook" | "Prep" | "Busser";

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
  rate: number; // $/hr
  since: string; // on the roster since
  certs: string[];
  picks90: number; // shifts picked up, last 90 days
  drops90: number; // shifts dropped, last 90 days
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
  note?: string;
  droppedBy?: string; // staff id, when the person gave the shift up themselves
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

export type RunStep = { label: string; detail?: string; state: "done" | "live" | "todo"; at?: string };
// who = the staff member on the other end of this text (or "you" for the GM);
// a tag bubble without who is a group blast
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
  // when set, the notification is actionable in place (drawer + inbox)
  action?: { kind: "timeoff" | "claim" | "cover"; id: string };
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

export type EventKind = "Large party" | "Live music" | "Buyout" | "Holiday" | "Other";
export type HouseEvent = {
  id: string;
  day: number; // 0=Mon
  kind: EventKind;
  time: string; // "7:00 PM"
  size: number | null; // party size, for Large party
  room: string | null; // Dining room | Patio | Bar
  label: string; // derived display line, e.g. "45-top · 7 PM"
  note: string; // free text for the crew, display only
};

export type Note = { id: string; text: string; when: string };

export type Table = {
  id: string;
  label: string;
  section: string;
  shape: "round" | "square" | "booth" | "hightop";
  seats: number;
  room: string; // Dining room | Patio | Bar
  x: number; // percent of room width, table center
  y: number; // percent of room height
};

export const ROOMS = ["Dining room", "Patio", "Bar"];

export type FixtureKind = "Kitchen" | "Bar counter" | "Entry" | "Restrooms" | "Host stand";
export type Fixture = {
  id: string;
  room: string;
  kind: FixtureKind;
  x: number; // percent, center
  y: number;
  w: number; // percent of room width
  h: number; // percent of room height
};
export type RotationMode = "even" | "seniority" | "training";

export const SEED_VERSION = 8;

export type PortalState = {
  v: number;
  houseName: string;
  gmFirst: string;
  autopilot: "suggest" | "ask-first" | "full";
  paused: boolean; // GM hit the big red switch: Tagout stops texting until turned back on
  tables: Table[];
  fixtures: Fixture[];
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
  claims: { shiftId: string; staffId: string }[]; // open-shift pickup requests waiting on the GM
  notes: Note[];
  weekPublished: boolean;
  dismissed: string[]; // suggestion ids the GM has handled
  stats: { coveredPct: number; repliesToday: number; laborWeek: number; covers90d: number; medianCoverMins: number };
};

const av = (n: string) => `/portal/avatars/${n}.webp`;

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function makeSeed(): PortalState {
  const staff: Staff[] = [
    { id: "marisa", name: "Marisa Torres", first: "Marisa", role: "Server", phone: "(561) 555-0184", photo: av("marisa"), color: "#0ecf7f", yesRate: 0.89, hoursWeek: 31, status: "active", availNote: "Not Sundays", rate: 12, since: "May 2026", certs: ["Food handler"], picks90: 9, drops90: 1 },
    { id: "jake", name: "Jake Reyes", first: "Jake", role: "Server", phone: "(561) 555-0119", photo: av("jake"), color: "#7c6cf6", yesRate: 0.62, hoursWeek: 34, status: "active", availNote: "Anytime", rate: 12, since: "Jan 2026", certs: ["Food handler"], picks90: 5, drops90: 2 },
    { id: "katie", name: "Katie Shaw", first: "Katie", role: "Server", phone: "(561) 555-0177", photo: av("katie"), color: "#f4b53f", yesRate: 0.74, hoursWeek: 28, status: "active", availNote: "No doubles", rate: 12, since: "Aug 2025", certs: ["Food handler", "Trainer"], picks90: 7, drops90: 0 },
    { id: "devon", name: "Devon King", first: "Devon", role: "Busser", phone: "(561) 555-0152", photo: av("devon"), color: "#ff7a68", yesRate: 0.91, hoursWeek: 26, status: "active", availNote: "Wants more hours", rate: 11, since: "Jun 2026", certs: ["Food handler"], picks90: 12, drops90: 0 },
    { id: "dana", name: "Dana Whitfield", first: "Dana", role: "Server", phone: "(561) 555-0146", photo: av("dana"), color: "#0ecf7f", yesRate: 0.55, hoursWeek: 22, status: "active", availNote: "In school Tue/Thu", rate: 12, since: "Feb 2026", certs: ["Food handler"], picks90: 3, drops90: 4 },
    { id: "luis", name: "Luis Mendoza", first: "Luis", role: "Prep", phone: "(561) 555-0128", photo: av("luis"), color: "#7c6cf6", yesRate: 0.83, hoursWeek: 36, status: "active", availNote: "Mornings only", rate: 17, since: "Sep 2024", certs: ["Food handler"], picks90: 6, drops90: 1 },
    { id: "sasha", name: "Sasha Bell", first: "Sasha", role: "Server", phone: "(561) 555-0139", photo: av("sasha"), color: "#f4b53f", yesRate: 0.7, hoursWeek: 30, status: "active", availNote: "Anytime", rate: 12, since: "Nov 2025", certs: ["Food handler"], picks90: 8, drops90: 1 },
    { id: "sam", name: "Sam Okafor", first: "Sam", role: "Bartender", phone: "(561) 555-0163", photo: av("sam"), color: "#ff7a68", keyholder: true, yesRate: 0.66, hoursWeek: 38, status: "active", availNote: "Closes only", rate: 15, since: "Mar 2024", certs: ["Alcohol service", "Food handler"], picks90: 4, drops90: 1 },
    { id: "erin", name: "Erin Castillo", first: "Erin", role: "Host", phone: "(561) 555-0171", photo: av("erin"), color: "#0ecf7f", minor: true, yesRate: 0.8, hoursWeek: 16, status: "active", availNote: "School nights out by 10", rate: 13, since: "Jul 2026", certs: [], picks90: 4, drops90: 0 },
    { id: "chris", name: "Chris Nolan", first: "Chris", role: "Manager", phone: "(561) 555-0107", photo: av("chris"), color: "#0b3527", keyholder: true, yesRate: 0.72, hoursWeek: 42, status: "active", availNote: "AGM · closes Tue-Sat", rate: 26, since: "Apr 2025", certs: ["Alcohol service", "Food handler", "Trainer"], picks90: 3, drops90: 0 },
    { id: "rosa", name: "Rosa Vega", first: "Rosa", role: "Line cook", phone: "(561) 555-0195", photo: av("rosa"), color: "#7c6cf6", keyholder: true, yesRate: 0.77, hoursWeek: 39, status: "active", availNote: "Not Mondays", rate: 19, since: "Oct 2023", certs: ["Alcohol service", "Food handler", "Trainer"], picks90: 5, drops90: 0 },
    { id: "tyler", name: "Tyler James", first: "Tyler", role: "Server", phone: "(561) 555-0102", photo: null, color: "#0ecf7f", yesRate: 0, hoursWeek: 0, status: "invited", availNote: "Invite sent 2:14 PM · waiting on YES", rate: 12, since: "Today", certs: [], picks90: 0, drops90: 0 },
    { id: "alex", name: "Alex Price", first: "Alex", role: "Busser", phone: "(561) 555-0187", photo: null, color: "#f4b53f", yesRate: 0, hoursWeek: 12, status: "pending", availNote: "Replied YES · picking photo & availability", rate: 11, since: "This week", certs: [], picks90: 0, drops90: 0 },
  ];

  // A believable week: dinner-heavy, Friday stacked.
  const S = (id: string, staffId: string, day: number, start: string, end: string, role: Role, state: Shift["state"] = "published", section?: string): Shift =>
    ({ id, staffId, day, start, end, role, state, section });
  const shifts: Shift[] = [
    S("s1", "marisa", 0, "5:00 PM", "11:00 PM", "Server", "published", "Patio"),
    S("s2", "marisa", 2, "5:00 PM", "11:00 PM", "Server", "published", "Main"),
    S("s3", "dana", 4, "5:00 PM", "11:00 PM", "Server", "covering", "Main"),
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
      when: "Fri Aug 29 · started 4:41 PM",
      steps: [
        { label: "Dana dropped Friday close", detail: "reason: sitter fell through", state: "done", at: "4:41 PM" },
        { label: "Ranked everyone eligible", detail: "6 can work it · sorted by hours, availability, yes-rate", state: "done", at: "4:41 PM" },
        { label: "Texting Marisa", detail: "she's 1st: 31 hrs, says yes 9 times out of 10", state: "live", at: "4:43 PM" },
        { label: "Then Sasha, then Jake", detail: "asked in order, one at a time", state: "todo" },
        { label: "You approve, board updates", state: "todo" },
      ],
      thread: [
        { from: "tag", who: "marisa", text: "Hey Marisa, it's Tagout for Harbor & Vine. Dana dropped Friday close, 5–11 PM. You'd end the week at 37 hrs. Want it?" },
      ],
    },
    {
      id: "r-1",
      title: "Sunday brunch host · covered",
      sub: "Erin's swap, caught before publish",
      state: "covered",
      when: "Thu Aug 28 · 5:03 PM",
      outcome: "Covered in 11 min · Katie confirmed",
      steps: [
        { label: "Erin asked to swap Sunday", detail: "family thing", state: "done", at: "5:03 PM" },
        { label: "Katie said yes", detail: "2nd ask · stayed under 40", state: "done", at: "5:11 PM" },
        { label: "You tapped Approve", detail: "board updated, both got confirmations", state: "done", at: "5:14 PM" },
      ],
      thread: [
        { from: "them", who: "erin", text: "any chance i can swap sunday? family thing 🙏" },
        { from: "tag", who: "erin", text: "On it. Checking who's free and under hours." },
        { from: "tag", who: "erin", text: "Katie can take Sunday if you cover her Tuesday close. Deal?" },
        { from: "them", who: "erin", text: "deal!! thank you" },
      ],
    },
    {
      id: "r-3",
      title: "Sunday brunch server · handed to you",
      sub: "7 AM server shift · all 5 eligible passed",
      state: "handed-off",
      when: "Sun Aug 24 · 6:58 AM",
      outcome: "All 5 eligible passed · you got the dial list at 8:12 AM · you called Rosa, marked it covered",
      steps: [
        { label: "Priya's old shift opened when she left", detail: "7 AM Sunday, brunch server", state: "done", at: "6:58 AM" },
        { label: "Asked all 5 eligible, one at a time", detail: "4 passed, 1 never answered", state: "done", at: "7:46 AM" },
        { label: "Handed you the dial list, early", detail: "names + numbers, not at the last minute", state: "done", at: "8:12 AM" },
        { label: "You called Rosa, marked it covered", detail: "Tagout confirmed her by text and updated the board", state: "done", at: "8:31 AM" },
      ],
      thread: [
        { from: "tag", who: "you", text: "Heads-up: I've asked everyone eligible for Sunday brunch and nobody can take it. Here's your dial list: Rosa (561) 555-0195 · Sam (561) 555-0163 · Katie (561) 555-0177. Reply COVERED <name> when someone's in." },
        { from: "them", who: "you", text: "covered rosa" },
        { from: "tag", who: "you", text: "Got it. Rosa's on Sunday 10–4, board's updated, and she just got her confirmation. Nice save 🤝" },
      ],
    },
    {
      id: "r-2",
      title: "Tuesday patio · voluntary cut",
      sub: "Rain flipped the forecast",
      state: "covered",
      when: "Tue Aug 26 · 3:40 PM",
      outcome: "2 volunteers in 9 min · saved about $118 in labor",
      steps: [
        { label: "Rain forecast for service", detail: "patio covers projected to drop", state: "done", at: "3:40 PM" },
        { label: "Offered voluntary cuts", detail: "first replies win, nobody forced", state: "done", at: "3:42 PM" },
        { label: "Jake & Devon took the night", state: "done", at: "3:51 PM" },
      ],
      thread: [
        { from: "tag", text: "Rain tonight and the patio's booked light. Anyone want the evening off? Two spots, first come." },
        { from: "them", who: "jake", text: "me 🙋" },
        { from: "tag", who: "jake", text: "You got it. Enjoy the night, Jake." },
      ],
    },
  ];

  const feed: FeedEvent[] = [
    { id: "f1", kind: "cover", who: "marisa", text: "Tagout is texting Marisa about Dana's Friday close", sub: "1st of 6 eligible · asked at 4:41 PM", when: "4:41 PM" },
    { id: "f2", kind: "clock", who: "erin", text: "Erin clocked in for host, 4:58 PM", sub: "2 min early", when: "4:58 PM" },
    { id: "f3", kind: "rule", who: "katie", text: "Blocked a swap that would clopen Katie", sub: "close Sat + open Sun · asked her first instead", when: "3:22 PM" },
    { id: "f3b", kind: "swap", who: "sasha", text: "Sasha requested Sep 12–14 off", sub: "sister's wedding", when: "1:12 PM", action: { kind: "timeoff", id: "t1" } },
    { id: "f3c", kind: "swap", who: "devon", text: "Devon requested Sep 3 off", sub: "DMV appointment", when: "11:05 AM", action: { kind: "timeoff", id: "t2" } },
    { id: "f4", kind: "onboard", who: "tyler", text: "Invite texted to Tyler James", sub: "he replies YES, he's on the roster", when: "2:14 PM" },
    { id: "f5", kind: "swap", who: "erin", text: "Erin ↔ Katie Sunday swap approved", sub: "you tapped Approve · both confirmed by text", when: "Yesterday" },
    { id: "f6", kind: "headsup", who: "dana", text: "Heads-up: Dana has dropped 3 straight Fridays", sub: "kept private · pattern + history in her file", when: "Yesterday" },
    { id: "f7", kind: "cover", who: "jake", text: "Rained-out patio: Jake & Devon took voluntary cuts", sub: "saved about $118 in labor", when: "Tuesday" },
  ];

  const rules: Rule[] = [
    // Hours & pay
    { id: "ot", group: "Hours & pay", name: "Overtime cap", plain: "Nobody gets offered a shift that would push them past the cap. Hard stop, not a warning after payroll.", on: true, value: "40 hrs/week", options: ["38 hrs/week", "40 hrs/week", "45 hrs/week"], lastUsed: "Aug 29, 4:41 PM · blocked an offer to Sam O. (over 40 hrs)" },
    { id: "maxasks", group: "Hours & pay", name: "Don't burn out the yes-people", plain: "Caps how many extra-shift asks any one person gets per week, so your most reliable people don't carry every gap.", on: true, value: "3 asks/week", options: ["2 asks/week", "3 asks/week", "No limit"], lastUsed: "Aug 28 · skipped Devon K. (3 asks this week)" },
    { id: "cuts", group: "Hours & pay", name: "Slow-night voluntary cuts", plain: "When a night books light, Tagout can offer voluntary cuts. First replies win, nobody gets forced off.", on: true, value: "Offer automatically", options: ["Offer automatically", "Only when I ask"], lastUsed: "Aug 26 · 2 voluntary cuts accepted" },
    { id: "minshift", group: "Hours & pay", name: "Minimum pickup length", plain: "Tagout never offers a pickup shorter than this. Nobody drives in for 90 minutes of work.", on: true, value: "3 hrs", options: ["2 hrs", "3 hrs", "4 hrs"], lastUsed: "Aug 25 · 2-hr gap not offered" },
    { id: "maxdays", group: "Hours & pay", name: "Days in a row", plain: "Nobody gets offered a shift that would make too many days straight, even if they'd say yes.", on: true, value: "6 days max", options: ["5 days max", "6 days max", "Off"], lastUsed: "Aug 25 · held Rosa V. (6 days in a row)" },
    // Compliance
    { id: "minor", group: "Compliance", name: "Minor curfew", plain: "Erin is 17. On school nights she's never offered anything past curfew. State rules, handled.", on: true, value: "Out by 10 PM", options: ["Out by 9 PM", "Out by 10 PM", "Out by 11 PM"], lastUsed: "Aug 29 · Erin C.'s shift capped at 10:00 PM" },
    { id: "breaks", group: "Compliance", name: "Break reminders", plain: "Anyone past six hours without a 30-minute break gets flagged on their timecard before you approve it.", on: true, value: "30 min by hour 6", options: ["30 min by hour 5", "30 min by hour 6", "Off"], lastUsed: "Aug 30 · timecard flagged (20-min break over 6 hrs)" },
    { id: "keys", group: "Compliance", name: "Keyholders open & close", plain: "Opens and closes only go to people who can unlock the door: Sam and Rosa.", on: true, value: "2 keyholders", lastUsed: "Aug 24 · open shift limited to keyholders" },
    { id: "clopen", group: "Compliance", name: "No accidental clopens", plain: "Closing then opening the next morning needs a real night's rest between. Tagout asks the person before it ever books one.", on: true, value: "10 hr gap", options: ["8 hr gap", "10 hr gap", "12 hr gap"], lastUsed: "Aug 30, 3:22 PM · blocked a swap (Katie S., 9-hr turnaround)" },
    { id: "barcert", group: "Compliance", name: "Certified behind the bar", plain: "Bartender shifts only get offered to people with an alcohol service certification on file.", on: true, value: "Cert required", lastUsed: "Standing · 2 staff hold alcohol certification" },
    // How Tagout asks
    { id: "quiet", group: "How Tagout asks", name: "Quiet hours", plain: "No texts during quiet hours unless it's a same-morning emergency.", on: true, value: "9:30 PM to 7 AM", options: ["9 PM to 8 AM", "9:30 PM to 7 AM", "10 PM to 6 AM"], lastUsed: "Aug 24 · 3 messages held until 7:00 AM" },
    { id: "spacing", group: "How Tagout asks", name: "Time per person", plain: "How long each person gets to answer before Tagout moves down the list.", on: true, value: "15 min each", options: ["10 min each", "15 min each", "30 min each"], lastUsed: "Aug 30, 4:56 PM · advanced to next person at 15 min" },
    { id: "escalate", group: "How Tagout asks", name: "When you get the dial list", plain: "Tagout always asks everyone eligible. This sets how early you also get names and numbers to dial yourself.", on: true, value: "1 hr before shift", options: ["2 hrs before shift", "1 hr before shift", "Only if the list runs dry"], lastUsed: "Aug 24, 8:12 AM · call list sent to GM" },
    { id: "fair", group: "How Tagout asks", name: "Who gets asked first", plain: "The order Tagout works the list. People flagged as wanting hours always jump the line.", on: true, value: "Best yes-rate first", options: ["Best coverage fit first", "Fewest hours first", "Best yes-rate first", "Even rotation"], lastUsed: "Aug 26 · first ask to Devon K. (requested hours)" },
    { id: "urgent", group: "How Tagout asks", name: "Last-minute mode", plain: "When a call-out lands this close to the shift, Tagout shortens the wait per person and warns you sooner.", on: true, value: "Inside 3 hrs", options: ["Inside 2 hrs", "Inside 3 hrs", "Inside 4 hrs"], lastUsed: "Aug 30, 6:04 AM · shortened waits (call-out inside window)" },
    // Approvals
    { id: "swaps", group: "Approvals", name: "Swaps that pass every rule", plain: "When a swap clears hours, roles, and rest rules, Tagout can finish it alone or still bring it to you.", on: true, value: "Still ask me", options: ["Auto-approve", "Still ask me"], lastUsed: "Aug 29 · swap sent for approval" },
    { id: "training", group: "Approvals", name: "New-hire training window", plain: "New hires don't get solo shifts until they've been on the floor long enough. Tagout pairs them with a trainer instead.", on: true, value: "First 2 weeks", options: ["First week", "First 2 weeks", "First month"], lastUsed: "Standing · applies to Tyler J. after onboarding" },
    { id: "otexcept", group: "Approvals", name: "Overtime exceptions", plain: "If the only person left for a shift would go into overtime, Tagout can bring it to you instead of leaving the gap.", on: true, value: "Ask me first", options: ["Never allow", "Ask me first"], lastUsed: "Aug 9 · last exception request" },
    { id: "dropreason", group: "Approvals", name: "Drops need a reason", plain: "When someone drops a shift, Tagout asks why and logs it to their file, so patterns show up early.", on: true, value: "Required", options: ["Required", "Optional"], lastUsed: "Aug 30, 4:41 PM · reason logged (Dana W.)" },
    { id: "pickupboard", group: "Approvals", name: "Post drops to the pickup board", plain: "Dropped shifts also appear in the staff portal's pickup list while Tagout works the texts, so browsers can grab them too.", on: true, value: "On", options: ["On", "Off"], lastUsed: "Aug 30 · 1 open shift posted to the board" },
  ];

  const timeOff: TimeOff[] = [
    { id: "t1", staffId: "sasha", range: "Sep 12–14", reason: "Sister's wedding", state: "pending" },
    { id: "t2", staffId: "devon", range: "Sep 3", reason: "DMV appointment", state: "pending" },
    { id: "t3", staffId: "rosa", range: "Sep 8", reason: "Doctor", state: "approved" },
  ];

  const events: HouseEvent[] = [
    { id: "e1", day: 4, kind: "Large party", time: "7:00 PM", size: 45, room: "Patio", label: "45-top · 7 PM", note: "Rehearsal dinner. Tagout staffed +2 servers." },
    { id: "e2", day: 5, kind: "Live music", time: "8:00 PM", size: null, room: "Bar", label: "Live music · 8 PM", note: "Bar side runs heavy after 8." },
  ];

  const notes: Note[] = [
    { id: "n1", text: "86 the swordfish until Thursday's delivery.", when: "Yesterday 9:12 PM" },
    { id: "n2", text: "New patio heaters arrive Monday. Devon offered to assemble.", when: "Tuesday" },
  ];

  return {
    v: SEED_VERSION,
    houseName: "Harbor & Vine",
    gmFirst: "Jordan",
    autopilot: "ask-first",
    paused: false,
    rotation: "even",
    fixtures: [
      { id: "fx1", room: "Dining room", kind: "Kitchen", x: 87, y: 14, w: 26, h: 28 },
      { id: "fx2", room: "Dining room", kind: "Entry", x: 32, y: 96, w: 18, h: 8 },
      { id: "fx3", room: "Dining room", kind: "Host stand", x: 32, y: 86, w: 10, h: 10 },
      { id: "fx4", room: "Dining room", kind: "Restrooms", x: 90, y: 88, w: 18, h: 16 },
      { id: "fx5", room: "Bar", kind: "Bar counter", x: 50, y: 20, w: 84, h: 22 },
      { id: "fx6", room: "Patio", kind: "Entry", x: 4, y: 50, w: 6, h: 30 },
    ],
    floorBalanced: false,
    tables: [
      // Dining room: booths along the left wall, window two-tops up top, floor in the middle
      { id: "t1", label: "1", section: "Main", shape: "booth", seats: 4, room: "Dining room", x: 12, y: 22 },
      { id: "t2", label: "2", section: "Main", shape: "booth", seats: 4, room: "Dining room", x: 12, y: 50 },
      { id: "t3", label: "3", section: "Main", shape: "booth", seats: 4, room: "Dining room", x: 12, y: 78 },
      { id: "t4", label: "4", section: "Main", shape: "round", seats: 2, room: "Dining room", x: 38, y: 16 },
      { id: "t5", label: "5", section: "Main", shape: "round", seats: 2, room: "Dining room", x: 58, y: 16 },
      { id: "t6", label: "6", section: "Main", shape: "round", seats: 6, room: "Dining room", x: 42, y: 52 },
      { id: "t7", label: "7", section: "Main", shape: "round", seats: 4, room: "Dining room", x: 66, y: 46 },
      { id: "t8", label: "8", section: "Bar side", shape: "round", seats: 4, room: "Dining room", x: 44, y: 82 },
      { id: "t9", label: "9", section: "Bar side", shape: "square", seats: 2, room: "Dining room", x: 68, y: 78 },
      // Patio: airy rows, the 8-top anchors the far end
      { id: "t10", label: "10", section: "Patio", shape: "round", seats: 4, room: "Patio", x: 18, y: 30 },
      { id: "t11", label: "11", section: "Patio", shape: "round", seats: 4, room: "Patio", x: 45, y: 30 },
      { id: "t12", label: "12", section: "Patio", shape: "round", seats: 2, room: "Patio", x: 18, y: 70 },
      { id: "t13", label: "13", section: "Patio", shape: "round", seats: 4, room: "Patio", x: 45, y: 70 },
      { id: "t14", label: "14", section: "Patio", shape: "square", seats: 8, room: "Patio", x: 78, y: 50 },
      // Bar: high-tops along the rail
      { id: "t15", label: "15", section: "Bar side", shape: "hightop", seats: 2, room: "Bar", x: 20, y: 66 },
      { id: "t16", label: "16", section: "Bar side", shape: "hightop", seats: 2, room: "Bar", x: 45, y: 66 },
      { id: "t17", label: "17", section: "Bar side", shape: "hightop", seats: 2, room: "Bar", x: 70, y: 66 },
    ],
    staff,
    shifts,
    punches,
    runs,
    feed,
    rules,
    timeOff,
    events,
    claims: [],
    notes,
    weekPublished: true,
    dismissed: [],
    stats: { coveredPct: 100, repliesToday: 14, laborWeek: 6240, covers90d: 47, medianCoverMins: 9 },
  };
}
