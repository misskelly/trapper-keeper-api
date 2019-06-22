
/////////////////
//// app.js ////
////////////////

const express = require('express')
const cors = require('cors')


const app = express()
// assign app as variable name for express

app.use(cors())
// tell server to use Cross Origin Resourse Sharing, letting the browser know it's safe to access resources from multiple specified origins. 

app.use(express.json())
// by default, parse the request body

app.locals.title = 'trapper-keeper';
// set title property of our app

const mockList = {
  title: 'example',
  id: 1,
  listItems: [{
    id: 111,
    text: 'example list item',
    completed: false
  }]
}
// example list

app.locals.notes = [mockList];
// set notes property of app, assign to example list when the user first accesses the app

app.get('/api/v1/notes', (request, response) => {
  response.status(200).json(app.locals.notes)
})
// define get method for this endpoint, sets the response status for a successful response, returns status and notes array in json format

app.get('/api/v1/notes/:id', (request, response) => {
  // define get method for a single requested note

  const id = parseInt(request.params.id);
  // assign id variable to note id from endpoint

  const matchingNote = app.locals.notes.find(note => note.id === id)
  // assign matchingNote variable to the specific note from the notes array

  if (!matchingNote) return response.status(404).json('Note not found')
  // condition for sad path, if there is no note with a matching id, return 'not found' status code and error message

  return response.status(200).json(matchingNote)
  // otherwise return success status code and single requested note

})

app.post('/api/v1/notes', (request, response) => {
  // define post method to add a new note

  const {
    title,
    listItems
  } = request.body
  // destructure request params

  if (!title || !listItems) return response.status(422).json('please provide a title and listItems')
  // conditional for sad path, if there is an attempt to post a note without a title and/or list items, return status code for unprocessable entity and an error message

  const listItemsWithId = listItems.map((item, i) => {
    // map thorough list items of new note
    if (item.text) {
      return {
        text: item.text,
        completed: false,
        id: Math.floor(Math.random() * 100000)
      }
    }
    // if they have text, return a list item object with a unique id
  })

  const newNote = {
    id: Math.floor(Math.random() * 100000),
    title,
    listItems: listItemsWithId
  }
  // declare newNote as a clean note with a unique id, title(from request body) and cleaned list items

  app.locals.notes.push(newNote)
  // add new note to notes array

  response.status(201).json(newNote)
  // return created status with the newly created note
})

app.patch('/api/v1/notes/:id', (request, response) => {
  // define patch method for editing a note

  const {
    title,
    listItems
  } = request.body
  // destructure request body

  const id = parseInt(request.params.id)
  // assign id variable to parsed id

  let noteWasFound = false
  // note not found by default

  let updatedNotes = app.locals.notes.map((note) => {
    // declare variable for updated notes array, iterate through existing notes

    if (note.id === id) {
      noteWasFound = true;
      return {
        id,
        title,
        listItems
      }
      // for the note being edited, update its content with the new version       

    } else {
      return note
      // all the others stay the same
    }
  })

  if (!title || !listItems) return response.status(422).json('please enter a title and listItems')
  // handle sad path, if there is no content for title or list items, return status code for unprocessable entity and an error message
  if (!noteWasFound) return response.status(404).json('Note not found');
  // same as line 38

  app.locals.notes = updatedNotes;
  // assign notes to updated notes array

  return response.status(204)
  // return success status, no payload required

})

//// TODO: refactor this patch!! 

app.delete('/api/v1/notes/:id', (request, response) => {
  // set delete note method

  const id = parseInt(request.params.id)
  // variable for note id

  const index = app.locals.notes.findIndex(note => note.id == id);
  // find index of note to delete

  if (index === -1) return response.status(404).json('Note not found')
  // same as line 38

  app.locals.notes.splice(index, 1)
  // remove just that note from that index in the notes array

  return response.status(204)
  // return success status, no payload required

})

module.exports = app;


////////////////////
//// server.js ////
/////////////////////

const app = require('./app')
// import app as common js module, assign to app variable

app.set('port', process.env.PORT || 3000);
// set port for local host to 3000

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`)
})
// log message for when server is started
