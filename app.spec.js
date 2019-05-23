import request from 'supertest';
import '@babel/polyfill';
import app from './app.js';
import { exportAllDeclaration } from '@babel/types';

describe('api', () => {
  describe('GET /api/v1/notes', () => {
    
    it('should have a status of 200', async () => {
      const response = await request(app).get('/api/v1/notes');

      expect(response.statusCode).toBe(200);
    });

    it('should return an array of notes', async () => {
      let mockNotes = [
        { title: 'example', id: 1, listItems: [{ id: 111, text: 'example list item' }] },
        { title: 'note', id: 2, listItems: [{ id: 222, text: 'another example' }] }
      ]
      app.locals.notes = mockNotes

      const response = await request(app).get('/api/v1/notes')

      expect(response.body).toEqual(mockNotes)
    });
  });

  describe('GET /api/v1/notes/:id', () => {
    let mockNotes
    let errorCode
    let goodNote

    beforeEach(() => {
      mockNotes = [
        { title: 'example', id: 1, listItems: [{ id: 111, text: 'example list item' }] },
        { title: 'note', id: 2, listItems: [{ id: 222, text: 'another example' }] }
      ]
      app.locals.notes = mockNotes
    })

    it('should have a status of 200', async () => {
      const response = await request(app).get('/api/v1/notes/1')

      expect(response.statusCode).toBe(200)
    });

    it('should return a specific note based on ID', async () => {
      goodNote = { title: 'example', id: 1, listItems: [{ id: 111, text: 'example list item' }] }
      
      const response = await request(app).get('/api/v1/notes/1')

      expect(response.body).toEqual(goodNote)
    });

    it('should have a status of 404 if page not found', async () => {
      const response = await request(app).get('/api/v1/notes/69');

      expect(response.statusCode).toBe(404);
    });
    
    it.skip('should return error message', () => {

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
  describe('PATCH /api/v1/notes/:id', () => {
    let notes
    beforeEach(() => {
      notes = [
        { id: 1, title: 'example1', listItems: [{ text: 'example list item 1', id: 1 }] },
        { id: 2, title: 'example2', listItems: [{ text: 'example list item 2', id: 2 }] }
      ]

      app.locals.notes = notes
    })

    it('should return a status 404 the wrong path id is used', async () => {
      const response = await request(app)
      .patch('/api/v1/notes/9001')
      .send({ title: 'example11', listItems: [{ text: 'example list item 1', id: 1 }] })

      expect(response.status).toBe(404)
      expect(response.body).toEqual('Note not found')
    })
  
    it('should return a status 422 if title or listItems are not entered', async () => {
      const response = await request(app)
      .patch('/api/v1/notes/1')
      .send({ title: 'example11' })

      expect(response.status).toBe(422)
      expect(response.body).toEqual('please enter a title and listItems')
    })
  
    it('should return a status 200 if the correct params are passed in', async () => {
      const response = await request(app)
      .patch('/api/v1/notes/1')
      .send({title: 'example11', listItems: [{ text: 'example list item 1', id: 1 }] })

      expect(response.status).toBe(200)
      expect(response.body).toEqual('updated')
    })
  })

  describe('DELETE /api/v1/notes/;id', () => {
    let notes
    beforeEach(() => {
      notes = [
        { id: 1, title: 'example1', listItems: [{ text: 'example list item 1', id: 1 }] },
        { id: 2, title: 'example2', listItems: [{ text: 'example list item 2', id: 2 }] }
      ]

      app.locals.notes = notes
    })

    it('should return a status of 404 if trying to delete something that doesnt exist', async () => {
      const response = await request(app).delete('/api/v1/notes/9001')

      expect(response.status).toBe(404)
      expect(response.body).toEqual('Note not found')
    })

    it('should delete the note with the matching id', async () => {
      const response = await request(app).delete('/api/v1/notes/1')

      expect(response.status).toBe(200)
      expect(response.body).toEqual('deleted')
      expect(app.locals.notes).toEqual( [{ id: 2, title: 'example2', listItems: [{ text: 'example list item 2', id: 2 }] }] )

    })
  })
})

