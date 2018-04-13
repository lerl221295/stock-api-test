import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let StockSchema = new Schema({
    entries: {
        type: Number,
        required: true,
        default: 0
    },
    outs: {
        type: Number,
        required: true,
        default: 0
    },
    product_id: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true
    }
});

StockSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

StockSchema.virtual('available_items').get(function(){
    return this.entries - this.outs;
});

StockSchema.set('toJSON', {
    virtuals: true
});

export default mongoose.model('Stock', StockSchema);