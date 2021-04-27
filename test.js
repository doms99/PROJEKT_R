const supertest = require('supertest');
const server = require('./index');
const chai = require('chai');

chai.should();

const api = supertest.agent(server);

describe('Add method', () => {
  it('should connect to the Server', (done) => {
    api.post('/')
      .set('Connetion', 'keep alive')
      .set('Content-Type', 'application/json')
      .type('form')
      .end((err, res) => {
        res.status.should.equal(200);
        done();
      });
  });
})