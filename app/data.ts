export type DomainCode = "DD" | "SE" | "BS" | "BR" | "ER";

export const domains: Array<{ code: DomainCode; name: string; description: string }> = [
  { code: "DD", name: "Discovery Drive", description: "How readily your pet investigates safe novelty and change." },
  { code: "SE", name: "Social Energy", description: "How often your pet seeks and sustains voluntary interaction." },
  { code: "BS", name: "Bonding Style", description: "How your pet participates in familiar, trusted relationships." },
  { code: "BR", name: "Behavioral Regulation", description: "How flexibly your pet shifts, pauses, and settles." },
  { code: "ER", name: "Emotional Resilience", description: "How your pet recovers after manageable everyday stress." },
];

type ScoredQuestion = { id: number; title: string; text: string; domain: DomainCode; reverse?: boolean };
type ContextQuestion = { id: number; title: string; text: string; options: string[] };
export type Question = ScoredQuestion | ContextQuestion;

export const questions: Question[] = [
  { id: 1, title: "Safe new object", text: "When a safe unfamiliar object appeared in a familiar space, my pet voluntarily moved closer to inspect it within about two minutes.", domain: "DD" },
  { id: 6, title: "Familiar-person initiation", text: "While awake and free to choose, my pet initiated play, proximity, or another social interaction with a familiar person.", domain: "SE" },
  { id: 11, title: "Comfortable familiar contact", text: "During a form of gentle contact this pet normally accepts, their body remained loose and they stayed voluntarily.", domain: "BS" },
  { id: 16, title: "Blocked access", text: "When access to a desired but nonessential item or place was briefly blocked, my pet could pause or move to another activity without repeated escalation.", domain: "BR" },
  { id: 21, title: "Ordinary unexpected sound", text: "After an ordinary unexpected household sound, my pet resumed their previous activity or another relaxed activity within about two minutes.", domain: "ER" },
  { id: 2, title: "New accessible space", text: "When given free access to an unfamiliar room or area, my pet moved beyond the entrance and investigated.", domain: "DD" },
  { id: 7, title: "Joining activity", text: "When familiar household members gathered for an ordinary activity, my pet voluntarily entered or remained in the shared area.", domain: "SE" },
  { id: 12, title: "Re-engagement", text: "If familiar contact paused while my pet was still interested, they moved closer, remained nearby, or invited the interaction to continue.", domain: "BS" },
  { id: 17, title: "Activity ending", text: "After an ordinary play or enrichment session ended, my pet shifted to another activity or began settling within about five minutes.", domain: "BR" },
  { id: 22, title: "Visitor or routine change", text: "Following a manageable visitor arrival or minor routine change, my pet returned to their usual behavior within about ten minutes.", domain: "ER" },
  { id: 3, title: "Changed familiar environment", text: "When a familiar object was moved or the room arrangement changed, my pet checked the changed area without being led to it.", domain: "DD" },
  { id: 8, title: "Sustained engagement", text: "After voluntarily beginning a social interaction, my pet remained engaged or reinitiated it for at least two minutes.", domain: "SE" },
  { id: 13, title: "Cooperative routine", text: "During a familiar, low-stress care routine, my pet remained available and could complete the routine without unusual restraint.", domain: "BS" },
  { id: 18, title: "Available alternative", text: "When the preferred option was unavailable, my pet engaged with an available alternative rather than repeatedly attempting only the blocked option.", domain: "BR" },
  { id: 23, title: "Brief frustration recovery", text: "After a minor everyday frustration, my pet's body and activity returned to their usual state within about five minutes.", domain: "ER" },
  { id: 4, title: "New enrichment", text: "When offered a safe new puzzle, toy, scent source, or search activity, my pet continued investigating after the first contact.", domain: "DD" },
  { id: 9, title: "Compatible-animal interaction", text: "When a known, compatible animal was available, my pet initiated or willingly joined a non-threatening interaction.", domain: "SE" },
  { id: 14, title: "Shared neutral space", text: "In a resource-neutral situation, my pet comfortably shared space with a familiar person or known compatible animal.", domain: "BS" },
  { id: 19, title: "Routine transition", text: "During a familiar daily transition, my pet completed the transition without repeated prompting or physical pressure.", domain: "BR" },
  { id: 24, title: "Caregiver briefly out of view", text: "During normal household movement when a familiar caregiver was briefly out of view, my pet remained able to rest, explore, eat, or engage in another ordinary activity.", domain: "ER" },
  { id: 5, title: "Continued avoidance", text: "After noticing a harmless unfamiliar object from a safe distance, my pet continued avoiding it for the remainder of the observation.", domain: "DD", reverse: true },
  { id: 10, title: "Declining familiar invitations", text: "When a familiar person calmly invited interaction and my pet was free to approach, my pet remained apart or moved farther away.", domain: "SE", reverse: true },
  { id: 15, title: "Tension during familiar approach", text: "When a familiar caregiver approached calmly during an ordinary neutral moment, my pet showed tension or withdrew before contact was attempted.", domain: "BS", reverse: true },
  { id: 20, title: "Escalating repetition", text: "When a desired outcome did not occur, my pet repeated the same action with increasing intensity after the opportunity had clearly ended.", domain: "BR", reverse: true },
  { id: 25, title: "Persistent response", text: "After a mild trigger had ended, vigilant scanning, hiding, pacing, trembling, or exit focus continued for more than ten minutes.", domain: "ER", reverse: true },
  { id: 26, title: "Time together", text: "How long has this pet lived with you?", options: ["Less than 30 days", "30–89 days", "3–12 months", "More than 12 months"] },
  { id: 27, title: "Health change", text: "During the last 30 days, has your pet had pain, illness, surgery, injury, reduced mobility, or a notable appetite or sleep change?", options: ["No known change", "Possible minor change", "Confirmed or substantial change", "Unsure"] },
  { id: 28, title: "Medication change", text: "During the last 30 days, was a medication started, stopped, or substantially changed?", options: ["No", "Yes", "Unsure"] },
  { id: 29, title: "Life change", text: "During the last 30 days, did your pet experience a move, new household member, loss, boarding, adoption, major schedule change, or frightening event?", options: ["No major change", "One manageable change", "One major or several changes", "Prefer not to say"] },
  { id: 30, title: "Sudden behavioral change", text: "Compared with the previous three months, has any behavior changed suddenly or markedly?", options: ["No", "Yes, but it has resolved", "Yes, and it is continuing", "I have not known the pet long enough"] },
  { id: 31, title: "Observation coverage", text: "In how many of the 25 situations above did you recall at least three relevant occasions?", options: ["0–9", "10–15", "16–20", "21–25"] },
  { id: 32, title: "Independent perspective", text: "Has another regular caregiver independently described this pet's recent behavior?", options: ["No second observer is available", "Yes, and our observations are mostly similar", "Yes, and our observations differ in several areas", "I am not sure"] },
];

