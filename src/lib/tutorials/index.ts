export interface Tutorial {
	slug: string;
	title: string;
	description: string;
	difficulty: 'beginner' | 'intermediate' | 'advanced';
	sections: TutorialSection[];
}

export interface TutorialSection {
	title: string;
	content: string;
	code?: string;
	hint?: string;
}

export const tutorials: Tutorial[] = [
	{
		slug: 'basics',
		title: 'Getting Started',
		description: 'Learn the fundamentals of ink - writing text, creating choices, and basic story structure.',
		difficulty: 'beginner',
		sections: [
			{
				title: 'Hello, ink!',
				content: `
Welcome to ink! Ink is a scripting language for writing interactive narrative. It was created by Inkle Studios and used to write games like 80 Days and Heaven's Vault.

The simplest ink story is just plain text. Try running this example to see it in action.
				`,
				code: `Hello, world!
This is my first ink story.

It can have multiple paragraphs.`
			},
			{
				title: 'Creating Choices',
				content: `
Interactive fiction needs choices! In ink, you create choices using the \`*\` symbol at the start of a line.

Each choice is wrapped in square brackets \`[]\`. The text inside the brackets is what the player sees as the choice.
				`,
				code: `You stand at a crossroads.

* [Go left]
  You head down the left path.

* [Go right]
  You take the right path.

* [Turn back]
  You decide to return home.`,
				hint: 'Click on a choice to see what happens!'
			},
			{
				title: 'Choice Text Variations',
				content: `
Sometimes you want the choice text to differ from what appears in the story. Ink lets you control this with brackets:

- \`* [Choice only]\` - Text appears only as the choice, nothing in the story
- \`* Choice and [story] text\` - "Choice and story text" is the choice, "Choice and text" appears in story

The simplest approach is using \`[]\` for choice-only text, then adding the story continuation below.
				`,
				code: `"What would you like?" the barista asks.

* [Order a coffee]
  "A coffee, please."
  She nods and starts brewing your drink.

* [Order water]
  "Just water, thanks."
  She hands you a glass.

* [Say you'll come back later]
  "I'll come back later."
  You step outside to think.

* [Leave without ordering]
  You walk out of the cafe silently.`
			},
			{
				title: 'Sticky Choices',
				content: `
By default, choices marked with \`*\` can only be selected once - they disappear after being chosen.

Use \`+\` instead of \`*\` to create **sticky choices** that remain available. This is useful for repeatable actions like asking questions or exploring locations.
				`,
				code: `-> conversation

=== conversation ===
The old sage sits before you.

+ [Ask about the weather]
  "Storms are coming from the east."
  -> conversation

+ [Ask about the prophecy]
  "A hero will rise when darkness falls."
  -> conversation

+ [Ask about yourself]
  "You seek answers, but first seek questions."
  -> conversation

* [Thank them and leave]
  "May wisdom guide you."
  -> END`,
				hint: 'Notice how the + choices remain available, but the * choice disappears after use.'
			},
			{
				title: 'Comments',
				content: `
Comments let you add notes to your ink that won't appear in the story. Use \`//\` for single-line comments or \`/* */\` for blocks.

Comments are great for explaining complex logic, leaving TODOs, or temporarily disabling content.
				`,
				code: `// This is our main story about a detective
VAR clues_found = 0

/*
  The player investigates a crime scene.
  They need to find at least 2 clues to solve the case.
*/

You arrive at the scene of the crime.

* [Examine the window]
  // This is an important clue!
  ~ clues_found = clues_found + 1
  The window was forced open from outside.
  -> check_progress

* [Check the desk]
  ~ clues_found = clues_found + 1
  You find a threatening letter.
  -> check_progress

* [Look under the rug]
  Just dust bunnies here.
  -> check_progress

=== check_progress ===
{clues_found >= 2: You think you've found enough evidence.|}
-> END`
			},
			{
				title: 'Fallback Choices',
				content: `
When all choices have been used (or none are available), ink needs somewhere to go. A **fallback choice** has no text in brackets and runs automatically.

Fallbacks are useful for loops where you want a default exit.
				`,
				code: `-> search_room

=== search_room ===
You search the dusty attic.

* [Open the chest]
  You find an old map inside!
  -> search_room

* [Look behind the painting]
  There's a hidden safe!
  -> search_room

* [Check under the floorboards]
  Just spiders.
  -> search_room

*   []
    You've searched everywhere.
    Time to move on.
    -> END`,
				hint: 'The fallback choice (with empty brackets) triggers when all other choices are exhausted.'
			}
		]
	},
	{
		slug: 'structure',
		title: 'Story Structure',
		description: 'Organize your story with knots, stitches, and diverts.',
		difficulty: 'beginner',
		sections: [
			{
				title: 'Knots',
				content: `
As your story grows, you'll want to organize it into sections. In ink, these sections are called **knots**.

A knot is defined with \`===\` followed by the knot name. You can jump to a knot using a **divert**: \`->\`
				`,
				code: `-> start

=== start ===
You wake up in a strange room.

* [Look around] -> look_around
* [Go back to sleep] -> sleep

=== look_around ===
The room is dimly lit. You see a door.

* [Open the door] -> escape
* [Search the room] -> search

=== sleep ===
You fall back asleep...
-> END

=== search ===
You find a key under the pillow!
-> escape

=== escape ===
You leave the room.
-> END`
			},
			{
				title: 'Stitches',
				content: `
Stitches are sub-sections within a knot. They're defined with a single \`=\` and help organize related content.

You can divert to a stitch using \`knot.stitch\` syntax.
				`,
				code: `-> tavern

=== tavern ===
You enter the tavern. It's warm and noisy.

+ [Go to the bar] -> tavern.bar
+ [Find a table] -> tavern.table
* [Leave] -> END

= bar
The bartender nods at you.
"What'll it be?"

+ [Order ale]
  "Coming right up!"
  -> tavern
* [Ask for information]
  "I might know something..."
  -> END

= table
You find a quiet corner table.

+ [Rest for a while]
  You take a short break.
  -> tavern`
			},
			{
				title: 'The END',
				content: `
Every story path needs to end somewhere. Use \`-> END\` to mark the end of a story branch.

If a path has no divert and no choices, ink will try to continue to the next content, which might not be what you want!
				`,
				code: `You find a mysterious box.

* [Open it]
  Inside is a golden coin!
  You pocket the treasure.
  -> END

* [Leave it alone]
  Some mysteries are best left unsolved.
  -> END

* [Destroy it]
  You smash the box.
  It was empty anyway.
  -> END`
			},
			{
				title: 'Glue',
				content: `
By default, ink puts each piece of content on its own line. Use **glue** \`<>\` to join content together without line breaks.

Glue is useful when you want text to flow naturally after a divert or choice.
				`,
				code: `-> greet

=== greet ===
"Hello<>

* [, friend]
  <>, friend!"

* [, stranger]
  <>, stranger!"

* [... wait, who are you?]
  <>... wait, who are you?"

-
"Welcome to our village."
-> END`,
				hint: 'The glue joins the greeting with the chosen response into one sentence.'
			},
			{
				title: 'Gathers',
				content: `
After choices branch out, you often want them to come back together. A **gather** point \`-\` collects all branches and continues the story.

Gathers help you avoid repeating the same content after every choice.
				`,
				code: `You approach the merchant.

* [Haggle aggressively]
  "That price is outrageous!"
  The merchant frowns.

* [Compliment their wares]
  "Such fine craftsmanship!"
  The merchant smiles.

* [Stay silent]
  You wait patiently.
  The merchant looks uncomfortable.

- "Well then," the merchant says, "shall we do business?"

* [Buy something]
  You make a purchase.

* [Leave]
  You walk away.

- The sun is setting as you leave the market.
-> END`,
				hint: 'The - gather points bring all branches back together.'
			},
			{
				title: 'Labels',
				content: `
You can name choices and gathers with **labels** to divert to them later. Labels are written in parentheses: \`* (label_name)\` or \`- (label_name)\`.

This lets you create loops or jump to specific points in a conversation.
				`,
				code: `-> interrogation

=== interrogation ===
The suspect sits nervously.

* (ask_name) [Ask their name]
  "I'm... John Smith."
  -> interrogation

* (ask_alibi) [Ask for an alibi]
  "I was at home, alone."
  -> interrogation

* {ask_name && ask_alibi} [Confront with evidence]
  "We know you're lying, John!"
  The suspect breaks down.
  -> confession

* [End interrogation]
  -> END

=== confession ===
"Alright, alright! I did it!"
-> END`,
				hint: 'The confront option only appears after asking both questions.'
			}
		]
	},
	{
		slug: 'variables',
		title: 'Variables & Logic',
		description: 'Track state, make calculations, and create dynamic stories.',
		difficulty: 'intermediate',
		sections: [
			{
				title: 'Declaring Variables',
				content: `
Variables let you track information throughout your story. Declare them with \`VAR\` at the top of your story.

Use \`~\` to modify variables. You can display variable values using \`{variableName}\`.
				`,
				code: `VAR gold = 10
VAR name = "Traveler"

Hello, {name}! You have {gold} gold coins.

* [Find treasure]
  ~ gold = gold + 5
  You found 5 gold!
  Now you have {gold} gold.
  -> END

* [Buy supplies]
  ~ gold = gold - 3
  You spend 3 gold on supplies.
  You have {gold} gold left.
  -> END`
			},
			{
				title: 'Conditional Content',
				content: `
Use curly braces \`{}\` with a condition to show content only when that condition is true.

You can also use \`{condition: content}\` for inline conditionals.
				`,
				code: `VAR has_sword = false
VAR gold = 15

You enter the shop.

* {gold >= 10} [Buy a sword (10 gold)]
  ~ gold = gold - 10
  ~ has_sword = true
  You purchase a fine blade.
  -> adventure

* [Leave]
  -> adventure

=== adventure ===
A goblin blocks your path!

{has_sword:
  * [Fight with your sword]
    You defeat the goblin easily!
    -> END
}

* [Run away]
  You flee!
  -> END

* [Negotiate]
  {gold > 0: You offer some gold.|}
  The goblin considers...
  -> END`
			},
			{
				title: 'Conditional Choices',
				content: `
You can make choices appear only when conditions are met by putting the condition before the choice.

This is great for unlocking options based on player progress.
				`,
				code: `VAR reputation = 0
VAR has_key = false

-> castle_gate

=== castle_gate ===
The guard eyes you suspiciously. (Reputation: {reputation})

* {reputation >= 5} [Show your royal pass]
  "Welcome back, friend of the crown!"
  -> inside

* {has_key} [Use the secret entrance]
  You slip through the side door.
  -> inside

+ [Try to sneak past]
  ~ reputation = reputation - 1
  The guard catches you!
  "Get back, peasant!"
  -> castle_gate

+ [Help the guard with his duties]
  ~ reputation = reputation + 2
  "Thanks! You're alright."
  -> castle_gate

* [Look for another way in]
  ~ has_key = true
  You find a key hidden nearby!
  -> castle_gate

=== inside ===
You made it into the castle!
-> END`
			},
			{
				title: 'Temporary Variables',
				content: `
Use \`temp\` to create temporary variables that only exist within the current knot or stitch. They're great for calculations without cluttering your global variables.
				`,
				code: `VAR base_damage = 10
VAR strength = 5
VAR has_magic_sword = true

-> combat

=== combat ===
A wild goblin appears!

* [Attack!]
  ~ temp damage = base_damage + strength
  ~ temp is_critical = false
  {has_magic_sword:
    ~ damage = damage * 2
    ~ is_critical = true
  }
  You swing your weapon!
  {is_critical: Critical hit! |}
  You deal {damage} damage!
  -> END

* [Run away]
  You flee from battle.
  -> END`
			},
			{
				title: 'Math Operations',
				content: `
Ink supports standard math: \`+\`, \`-\`, \`*\`, \`/\`, and \`%\` (modulo/remainder).

Use \`RANDOM(min, max)\` to generate random numbers for unpredictable outcomes.
				`,
				code: `VAR coins = 100
VAR items = 0

-> shop

=== shop ===
You have {coins} coins.

+ {coins >= 25} [Buy sword (25 coins)]
  ~ coins = coins - 25
  ~ items = items + 1
  -> shop

+ {coins >= 10} [Buy potion (10 coins)]
  ~ coins = coins - 10
  ~ items = items + 1
  -> shop

+ {coins >= 10} [Gamble (costs 10 coins)]
  ~ coins = coins - 10
  ~ temp winnings = RANDOM(0, 30)
  You won {winnings} coins!
  ~ coins = coins + winnings
  -> shop

* [Leave]
  You bought {items} items.
  You have {coins} coins left.
  -> END`,
				hint: 'Try gambling a few times to see the random results!'
			},
			{
				title: 'Constants',
				content: `
Use \`CONST\` to define values that never change. Constants make your code clearer and easier to maintain.
				`,
				code: `CONST MAX_HEALTH = 100
CONST POTION_HEAL = 30
CONST TRAP_DAMAGE = 25

VAR health = MAX_HEALTH

-> dungeon

=== dungeon ===
Health: {health}/{MAX_HEALTH}

+ {health < MAX_HEALTH} [Drink potion (+{POTION_HEAL})]
  ~ health = health + POTION_HEAL
  {health > MAX_HEALTH:
    ~ health = MAX_HEALTH
  }
  You feel better!
  -> dungeon

+ [Enter the next room]
  ~ temp trap = RANDOM(1, 3)
  {trap == 1:
    A trap! You take {TRAP_DAMAGE} damage.
    ~ health = health - TRAP_DAMAGE
  }
  {trap > 1:
    The room is safe.
  }
  {health <= 0:
    You collapse...
    -> END
  }
  -> dungeon

* [Leave dungeon]
  You escaped with {health} health!
  -> END`
			}
		]
	},
	{
		slug: 'sequences',
		title: 'Sequences & Alternatives',
		description: 'Create variety with sequences, cycles, and shuffles.',
		difficulty: 'intermediate',
		sections: [
			{
				title: 'Sequences',
				content: `
Sequences show different content each time they're visited. Use \`{}\` with items separated by \`|\`.

By default, sequences **stop** on the last item - once you reach the end, it keeps showing the last item.
				`,
				code: `VAR times = 0

-> knock

=== knock ===
~ times = times + 1
You knock on the door.
{No answer.|Still no answer.|You hear movement inside.|The door creaks open.}

+ {times < 4} [Knock again]
  -> knock

* {times >= 4} [Enter]
  You step inside.
  -> END

* [Give up]
  You walk away.
  -> END`
			},
			{
				title: 'Cycles',
				content: `
Cycles loop back to the beginning after reaching the end. Use \`&\` at the start to create a cycle.
				`,
				code: `VAR turns = 0

-> meditate

=== meditate ===
~ turns = turns + 1

You focus your mind.
{&You feel calm.|You feel centered.|You feel at peace.|You feel enlightened.}

{turns < 6:
  + [Continue meditating]
    -> meditate
}

* [Stop]
  You've meditated for {turns} turns.
  -> END`
			},
			{
				title: 'Shuffles',
				content: `
Shuffles show items in random order. Use \`~\` at the start to create a shuffle.
				`,
				code: `-> explore

=== explore ===
You search the ancient ruins.
{~You find a dusty scroll.|You discover ancient coins.|You spot mysterious runes.|You uncover a hidden passage.}

+ [Search again]
  -> explore

* [Leave]
  -> END`
			},
			{
				title: 'Once-Only Text',
				content: `
Use a sequence with a single item and blank alternative to show text only once: \`{First time only.|}\`

The blank after the \`|\` means nothing shows on subsequent visits.
				`,
				code: `-> camp

=== camp ===
{You set up camp for the night.|}
The fire crackles warmly.
{!This is your first night in the wilderness.|Another night under the stars.|You've grown used to sleeping outdoors.}

+ [Rest]
  {You sleep fitfully.|You sleep better than before.|You sleep soundly.}
  Morning comes.
  -> camp

* [Pack up and leave]
  You continue your journey.
  -> END`,
				hint: 'The ! before a sequence makes it "once-only" - showing blank after the last item.'
			},
			{
				title: 'Conditional Text',
				content: `
Combine conditions with alternatives using \`{condition: if true | if false}\`.

This lets you weave dynamic descriptions based on story state.
				`,
				code: `VAR has_torch = false
VAR gold = 5

-> cave

=== cave ===
You stand at the cave entrance.
{has_torch: Your torch illuminates the darkness.|It's pitch black inside.}

* {not has_torch && gold >= 3} [Buy a torch (3 gold)]
  ~ gold = gold - 3
  ~ has_torch = true
  You purchase a torch from a nearby vendor.
  -> cave

* {has_torch} [Enter the cave]
  You venture into the depths.
  The walls glitter with {gold > 0: promise|forgotten treasures}.
  -> END

+ {not has_torch} [Enter anyway]
  You stumble in the darkness...
  {~You trip over a rock.|Something brushes past you.|You hear strange noises.}
  -> cave

* [Leave]
  {has_torch: Torch in hand, you|You} walk away.
  -> END`
			}
		]
	},
	{
		slug: 'advanced',
		title: 'Advanced Features',
		description: 'Master functions, tunnels, and threads.',
		difficulty: 'advanced',
		sections: [
			{
				title: 'Functions',
				content: `
Functions let you reuse logic. Define them like knots but use them with \`{function_name()}\`.

Functions can take parameters and return values.
				`,
				code: `VAR health = 100
VAR max_health = 100

-> start

=== function heal(amount) ===
~ health = health + amount
{health > max_health:
  ~ health = max_health
}
~ return

=== function show_health ===
Health: {health}/{max_health}
~ return

=== start ===
You enter the dungeon.
{show_health()}

* [Fight the skeleton]
  ~ health = health - 30
  Ouch! You take damage.
  {show_health()}
  -> rest

* [Sneak past]
  You avoid combat.
  -> rest

=== rest ===
You find a healing fountain.

* [Drink deeply]
  ~ heal(50)
  You feel refreshed!
  {show_health()}
  -> END

* [Take a sip]
  ~ heal(20)
  A little better.
  {show_health()}
  -> END`
			},
			{
				title: 'Tunnels',
				content: `
Tunnels let you "visit" content and return. Use \`->->\` to return from a tunnel.

This is useful for reusable scenes or conversations.
				`,
				code: `-> start

=== start ===
You're in the town square.

* [Visit the shop] -> shop ->
  Back in the square.
  -> start

* [Talk to the guard] -> guard_chat ->
  The guard returns to his post.
  -> start

* [Leave town]
  -> END

=== shop ===
"Welcome! Browse my wares."

* [Buy health potion]
  "Excellent choice!"
  ->->

* [Just looking]
  "Come back anytime."
  ->->

=== guard_chat ===
"Halt! State your business."

* [Just passing through]
  "Move along then."
  ->->

* [Any news?]
  "Beware the forest at night."
  ->->`
			},
			{
				title: 'Threads',
				content: `
Threads let you run content in parallel. Use \`<-\` to start a thread.

Threads are useful for background events or simultaneous actions.
				`,
				code: `VAR tension = 0

-> scene

=== scene ===
<- background_tension
The negotiation begins.

* [Make demands]
  ~ tension = tension + 2
  They look angry.
  -> continue_scene

* [Offer compromise]
  ~ tension = tension - 1
  They seem receptive.
  -> continue_scene

=== continue_scene ===
{tension >= 3:
  The situation explodes!
  -> END
}

* [Press further]
  ~ tension = tension + 2
  -> continue_scene

* [Back off]
  You reach an agreement.
  -> END

=== background_tension ===
~ tension = tension + 1
The clock ticks loudly...
-> DONE`
			},
			{
				title: 'Knot Parameters',
				content: `
Knots can accept parameters, making them reusable for different situations.

Pass values when you divert: \`-> knot_name(value1, value2)\`
				`,
				code: `VAR player_gold = 50
VAR items_shown = 0

-> shop

=== shop ===
~ items_shown = items_shown + 1
{items_shown == 1: -> show_item("Sword", 25)}
{items_shown == 2: -> show_item("Shield", 20)}
{items_shown == 3: -> show_item("Potion", 10)}
"That's all I have!"
-> END

=== show_item(item, price) ===
The merchant shows you a {item}.
"This {item} costs {price} gold." (You have {player_gold}g)

+ {player_gold >= price} [Buy the {item}]
  ~ player_gold = player_gold - price
  "Pleasure doing business!"
  -> shop

* [No thanks]
  "Maybe next time."
  -> shop`
			},
			{
				title: 'Game Queries',
				content: `
Ink provides built-in functions to query the game state:

- \`TURNS()\` - Total turns taken
- \`TURNS_SINCE(-> knot)\` - Turns since visiting a knot (-1 if never)
- \`CHOICE_COUNT()\` - Number of choices available at this point
				`,
				code: `VAR visited_garden = false

-> start

=== start ===
Turn {TURNS()}: You're in the hallway.
{TURNS() > 5: You've been wandering a while now.|}

+ [Go to garden]
  -> garden

+ [Go to library]
  -> library

+ {TURNS() >= 3} [Rest here]
  You take a moment to rest.
  -> start

=== garden ===
~ visited_garden = true
The garden is peaceful.
{TURNS_SINCE(-> library) >= 0: You were just in the library {TURNS_SINCE(-> library)} turns ago.|}

+ [Return to hallway]
  -> start

=== library ===
The library is quiet.
{visited_garden: The garden felt nice.|}

+ [Return to hallway]
  -> start`,
				hint: 'Watch how TURNS() increases and TURNS_SINCE() tracks your movement!'
			},
			{
				title: 'External Functions',
				content: `
The \`EXTERNAL\` keyword declares functions that will be provided by the game engine. This connects your ink story to game features like saving, achievements, or sound.

In this tutorial, external functions won't actually run - but this shows the syntax.
				`,
				code: `// Declare external functions (provided by game)
EXTERNAL playSound(soundName)
EXTERNAL saveGame()
EXTERNAL unlockAchievement(name)

VAR treasure_found = false

-> cave

=== cave ===
You enter a dark cave.

* [Search carefully]
  ~ treasure_found = true
  You find hidden treasure!
  ~ unlockAchievement("Treasure Hunter")
  ~ playSound("treasure_chime")
  -> cave_exit

* [Rush through]
  You hurry past, missing the treasure.
  -> cave_exit

=== cave_exit ===
You see daylight ahead.

* [Save and exit]
  ~ saveGame()
  You emerge from the cave.
  {treasure_found: You clutch your newfound treasure.|}
  -> END

* [Go back]
  -> cave`,
				hint: 'External functions let ink communicate with your game engine.'
			}
		]
	}
];

export function getTutorial(slug: string): Tutorial | undefined {
	return tutorials.find(t => t.slug === slug);
}
