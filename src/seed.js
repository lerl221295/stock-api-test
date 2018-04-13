import mongoose from 'mongoose'
import * as models from './models'

//CONECTING MONGODB
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/toolboxtest');

const Product = mongoose.model('Product');
const Stock = mongoose.model('Stock');

(async () => {
	const products = [
		{ name: "Harina", price: 200, unit: "KG", code: "6a1231"},
		{ name: "Manteca", price: 100, unit: "KG", code: "6a1232"},
		{ name: "Leche", price: 250, unit: "L", code: "6a1233"},
		{ name: "Cacao", price: 80, unit: "KG", code: "6a1234"},
	];

	for(let product of products){
		/*crear productos con su stock*/
		let new_product = await Product.create(product);
		await Stock.create({product_id: new_product.id, entries: Math.floor((Math.random() * 20) + 1)});
	}

	/*crear un producto sin stock*/
	await Product.create({ name: "Azucar", price: 180, unit: "KG", code: "6a1235"});

	console.log("BD inicializada!");
	process.exit();
})()
