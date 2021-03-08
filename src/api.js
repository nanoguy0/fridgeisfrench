// This file manages all api resources
const express = require("express");
const knex = require("knex")({
	client: 'sqlite3',
	connection: {
    filename: "./db.sqlite"
  },
	useNullAsDefault: true
});

// Run setup on database init
require("./database")(knex);

// create an express router
var router = express.Router();

const sendBadRequest = (error, res) => res.status(400).json({ error });
const sendErrorRequest = (error, res) => res.status(500).json({ error });

router
  .route("/i")
  /**
   * @description retrieves ingredients based on search queries
   * @path /i
   * @method GET
   */
  .get(async (req, res) => {
    try {
      // Verify the validity of the parameters and format them
      if (
        req.query.name &&
        (typeof req.query.name != "string" || req.query.name.length == 0)
      )
        return sendBadRequest("Name must be a valid string", res);
      else if (req.query.name) req.query.name = req.query.name.trim().toLowerCase();
      if (
        req.query.unit &&
        (typeof req.query.unit != "string" || req.query.unit.length == 0)
      )
        return sendBadRequest("Unit must be a valid string", res);
      else if (req.query.unit) req.query.unit = req.query.unit.trim().toLowerCase();
      if (req.query.count && Number.isNaN(Number(req.query.count)))
        return sendBadRequest("Count must be a valid number", res);
      else if (req.query.count) req.query.count = Number(req.query.count);
      if (req.query.from && Number.isNaN(Number(req.query.from)))
        return sendBadRequest("From must be a valid number", res);
      else if (req.query.from) req.query.from = Number(req.query.from);
      if (req.query.to && Number.isNaN(Number(req.query.to)))
        return sendBadRequest("To must be a valid number", res);
      else if (req.query.to) req.query.to = Number(req.query.to);

      // Create Knex search query
      var search = {};
      // if (req.query.name) search.name = req.query.name;
      if (req.query.unit) search.unit = req.query.unit;
      if (typeof req.query.count == 'number') search.ammount = req.query.count;

      // Knex query
      var results = knex("ingredients")
        .select()
        .where(search)
        .whereBetween("expiry_date", [
          req.query.from || -1,
          req.query.to || Date.now(),
        ]);

			if (req.query.name) results.where('name', 'like', `%${req.query.name}%`);

			results = await results;
      // Format results based on docs
      var formatted = (results || []).map(function (value) {
        return {
          name: value.name,
          count: {
            number: value.ammount,
            unit: value.unit,
          },
          expiry_date: value.expiry_date,
          icon: value.icon,
        };
      });

      // send results
      return res.json({ ingredients: formatted });
    } catch (error) {
      // send error message
      console.log(`Recieved error with request to ${req.url}. Got: `, error);
      return sendErrorRequest(error.toString(), res);
    }
  })
  /**
   * @description modify or add ingredients
   * @path /i
   * @method POST
   */
  .post(async (req, res) => {
    try {
      // Verify the validity of the parameters and format them
      if (!req.body) return sendBadRequest("Expected body", res);
      if (
        !req.body.name ||
        typeof req.body.name != "string" ||
        req.body.name.length == 0
      )
        return sendBadRequest("Name must be a valid string", res);
      else if (req.body.name) req.body.name = req.body.name.trim().toLowerCase();
      if (req.body.count) {
        if (typeof req.body.count != "object")
          return sendBadRequest("Count must be a valid object", res);
        if (
          req.body.count.number &&
          Number.isNaN(Number(req.body.count.number))
        )
          return sendBadRequest("Number must be a valid number", res);
        else if ( req.body.count.number) req.body.count.number = Number(req.body.count.number);
        if (
          req.body.count.unit &&
          (typeof req.body.count.unit != "string" ||
            req.body.count.unit.length == 0)
        )
          return sendBadRequest("Unit must be a valid string", res);
        else if (req.body.count.unit) req.body.count.unit = req.body.count.unit.trim().toLowerCase();
      } else req.body.count = {};
      if (req.body.expiry_date && Number.isNaN(Number(req.body.expiry_date)))
        return sendBadRequest("Expiry Date must be a valid number", res);
      else if (req.body.expiry_date) req.body.expiry_date = Number(req.body.expiry_date);
      if (
        req.body.icon &&
        (typeof req.body.icon != "string" || req.body.icon.length == 0)
      )
        return sendBadRequest("Icon must be a valid string", res);
      else if (req.body.icon) req.body.icon = req.body.icon.trim();

      // Check if the ingredient exists
      var ingredient = (
        await knex("ingredients").select().where("name", "=", req.body.name)
      )[0];
      // Add the ingredient to the database
      if (ingredient) {
        // Edit the ingredient
        ingredient = (
          await knex("ingredients")
            .update({
              ammount: (req.body.count.number == 0) ? 0 : req.body.count.number ||  ingredient.ammount,
              unit: req.body.count.unit || ingredient.unit,
              expiry_date: req.body.expiry_date || ingredient.expiry_date,
              icon: req.body.icon || ingredient.icon,
            })
            .where("name", "=", req.body.name)
            // .returning("*")
        )[0];
      } else {
        // Create the ingredient
        ingredient = (
          await knex("ingredients")
            .insert({
              name: req.body.name,
              ammount: req.body.count.number || 0,
              unit: req.body.count.unit || "",
              expiry_date: req.body.expiry_date || -1,
              icon: req.body.icon || "",
            })
            // .returning("*")
        )[0];
      }

			ingredient = (
        await knex("ingredients").select().where("name", "=", req.body.name)
      )[0];
      res.json({
        ingredients: [
          (ingredient) ? {
            name: ingredient.name,
            count: {
              number: ingredient.ammount,
              unit: ingredient.unit,
            },
            expiry_date: ingredient.expiry_date,
            icon: ingredient.icon,
          }: {},
        ],
      });
    } catch (error) {
      // send error message
      console.log(`Recieved error with request to ${req.url}. Got: `, error);
      return sendErrorRequest(error.toString(), res);
    }
  })
  /**
   * @description remove an ingredient
   * @path /i
   * @method DELETE
   */
  .delete(async (req, res) => {
    try {
			// Setup and validate query params
			if (
        !req.query.name ||
        typeof req.query.name != "string" ||
        req.query.name.length == 0
      )
        return sendBadRequest("Name must be a valid string", res);
      else req.query.name = req.query.name.trim().toLowerCase();

			// delete from database
			await knex('ingredients').delete().where('name', '=', req.query.name);
			res.json({error: null});
    } catch (error) {
      // send error message
      console.log(`Recieved error with request to ${req.url}. Got: `, error);
      return sendErrorRequest(error.toString(), res);
    }
  });

module.exports = router;
