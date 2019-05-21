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

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`)
})