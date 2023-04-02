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
     
      const r = 40*3;
      const c = Math.PI*(r*2);
      let pct = 0; 
      let desc = '';

      if (!(day.getDate() == today.getDate() && day.getMonth() == today.getMonth())) {
        day.setFullYear(today.getFullYear());
        if (today > day) {
          day.setFullYear(today.getFullYear() + 1); 
        }
        
        pct = ( (day-today)/(1000*60*60*24) ) / 365;
        desc = `I'll turn ${age+1} in ${day.getFullYear()}`;
      }
      else {
        desc = "It seems today is my birthday";
      }

      const conf = [ ['$Age', age], ['$C', c], ['$Pct', c*pct], ['$BDay', bday], ['$DaysUntilNext', Math.floor(pct*365)], ['$Desc', desc] ];

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
