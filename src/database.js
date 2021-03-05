// This file is in charge of setting up the database enviornment.

module.exports = async (knex) => {

	if (!await knex.schema.hasTable('ingredients')) {
		// create ingredients table
		await knex.schema.createTable('ingredients', function(table) {
			table.string('name').primary(); // all lower case
      // table.string('category').defaultTo('other'); // category of the specified ingredient
			table.integer('ammount').defaultTo('1'); // store ammount as integer
			table.string('unit').defaultTo('');
			table.integer('expiry_date'); // time the ingredient expires
			// table.text('comments'); // store comments regarding ingredient
			table.string('icon').defaultTo(''); // the icon for the ingredient
    });
	};

	// do more tables here

	console.log('database completed startup');
}