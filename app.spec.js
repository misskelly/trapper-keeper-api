import request from 'supertest';
import '@babel/polyfill';
import app from './app'

describe('api', () => {
  describe('GET /api/v1/notes', () => {
    it('should have a status of 200', () => {

    });
    it('should return an array of notes', () => {

    });
  });
  describe('GET /api/v1/notes/:id', () => {
    it('should have a status of 200', () => {

    });
    it('should return a specific note based on ID', () => {

    });
    it('should have a status of 404 if page not found', () => {

    });
    it('should return error message', () => {

    });
  });
  describe('POST /api/v1/notes', () => {
    let notes
    beforeEach(() => {
      notes = [
        { title: 'example1', listItems: [{ text: 'example list item 1' }] },
        { title: 'example2', listItems: [{ text: 'example list item 2' }] }
      ]

      app.locals.notes = notes
    })

    it('should return a status of 422 if it doesnt receive the correct params', async () => {
      const response = await request(app).post('/api/v1/notes')

      expect(response.status).toBe(422)
    })

    it('should return an error if it doesnt recieve the correct params', async () => {
      const response = await request(app).post('/api/v1/notes')
      
      expect(response.body).toEqual('please provide a title and listItems')
    })
    
    it('should give a status of 201 if the correct params are given', async () => {
      Date.now = jest.fn().mockImplementation(() => 10)
      const response = await request(app)
      .post('/api/v1/notes')
      .send({title: 'hi', listItems:[]})

      expect(response.body).toEqual({id: 10, title: 'hi', listItems: [] })
    })
  })

  
})

