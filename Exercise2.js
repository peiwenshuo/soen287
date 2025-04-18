const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

app.use(cookieParser());

function formatDate(date) {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months   = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const dayOfWeek = weekdays[date.getDay()];
  const month     = months[date.getMonth()];
  const day       = date.getDate();           // <-- use getDate(), not getDay
  let   hours     = date.getHours();
  let   minutes   = date.getMinutes();
  let   seconds   = date.getSeconds();

  hours   = hours   < 10 ? '0' + hours   : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  const year = date.getFullYear();
  const tz   = date
    .toLocaleTimeString('en-US', { timeZoneName: 'short' })
    .split(' ')[2];

  // include the day in the formatted string
  return `${dayOfWeek} ${month} ${day} ${hours}:${minutes}:${seconds} ${tz} ${year}`;
}

app.get('/numOfVisits', (req, res) => {
  let visits    = req.cookies.visits;
  let lastVisit = req.cookies.lastVisit;
  let message   = '';

  const now = new Date();

  if (!visits) {
    visits  = 1;
    message = "Welcome to my webpage! It is your first time here.";
  } else {
    visits  = Number(visits) + 1;
    message = `Hello, this is the ${visits} time you are visiting my webpage!`;
    if (lastVisit) {
      message += `<br>Last time you visited my webpage on: ${lastVisit}`;
    }
  }

  const formattedNow = formatDate(now);
  res.cookie('visits', visits,    { maxAge: 24*60*60*1000 });
  res.cookie('lastVisit', formattedNow, { maxAge: 24*60*60*1000 });

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Number of Visits</title></head>
<body>
  <p style="text-align:center;">${message}</p>
</body>
</html>
  `);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}. Visit http://localhost:${port}/numOfVisits to test.`);
});
