const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../index')
const should = chai.should()
const expect = chai.expect
var requester

chai.use(chaiHttp)

// ---> DEBUT
/**
  * Génération des nouvelles couleurs et enregistrement de ces
  * couleurs dans un tableau.
  */
const newValues = []
const colorKey = 'NEW_COLOR_'
let nextCursor = 0;
const payloadColor = () => {
  const nextColor = `${colorKey}${nextCursor}`
  newValues.push(nextColor)
  nextCursor++;
  return { 'color': nextColor }
}
const getCurrentColor = () => {
  return nextCursor > 0 ? `${colorKey}${nextCursor - 1}` : `${colorKey}O`
}
// <-- FIN

const DEFAULT_COLORS = ['RED', 'GREEN', 'BLUE'];

describe('Integration Test', () => {
  before(() => {
    requester = chai.request(app).keepOpen()
  })

  after(() => {
    requester.close()
  })

  describe('Should return all colors', () => {

    it('Should return a 200 status', done => {
      requester.get('/colors')
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          done()
        })
    })

    it('Should return json', done => {
      requester.get('/colors')
        .end((err, res) => {
          res.should.be.json
          done()
        })
    })
    it('Should return an object as body', done => {
      requester.get('/colors')
        .end((err, res) => {
          res.body.should.be.a('object')
          done()
        })
    })

    it('Should return an array as result', done => {
      requester.get('/colors')
        .end((err, res) => {
          res.body.results.should.be.a('array')
          done()
        })
    })

    it('Should return an array of colors', done => {
      requester.get('/colors')
        .end((err, res) => {
          expect(res.body.results).to.eql(DEFAULT_COLORS)
          done()
        })
    })
  })

  describe('Should return bad request', () => {
    it('Should return a 200 status', done => {
      requester.get('/badrequest')
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(404)
          done()
        })
    })
  })

  describe('Should add new color', () => {
    var result

    it('Should add a new color', done => {
      requester.post('/colors')
        .send(payloadColor())
        .then(res => {
          result = res

          expect(result).to.have.status(201)


          result.should.be.json

          result.body.should.be.a('object')

          result.body.results.should.be.a('array')

          expect(result.body.results).to.eql(DEFAULT_COLORS.concat(newValues))
          done()
        })
    })
  })

  describe('​Should return new color list Request', () => {

    it('Should return a 200 status', done => {
      requester.get('/colors')
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          done()
        })
    })

    it('Should return json', done => {
      requester.get('/colors')
        .end((err, res) => {
          res.should.be.json
          done()
        })
    })
    it('Should return an object as body', done => {
      requester.get('/colors')
        .end((err, res) => {
          res.body.should.be.a('object')
          done()
        })
    })

    it('Should return an array as result', done => {
      requester.get('/colors')
        .end((err, res) => {
          res.body.results.should.be.a('array')
          done()
        })
    })

    it('Should return the correct results', done => {
      requester.get('/colors')
        .end((err, res) => {
          expect(res.body.results).to.eql(DEFAULT_COLORS.concat(newValues))
          done()
        })
    })
  })
})