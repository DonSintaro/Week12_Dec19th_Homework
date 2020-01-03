var express = require("express");
var path = require("path");
var fs = require("fs");
var bodyParser = require('body-parser')


const app = express();
const port = 3000;
var count = 1;

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.use(express.static('public'));

var notes = JSON.parse(fs.readFileSync('./db/db.json'));
assignID(notes);


app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, "/public/notes.html")));

app.get('/api/notes', (req,res) => {
    return res.send(notes);
})

app.post('/api/notes', (req,res) => {
    let buffer = req.body;
    console.log(buffer);
    notes.push(buffer);
    assignID(notes);


    return res.send(buffer);
})

function checkDups(array,num){
    array.map(function(iter){
        if (iter.id == num){
            count++;
            return true;
        }
    })
    return false;
}

function assignID(array){
    array.map(function(iter){
        if (!iter.id){
            do {
                dup = checkDups(array,count)
            }
            while(dup == true);
            iter.id = count;
        }
    })
}



app.listen(port, () => console.log(`Listening on port ${port}!`));