const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const apiStart = code.indexOf('  // AI Verification route');
const apiEnd = code.indexOf('  // API route to proxy URL shortening');

if (apiStart !== -1 && apiEnd !== -1) {
    code = code.substring(0, apiStart) + code.substring(apiEnd);
}

code = code.replace('import { GoogleGenAI } from "@google/genai";\n', '');

fs.writeFileSync('server.ts', code);
