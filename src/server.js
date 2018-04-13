import "babel-polyfill";
import express from 'express';
import bodyParser from 'body-parser';
import * as models from './models'
import routes from './routes/routes';
import cors from 'cors';
import mongoose from 'mongoose';

//CONECTING MONGODB
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/toolboxtest');

let app = express(),
	port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cors());
routes(app);
app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to Toolbox Stock API!!!" });
});
app.listen(port);

console.log('Server running on port: ' + port);

export default app;
