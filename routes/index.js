"use strict";
var express = require("express");
var router = express.Router();
var tweetBank = require("../tweetBank");
const client = require("../db/index");

module.exports = router;

// una función reusable
function respondWithAllTweets(req, res, next) {
  client.query(
    "SELECT u.name, t.content, t.id , u.picture_url FROM tweets as t INNER JOIN users as u ON u.id=t.user_id;",
    function (err, result) {
      if (err) return next(err); // pasa el error a Express
      var tweets = result.rows;
      res.render("index", {
        title: "Tweety.js",
        tweets: tweets,
        showForm: true,
      });
    }
  );
}

// aca basícamente tratamos a la root view y la tweets view como identica
router.get("/", respondWithAllTweets);
router.get("/tweets", respondWithAllTweets);

// página del usuario individual
router.get("/users/:username", function (req, res, next) {
  client.query(
    "SELECT u.name, t.content, t.id , u.picture_url FROM tweets as t INNER JOIN users as u ON u.id=t.user_id WHERE u.name = $1;",
    [req.params.username],
    function (err, result) {
      if (err) return next(err); // pasa el error a Express
      var tweets = result.rows;
      res.render("index", {
        title: "Tweety.js",
        tweets: tweets,
        showForm: true,
      });
    }
  );
});

// página del tweet individual
router.get("/tweets/:id", function (req, res, next) {
  client.query(
    "SELECT t.content, t.id, u.name, u.picture_url FROM tweets as t INNER JOIN users as u ON u.id=t.user_id WHERE t.id = $1;",
    [req.params.id],
    function (err, result) {
      if (err) return next(err); // pasa el error a Express
      var tweets = result.rows;
      res.render("index", {
        title: "Tweety.js",
        tweets: tweets,
        showForm: true,
      });
    }
  );
});

function validar(name) {
  // ver si el usuario existe
  client.query(
    "SELECT name FROM users WHERE name = $1;",
    [name],
    function (err, result) {
      console.log("dentro de validar: ", result.rows);
      return false;
      // if (result.rows.length) return true;
    }
  );
}

// crear un nuevo tweet
router.post("/tweets", function (req, res, next) {
  // var newTweet = tweetBank.add(req.body.name, req.body.content);
  // res.redirect("/");

  let id;
  console.log(typeof req.body.name);
  client.query(
    "SELECT id FROM users WHERE name = $1;",
    [req.body.name],
    function (err, result) {
      id = result.rows[0].id;
    }
  );

  let bool = validar(req.body.name);
  console.log(bool);

  if (bool) {
    // si el usuario ya existe, crear el tweet
    client.query(
      "INSERT INTO tweets (user_id, content) VALUES ($1, $2);",
      [id, req.body.content],
      function (err, result) {
        if (err) return next(err); // pasa el error a Express
        var tweets = result.rows;
        res.render("index", {
          title: "Tweety.js",
          tweets: tweets,
          showForm: true,
        });
      }
    );

    res.redirect("/");
  }
});

// // reemplazá esta ruta hard-codeada con static routing general en app.js
// router.get('/stylesheets/style.css', function(req, res, next){
//   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
// });
