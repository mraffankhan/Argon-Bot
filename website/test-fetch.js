fetch("http://localhost:3000/api/servers/1449085445593108615/scrims")
  .then(r => r.text())
  .then(console.log);
