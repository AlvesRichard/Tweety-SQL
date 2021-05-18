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

// crear un nuevo tweet
router.post("/tweets", function (req, res, next) {
  // CONSIGO LA ID DEL USUARIO
  client.query(
    "SELECT id FROM users WHERE name = $1;",
    [req.body.name],
    function (err, result) {
      if (!result.rows[0]) {
        // SINO EXISTE, CREO EL USUARIO
        client.query("INSERT INTO users (name) VALUES ($1);",[req.body.name],(err,result)=>{
          if(err) console.log(err);
        })
      }
      // si el usuario ya existe, crear el tweet
      client.query(
         "INSERT INTO tweets (user_id, content) VALUES ((SELECT id FROM users WHERE name=$1), $2);",
        [req.body.name, req.body.content],
        function (err, result) {
          if (err) return next(err); // pasa el error 
        }); 
    }
  );
  res.redirect("/");
});

// // reemplazá esta ruta hard-codeada con static routing general en app.js
// router.get('/stylesheets/style.css', function(req, res, next){
//   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
// });
