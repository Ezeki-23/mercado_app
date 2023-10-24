const express = require("express");
const app = express();
const cors = require("cors");
const mercadopago = require("mercadopago");
require('dotenv').config();

mercadopago.configure({
	access_token: process.env.SECRET_TOKEN,
});

app.use(function (req, res, next) {
	res.setHeader(
	  'Content-Security-Policy-Report-Only',
	  "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
	);
	next();
  });

app.use(express.json());
app.use(cors());

app.get("/", function (req, res) {
	res.send("Hola!");
});

app.post("/create_preference", (req, res) => {

	const preference = {
		items: [
			{
				title: req.body.description,
				unit_price: Number(req.body.price),
				quantity: Number(req.body.quantity),
			}
		],
		back_urls: {
			"success": "https://ecommer-app.vercel.app",
			"failure": "https://ecommer-app.vercel.app",
			"pending": ""
		},
		auto_return: "approved",
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
			res.json({
				id: response.body.id
			});
		}).catch(function (error) {
			console.log(error);
		});
});

app.listen(3000, () => {
	console.log("The server is now running on Port 3000");
});
