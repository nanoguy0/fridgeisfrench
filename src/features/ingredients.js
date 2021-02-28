// This file allows ingredient handling for the system

const FlexSearch = require("flexsearch");
const TheMealDB = require('./themealdb');

var index = new FlexSearch();

// uses a cache if in dev mode
// var meta = JSON.parse(require('fs').readFileSync('db.json'));
var meta;

(async () => {
	meta = meta ? meta : await TheMealDB._metaData();
	meta.ingredients.forEach((ingredient, pos) => index.add(pos, ingredient.name));
})()

module.exports = {
	/**
	 * @name searchIngredient
	 * @description Searches for the specified ingredient and returns a ingredient recognized by themealdb
	 * 
	 * @param {String} name 
	 */
	searchIngredient(name) {
		return new Promise(res => index.search(name, (result) => res(result.map(d => meta.ingredients[d]))));
	}
};

// (async function test() => {
	//  // testing
// 	console.log(await module.exports.searchIngredient('apple'))
// })()