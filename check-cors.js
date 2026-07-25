async function checkCors(url) {
  try {
    const res = await fetch(url, { method: 'OPTIONS' });
    console.log(url, 'OPTIONS:', res.headers.get('access-control-allow-origin'));
  } catch(e) {}
  try {
    const res = await fetch(url);
    console.log(url, 'GET:', res.headers.get('access-control-allow-origin'));
  } catch(e) {}
}

checkCors('https://tinyurl.com/api-create.php?url=https://example.com');
checkCors('https://is.gd/create.php?format=json&url=https://example.com');
checkCors('https://spoo.me/');
