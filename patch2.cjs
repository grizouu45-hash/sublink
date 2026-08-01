const fs = require('fs');
let code = fs.readFileSync('src/components/ViewLock.tsx', 'utf8');

// Replace dynamic tasks loop to remove clickedTasks, verifyingTasks, taskErrors
const oldTasksStart = '{config.tasks.map((task, index) => {';
const oldTasksEnd = '})}\\n          </div>\\n        </div>';

code = code.replace(/\{config\.tasks\.map\(\(task, index\) => \{\s+const platform = platforms\.find\(p => p\.id === task\.platform\);\s+const isCompleted = completedTasks\.has\(task\.id\);\s+const isClicked = !!clickedTasks\[task\.id\];\s+const isVerifying = verifyingTasks\.has\(task\.id\);\s+const taskError = taskErrors\[task\.id\];[\s\S]*?            \}\)}/, `{config.tasks.map((task, index) => {
              const platform = platforms.find(p => p.id === task.platform);
              const isCompleted = completedTasks.has(task.id);

              return (
                <button
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  disabled={isCompleted}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group",
                    isCompleted 
                      ? "bg-red-500/10 border-red-500/30 cursor-default" 
                      : "bg-zinc-950 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110",
                      isCompleted ? "opacity-50" : "bg-zinc-900"
                    )}>
                      {platform?.icon || <Link2 className="w-5 h-5 text-zinc-400" />}
                    </div>
                    <div>
                      <span className={cn(
                        "block font-bold text-sm",
                        isCompleted ? "text-zinc-500 line-through" : "text-white"
                      )}>
                        {task.action}
                      </span>
                      <span className="block text-xs text-zinc-400">
                        {platform?.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-red-500" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-zinc-700 group-hover:border-zinc-500" />
                    )}
                  </div>
                </button>
              );
            })}`);

// Also fix the import to remove Loader2 if still there
code = code.replace(/import \{ CheckCircle2, Lock, Unlock, Link2, Loader2, Star, Download, Upload \} from 'lucide-react';/g, "import { CheckCircle2, Lock, Unlock, Link2, Star, Download } from 'lucide-react';");

fs.writeFileSync('src/components/ViewLock.tsx', code);
