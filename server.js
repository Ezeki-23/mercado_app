const express = require("express");
const app = express();
const cors = require("cors");
const mercadopago = require("mercadopago");

mercadopago.configure({
	access_token: "TEST-2089730705150239-101922-7119336a8560d6f73044cabfb5dbfdc3-1515647047",
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
			"success": "http://localhost:5173/cart",
			"failure": "http://localhost:5173/cart",
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
