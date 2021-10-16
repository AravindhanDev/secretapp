const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
	email: String,
	password: String
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/register", (req, res) => {
	res.render("register");
});

app.post("/register", (req, res) => {
	const newUser = new User({
		email: req.body.username,
		password: md5(req.body.password)
	});
	newUser.save((err) => {
		if (!err) res.render("secrets");
		else console.log(err);
	});
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.post("/login", (req, res) => {
	User.findOne({ email: req.body.username }, (err, foundUser) => {
		if (!err) {
			if (foundUser) {
				if (foundUser.password === md5(req.body.password)) {
					res.render("secrets");
				} else {
					console.log("incorrect password");
				}
			}
		} else {
			console.log(err);
		}
	});
});

app.listen(3000, () => console.log("Server started on port 3000"));
