const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const expressSanitizer = require("express-sanitizer");

//app config
app.use(express.urlencoded({ extended: true }));
mongoose.connect(
  "mongodb://austinloveless:austin5171@ds263948.mlab.com:63948/movie_app"
);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//mongoose/model config
const movieSchema = new mongoose.Schema({
  title: String,
  poster: String,
  director: String,
  year: Number,
  rating: Number
});

const Movie = mongoose.model("Movie", movieSchema);

//RESTful routes
app.get("/", (req, res) => {
  res.render("home");
});

//index route
app.get("/movies", (req, res) => {
  Movie.find({}, (err, movies) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { movies: movies });
    }
  });
});

//new route
app.get("/movies/new", (req, res) => {
  res.render("new");
});

//create route
app.post("/movies", (req, res) => {
  Movie.create(req.body.movie, (err, newMovie) => {
    if (err) {
      res.render("new");
    } else {
      res.redirect("/movies");
    }
  });
});

//Show route
app.get("/movies/:id", (req, res) => {
  Movie.findById(req.params.id, (err, foundMovie) => {
    if (err) {
      res.redirect("/movies");
    } else {
      res.render("show", { movie: foundMovie });
    }
  });
});

//Edit Routes
app.get("/movies/:id/edit", (req, res) => {
  Movie.findById(req.params.id, (err, foundMovie) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { movie: foundMovie });
    }
  });
});

//update Routes
app.put("/movies/:id", (req, res) => {
  Movie.findByIdAndUpdate(
    req.params.id,
    req.body.movie,
    (err, updatedMovie) => {
      if (err) {
        res.redirect("/movies");
      } else {
        res.redirect("/movies");
      }
    }
  );
});

//Delete Routes
app.delete("/movies/:id", (req, res) => {
  Movie.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect("/movies");
    } else {
      res.redirect("/movies");
    }
  });
});

app.listen(port, () => {
  console.log("listening on port", port);
});
