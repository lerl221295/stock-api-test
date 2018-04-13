import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    }
});

export default mongoose.model('Product', ProductSchema);