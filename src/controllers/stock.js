import mongoose from 'mongoose'

const Product = mongoose.model('Product');
const Stock = mongoose.model('Stock');

class StockController {
    list = async ({query: {product_name: query_product_name, product_code: query_product_code}}, res) => {
        let products = await Product.find().select('code name');
        let response = await Promise.all(products.map(async ({name: product_name, code: product_code, _id: product_id}) => {
            const stock = await Stock.findOne({product_id}).select('entries outs available_items');
            if(!stock) return {product_code, product_name, available_items: null};
            return {
                ...stock.toObject({virtuals: true}),
                product_name,
                product_code
            }
        }))

        /*filtrado en pase al nombre y codigo del producto*/
        if(query_product_name || query_product_code){
            response = response.filter(({product_name, product_code}) => {
                const name_coincidence = query_product_name && (product_name.toLowerCase().includes(query_product_name.toLowerCase()))
                const code_coincidence = query_product_code && (product_code.toLowerCase().includes(query_product_code.toLowerCase()))
                return name_coincidence || code_coincidence;
            })
        }

        res.json(response);
    };

    create = async ({body: {product_code, entries, outs}}, res) => {
        //crear el stock de un producto (si aun no existe)
        const product = await Product.findOne({code: product_code});
        if(!product) res.json({error: "El producto no existe en la base de datos"});
        else {
            const stock = await Stock.findOne({product_id: product.id});
            if(!stock){
                res.json(await Stock.create({product_id: product.id, entries, outs}));
            }
            else res.json({
                error: "El producto ya se encuentra en stock, si desea, actualice el stock",
                stock_id: stock.id
            });
        }
    };

    updateStock = async ({body : {type, quantity}, params: {id}}, res) => {
        //altas y bajas en el stock.
        if(type === "entry"){
            /*si es una entrada, simplemente incremento (alta) del stock*/
            res.json(await Stock.findByIdAndUpdate(id, 
                {$inc: { 'entries' : quantity } }, {new: true}));
        }
        else if(type === "out"){
            /*si es una baja, valido la disponibilidad primero*/
            const stock = await Stock.findById(id);
            if(stock.available_items >= quantity){
                stock.outs += quantity;
                stock.save();
                res.json(stock);
            }
            else {
                res.json({
                    error: "No hay productos suficientes en el stock",
                    available_items: stock.available_items
                });
            }
        }
    }

}

export default new StockController