require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https")


const app = express();

app.use(bodyParser.urlencoded({extended: true}))

// make some files accessable from any where (public)
app.use(express.static("Public"));

// set view engine to ejs
app.set('view engine', 'ejs');

//
app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
   
});


app.post("/", function(req, res){
    const query = req.body.cityName;
    const check = Number(query);

    if(Number.isNaN(check)){
        //apk key taken from .env
        const apiKey = process.env.API_KEY;
        const units = "metric";
        const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;
        https.get(url, function(response){ 
            // console.log(response.statusCode);
            const status = Number(response.statusCode);
            response.on("data", function(data){
                
                if(!(status === 200)){
                    res.render("wrong_city_name");
                }
                else{
                    const weatherData = JSON.parse(data);
                    const temp = weatherData.main.temp;
                    const weatherDescription = weatherData.weather[0].description;
                    const lon = weatherData.coord.lon;
                    const lat = weatherData.coord.lat;
                    const icon = weatherData.weather[0].icon;
                    const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                    res.render("index", {city_name: query, tempEJS: temp, descriptionEJS: weatherDescription, lonEJS: lon, latEJS: lat,iconEJS: imageURL});

                }
            }); 
        });
    }
    else{
        res.render("wrong_city_name");
    }
});


//page not found code 404
app.get('*', function(req, res){
    res.status(404).render("404");
});


app.listen(3000, function(){
    console.log("Server listening on port 3000");
});