fetch('https://clck.ru/--', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'url=https://google.com'
}).then(r => r.text()).then(console.log).catch(console.error);
