import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LockConfig, Task } from '../types';
import { platforms } from '../data';
import { CheckCircle2, Lock, Unlock, Link2, Loader2, Star, Download } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ViewLock() {
  const location = useLocation();
  const navigate = useNavigate();
  const [config, setConfig] = useState<LockConfig | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [clickedTasks, setClickedTasks] = useState<Record<string, number>>({});
  const [verifyingTasks, setVerifyingTasks] = useState<Set<string>>(new Set());
  const [taskErrors, setTaskErrors] = useState<Record<string, string>>({});
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const data = params.get('data');
    if (data) {
      try {
        setConfig(JSON.parse(decodeURIComponent(data)));
      } catch (e) {
        console.error("Invalid config data");
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  if (!config) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Yükleniyor...</div>;

  const allTasksCompleted = completedTasks.size === config.tasks.length;

  const handleTaskClick = (task: Task) => {
    if (completedTasks.has(task.id) || verifyingTasks.has(task.id)) return;

    if (!clickedTasks[task.id]) {
      // First click: Open link and mark as clicked
      window.open(task.url, '_blank', 'noopener,noreferrer');
      setClickedTasks(prev => ({ ...prev, [task.id]: Date.now() }));
      setTaskErrors(prev => {
        const next = { ...prev };
        delete next[task.id];
        return next;
      });
    } else {
      // Second click: Verify
      const clickTime = clickedTasks[task.id];
      const isYoutubeWatch = task.platform === 'youtube' && task.action === 'İzle';
      const requiredTime = isYoutubeWatch ? 60000 : 2000;
      
      const timeElapsed = Date.now() - clickTime;
      
      setVerifyingTasks(prev => {
        const next = new Set(prev);
        next.add(task.id);
        return next;
      });

      setTaskErrors(prev => {
        const next = { ...prev };
        delete next[task.id];
        return next;
      });

      setTimeout(() => {
        setVerifyingTasks(prev => {
          const next = new Set(prev);
          next.delete(task.id);
          return next;
        });

        if (isYoutubeWatch && timeElapsed < requiredTime) {
           setTaskErrors(prev => ({
             ...prev,
             [task.id]: 'Lütfen videoyu en az 1 dakika izleyin.'
           }));
           // Reset click state so they have to click the link again
           setClickedTasks(prev => {
             const next = { ...prev };
             delete next[task.id];
             return next;
           });
        } else {
           setCompletedTasks(prev => {
             const next = new Set(prev);
             next.add(task.id);
             return next;
           });
        }
      }, 1500);
    }
  };

  const handleUnlock = () => {
    if (allTasksCompleted) {
      setIsUnlocking(true);
      setTimeout(() => {
        window.location.href = config.targetUrl;
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 py-12 px-4 sm:px-6 flex items-center justify-center font-sans">
      <div className="max-w-md w-full bg-zinc-900 rounded-[3rem] shadow-2xl border-8 border-zinc-800 overflow-hidden relative">
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-zinc-800 rounded-b-2xl z-10"></div>

        {/* Header Area */}
        <div className="p-8 pt-12 text-center border-b border-zinc-800 bg-zinc-950/50">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20 shadow-inner">
             {allTasksCompleted ? (
               <Unlock className="w-8 h-8 text-red-500" />
             ) : (
               <Lock className="w-8 h-8 text-red-500" />
             )}
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white mb-2">{config.title}</h1>
          {config.description && (
            <p className="text-zinc-400 text-sm">{config.description}</p>
          )}
        </div>

        {/* Tasks Area */}
        <div className="p-6 md:p-8 space-y-4 bg-zinc-900">
          <p className="text-[11px] font-medium text-zinc-500 text-center mb-6 uppercase tracking-wider">
            Kilidi açmak için aşağıdaki adımları tamamlayın
          </p>

          <div className="space-y-3">
            {config.tasks.map((task, index) => {
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
            })}
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-6 md:p-8 bg-zinc-950 border-t border-zinc-900">
          <button
            onClick={handleUnlock}
            disabled={!allTasksCompleted || isUnlocking}
            className={cn(
              "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-[12px]",
              allTasksCompleted
                ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20"
                : "bg-zinc-900 text-zinc-600 cursor-not-allowed border-2 border-zinc-800"
            )}
          >
            {isUnlocking ? (
              <span className="animate-pulse">Kilidi açılıyor...</span>
            ) : (
              <>
                {allTasksCompleted ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                {config.buttonText || 'LİNK HAZIR!'}
              </>
            )}
          </button>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-yellow-500">
               <Star className="w-5 h-5 fill-current" />
               <span className="font-bold text-white text-base">{config.rating?.toFixed(1) || '4.8'}</span>
            </div>
            <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></div>
            <div className="flex items-center gap-2 text-zinc-400">
               <Download className="w-5 h-5" />
               <span className="font-bold text-white text-base">
                 {new Intl.NumberFormat('tr-TR').format(config.downloads || 1200)}
               </span>
               <span className="text-xs font-medium uppercase tracking-wider">İndirme</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[9px] text-zinc-600 font-medium uppercase tracking-widest">Link Oluştur ile oluşturuldu</p>
          </div>
        </div>

      </div>
    </div>
  );
}
