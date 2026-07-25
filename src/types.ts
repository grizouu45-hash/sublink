export type PlatformId = 'youtube' | 'instagram' | 'facebook' | 'twitter' | 'tiktok' | 'linkedin' | 'telegram' | 'discord' | 'twitch' | 'reddit' | 'whatsapp' | 'snapchat';

export interface Task {
  id: string;
  platform: PlatformId;
  action: string;
  url: string;
}

export interface LockConfig {
  title: string;
  description: string;
  targetUrl: string;
  buttonText: string;
  tasks: Task[];
  rating?: number;
  downloads?: number;
}
