const http = require("http");
const path = require('path');
const fs = require("fs");

const port = 8080;

const server = http.createServer((req, res) => {
  const file = path.join(process.cwd(), 'image.svg');

  fs.readFile(file, function (err, svg) {
    if (err) {
      throw err; 
    }

    svg = svg.toString();
    const bday = req.url.split('/')[1];

    if (Date.parse(bday)) {
      const today = new Date();
      const day = new Date(bday);
      const age = Math.floor((today-day)/31557600000);

      let next = "Today";
      let pct = 0;

      // Bday Stats
      if (!(day.getDate() == today.getDate() && day.getMonth() == today.getMonth())) {
        day.setFullYear(today.getFullYear());
        if (today > day) {
          day.setFullYear(today.getFullYear() + 1); 
        }
        
        pct = ( (day-today)/(1000*60*60*24) ) / 365;
        next = `In ${Math.floor(pct*365)} Days`;
      }
      const findSign = (date) => {
        const days = [21, 20, 21, 21, 22, 22, 23, 24, 24, 24, 23, 22];
        const signs = ["♒︎", "♓︎", "♈︎", "♉︎", "♊︎", "♋︎", "♌︎", "♍︎", "♎︎", "♏︎", "♐︎", "♑︎"];
        const names = ["Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn"];
        let month = date.getMonth();
        const day = date.getDate();
        if (month == 0 && day <= 20){
          month = 11;
        } else if(day < days[month]){
          month--;
        }
        return [ names[month], signs[month] ];
      };
      const zodiac = findSign(day);
      
      const conf = [ 
        ['$Age', age],
        ['$Ttl', 600],
        ['$Pct', pct*600],
        ['$BDay', new Date(bday).toLocaleDateString('en-AU')],
        ['$DaysUntilNext', next],
        ['$Name', zodiac[0]],
        ['$Sign', zodiac[1]],
      ];
      
      for (let i = 0; i < conf.length; i++) {
        const data = conf[i];
        svg = svg.replaceAll(data[0], data[1])
      }

      res.writeHead(200, {"Content-Type": "image/svg+xml"});  
      res.write(svg);  
    }
    else {
      res.writeHead(200, {"Content-Type": "text/plain"});  
      res.write('Invalid Date Provided');  
    }

    res.end();
  })
})

server.listen(port, "127.0.0.1", () => {
  console.log(`active on 127.0.0.1:${port}`)
})
