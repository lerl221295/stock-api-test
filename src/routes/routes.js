import stock from '../controllers/stock'

export default function(app) {
	// Stock
	app.route('/stock')
		.get(stock.list)
		.post(stock.create);

	app.patch('/stock/:id', stock.updateStock);
}

