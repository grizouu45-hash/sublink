const fs = require('fs');
let code = fs.readFileSync('src/components/CreateLock.tsx', 'utf8');

const regex = /try\s*\{\s*const res = await fetch\(\`https:\/\/is\.gd\/create\.php\?format=json&url=\$\{encodeURIComponent\(longLink\)\}\`\);\s*if \(res\.ok\) \{\s*const data = await res\.json\(\);\s*if \(data\.shorturl\) \{\s*finalLink = data\.shorturl;\s*\}\s*\}\s*\} catch \(err\) \{/m;

const replacement = `try {
        const res = await fetch('/api/shorten', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: longLink })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.shortUrl) {
            finalLink = data.shortUrl;
          }
        }
      } catch (err) {`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/components/CreateLock.tsx', code);
