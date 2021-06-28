const http = require('http');
const fs = require('fs');
var requests = require("requests");
const { join } = require('path');

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal,orgVal) => {
    let tem = (orgVal.main.temp - 273);
    let tem_min = (orgVal.main.temp_min - 273);
    let tem_max = (orgVal.main.temp_max -273);
    let temperature = tempVal.replace("{%tempval%}" , tem.toFixed(2));
    temperature = temperature.replace("{%tempmin%}" , tem_min.toFixed(2));
    temperature = temperature.replace("{%tempmax%}" , tem_max.toFixed(2));
    temperature = temperature.replace("{%location%}" , orgVal.name);
    temperature = temperature.replace("{%country%}" , orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}" , orgVal.weather[0].main);
    return temperature;
}

const server = http.createServer((req,res) =>{
    if(req.url == "/"){
        requests("http://api.openweathermap.org/data/2.5/weather?q=Chhindwara&appid=6938924962ed6783e45d55bfc31464f0" 
        )
            .on('data', (chunk) =>{
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                // console.log(arrData[0].main.temp);
                const realTimeData = arrData.map((val) => replaceVal(homeFile,val))
                    .join("");
                res.write(realTimeData);
                // console.log(realTimeData);
            })
            .on('end', (err) =>{
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });

    }
});

server.listen(8000 , "127.0.0.1");
