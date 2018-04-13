import mongoose from "mongoose";
import Product from './src/models/Product';
import Stock from './src/models/Stock';

import chai from 'chai';
import chaiHttp from 'chai-http';
import server from './src/server';
let should = chai.should();

chai.use(chaiHttp);

describe('Stock', () => {
    describe('/GET stock', () => {
        it('Deberia devolver todos los productos en stock, con su cantidad disponible de items', (done) => {
            chai.request(server)
                .get('/stock')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body[0].should.have.property('available_items');
                    done();
                });
        });
    });

    describe('/POST stock', () => {
        const new_stock = {
            product_code: '6a1235',
            entries: 10
        }

        it('Crea el stock de un producto de la BD', (done) => {
            Product.findOne({code: '6a1235'}).then(product => {
              /*elimina su stock en la BD si existe*/
              Stock.remove({product_id: product._id}).then(response => {
                /*realiza peticion para crear el stock*/
                chai.request(server)
                  .post('/stock')
                  .send(new_stock)
                  .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('available_items', 10);
                      done();
                  });
              });
              
            });
        });
        
        it('Falla al intentar crear un stock existente', (done) => {
            chai.request(server)
                .post('/stock')
                .send(new_stock)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/PATCH stock', () => {
      it('Aumenta el stock de un producto', (done) => {
          Product.findOne({code: '6a1235'}).then(product => {
            Stock.findOne({product_id: product.id}).then(stock => {

              chai.request(server)
                .patch(`/stock/${stock.id}`)
                .send({
                  quantity: 12,
                  type: "entry"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('available_items', 22);
                    done();
                });
            })
          })
        });
      it('Falla al intentar disminuir mas de lo que hay en stock', (done) => {
        Product.findOne({code: '6a1235'}).then(product => {
            Stock.findOne({product_id: product.id}).then(stock => {

              chai.request(server)
              .patch(`/stock/${stock.id}`)
              .send({
                quantity: 27,
                type: "out"
              })
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('error');
                  res.body.should.have.property('available_items', 22);
                  done();
              });

            })
          })
            
        });
      it('Disminuye el stock de un producto', (done) => {
        Product.findOne({code: '6a1235'}).then(product => {
            Stock.findOne({product_id: product.id}).then(stock => {

              chai.request(server)
              .patch(`/stock/${stock.id}`)
              .send({
                quantity: 4,
                type: "out"
              })
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('available_items', 18);
                  done();
              });
              
            })
          })
            
        });
    });
});