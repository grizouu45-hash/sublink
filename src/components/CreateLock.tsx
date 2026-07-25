import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Link2, Plus, Rocket, Share2, Copy, CheckCircle2, X } from 'lucide-react';
import { PlatformId, LockConfig, Task } from '../types';
import { platforms, MAX_TASKS } from '../data';
import { cn } from '../lib/utils';
import LZString from 'lz-string';

export default function CreateLock() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<LockConfig>({
    title: 'OYUN ADI BURAYA',
    description: 'LİNKE ULAŞMAK İÇİN GÖREVLERİ TAMAMLAYIN!',
    targetUrl: '',
    buttonText: 'LİNK HAZIR!',
    tasks: [
      { id: '1', platform: 'youtube', action: 'Abone Ol', url: '' }
    ]
  });

  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [urlHistory, setUrlHistory] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const savedHistory = localStorage.getItem('urlHistory');
    if (savedHistory) {
      try {
        setUrlHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse URL history');
      }
    }
  }, []);

  const handleTaskChange = (index: number, field: keyof Task, value: string) => {
    const newTasks = [...config.tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    
    // If platform changes, reset the action to the first available for that platform
    if (field === 'platform') {
      const platformData = platforms.find(p => p.id === value);
      if (platformData) {
        newTasks[index].action = platformData.actions[0];
      }
    }
    
    setConfig({ ...config, tasks: newTasks });
  };

  const addTask = () => {
    if (config.tasks.length < MAX_TASKS) {
      setConfig({
        ...config,
        tasks: [...config.tasks, { id: Date.now().toString(), platform: 'youtube', action: 'Abone Ol', url: '' }]
      });
    }
  };

  const generateLock = (e: React.FormEvent) => {
    e.preventDefault();
    const ratings = [4.6, 4.7, 4.8, 4.9, 5.0];
    const randomRating = ratings[Math.floor(Math.random() * ratings.length)];
    const downloads = Math.floor(Math.random() * 5001) + 5000;
    
    // Save URLs to history
    const newHistory = { ...urlHistory };
    config.tasks.forEach(task => {
      if (task.url) {
        if (!newHistory[task.platform]) {
          newHistory[task.platform] = [];
        }
        if (!newHistory[task.platform].includes(task.url)) {
          newHistory[task.platform] = [task.url, ...newHistory[task.platform]].slice(0, 10);
        }
      }
    });
    setUrlHistory(newHistory);
    localStorage.setItem('urlHistory', JSON.stringify(newHistory));

    const finalConfig = { ...config, rating: randomRating, downloads };
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(finalConfig));
    const link = `${window.location.origin}/view?c=${compressed}`;
    setGeneratedLink(link);
  };

  const copyToClipboard = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 p-8">
        
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-3 mb-2 text-white">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/20">
              <Edit2 className="text-white w-6 h-6" />
            </div>
            Link Oluştur
          </h1>
          <p className="text-zinc-400 text-sm md:text-base">
            Maksimum büyüme için {MAX_TASKS}'a kadar sosyal medya platformu ekleyin
          </p>
        </div>

        {generatedLink ? (
          <div className="bg-zinc-950 border-2 border-red-500/30 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Linkiniz Hazır!</h2>
            <p className="text-zinc-400 mb-8">Aşağıdaki linki kopyalayıp takipçilerinizle paylaşabilirsiniz.</p>
            
            <div className="flex items-center gap-2 max-w-lg mx-auto bg-zinc-900 border border-zinc-700 p-2 rounded-xl">
              <div className="flex-1 truncate px-3 text-sm text-zinc-300 select-all">
                {generatedLink}
              </div>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shrink-0"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Kopyalandı
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Kopyala
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-8 flex justify-center gap-4">
               <button
                onClick={() => setGeneratedLink(null)}
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
               >
                 Yeni Link Oluştur
               </button>
               <button
                onClick={() => window.open(generatedLink, '_blank')}
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
               >
                 <Link2 className="w-4 h-4" />
                 Önizleme
               </button>
            </div>
          </div>
        ) : (
        <form onSubmit={generateLock} className="space-y-8">
          
          {/* General Settings */}
          <div className="space-y-6">
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
                <span className="font-serif">H</span> Kilit Başlığı *
              </label>
              <input
                type="text"
                required
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                placeholder="Örn. OYUN ADI BURAYA"
              />
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
                <Edit2 className="w-4 h-4" /> Açıklama (isteğe bağlı)
              </label>
              <textarea
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors min-h-[100px]"
                placeholder="Örn. ŞARTLARI YERİNE GETİRİN VE AÇILAN LİNKE GİDİN"
              />
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
                <Link2 className="w-4 h-4" /> Kilidi Açılacak İçerik URL'si *
              </label>
              <input
                type="url"
                required
                value={config.targetUrl}
                onChange={(e) => setConfig({ ...config, targetUrl: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                placeholder="https://drive.google.com/file/..."
              />
              <p className="text-xs text-zinc-500 mt-2">Kullanıcıların görevleri tamamladıktan sonra erişeceği URL</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
                <Edit2 className="w-4 h-4" /> Buton Metni
              </label>
              <input
                type="text"
                value={config.buttonText}
                onChange={(e) => setConfig({ ...config, buttonText: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors uppercase"
                placeholder="LİNK HAZIR!"
              />
            </div>
          </div>

          <hr className="border-zinc-800" />

          {/* Social Media Tasks */}
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-white">
              <Share2 className="w-5 h-5 text-red-500" />
              Sosyal Medya Platformları (1-{MAX_TASKS} Ekle)
            </h2>

            <div className="space-y-6">
              {config.tasks.map((task, index) => (
                <div key={task.id} className={cn("bg-zinc-950 rounded-xl p-6 relative", index === 0 ? "border-2 border-red-500/30" : "border border-zinc-800")}>
                  {index === 0 && (
                    <div className="absolute -top-3 -left-3 bg-red-600 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase shadow-lg shadow-red-500/20">Zorunlu</div>
                  )}
                  <h3 className="text-red-500 font-semibold mb-4 mt-2">
                    # Platform {index + 1}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Platform</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {platforms.map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleTaskChange(index, 'platform', p.id)}
                            className={cn(
                              "flex flex-col items-center justify-center p-3 rounded-lg border transition-all",
                              task.platform === p.id 
                                ? "bg-red-500/10 border-red-500 shadow-sm shadow-red-500/10" 
                                : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                            )}
                          >
                            {p.icon}
                            <span className="text-[10px] mt-2 font-medium text-zinc-400">{p.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Görev</label>
                      <select
                        value={task.action}
                        onChange={(e) => handleTaskChange(index, 'action', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors appearance-none"
                      >
                        {platforms.find(p => p.id === task.platform)?.actions.map(action => (
                          <option key={action} value={action}>{action}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">URL</label>
                      <input
                        type="url"
                        required
                        list={`url-history-${task.platform}-${index}`}
                        value={task.url}
                        onChange={(e) => handleTaskChange(index, 'url', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                        placeholder="https://..."
                      />
                      <datalist id={`url-history-${task.platform}-${index}`}>
                        {urlHistory[task.platform]?.map((url, i) => (
                          <option key={i} value={url} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                  
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newTasks = [...config.tasks];
                        newTasks.splice(index, 1);
                        setConfig({ ...config, tasks: newTasks });
                      }}
                      className="absolute top-6 right-6 text-zinc-500 hover:text-red-500 transition-colors"
                    >
                      Kaldır
                    </button>
                  )}
                </div>
              ))}
            </div>

            {config.tasks.length < MAX_TASKS && (
              <button
                type="button"
                onClick={addTask}
                className="w-full mt-6 bg-zinc-900 border border-dashed border-zinc-700 hover:border-red-500 hover:text-red-500 rounded-xl py-4 flex items-center justify-center gap-2 text-zinc-500 font-medium transition-colors uppercase tracking-wider text-sm"
              >
                <Plus className="w-5 h-5" />
                Başka Bir Platform Ekle (İsteğe Bağlı)
              </button>
            )}
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 transition-all uppercase tracking-wider"
            >
              <Rocket className="w-5 h-5" />
              Link Oluştur
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
