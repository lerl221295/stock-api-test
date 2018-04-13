## Stock API

Clone the project

### Installations

```sh
$ npm install 
```

### Turn-on your mongodb server and initialize the database with products

```sh
$ npm run seed
```

### Run tests (after run seeder)

```sh
$ npm run test
```

### Run on dev enviroment

```sh
$ npm run dev 
```

### Run on production enviroment

* Run your mongo server

```sh
$ npm run start 
```

## Endpoints: 
	- GET /stock -> obtener el stock de productos
	- POST /stock -> crear un stock de un producto particular 
	- PATCH /stock/:stock_id -> actualizar un stock de producto (altas y bajas de stock)

:)
