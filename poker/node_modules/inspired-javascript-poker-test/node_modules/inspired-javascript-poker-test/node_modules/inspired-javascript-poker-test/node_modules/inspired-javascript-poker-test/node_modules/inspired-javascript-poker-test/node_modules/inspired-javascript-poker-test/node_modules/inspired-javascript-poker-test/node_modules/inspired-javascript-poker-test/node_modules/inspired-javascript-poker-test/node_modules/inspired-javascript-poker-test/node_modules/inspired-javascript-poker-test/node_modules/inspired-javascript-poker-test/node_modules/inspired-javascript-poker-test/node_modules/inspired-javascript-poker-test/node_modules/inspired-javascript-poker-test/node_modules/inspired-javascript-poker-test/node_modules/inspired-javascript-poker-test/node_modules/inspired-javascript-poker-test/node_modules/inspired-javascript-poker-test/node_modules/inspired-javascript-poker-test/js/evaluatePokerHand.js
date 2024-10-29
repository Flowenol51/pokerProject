/**
 * @typedef {Object} Card
 * @property {string} suit - Suit of the card - Either "club", "spade", "diamond" or "heart"
 * @property {number} rank - Number rank of the card - So 1 for Ace, 2 for Two, 3 for Three, and so on, until 10 for Ten, then 11 for Jack, 12 for Queen and 13 for King
 */

/**
 * Given a poker hand of 5 cards, examines the cards and returns a string describing the type of win.
 *
 * @param {Array.<Card>} hand - Array of the card objects that make up the poker hand.
 * @returns {string} - Returns a string for the type of the win detected:
 *		"highcard" - Five cards which do not form any of the combinations below
 *		"pair" - A hand with two cards of equal rank and three cards which are different from these and from each other
 *		"twopair" - A hand with two pairs of different ranks
 *		"threeofakind" - Three cards of the same rank plus two unequal cards
 *		"straight" - Five cards of mixed suits in sequence
 *		"flush" - Five cards of the same suit
 *		"fullhouse" - Three cards of one rank and two cards of another rank
 *		"fourofakind" - Four cards of the same rank and the fifth card can be anything
 *		"straightflush" - Five cards of the same suit in sequence
 *		"royalflush" - A 10, Jack, Queen, King and Ace ranked cards of the same suit
 */

function runCheck(handOrdered) {
	let runAmount = 1;

	for (i = 0; i < handOrdered.length-1; i++) { // checks if the 1st card + 1 equals the 2nd card, etc... till all 5 cards have been compared.
		if (handOrdered[i].rank + 1 == handOrdered[i+1].rank) {
			runAmount++;  // adding +1 when the cards follow eachother
		} else { 
			runAmount = 1; // reset the counter as its either 5 in a row or nothing for power hands.
		}
	}

	if (runAmount == 5) {
		return("straight");
	} else if (runAmount == 4 && handOrdered[4].rank == 13 && handOrdered[0].rank == 1) { // checks if 1st is ace and last is king
		return ("royal");
	} else {
		return ("");
	}
 }

function dupeCheck(handOrdered) {
	let dupeAmount = {};

	handOrdered.forEach(value => { // sort suits into amount of each suit
		if (dupeAmount[value.rank] == undefined) { // has not been found before
			dupeAmount[value.rank] = 1;
		} else { // has been found before
			dupeAmount[value.rank] += 1;
		}
	});

	return (Object.entries(dupeAmount).sort((a, b) => b[1] - a[1])); // sorts the different amounts of each card from biggest to smallest.
}

function evaluatePokerHand(hand) {
	let suits = [];
	let handOrdered = [];
	let suitAmount = {};
	let suitCheck = "";
	let runCheckResult = "";
	let dupeCheckResult = "";

	for ( let index=0; index<hand.length; ++index ) { // combines all the cards into a variable and puts all the suits into an array.
		handOrdered.push({rank: hand[index].rank, suit: hand[index].suit});
		suits.push(hand[index].suit);
	}

	suits.forEach(suit => { // sort suits into amount of each suit
		if (suitAmount[suit] == undefined) { // has not been found before
			suitAmount[suit] = 1;
		} else { // has been found before
			suitAmount[suit] += 1;
		}
	});

	if (Object.values(suitAmount).includes(5)) {
		suitCheck="flush"
	} else {
		suitCheck=""; // checks if we have 5 of the same suit for a flush
	}
	
	handOrdered.sort((a, b) => a.rank - b.rank); // orders the hand from lowest rank to highest rank
	runCheckResult = runCheck(handOrdered); // checks if there are 5 numbers that follow eachother
	dupeCheckResult = dupeCheck(handOrdered); // sorts the cards into the amount of each rank

	if (suitCheck != "" && runCheckResult != "") { // check for straight AND flush at the same time
		return(runCheckResult+suitCheck); // will either return straightflush or royalflush
	} else if (suitCheck != "" || runCheckResult != "") { // check for straight OR flush
		if (runCheckResult == 'royal') { // royal with no flush becomes a straight
			runCheckResult = 'straight';
		}
		return(runCheckResult+suitCheck); // will print nothing + either of the 2 that have text
	}
	
	switch (dupeCheckResult[0][1]) {
		case 4 : // 4 cards of the same rank
			return ("fourofakind");
		case 3 : // 3 cards of the same rank
			if (dupeCheckResult[1][1] == 2) { // Checks if then 2nd counted card value is 2 if so its a fullhouse
				return ("fullhouse");
			} else { // else its 3 of a kind
				return ("threeofakind");
			}
		case 2 : // 2 cards of the same rank 
			if (dupeCheckResult[1][1] == 2) { // Checks if a 2nd pair was counted 
				return ("twopair");
			} else { // else its just 1 pair
				return ("pair");
			}
	}

	return "highcard"; // lowest hand in poker
}

module.exports = evaluatePokerHand;
