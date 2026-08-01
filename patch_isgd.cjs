const fs = require('fs');
let code = fs.readFileSync('src/components/CreateLock.tsx', 'utf8');

const regex = /try\s*\{\s*const res = await fetch\('\/api\/shorten', \{\s*method: 'POST',\s*headers: \{ 'Content-Type': 'application\/json' \},\s*body: JSON\.stringify\(\{ url: longLink \}\)\s*\}\);\s*if \(res\.ok\) \{\s*const data = await res\.json\(\);\s*const shortUrl = data\.shortUrl;\s*if \(shortUrl\) \{\s*finalLink = shortUrl;\s*\}\s*\}\s*\} catch \(err\) \{/m;

const replacement = `try {
        const res = await fetch(\`https://is.gd/create.php?format=json&url=\${encodeURIComponent(longLink)}\`);
        if (res.ok) {
          const data = await res.json();
          if (data.shorturl) {
            finalLink = data.shorturl;
          }
        }
      } catch (err) {`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/components/CreateLock.tsx', code);
