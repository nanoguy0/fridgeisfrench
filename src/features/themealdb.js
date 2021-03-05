// This file contains the interface for the meal db api. See https://www.themealdb.com/api.php.

const { request } = require("../utils");

var _metaCache; 

module.exports = {

  /**
   * @name getMealId
   * @description Retrieves a meal from a provided meal id.
   *
   * @param {Number or String} id
   */
  async getMealId(id) {
    if (typeof id == "number") id = id.toString();
    if (typeof id != "string" || !/^[0-9]*$/.test(id))
      throw new Error("Not a valid id");
    return ((
      await request(
        "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
      )
    ).meals || [])[0];
  },

	/**
	 * @name randomMeal
	 * @description retrieves a random meal
	 */
  async randomMeal() {
    return (await request("https://www.themealdb.com/api/json/v1/1/random.php")).meals[0];
  },

	/**
	 * @name searchMeal
	 * @description Searches for the provided meal
	 * 
	 * @param {String} name 
	 */
	async searchMeal(name) {
		if (typeof name != 'string' || name.length == 0) throw new Error('Provided name is required');
		return (await request("https://www.themealdb.com/api/json/v1/1/search.php?s=" + name)).meals || undefined;
	},

	/**
	 * @name filterCategory
	 * @description Provide a list of recipes based on category
	 * 
	 * @param {String} category
	 */
	async filterCategory(name) {
		if (typeof name != 'string' || name.length == 0) throw new Error('Provided category is required');
		return (await request("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + name)).meals || undefined;
	},

	/**
	 * @name filterArea
	 * @description Provide a list of recipes based on area
	 * 
	 * @param {String} area
	 */
	async filterArea(name) {
		if (typeof name != 'string' || name.length == 0) throw new Error('Provided area is required');
		return (await request("https://www.themealdb.com/api/json/v1/1/filter.php?a=" + name)).meals || undefined;
	},

	/**
	 * @name filterMainIngredient
	 * @description Provide a list of recipes based on ingredient
	 * 
	 * @param {String} ingredient
	 */
	async filterMainIngredient(name) {
		if (typeof name != 'string' || name.length == 0) throw new Error('Provided ingredient is required');
		return (await request("https://www.themealdb.com/api/json/v1/1/filter.php?i=" + name)).meals || undefined;
	},

	/**
	 * @name _metaData
	 * @description Retrieves the meta data of the the meal db
	 */
	async _metaData() {
		return _metaCache || (_metaCache = {
			categories: (await request("https://www.themealdb.com/api/json/v1/1/list.php?c=list")).meals.map( d=> d.strCategory),
			areas: (await request("https://www.themealdb.com/api/json/v1/1/list.php?a=list")).meals.map( d=> d.strArea),
			ingredients: (await request("https://www.themealdb.com/api/json/v1/1/list.php?i=list")).meals.map( d=> ({name: d.strIngredient, description: d.strDescription || 'No description provided.'}))
		});
	}
};

// (async function test() {
// 	// testing cache
//   console.log(await module.exports.searchMeal('Eggs'));
// 	// require('fs').writeFileSync('db.json', JSON.stringify(await module.exports._metaData()))
// })();
