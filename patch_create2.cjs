const fs = require('fs');
let code = fs.readFileSync('src/components/CreateLock.tsx', 'utf8');

const regex = /try\s*\{\s*const res = await fetch\('\/api\/shorten', \{\s*method: 'POST',\s*headers: \{ 'Content-Type': 'application\/json' \},\s*body: JSON\.stringify\(\{ url: longLink \}\)\s*\}\);\s*if \(res\.ok\) \{\s*const data = await res\.json\(\);\s*if \(data\.shortUrl\) \{\s*finalLink = data\.shortUrl;\s*\}\s*\}\s*\} catch \(err\) \{/m;

const replacement = `try {
        const res = await fetch('https://clck.ru/--', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'url=' + encodeURIComponent(longLink)
        });
        if (res.ok) {
          const shortUrl = await res.text();
          if (shortUrl) {
            finalLink = shortUrl;
          }
        }
      } catch (err) {`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/components/CreateLock.tsx', code);
