import { Platform, Currency } from '../types';

export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rate: 1 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', rate: 92 },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rate: 0.86 },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rate: 0.75 },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺', rate: 83 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪', rate: 3.67 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳', rate: 6.88 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', rate: 157 },
];

export const platforms: Platform[] = [
  {
    id: 'telegram',
    name: 'Telegram',
    color: '#229ED9',
    services: [
      { id: 'tg-channel', name: 'Channel Takedown', description: 'Remove public/private channels', tat: '2-24h', price: 199, discount: 85 },
      { id: 'tg-group', name: 'Group Takedown', description: 'Terminate group chats', tat: '4-48h', price: 149, discount: 80 },
      { id: 'tg-account', name: 'Account Termination', description: 'Ban user accounts permanently', tat: '6-72h', price: 129, discount: 78 },
      { id: 'tg-bot', name: 'Bot Removal', description: 'Disable malicious bots', tat: '12-48h', price: 79, discount: 70 },
    ]
  },
  {
    id: 'instagram',
    name: 'Instagram',
    color: '#E4405F',
    services: [
      { id: 'ig-post', name: 'Post Removal', description: 'Delete specific posts', tat: '6-24h', price: 49, discount: 70 },
      { id: 'ig-story', name: 'Story Removal', description: 'Remove active stories', tat: '2-12h', price: 39, discount: 65 },
      { id: 'ig-reel', name: 'Reel Removal', description: 'Take down reels content', tat: '6-36h', price: 69, discount: 72 },
      { id: 'ig-account', name: 'Account Takedown', description: 'Full account termination', tat: '24-96h', price: 299, discount: 88 },
    ]
  },
  {
    id: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    services: [
      { id: 'yt-video', name: 'Video Removal', description: 'Remove specific videos', tat: '12-48h', price: 129, discount: 78 },
      { id: 'yt-channel', name: 'Channel Takedown', description: 'Terminate entire channels', tat: '48-120h', price: 449, discount: 87 },
      { id: 'yt-copyright', name: 'Copyright Strike', description: 'File copyright claims', tat: '24-72h', price: 179, discount: 80 },
      { id: 'yt-comment', name: 'Comment Removal', description: 'Remove harmful comments', tat: '6-24h', price: 29, discount: 62 },
      { id: 'yt-shorts', name: 'Shorts Removal', description: 'Take down shorts content', tat: '12-36h', price: 89, discount: 72 },
    ]
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    color: '#000000',
    services: [
      { id: 'tt-video', name: 'Video Removal', description: 'Remove specific videos', tat: '6-24h', price: 59, discount: 68 },
      { id: 'tt-account', name: 'Account Takedown', description: 'Full account termination', tat: '24-72h', price: 249, discount: 85 },
      { id: 'tt-sound', name: 'Sound Removal', description: 'Remove audio tracks', tat: '12-48h', price: 119, discount: 76 },
      { id: 'tt-live', name: 'Live Ban', description: 'Revoke live streaming access', tat: '12-36h', price: 149, discount: 80 },
    ]
  },
  {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    services: [
      { id: 'fb-post', name: 'Post Removal', description: 'Delete specific posts', tat: '6-24h', price: 49, discount: 65 },
      { id: 'fb-page', name: 'Page Takedown', description: 'Remove business/public pages', tat: '48-96h', price: 349, discount: 86 },
      { id: 'fb-account', name: 'Account Termination', description: 'Full account removal', tat: '24-72h', price: 249, discount: 82 },
      { id: 'fb-group', name: 'Group Removal', description: 'Terminate Facebook groups', tat: '24-72h', price: 279, discount: 84 },
      { id: 'fb-ad', name: 'Ad Account Ban', description: 'Disable advertising access', tat: '12-48h', price: 199, discount: 78 },
    ]
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    services: [
      { id: 'li-post', name: 'Post Removal', description: 'Delete specific posts', tat: '12-36h', price: 59, discount: 68 },
      { id: 'li-profile', name: 'Profile Takedown', description: 'Remove user profiles', tat: '48-96h', price: 349, discount: 85 },
      { id: 'li-company', name: 'Company Page Removal', description: 'Take down company pages', tat: '72-144h', price: 549, discount: 90 },
      { id: 'li-article', name: 'Article Removal', description: 'Remove published articles', tat: '24-48h', price: 99, discount: 72 },
    ]
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    color: '#000000',
    services: [
      { id: 'tw-tweet', name: 'Tweet Removal', description: 'Delete specific tweets', tat: '6-24h', price: 39, discount: 62 },
      { id: 'tw-account', name: 'Account Suspension', description: 'Suspend user accounts', tat: '24-72h', price: 229, discount: 83 },
      { id: 'tw-media', name: 'Media Removal', description: 'Remove images/videos', tat: '6-24h', price: 49, discount: 67 },
      { id: 'tw-space', name: 'Space Termination', description: 'End live audio spaces', tat: '2-12h', price: 99, discount: 74 },
    ]
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    color: '#FFFC00',
    services: [
      { id: 'sc-account', name: 'Account Takedown', description: 'Full account termination', tat: '24-72h', price: 229, discount: 82 },
      { id: 'sc-story', name: 'Public Story Removal', description: 'Remove public stories', tat: '12-36h', price: 119, discount: 76 },
      { id: 'sc-spotlight', name: 'Spotlight Removal', description: 'Take down spotlight content', tat: '12-48h', price: 139, discount: 78 },
    ]
  },
  {
    id: 'discord',
    name: 'Discord',
    color: '#5865F2',
    services: [
      { id: 'dc-server', name: 'Server Takedown', description: 'Remove entire servers', tat: '24-72h', price: 329, discount: 85 },
      { id: 'dc-account', name: 'Account Ban', description: 'Ban user accounts', tat: '12-48h', price: 149, discount: 78 },
      { id: 'dc-bot', name: 'Bot Removal', description: 'Disable malicious bots', tat: '12-36h', price: 79, discount: 68 },
    ]
  },
  {
    id: 'twitch',
    name: 'Twitch',
    color: '#9146FF',
    services: [
      { id: 'twitch-channel', name: 'Channel Ban', description: 'Permanently ban channels', tat: '48-96h', price: 399, discount: 87 },
      { id: 'twitch-vod', name: 'VOD Removal', description: 'Remove video on demand', tat: '12-36h', price: 119, discount: 76 },
      { id: 'twitch-clip', name: 'Clip Removal', description: 'Delete specific clips', tat: '6-24h', price: 59, discount: 66 },
    ]
  },
  {
    id: 'reddit',
    name: 'Reddit',
    color: '#FF4500',
    services: [
      { id: 'rd-post', name: 'Post Removal', description: 'Remove specific posts', tat: '6-24h', price: 39, discount: 62 },
      { id: 'rd-account', name: 'Account Ban', description: 'Ban user accounts', tat: '24-72h', price: 179, discount: 80 },
      { id: 'rd-subreddit', name: 'Subreddit Takedown', description: 'Remove entire subreddits', tat: '72-168h', price: 699, discount: 92 },
      { id: 'rd-comment', name: 'Comment Removal', description: 'Delete specific comments', tat: '6-24h', price: 29, discount: 60 },
    ]
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    color: '#E60023',
    services: [
      { id: 'pin-pin', name: 'Pin Removal', description: 'Remove specific pins', tat: '6-24h', price: 29, discount: 62 },
      { id: 'pin-board', name: 'Board Takedown', description: 'Remove entire boards', tat: '12-48h', price: 99, discount: 74 },
      { id: 'pin-account', name: 'Account Ban', description: 'Terminate accounts', tat: '24-72h', price: 179, discount: 80 },
    ]
  },
];
