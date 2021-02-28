// This file is in charge of setting up the database enviornment.

module.exports = async (knex) => {

	if (!await knex.schema.hasTable('ingredients')) {
		// create ingredients table
		await knex.schema.createTable('ingredients', function(table) {
			table.string('name').primary(); // all lower case
      table.string('category').defaultTo('other'); // category of the specified ingredient
			table.string('amount').defaultTo('1'); // store ammount as text
			table.timestamp('changed_at').defaultTo(knex.fn.now()); // time the ingredient was changed
			table.text('comments'); // store comments regarding ingredient
    });
	};

	// do more tables here

	console.log('database completed startup');
}