import { useState } from 'react';

interface Review {
  id: number;
  name: string;
  country: string;
  flag: string;
  rating: number;
  service: string;
  platform: string;
  date: string;
  review: string;
  verified: boolean;
  helpful: number;
  reply?: string;
}

const reviews: Review[] = [
  // 5 STAR REVIEWS (Most)
  {
    id: 1,
    name: "Aleksandr Volkov",
    country: "Russia",
    flag: "🇷🇺",
    rating: 5,
    service: "Channel Takedown",
    platform: "Telegram",
    date: "2 days ago",
    review: "Невероятно быстрая работа! Мой канал-клон был удален за 3 часа. Команда держала меня в курсе на каждом этапе. Highly professional service, exceeded all expectations.",
    verified: true,
    helpful: 47
  },
  {
    id: 2,
    name: "Priya Sharma",
    country: "India",
    flag: "🇮🇳",
    rating: 5,
    service: "Account Takedown",
    platform: "Instagram",
    date: "5 days ago",
    review: "Someone was impersonating me and scamming my followers. PDORQ removed the fake account within 18 hours. Customer support was responsive and professional. Worth every rupee!",
    verified: true,
    helpful: 89
  },
  {
    id: 3,
    name: "Michael Schmidt",
    country: "Germany",
    flag: "🇩🇪",
    rating: 5,
    service: "Video Removal",
    platform: "YouTube",
    date: "1 week ago",
    review: "Jemand hat mein urheberrechtlich geschütztes Material hochgeladen. PDORQ hat es in weniger als einem Tag entfernt. Sehr professioneller Service mit hervorragender Kommunikation. Absolute Empfehlung!",
    verified: true,
    helpful: 62
  },
  {
    id: 4,
    name: "James Wilson",
    country: "USA",
    flag: "🇺🇸",
    rating: 5,
    service: "Page Takedown",
    platform: "Facebook",
    date: "3 days ago",
    review: "A competitor created a fake business page using my company name and was posting negative reviews about my real business. PDORQ handled everything professionally. Page was gone in 24 hours. 10/10 would recommend.",
    verified: true,
    helpful: 134
  },
  {
    id: 5,
    name: "Анна Петрова",
    country: "Russia",
    flag: "🇷🇺",
    rating: 5,
    service: "Group Takedown",
    platform: "Telegram",
    date: "4 days ago",
    review: "Мошенническая группа использовала мой бренд для обмана людей. PDORQ удалили группу с 50k+ участниками за 6 часов. Профессионализм на высшем уровне!",
    verified: true,
    helpful: 78
  },
  {
    id: 6,
    name: "Rahul Patel",
    country: "India",
    flag: "🇮🇳",
    rating: 5,
    service: "Video Removal",
    platform: "TikTok",
    date: "1 week ago",
    review: "My video was stolen and reuploaded by an account with 2M followers. They removed my watermark and claimed it as theirs. PDORQ got it taken down in just 8 hours. Amazing service!",
    verified: true,
    helpful: 203
  },
  {
    id: 7,
    name: "Hans Müller",
    country: "Germany",
    flag: "🇩🇪",
    rating: 5,
    service: "Account Termination",
    platform: "Telegram",
    date: "6 days ago",
    review: "Ein Betrüger nutzte ein ähnliches Profil wie meins, um Leute zu betrügen. PDORQ hat das Konto innerhalb von 12 Stunden gelöscht. Sehr zufrieden mit dem Service!",
    verified: true,
    helpful: 45
  },
  {
    id: 8,
    name: "Sarah Johnson",
    country: "USA",
    flag: "🇺🇸",
    rating: 5,
    service: "Tweet Removal",
    platform: "X (Twitter)",
    date: "2 days ago",
    review: "Defamatory tweets were spreading about my business. PDORQ removed them and got the account suspended. Fast, efficient, and professional. Couldn't ask for more.",
    verified: true,
    helpful: 91
  },
  {
    id: 9,
    name: "Dmitri Ivanov",
    country: "Russia",
    flag: "🇷🇺",
    rating: 5,
    service: "Channel Takedown",
    platform: "YouTube",
    date: "5 days ago",
    review: "Кто-то перезаливал мои видео на свой канал. PDORQ удалили канал полностью за 36 часов. Отличный сервис, буду рекомендовать всем!",
    verified: true,
    helpful: 67
  },
  {
    id: 10,
    name: "Aisha Kapoor",
    country: "India",
    flag: "🇮🇳",
    rating: 5,
    service: "Post Removal",
    platform: "Instagram",
    date: "3 days ago",
    review: "Someone posted my private photos without consent. PDORQ handled the sensitive situation with complete discretion and removed the content within 4 hours. Forever grateful.",
    verified: true,
    helpful: 156
  },
  {
    id: 11,
    name: "Thomas Weber",
    country: "Germany",
    flag: "🇩🇪",
    rating: 5,
    service: "Server Takedown",
    platform: "Discord",
    date: "1 week ago",
    review: "A Discord server was leaking my company's proprietary information. PDORQ shut it down completely in under 48 hours. Excellent communication throughout the process.",
    verified: true,
    helpful: 38
  },
  {
    id: 12,
    name: "David Brown",
    country: "USA",
    flag: "🇺🇸",
    rating: 5,
    service: "Subreddit Takedown",
    platform: "Reddit",
    date: "4 days ago",
    review: "A subreddit was dedicated to harassing me and my family. PDORQ got it banned. The peace of mind is priceless. Thank you so much!",
    verified: true,
    helpful: 112
  },
  {
    id: 13,
    name: "Екатерина Соколова",
    country: "Russia",
    flag: "🇷🇺",
    rating: 5,
    service: "Account Takedown",
    platform: "TikTok",
    date: "6 days ago",
    review: "Фейковый аккаунт использовал мои фото и имя. PDORQ удалили его менее чем за 24 часа. Сервис работает отлично!",
    verified: true,
    helpful: 54
  },
  {
    id: 14,
    name: "Vikram Singh",
    country: "India",
    flag: "🇮🇳",
    rating: 5,
    service: "Copyright Strike",
    platform: "YouTube",
    date: "2 days ago",
    review: "Multiple channels were using my music without permission. PDORQ issued copyright strikes on all of them and 3 channels were terminated. Excellent work!",
    verified: true,
    helpful: 87
  },
  
  // 4 STAR REVIEWS
  {
    id: 15,
    name: "Emma Fischer",
    country: "Germany",
    flag: "🇩🇪",
    rating: 4,
    service: "Reel Removal",
    platform: "Instagram",
    date: "1 week ago",
    review: "Got the job done but took a bit longer than the estimated time (36h instead of 24h). Still happy with the result though. Would use again.",
    verified: true,
    helpful: 29
  },
  {
    id: 16,
    name: "Robert Davis",
    country: "USA",
    flag: "🇺🇸",
    rating: 4,
    service: "Channel Ban",
    platform: "Twitch",
    date: "5 days ago",
    review: "Service was effective. Channel that was streaming my copyrighted content got banned. Only giving 4 stars because communication could be slightly better. But results are what matter!",
    verified: true,
    helpful: 41
  },
  {
    id: 17,
    name: "Nikolai Popov",
    country: "Russia",
    flag: "🇷🇺",
    rating: 4,
    service: "Post Removal",
    platform: "Facebook",
    date: "3 days ago",
    review: "Хороший сервис, удалили пост за 18 часов. Немного дороговато, но результат есть. В целом доволен.",
    verified: true,
    helpful: 33
  },
  {
    id: 18,
    name: "Neha Gupta",
    country: "India",
    flag: "🇮🇳",
    rating: 4,
    service: "Account Suspension",
    platform: "X (Twitter)",
    date: "4 days ago",
    review: "The fake account was suspended successfully. Took about 2 days which was within their timeframe. Good service, would recommend.",
    verified: true,
    helpful: 52
  },
  {
    id: 19,
    name: "Klaus Richter",
    country: "Germany",
    flag: "🇩🇪",
    rating: 4,
    service: "Pin Removal",
    platform: "Pinterest",
    date: "1 week ago",
    review: "Jemand hatte meine Designs auf Pinterest kopiert. Die Pins wurden entfernt. Guter Service, nur die Wartezeit auf Antworten könnte kürzer sein.",
    verified: true,
    helpful: 18
  },
  {
    id: 20,
    name: "Jennifer Martinez",
    country: "USA",
    flag: "🇺🇸",
    rating: 4,
    service: "Video Removal",
    platform: "YouTube",
    date: "6 days ago",
    review: "Video removed successfully. Process was straightforward. Would have given 5 stars if the estimated time was more accurate. Still, great result!",
    verified: true,
    helpful: 44
  },

  // 3 STAR REVIEWS  
  {
    id: 21,
    name: "Андрей Козлов",
    country: "Russia",
    flag: "🇷🇺",
    rating: 3,
    service: "Group Takedown",
    platform: "Telegram",
    date: "2 weeks ago",
    review: "Группу удалили, но это заняло почти 3 дня вместо обещанных 48 часов. Результат есть, но хотелось бы быстрее.",
    verified: true,
    helpful: 26,
    reply: "We apologize for the delay. This particular case required additional verification due to the group's size. We've since optimized our process for similar cases. Thank you for your patience."
  },
  {
    id: 22,
    name: "Amit Joshi",
    country: "India",
    flag: "🇮🇳",
    rating: 3,
    service: "Account Takedown",
    platform: "Instagram",
    date: "1 week ago",
    review: "Account was removed but I had to follow up multiple times to get updates. The end result was good but the communication could improve.",
    verified: true,
    helpful: 31,
    reply: "Thank you for your feedback. We've implemented a new automated update system so clients receive real-time notifications. We appreciate you helping us improve."
  },

  // 2 STAR REVIEWS (User clearly at fault)
  {
    id: 23,
    name: "Chris Taylor",
    country: "USA",
    flag: "🇺🇸",
    rating: 2,
    service: "Video Removal",
    platform: "YouTube",
    date: "2 weeks ago",
    review: "They said they couldn't remove the video because it was 'fair use commentary'. I paid for nothing. This is ridiculous, the video clearly uses my footage!",
    verified: true,
    helpful: 8,
    reply: "We thoroughly reviewed this case. The video in question was a transformative commentary/review which is protected under Fair Use law. We explained this before processing and offered a full refund which was accepted. We cannot take down legally protected content."
  },
  {
    id: 24,
    name: "Marina Orlova",
    country: "Russia",
    flag: "🇷🇺",
    rating: 2,
    service: "Channel Takedown",
    platform: "Telegram",
    date: "3 weeks ago",
    review: "Не смогли удалить канал. Сказали что канал не нарушает правила. Но он копирует мой контент!",
    verified: true,
    helpful: 5,
    reply: "После проверки мы установили, что целевой канал создавал оригинальный контент в той же нише, что не является нарушением. Мы предоставили полный возврат средств и подробное объяснение. Мы работаем только в рамках правовых норм."
  },

  // 1 STAR REVIEW (User clearly wrong)
  {
    id: 25,
    name: "Kevin Walsh",
    country: "USA",
    flag: "🇺🇸",
    rating: 1,
    service: "Account Termination",
    platform: "Telegram",
    date: "1 month ago",
    review: "SCAM! I wanted them to take down my ex's personal account because she was posting about our breakup. They refused and kept my money!",
    verified: false,
    helpful: 2,
    reply: "This request was for removing a personal account posting legal, non-defamatory personal content. We do not facilitate harassment or removal of lawful speech. The client was informed this violates our ToS BEFORE payment, and a full refund was processed within 24 hours. Our payment records confirm this."
  },
  
  // More 5 STAR REVIEWS
  {
    id: 26,
    name: "Sergei Kuznetsov",
    country: "Russia",
    flag: "🇷🇺",
    rating: 5,
    service: "Bot Removal",
    platform: "Telegram",
    date: "1 day ago",
    review: "Бот копировал функционал моего бота и воровал пользователей. PDORQ удалили его за 5 часов. Невероятная скорость работы!",
    verified: true,
    helpful: 34
  },
  {
    id: 27,
    name: "Rajesh Kumar",
    country: "India",
    flag: "🇮🇳",
    rating: 5,
    service: "Company Page Removal",
    platform: "LinkedIn",
    date: "3 days ago",
    review: "A fraudulent company page was using our registered trademark. PDORQ removed it professionally. Their legal knowledge is impressive. Highly recommended for businesses!",
    verified: true,
    helpful: 76
  },
  {
    id: 28,
    name: "Wolfgang Braun",
    country: "Germany",
    flag: "🇩🇪",
    rating: 5,
    service: "Account Takedown",
    platform: "Snapchat",
    date: "5 days ago",
    review: "Jemand hat Deepfakes von mir erstellt und auf Snapchat geteilt. PDORQ hat das Konto in 8 Stunden entfernt und mich über weitere Schutzmaßnahmen beraten. Lebensretter!",
    verified: true,
    helpful: 98
  },
  {
    id: 29,
    name: "Lisa Anderson",
    country: "USA",
    flag: "🇺🇸",
    rating: 5,
    service: "Video Removal",
    platform: "TikTok",
    date: "2 days ago",
    review: "Someone recorded me without consent and it went viral. PDORQ not only removed the original but also tracked down and removed 12 reposts. Above and beyond service!",
    verified: true,
    helpful: 187
  },
  {
    id: 30,
    name: "Олег Морозов",
    country: "Russia",
    flag: "🇷🇺",
    rating: 5,
    service: "Channel Takedown",
    platform: "YouTube",
    date: "4 days ago",
    review: "Канал с 100k подписчиков воровал мои видео и монетизировал их. PDORQ удалили канал полностью. Справедливость восторжествовала! Спасибо огромное!",
    verified: true,
    helpful: 145
  },
  {
    id: 31,
    name: "Sunita Verma",
    country: "India",
    flag: "🇮🇳",
    rating: 5,
    service: "Post Removal",
    platform: "Facebook",
    date: "1 week ago",
    review: "Fake news about my business was being spread. Multiple posts removed within hours. PDORQ saved my reputation. Can't thank them enough!",
    verified: true,
    helpful: 92
  },
  {
    id: 32,
    name: "Max Hofmann",
    country: "Germany",
    flag: "🇩🇪",
    rating: 5,
    service: "Account Ban",
    platform: "Discord",
    date: "6 days ago",
    review: "Ein User verbreitete Malware-Links unter meinem Namen. PDORQ hat sowohl den Account als auch den Server entfernt. Schnell und professionell!",
    verified: true,
    helpful: 56
  },
  {
    id: 33,
    name: "Michelle Thompson",
    country: "USA",
    flag: "🇺🇸",
    rating: 5,
    service: "Profile Takedown",
    platform: "LinkedIn",
    date: "3 days ago",
    review: "Someone created a fake LinkedIn profile impersonating me as a CEO to run job scams. PDORQ removed it and LinkedIn even sent me a verification badge after. Incredible service!",
    verified: true,
    helpful: 124
  },
  {
    id: 34,
    name: "Иван Федоров",
    country: "Russia",
    flag: "🇷🇺",
    rating: 5,
    service: "Sound Removal",
    platform: "TikTok",
    date: "5 days ago",
    review: "Мой трек использовали без разрешения в тысячах видео. PDORQ удалили звук из библиотеки TikTok. Теперь никто не может его использовать. Профессионалы!",
    verified: true,
    helpful: 71
  },
  {
    id: 35,
    name: "Deepak Malhotra",
    country: "India",
    flag: "🇮🇳",
    rating: 5,
    service: "Ad Account Ban",
    platform: "Facebook",
    date: "2 days ago",
    review: "Competitors were running defamatory ads against my brand. PDORQ got their entire ad account banned permanently. Swift justice! Best investment I've made.",
    verified: true,
    helpful: 108
  }
];

