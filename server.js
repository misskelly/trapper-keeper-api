const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);

app.locals.title = 'trapper-keeper';
const mockList = {title: 'example', id: 1, listItems: [{id: 111, text: 'example list item'}]}

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

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`)
})