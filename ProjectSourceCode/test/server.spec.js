// ********************** Initialize server **********************************

const server = require('../src/index.js'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

// ********************** DEFAULT WELCOME TESTCASE ****************************

// describe('Server!', () => {
//   // Sample test case given to test / endpoint.
//   it('Returns the default welcome message', done => {
//     chai
//       .request(server)
//       .get('/welcome')
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.status).to.equals('success');
//         assert.strictEqual(res.body.message, 'Welcome!');
//         done();
//       });
//   });
// });

// *********************** TODO: WRITE 2 UNIT TESTCASES **************************
describe('Testing Register API Positive', () => {
  it('positive : /register', done => {
    chai
      .request(server)
      .post('/register')
      .send({username: 'John Doe', password: 'My_Password'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('Testing Register API Negative', () => {
  it('negative : /register', done => {
    chai
      .request(server)
      .post('/register')
      .send({username: 'John Doe'})
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
});
// ********************************************************************************

// *********************** Part C **************************

describe('Testing Login API Positive', () => {
  it('positive : /login', done => {
    chai
      .request(server)
      .post('/register')
      .send({username: 'Doe John', password: 'My_Password'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

/*
describe('Testing Login API Negative', () => {
  it('negative : /login', done => {
    chai
      .request(server)
      .post('/login')
      .send({username: 'Doe John', password: 'pword'})
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
});
*/