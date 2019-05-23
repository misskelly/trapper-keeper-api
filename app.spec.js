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
})

