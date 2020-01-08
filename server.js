var express = require("express");
var path = require("path");
var fs = require("fs");
var bodyParser = require('body-parser')


const app = express();
const port = 3000;
var count = 1;
var position;

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.use(express.static('public'));

fileRead = fs.readFileSync('./db/db.json');
fileWrite = fs.writeFileSync('./db/db.json');


var notes = JSON.parse(fileRead);

assignID(notes);


app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, "/public/notes.html")));

app.get('/api/notes', (req,res) => {
    return res.send(notes);
})

app.post('/api/notes', (req,res) => {
    let buffer = req.body;
    notes.push(buffer);
    assignID(notes);

    ////put hard write to file here////


    return res.send(buffer);
})

app.delete('/api/notes/:id',(req,res) =>{
    let buffer = req.params;
    findDups(notes,buffer.id);
    notes.splice(position,1);



    ////////save to the hard file

    return res.send(notes)

})





function findDups(array,num){
    array.map(function(iter){
        if (iter.id == num){
            count++;
            position = array.indexOf(iter);
            return true;
        }
    })
    return false;
}

function assignID(array){
    array.map(function(iter){
        if (!iter.id){
            do {
                dup = findDups(array,count)
            }
            while(dup == true);
            iter.id = count;
        }
    })
}



app.listen(port, () => console.log(`Listening on port ${port}!`));