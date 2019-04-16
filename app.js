const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require("express-handlebars");
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const kijiji = require("kijiji-scraper");
const Sequelize = require("sequelize");
var request = require('request');
var fs = require('fs');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//static folder
//app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(express.static(__dirname + '/public'));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/contact', (req, res) => {
    res.render('contact');
    //res.render('result');
});

app.post('/send', (req, res) => {
    console.log(req.body);
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Detail</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Name: ${req.body.company}</li>
        <li>Name: ${req.body.email}</li>
        <li>Name: ${req.body.phone}</li>
        </ul>
    <h3> Message </h3>
    ${req.body.message}
    `
})

let Rommsize = 2;

let portuses = 8080;

let options = {
    minResults: 70
};

let params = {
    locationId: 1700273,  // GTA Location Only
    categoryId: 37,  // Same as kijiji.categories.CARS_AND_VEHICLES
    sortByName: "priceAsc"  // Show the cheapest listings first
};

let data;

try {  
    data = fs.readFileSync('test.txt', 'utf8');
 

} catch(e) {
    console.log('Error:', e.stack);
}

// Redefine the catoryID base one the size of the room user search on
// more modification on the document of category
if (Rommsize == 0) {
    params.categoryId == 37;
}
else if (Rommsize == 1) {
    params.categoryId == 212;
}
else if (Rommsize == 12) {  //One plus one
    params.categoryId == 213;
}
else if (Rommsize == 2) {
    params.categoryId == 214;
}
else if (Rommsize == 3) {
    params.categoryId == 215;
}
else if (Rommsize == 4) {
    params.categoryId == 216;
}
else if (Rommsize == 5) {   //Bachelor and studio
    params.categoryId == 211;
}


var selection = '{"Smart":[{ "title":"", "url":"","latitude":"","longitude":"","mapAddress":"", "price":"", "visits":""}]}';
var obj = JSON.parse(selection);


let rent;

let RentAds = [{
    title: String,
    description: String,
    date: Date,
    image: String,
    images: String,
    attributes:
    {
        numberbedrooms: Number,
        numberbathrooms: Number,
        petsallowed: Number,
        furnished: Number,
        forrentbyhousing: String,
        price: Number,
        location:
        {
            latitude: String,
            longitude: String,
            mapAddress: String,
            province: String,
            mapRadius: Number,
        },
        type: String,
        visits: Number,
    },
    url: String,
    scrape: [],
    isScraped: []

}]


// Scrape using returned promise
kijiji.search(params, options).then(function (ads) {
    // Use the ads array
    for (let i = 0; i < ads.length; ++i) {
        //get the object stored and try test the url link
        rent = ads[i];
        if(rent.attributes.price > 300 && rent.attributes.petsallowed == 1){
        obj['Smart'].push({"title":rent.title, "url":rent.url,"latitude":rent.attributes.location.latitude,"longitude":rent.attributes.location.longitude,"mapAddress":rent.attributes.location.mapAddress, "price":rent.attributes.price, "visits":rent.attributes.visits})
        //console.log(obj['Smart']);
        /*latitude.push(rent.attributes.location.latitude);
        longitude.push(rent.attributes.location.longitude);
        mapAddress.push(rent.attributes.location.mapAddress);
        price.push(rent.attributes.price);*/
        }
    }
    delete obj['Smart'][0];
    str = JSON.stringify(obj['Smart']);
    app.get('/', function(req, res){
        res.render('result',{str:obj['Smart']});
        //res.render('/result',{name:"api", bb:"root"});
        
    });

            
    console.log("==========================================================================================================================================================");
    console.log("==========================================================================================================================================================");
    console.log("==========================================================================================================================================================");

    //URL check
    /*for(let i =0; i<selection.length; i++){
    request.get(obj[i], options, function (err, res, body) {
        if (res.statusCode !== 200) {
            console.log("warnning, link broke");
        } //etc
        //TODO Do something with response
        else{
            console.log("Good Link ->  " + selection[i].url + "           " + selection[i].price);
        }
    });}*/

}).catch(console.error);

// Scrape using optional callback parameter
function callback(err, ads) {
    if (!err) {
        // Use the ads array
        for (let i = 0; i < ads.length; ++i) {
            //get the object stored and try test the url link
            rent = ads[i];
            //console.log(rent.url);
        }
    }
}
kijiji.search(params, options, callback);

app.listen(portuses, () => console.log('Loading up......on_' + " http://localhost:" + portuses));

/*app.get('/result', (req, res) => {
    //res.render('contact');
    //send the url datas
    res.render('result',{name:"api", bb:"root"});
});*/


/*
let status;

let statusText;
//URL check
request.open("GET",rent[0].url,true);
request.send();
request.onload = function(){
	status = request.status;
	statusText = request.statusText;
}
if(status == 200) //if(statusText == OK)
{
    //your required operation on valid URL
    window.open(rent[0].url);
}
else{
   //your operation for broken URL
   console.log("warnning, link broke");
}
*/