const fs = require('fs');
let code = fs.readFileSync('src/components/ViewLock.tsx', 'utf8');

// Replace imports
code = code.replace(
  "import { CheckCircle2, Lock, Unlock, Link2, Loader2, Star, Download, Upload } from 'lucide-react';",
  "import { CheckCircle2, Lock, Unlock, Link2, Star, Download } from 'lucide-react';"
);
code = code.replace("import React, { useEffect, useState, useRef } from 'react';", "import React, { useEffect, useState } from 'react';");

// Remove state vars
code = code.replace("  const [clickedTasks, setClickedTasks] = useState<Record<string, number>>({});\n", "");
code = code.replace("  const [verifyingTasks, setVerifyingTasks] = useState<Set<string>>(new Set());\n", "");
code = code.replace("  const [taskErrors, setTaskErrors] = useState<Record<string, string>>({});\n", "");
code = code.replace("  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});\n", "");

// Remove compressImage and handleFileUpload
code = code.replace(/  const compressImage = \[\s\S\]*?  };\n\n  const handleFileUpload = \[\s\S\]*?  };\n\n/, "");

// Wait, regex might be tricky. Let's just use substring from 'const compressImage' to 'useEffect(() => {'

const startIdx = code.indexOf('  const compressImage =');
const endIdx = code.indexOf('  useEffect(() => {');
if (startIdx !== -1 && endIdx !== -1) {
    code = code.substring(0, startIdx) + code.substring(endIdx);
}

// Replace handleTaskClick
const clickStart = code.indexOf('  const handleTaskClick =');
const clickEnd = code.indexOf('  const handleUnlock =');
if (clickStart !== -1 && clickEnd !== -1) {
    const newClick = `  const handleTaskClick = (task: Task | typeof FIXED_CHANNELS[0]) => {
    if (completedTasks.has(task.id)) return;
    
    window.open(task.url, '_blank', 'noopener,noreferrer');
    
    setCompletedTasks(prev => {
      const next = new Set(prev);
      next.add(task.id);
      return next;
    });
  };

`;
    code = code.substring(0, clickStart) + newClick + code.substring(clickEnd);
}

fs.writeFileSync('src/components/ViewLock.tsx', code);