export const responseLabels = ["Never", "Rarely", "Sometimes", "Often", "Almost always", "Not observed / not applicable"];

export const archetypes = [
  ["Flame Vanguard", [80,80,50,20,80], "Moves quickly toward novelty and often acts before pausing"],
  ["Glacier Watcher", [20,20,50,80,80], "Calm, self-paced, predictable, and selective about engagement"],
  ["Moonshadow Ranger", [80,20,20,50,80], "Independent exploration with little need for social participation"],
  ["Sunmeadow Guardian", [20,50,80,80,80], "Warm, steady, familiar-routine oriented, and dependable in known settings"],
  ["Thundertrail Scout", [80,80,50,50,50], "Active, socially visible, and eager to investigate what happens next"],
  ["Starlight Inventor", [80,20,50,20,50], "Quietly experimental and inclined to discover unconventional solutions"],
  ["Riverstone Companion", [50,50,80,80,80], "Affiliative, balanced, and easy to settle into shared routines"],
  ["Mosswood Keeper", [20,20,80,80,50], "Private, gentle, and deeply comfortable with familiar people and places"],
  ["Golden Harbor Host", [50,80,80,80,80], "Socially welcoming, cooperative, and steady in familiar gatherings"],
  ["Wildwind Trickster", [80,80,50,20,50], "Fast-moving, inventive, and likely to repeat what produces excitement"],
  ["Dewlight Comforter", [20,50,80,50,20], "Affection-oriented and responsive, with a need for gentle transitions"],
  ["Stormglass Sentinel", [50,20,20,80,20], "Watchful, selective, and most comfortable when change is predictable"],
  ["Emberheart Ally", [50,80,80,50,20], "Highly engaged with companions and emotionally responsive to the setting"],
  ["Cloudpath Wanderer", [80,50,20,20,80], "Flexible, independent, and drawn toward discovery more than routine"],
  ["Willowshade Observer", [50,20,50,80,50], "Deliberate, orderly, and inclined to watch before participating"],
  ["Aurora Pathfinder", [80,50,80,80,50], "Curious and cooperative, balancing exploration with connection"],
] as Array<[string, number[], string]>;

export const demoProfiles = [
  { id: "miso", name: "Miso", species: "Cat", region: "Shanghai · Jing'an", stage: "Adult", archetype: "Mosswood Keeper", activity: "Quiet enrichment", owner: "Lin", score: 92, signals: ["Similar social energy", "Shared calm-enrichment goal", "Same general region"], color: "moss" },
  { id: "pepper", name: "Pepper", species: "Dog", region: "Shanghai · Xuhui", stage: "Young adult", archetype: "Thundertrail Scout", activity: "Walks & outings", owner: "Kai", score: 88, signals: ["Strong discovery drive", "Shared outing goal", "Compatible activity rhythm"], color: "ember" },
  { id: "nori", name: "Nori", species: "Cat", region: "Shanghai · Pudong", stage: "Adult", archetype: "Willowshade Observer", activity: "Window watching", owner: "Mei", score: 83, signals: ["Deliberate approach to novelty", "Similar recovery patterns", "Care-discussion goal"], color: "slate" },
  { id: "bao", name: "Bao", species: "Dog", region: "Shanghai · Changning", stage: "Senior", archetype: "Riverstone Companion", activity: "Gentle routines", owner: "Ana", score: 79, signals: ["Steady familiar routines", "Calm-companionship goal", "High profile completeness"], color: "terracotta" },
];
