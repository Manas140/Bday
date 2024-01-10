import { serve, file as _file } from 'bun';

serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const file = _file(`./image.svg`);

    let svg = await file.text();
    const queryBday = url.searchParams.get('bday');
    const bg = url.searchParams.get('bg') || '121212';
    const fg = url.searchParams.get('fg') || 'a8a3a3';
    
    if (Date.parse(queryBday)) {
      const today = new Date();
      const bday = new Date(queryBday);
      const age = Math.floor((today-bday)/31557600000);

      let next = "Today";
      let pct = 0;

      // Bday Stats
      if (!(bday.getDate() == today.getDate() && bday.getMonth() == today.getMonth())) {
        bday.setFullYear(today.getFullYear());
        if (today > bday) {
          bday.setFullYear(today.getFullYear() + 1); 
        }
        
        pct = ( (bday-today)/(1000*60*60*24) ) / 365;
        next = `In ${Math.floor(pct*365)} Days`;
      }

      const get_zodiac = (date) => {
        const days = [21, 20, 21, 21, 22, 22, 23, 24, 24, 24, 23, 22];
        const signs = ["♒︎", "♓︎", "♈︎", "♉︎", "♊︎", "♋︎", "♌︎", "♍︎", "♎︎", "♏︎", "♐︎", "♑︎"];
        const names = ["Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn"];
        let month = date.getMonth();
        const bday = date.getDate();
        if (month == 0 && bday <= 20){
          month = 11;
        } else if(bday < days[month]){
          month--;
        }
        return [ names[month], signs[month] ];
      };
      const zodiac = get_zodiac(bday)
      
      const conf = [ 
        ['$Age', age],
        ['$Ttl', 600],
        ['$Pct', pct*600],
        ['$BDay', new Date(bday).toLocaleDateString('en-AU')],
        ['$DaysUntilNext', next],
        ['$Name', zodiac[0]],
        ['$Sign', zodiac[1]],
        ['$Bg', bg],
        ['$Fg', fg],
      ];
      
      for (let i = 0; i < conf.length; i++) {
        const data = conf[i];
        svg = svg.replaceAll(data[0], data[1])
      }

      return new Response(svg, {headers: {"Content-Type": "image/svg+xml"}, status: 200});  
    }
    else {
      return new Response('invalid date', {headers: {"Content-Type": "text/plain"}, status: 200});  
    }
  }
})