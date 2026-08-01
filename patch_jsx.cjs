const fs = require('fs');
let code = fs.readFileSync('src/components/ViewLock.tsx', 'utf8');

// The fixed channels loop:
const oldFixedStr = `{FIXED_CHANNELS.map(channel => {
              const isCompleted = completedTasks.has(channel.id);
              const isClicked = !!clickedTasks[channel.id];
              const isVerifying = verifyingTasks.has(channel.id);
              const taskError = taskErrors[channel.id];
              
              return (
                <div key={channel.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center text-center shadow-lg relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={el => fileInputRefs.current[channel.id] = el}
                    onChange={(e) => handleFileUpload(e, channel)}
                  />
                  <div className="w-20 h-20 mb-3 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800">
                    <img src={channel.avatar} alt={channel.name} className={cn("w-full h-full object-cover", isCompleted && "opacity-50 grayscale")} />
                  </div>
                  <span className={cn("font-bold text-sm mb-3 truncate w-full", isCompleted ? "text-zinc-500 line-through" : "text-white")}>{channel.name}</span>
                  
                  <button
                    onClick={() => handleTaskClick(channel as any)}
                    disabled={isCompleted || isVerifying}
                    className={cn(
                      "w-full py-2 px-4 rounded-xl font-bold text-sm transition-all shadow-lg",
                      isCompleted 
                        ? "bg-zinc-900 text-zinc-500 cursor-default shadow-none" 
                        : "bg-red-600 hover:bg-red-500 text-white shadow-red-600/20"
                    )}
                  >
                    {isCompleted ? (
                      <span className="flex items-center justify-center gap-1"><CheckCircle2 className="w-4 h-4" /> Tamamlandı</span>
                    ) : isVerifying ? (
                      <span className="flex items-center justify-center gap-1"><Loader2 className="w-4 h-4 animate-spin" /> Doğrulanıyor...</span>
                    ) : isClicked ? (
                      <span className="flex items-center justify-center gap-1"><Upload className="w-4 h-4" /> SS Yükle</span>
                    ) : (
                      "Abone Ol"
                    )}
                  </button>
                  {isClicked && !isCompleted && !isVerifying && (
                    <button
                      onClick={() => window.open(channel.url, '_blank', 'noopener,noreferrer')}
                      className="w-full mt-2 py-2 px-4 rounded-xl font-bold text-xs bg-zinc-800 hover:bg-zinc-700 text-white transition-all shadow-lg"
                    >
                      Abone Ol
                    </button>
                  )}
                  {taskError && (
                    <span className="block text-[10px] text-red-500 mt-2 leading-tight">
                      {taskError}
                    </span>
                  )}
                </div>
              );
            })}`;

const newFixedStr = `{FIXED_CHANNELS.map(channel => {
              const isCompleted = completedTasks.has(channel.id);
              
              return (
                <div key={channel.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center text-center shadow-lg relative">
                  <div className="w-20 h-20 mb-3 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800">
                    <img src={channel.avatar} alt={channel.name} className={cn("w-full h-full object-cover", isCompleted && "opacity-50 grayscale")} />
                  </div>
                  <span className={cn("font-bold text-sm mb-3 truncate w-full", isCompleted ? "text-zinc-500 line-through" : "text-white")}>{channel.name}</span>
                  
                  <button
                    onClick={() => handleTaskClick(channel as any)}
                    disabled={isCompleted}
                    className={cn(
                      "w-full py-2 px-4 rounded-xl font-bold text-sm transition-all shadow-lg",
                      isCompleted 
                        ? "bg-zinc-900 text-zinc-500 cursor-default shadow-none" 
                        : "bg-red-600 hover:bg-red-500 text-white shadow-red-600/20"
                    )}
                  >
                    {isCompleted ? (
                      <span className="flex items-center justify-center gap-1"><CheckCircle2 className="w-4 h-4" /> Tamamlandı</span>
                    ) : (
                      "Abone Ol"
                    )}
                  </button>
                </div>
              );
            })}`;

code = code.replace(oldFixedStr, newFixedStr);

// The dynamic tasks loop:
const oldTasksStr = `{config.tasks.map((task, index) => {
              const platform = platforms.find(p => p.id === task.platform);
              const isCompleted = completedTasks.has(task.id);
              const isClicked = !!clickedTasks[task.id];
              const isVerifying = verifyingTasks.has(task.id);
              const taskError = taskErrors[task.id];

              return (
                <button
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  disabled={isCompleted || isVerifying}
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
                        {isVerifying ? "Doğrulanıyor..." : isClicked ? "Doğrula" : task.action}
                      </span>
                      {taskError ? (
                        <span className="block text-xs text-red-500 mt-1">
                          {taskError}
                        </span>
                      ) : (
                        <span className="block text-xs text-zinc-400">
                          {platform?.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-red-500" />
                    ) : isVerifying ? (
                      <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-zinc-700 group-hover:border-zinc-500" />
                    )}
                  </div>
                </button>
              );
            })}`;

const newTasksStr = `{config.tasks.map((task, index) => {
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
            })}`;

code = code.replace(oldTasksStr, newTasksStr);
fs.writeFileSync('src/components/ViewLock.tsx', code);
