const express = require('express')
const cors = require('cors')


const app = express()
app.use(cors())
app.use(express.json())



app.locals.title = 'trapper-keeper';
const mockList = { title: 'example', id: 1, listItems: [{ id: 111, text: 'example list item' }] }

app.locals.notes = [mockList];

app.use(express.json());

app.get('/api/v1/notes', (request, response) => {
  response.status(200).json(app.locals.notes)
})

app.get('/api/v1/notes/:id', (request, response) => {
  const id = parseInt(request.params.id);
  const matchingNotes = app.locals.notes.find(keep => keep.id === id)
  return response.status(200).json(matchingNotes)
})

module.exports = app;