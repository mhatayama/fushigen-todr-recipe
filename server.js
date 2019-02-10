const bodyParser = require('body-parser');
const csvParse = require('csv-parse');
const express = require('express');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// setting up a database
let db = new sqlite3.Database(':memory:', err => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

db.serialize(() => {
  const createTableSql = fs.readFileSync('database/CREATE_TABLE.sql', 'utf8');
  db.exec(createTableSql, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Created the table for recipes.');
  });

  const recipeDataMixing = fs.readFileSync('database/recipes-mixing.csv', 'utf8');
  const recipeDataCrafing = fs.readFileSync('database/recipes-crafting.csv', 'utf8');
  csvParse(recipeDataMixing + recipeDataCrafing, { comment: '#' }, (err, output) => {
    if (err) {
      return console.error(err.message);
    }
    output.forEach(row => {
      const insertSql = `INSERT INTO
        recipe(category, result, item1, item2, item3, item4, item5, item6)
        values (?, ?, ?, ?, ?, ?, ?, ?);`;
      db.run(insertSql, row, err => {
        if (err) {
          return console.error(err.message);
        }
      });
    });
  });
});

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bulma'));

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`server on ${port}`);

app.get('/api/search/:text', (req, res) => {
  const searchText = req.params.text;
  if (!searchText) {
    res.send([]);
  }
  db.all(`SELECT * FROM recipe WHERE result like ? or 
  item1 like ? or item2 like ? or item3 like ? or item4 like ? or item5 like ? or item6 like ?`,
    Array(7).fill(`%${searchText}%`), (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      res.send(rows);
    });
});

