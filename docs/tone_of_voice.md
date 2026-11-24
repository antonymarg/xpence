# XPence Tone of Voice

**Status:** v1 (2026-11-24). Open decisions confirmed and applied to the app copy.

## In one line

XPence sounds like a friend who's good with money and never makes you feel bad about yours: calm underneath, a little playful on top.

## Who we're talking to

Beginners who feel anxious or guilty about money. They want to get on top of their spending without being judged. Every line of copy should lower stress, not raise it.

## Principles

1. **Calm first, playful second.** Personality is a seasoning. If a joke could add stress, drop it.
2. **Never judge.** We report what happened and offer a next step. We don't scold, shame, or mock spending.
3. **Plain words.** Everyday language, no finance jargon.
4. **Short, with personality in the right places.** One brief line is the default. Personality lives in empty states, onboarding and celebrations, not in every label.
5. **Warm celebration, in proportion.** Wins get real enthusiasm, but sized to the achievement.

## Tone by context

| Context | Tone | Humour |
|---|---|---|
| Buttons, labels, navigation | Neutral, short, action-first | No |
| Onboarding, empty states | Friendly, light, playful | Yes |
| Success and wins (goal hit, under budget) | Warm and upbeat | Light, yes |
| Over-budget and goal-missed messages | Gentle nudge: state it, offer a next step *(proposed: at most a light touch, never a joke at the user's expense)* | Rarely |
| Errors and failed actions | Clear, calm, tell them what to do next | **No** |
| Deleting data and other destructive actions | Serious and unambiguous: say exactly what will happen | **No** |

## Voice mechanics

- **Address:** informal second person. English "you"; Greek singular informal (εσύ), never the formal plural.
- **Emoji:** minimal. Use rarely, only for celebrations and empty states. Never in alerts, errors, destructive actions, buttons or labels. Max one per message.
- **Exclamation marks:** sparingly. Reserve for celebrations. Max one per message.
- **Core terms:** **needs**, **wants**, **savings**. Fixed, lowercase, used the same way everywhere. Don't swap in synonyms ("essentials", "treats", "nest egg").
- **Jargon:** plain words only. Say "left to spend", not "remaining balance". Avoid "allocation", "variance", "net", etc.
- **Length:** one short line by default. Add a second line only when the user needs a next step.

## Examples

| Situation | Don't | Do |
|---|---|---|
| Over budget on wants | "Warning! You've exceeded your wants budget." | "You're a bit over on wants this month. Want to adjust your budget?" |
| Under budget | "Budget variance: positive." | "Nice, you stayed under budget this month 🎉" |
| Empty expenses list | "No data." | "Nothing here yet. Add your first expense and we'll take it from there." |
| Error | "Oops, something exploded!" | "Couldn't save that expense. Check your connection and try again." |
| Delete | "Bye bye, data!" | "Delete this expense? This can't be undone." |
| Balance | "Remaining balance: €40" | "€40 left to spend" |

## Greek localisation

- **Natural, localised.** Greek copy should read as if it was written in Greek. Adapt humour and idiom; don't translate word for word.
- **Same voice, same rules.** Same limits on humour, emoji and exclamation marks as English.
- **Informal singular (εσύ)** throughout. Use everyday modern Greek, not stiff or bureaucratic phrasing.
- **Fixed glossary.** Each core term gets one Greek translation, used everywhere: needs → **Ανάγκες**, wants → **Επιθυμίες**, savings → **Αποταμίευση**. Expense is always neuter (**το έξοδο / τα έξοδα**); prefer "έξοδα" over "δαπάνες".
- **Button and label style:** noun form ("Προσθήκη εξόδου", "Αποθήκευση"), app-wide. Messages and prompts use the informal imperative ("Δοκίμασε ξανά").
- **Exception: legal text.** The Terms of Use & Privacy Policy stay in the formal plural (εσείς).
- *(To decide)* **Gender-neutral phrasing** where the user is described, to avoid assuming gender.

## Translation review checklist

For each Greek string, compared against its English source:

1. **Meaning:** same information and same next step as the source.
2. **Tone:** calm, not judgmental. Humour is absent in errors and destructive actions.
3. **Address:** informal singular only.
4. **Glossary:** core terms match the fixed translations.
5. **Naturalness:** reads like native Greek, not translated English.
6. **Emoji and exclamation marks:** within the limits above.
7. **Plain words:** no jargon introduced by the translation.
8. **Consistency:** same term and same phrasing for the same concept across screens.
9. **Technical:** placeholders, plurals and variables intact; text still fits the UI.

## Open decisions

- [x] Confirm the Greek glossary for needs / wants / savings
- [x] Imperative vs noun form for Greek buttons (noun form)
- [ ] Decide whether over-budget messages may ever use a light touch of humour
- [x] Confirm emoji and exclamation limits (one per message)