const express = require('express')
const cors = require('cors')


const app = express()
app.use(cors())
app.use(express.json())



app.locals.title = 'trapper-keeper';
const mockList = { title: 'example', id: 1, listItems: [{ id: 111, text: 'example list item' }] }

app.locals.keeper = [mockList];

app.use(express.json());

app.get('/api/v1/keeper', (request, response) => {
  response.status(200).json(app.locals.keeper)
})

app.get('/api/v1/keeper/:id', (request, response) => {
  const id = parseInt(request.params.id);
  const matchingKeeper = app.locals.keeper.find(keep => keep.id === id)
  return response.status(200).json(matchingKeeper)
})

module.exports = app;