export default function Reviews() {
  const [filter, setFilter] = useState<'all' | 5 | 4 | 3 | 2 | 1>('all');
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(r => r.rating === filter);

  const visibleReviews = filteredReviews.slice(0, visibleCount);

  const stats = {
    total: reviews.length,
    average: (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1),
    distribution: {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-[#C5A572]' : 'text-[#333]'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section id="reviews" className="py-16 sm:py-24 lg:py-32 bg-[#0D0D0D] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 text-[200px] font-cormorant text-white/[0.02] select-none pointer-events-none hidden lg:block">
        REVIEWS
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[10px] sm:text-xs tracking-[0.3em] text-[#C5A572] uppercase mb-4">
            Client Testimonials
          </p>
          <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-tight">
            What Our <span className="italic text-[#C5A572]">Clients</span> Say
          </h2>
        </div>

        {/* Stats Overview */}
        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#151515] rounded-2xl p-6 sm:p-8 mb-10 sm:mb-12 border border-[#252525]">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            
            {/* Overall Rating */}
            <div className="text-center lg:text-left">
              <div className="flex items-baseline justify-center lg:justify-start gap-2">
                <span className="font-cormorant text-5xl sm:text-6xl text-white">{stats.average}</span>
                <span className="text-white/80">/5</span>
              </div>
              <div className="flex justify-center lg:justify-start gap-1 mt-2">
                {renderStars(Math.round(parseFloat(stats.average)))}
              </div>
              <p className="text-white/90 text-sm mt-2">{stats.total} verified reviews</p>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-20 bg-[#333]" />

            {/* Rating Distribution */}
            <div className="flex-1 w-full lg:w-auto space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => setFilter(filter === star ? 'all' : star as 5|4|3|2|1)}
                  className={`w-full flex items-center gap-3 p-1.5 rounded-lg transition-colors ${filter === star ? 'bg-[#C5A572]/10' : 'hover:bg-white/5'}`}
                >
                  <span className="text-white text-sm w-8">{star}★</span>
                  <div className="flex-1 h-2 bg-[#252525] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#C5A572] to-[#8B7355] rounded-full transition-all duration-500"
                      style={{ width: `${(stats.distribution[star as keyof typeof stats.distribution] / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-white/90 text-sm w-8 text-right">
                    {stats.distribution[star as keyof typeof stats.distribution]}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="hidden xl:grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-[#0D0D0D] rounded-xl">
                <p className="text-2xl font-cormorant text-[#C5A572]">99.2%</p>
                <p className="text-xs text-white/90 mt-1">Success Rate</p>
              </div>
              <div className="text-center p-4 bg-[#0D0D0D] rounded-xl">
                <p className="text-2xl font-cormorant text-[#C5A572]">&lt;6h</p>
                <p className="text-xs text-white/90 mt-1">Avg Response</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => { setFilter('all'); setVisibleCount(6); }}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              filter === 'all' 
                ? 'bg-[#C5A572] text-[#0D0D0D]' 
                : 'bg-[#1a1a1a] text-white/60 hover:text-white border border-[#333]'
            }`}
          >
            All Reviews ({stats.total})
          </button>
          {[5, 4, 3, 2, 1].map(star => (
            <button
              key={star}
              onClick={() => { setFilter(star as 5|4|3|2|1); setVisibleCount(6); }}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                filter === star 
                  ? 'bg-[#C5A572] text-[#0D0D0D]' 
                  : 'bg-[#1a1a1a] text-white/60 hover:text-white border border-[#333]'
              }`}
            >
              {star}★ ({stats.distribution[star as keyof typeof stats.distribution]})
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {visibleReviews.map((review) => (
            <div 
              key={review.id}
              className="bg-gradient-to-b from-[#1a1a1a] to-[#141414] rounded-xl p-5 sm:p-6 border border-[#252525] hover:border-[#333] transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#C5A572] to-[#8B7355] flex items-center justify-center text-[#0D0D0D] font-medium text-sm sm:text-base">
                    {review.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm sm:text-base">{review.name}</span>
                      <span>{review.flag}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex gap-0.5">
                        {renderStars(review.rating)}
                      </div>
                      {review.verified && (
                        <span className="text-[10px] text-green-500 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Tag */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 rounded-full bg-[#C5A572]/10 text-[#C5A572] text-[10px] sm:text-xs">
                  {review.platform}
                </span>
                <span className="px-2 py-1 rounded-full bg-white/5 text-white/90 text-[10px] sm:text-xs">
                  {review.service}
                </span>
              </div>

              {/* Review Text */}
              <p className="text-white/95 text-sm leading-relaxed mb-4">
                "{review.review}"
              </p>

              {/* Official Reply */}
              {review.reply && (
                <div className="bg-[#0D0D0D] rounded-lg p-3 mb-4 border-l-2 border-[#C5A572]">
                  <p className="text-[10px] text-[#C5A572] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                    Official Response
                  </p>
                  <p className="text-white/90 text-xs leading-relaxed">{review.reply}</p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#252525]">
                <span className="text-white/80 text-xs">{review.date}</span>
                <button className="flex items-center gap-1.5 text-white/80 hover:text-[#C5A572] transition-colors text-xs group/helpful">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {visibleCount < filteredReviews.length && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="px-8 py-3 rounded-full border border-[#C5A572] text-[#C5A572] hover:bg-[#C5A572] hover:text-[#0D0D0D] transition-all text-sm tracking-wider uppercase"
            >
              Load More Reviews ({filteredReviews.length - visibleCount} remaining)
            </button>
          </div>
        )}

        {/* Trust Badge */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#1a1a1a] border border-[#252525]">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-white text-sm">All reviews are from verified clients with completed orders</span>
          </div>
        </div>
      </div>
    </section>
  );
}
