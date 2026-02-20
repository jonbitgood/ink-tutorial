export interface Example {
	name: string;
	source: string;
}

export const examples: Record<string, Example> = {
	hello: {
		name: 'Hello World',
		source: `// A simple Hello World example
Hello, world!

* [Say hello back]
    Hello to you too!
    -> END

* [Stay silent]
    ...
    -> END`
	},

	choices: {
		name: 'Basic Choices',
		source: `// Demonstrating choices in ink
You stand at a crossroads.

* [Go left]
    You head down the left path.
    The forest grows darker.
    -> deeper

* [Go right]
    You take the right path.
    Sunlight filters through the trees.
    -> clearing

* [Turn back]
    You decide to turn back.
    -> END

=== deeper ===
The path winds deeper into the woods.
You hear strange sounds ahead.

* [Continue forward]
    You push on bravely.
    -> END

* [Climb a tree]
    You scale a tall oak to get your bearings.
    -> END

=== clearing ===
You emerge into a sunny clearing.
Birds sing in the trees.

* [Rest here]
    You sit down and enjoy the peace.
    -> END

* [Explore the clearing]
    You find some interesting mushrooms.
    -> END`
	},

	variables: {
		name: 'Variables & Logic',
		source: `// Using variables in ink
VAR gold = 10
VAR has_sword = false

You have {gold} gold coins.

* [Buy a sword (5 gold)]
    ~ gold = gold - 5
    ~ has_sword = true
    You purchase a fine steel sword.
    You now have {gold} gold.
    -> adventure

* [Save your money]
    You decide to hold onto your gold.
    -> adventure

=== adventure ===
A goblin blocks your path!

{has_sword:
    * [Fight with your sword]
        You draw your blade and defeat the goblin!
        It drops 3 gold coins.
        ~ gold = gold + 3
        You now have {gold} gold.
        -> END
}

* [Run away]
    You flee from the goblin.
    -> END

* [Try to bribe it]
    {gold >= 5:
        You offer 5 gold and the goblin lets you pass.
        ~ gold = gold - 5
        -> END
    - else:
        You don't have enough gold to bribe it!
        -> adventure
    }`
	},

	sequences: {
		name: 'Sequences & Cycles',
		source: `// Demonstrating sequences and cycles
VAR times_knocked = 0

=== door ===
You stand before a mysterious door.

* [Knock on the door]
    ~ times_knocked = times_knocked + 1
    You knock on the door.

    // Stopping sequence - different response each time, then stops
    {times_knocked:
        - 1: No answer.
        - 2: Still no answer.
        - 3: You hear shuffling inside.
        - else: The door creaks open slightly...
    }

    {times_knocked < 4:
        -> door
    - else:
        -> inside
    }

* [Look through the keyhole]
    // Cycle - loops forever
    {cycle:
        - You see darkness.
        - You glimpse a flickering light.
        - You see a shadow move.
    }
    -> door

* [Give up] -> END

=== inside ===
The door opens to reveal an old wizard.

"Ah, finally! I was wondering when you'd be persistent enough."

* [Ask about the shuffling]
    "I was looking for my slippers."
    -> END

* [Ask why you couldn't just open the door]
    "Magic doors require patience."
    -> END`
	},

	knots: {
		name: 'Knots & Stitches',
		source: `// Demonstrating story structure with knots and stitches

-> start

=== start ===
Welcome to the adventure!
Where would you like to go?

* [Visit the castle] -> castle
* [Explore the forest] -> forest
* [Go to the tavern] -> tavern

=== castle ===
= entrance
You arrive at the castle gates.
Guards eye you suspiciously.

* [Request an audience] -> throne_room
* [Sneak around back] -> gardens
* [Leave] -> start

= throne_room
The king sits upon his throne.
"What brings you here, traveler?"

* ["I seek adventure!"]
    "Then seek the dragon in the eastern mountains."
    -> END

* ["Just passing through."]
    "Then pass through quickly."
    -> entrance

= gardens
You find yourself in the royal gardens.
Beautiful flowers surround you.

* [Pick a flower]
    A guard catches you!
    "Halt! Flower thief!"
    -> END

* [Admire them peacefully]
    You enjoy the serene beauty.
    -> entrance

=== forest ===
Tall trees surround you.
The path splits in two.

* [Take the dark path]
    You encounter a bear!
    -> END

* [Take the sunny path]
    You find a peaceful stream.
    -> END

* [Return] -> start

=== tavern ===
The tavern is warm and lively.
A bard plays in the corner.

* [Order a drink]
    The ale is refreshing!
    -> END

* [Talk to the bard]
    "Have you heard the tale of the crystal caves?"
    -> END

* [Leave] -> start`
	},

	functions: {
		name: 'Functions',
		source: `// Using functions in ink
VAR health = 100
VAR max_health = 100

-> start

=== function heal(amount) ===
~ health = health + amount
{health > max_health:
    ~ health = max_health
}
~ return health

=== function damage(amount) ===
~ health = health - amount
{health < 0:
    ~ health = 0
}
~ return health

=== function show_health ===
Health: {health}/{max_health}
~return

=== start ===
You enter the dungeon.
{show_health()}

* [Fight the skeleton]
    The skeleton hits you!
    ~ damage(20)
    You defeat it!
    {show_health()}
    -> corridor

* [Sneak past]
    You quietly slip by.
    -> corridor

=== corridor ===
You find a health potion.

* [Drink it]
    ~ heal(30)
    You feel better!
    {show_health()}
    -> boss

* [Save it for later]
    -> boss

=== boss ===
A dragon blocks your path!

* [Attack!]
    ~ damage(50)
    {health <= 0:
        You have fallen...
        -> END
    }
    You wound the dragon, but it fights back!
    {show_health()}
    -> boss

* [Flee]
    You escape with your life.
    Final {show_health()}
    -> END`
	},

	shopping: {
		name: 'Shopping Example',
		source: `// A simple shopping scenario
VAR money = 20
VAR has_apple = false
VAR has_bread = false
VAR has_cheese = false

-> shop

=== shop ===
Welcome to the general store!
You have {money} gold.

{has_apple || has_bread || has_cheese:
    Your bag contains:
    {has_apple: - An apple}
    {has_bread: - A loaf of bread}
    {has_cheese: - A wheel of cheese}
}

* {money >= 3 && not has_apple} [Buy an apple (3 gold)]
    ~ money = money - 3
    ~ has_apple = true
    You buy a fresh apple.
    -> shop

* {money >= 5 && not has_bread} [Buy bread (5 gold)]
    ~ money = money - 5
    ~ has_bread = true
    You buy a warm loaf of bread.
    -> shop

* {money >= 8 && not has_cheese} [Buy cheese (8 gold)]
    ~ money = money - 8
    ~ has_cheese = true
    You buy a wheel of aged cheese.
    -> shop

* [Leave the shop]
    -> outside

=== outside ===
You step outside into the sunshine.
{has_apple && has_bread && has_cheese:
    With all your provisions, you're ready for your journey!
- else:
    {not (has_apple || has_bread || has_cheese):
        You leave empty-handed.
    - else:
        You have some supplies, but could use more.
    }
}

* {money > 0} [Go back inside]
    -> shop

* [Set off on your adventure]
    And so your journey begins...
    -> END`
	}
};

export const defaultExample = 'hello';
