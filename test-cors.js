fetch('https://clck.ru/--?url=https://example.com', { method: 'GET', headers: { 'Origin': 'http://localhost:3000' } })
  .then(res => { console.log("Status:", res.status); res.text().then(console.log); })
  .catch(console.error);
