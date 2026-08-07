import React from 'react';
import { Youtube, Instagram, Facebook, Twitter, Link2, Send, MessageCircle, Gamepad2, Twitch, MessageSquare, Phone, Ghost } from 'lucide-react';
import { PlatformId } from './types';

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 448 512" fill="currentColor">
    <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/>
  </svg>
);

export const platforms: { id: PlatformId; name: string; icon: React.ReactNode; actions: string[] }[] = [
  { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-6 h-6 text-red-500" />, actions: ['Abone Ol', 'İzle ve Beğen', 'Beğen', 'İzle', 'İzle + Beğen + Hype'] },
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-6 h-6 text-pink-500" />, actions: ['Takip Et', 'Beğen', 'Yorum Yap'] },
  { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-6 h-6 text-blue-600" />, actions: ['Takip Et', 'Beğen', 'Paylaş'] },
  { id: 'twitter', name: 'Twitter', icon: <Twitter className="w-6 h-6 text-sky-500" />, actions: ['Takip Et', 'Retweetle', 'Beğen'] },
  { id: 'tiktok', name: 'TikTok', icon: <TiktokIcon className="w-5 h-5 text-zinc-100" />, actions: ['Takip Et', 'Beğen', 'İzle'] },
  { id: 'linkedin', name: 'LinkedIn', icon: <Link2 className="w-6 h-6 text-blue-500" />, actions: ['Takip Et', 'Bağlantı Kur'] },
  { id: 'telegram', name: 'Telegram', icon: <Send className="w-6 h-6 text-blue-400" />, actions: ['Kanala Katıl', 'Gruba Katıl'] },
  { id: 'discord', name: 'Discord', icon: <Gamepad2 className="w-6 h-6 text-indigo-500" />, actions: ['Sunucuya Katıl'] },
  { id: 'twitch', name: 'Twitch', icon: <Twitch className="w-6 h-6 text-purple-500" />, actions: ['Takip Et', 'Abone Ol'] },
  { id: 'reddit', name: 'Reddit', icon: <MessageSquare className="w-6 h-6 text-orange-500" />, actions: ['Topluluğa Katıl', 'Oyla'] },
  { id: 'whatsapp', name: 'WhatsApp', icon: <Phone className="w-6 h-6 text-green-500" />, actions: ['Gruba Katıl'] },
  { id: 'snapchat', name: 'Snapchat', icon: <Ghost className="w-6 h-6 text-yellow-400" />, actions: ['Arkadaş Ekle', 'Abone Ol'] },
];

export const MAX_TASKS = 15;
