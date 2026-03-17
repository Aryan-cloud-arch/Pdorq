interface BlogPageProps {
  onNavigate: (page: string) => void;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to Protect Your Brand from Impersonation on Social Media',
    excerpt: 'Learn the essential steps to safeguard your brand identity across social platforms and what to do when impersonators strike.',
    category: 'Brand Protection',
    date: 'March 15, 2026',
    readTime: '5 min read',
    image: '🛡️',
    featured: true
  },
  {
    id: '2',
    title: 'Understanding DMCA Takedown Notices: A Complete Guide',
    excerpt: 'Everything you need to know about DMCA takedown notices, how they work, and when to use them to protect your content.',
    category: 'Legal',
    date: 'March 12, 2026',
    readTime: '8 min read',
    image: '⚖️'
  },
  {
    id: '3',
    title: '2026 Social Media Copyright Trends: What Content Creators Need to Know',
    excerpt: 'The landscape of digital copyright is evolving. Here are the key trends and changes affecting content creators this year.',
    category: 'Industry News',
    date: 'March 10, 2026',
    readTime: '6 min read',
    image: '📊'
  },
  {
    id: '4',
    title: 'Telegram Channel Takedowns: Success Stories from Our Clients',
    excerpt: 'Real case studies of how we helped businesses and individuals remove harmful Telegram channels affecting their reputation.',
    category: 'Case Studies',
    date: 'March 8, 2026',
    readTime: '4 min read',
    image: '✓'
  },
  {
    id: '5',
    title: 'The Rise of AI-Generated Content: New Challenges in Content Protection',
    excerpt: 'As AI-generated content becomes more prevalent, new challenges emerge for content protection. Here\'s what you need to know.',
    category: 'Industry News',
    date: 'March 5, 2026',
    readTime: '7 min read',
    image: '🤖'
  },
  {
    id: '6',
    title: 'Instagram\'s New Reporting System: What Changed in 2026',
    excerpt: 'Instagram updated their content reporting and takedown procedures. We break down what these changes mean for you.',
    category: 'Platform Updates',
    date: 'March 1, 2026',
    readTime: '5 min read',
    image: '📱'
  },
];

const categories = ['All', 'Brand Protection', 'Legal', 'Industry News', 'Case Studies', 'Platform Updates'];

export default function BlogPage({ onNavigate }: BlogPageProps) {
  const featuredPost = blogPosts.find(p => p.featured);
  const regularPosts = blogPosts.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-20">
      {/* Hero */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-black/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-xs sm:text-sm tracking-[0.3em] text-[#C5A572] uppercase mb-4">
            Insights & Updates
          </div>
          <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl text-[#0D0D0D] mb-6">
            The PDORQ <span className="italic">Blog</span>
          </h1>
          <p className="font-outfit text-black/60 max-w-2xl mx-auto">
            Industry insights, platform updates, and expert advice on content protection and digital rights management.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 text-xs tracking-wider uppercase rounded-full bg-white border border-black/10 text-black/70 hover:border-[#C5A572] hover:text-[#C5A572] transition-all font-outfit"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-[#0D0D0D] rounded-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-8 p-8 sm:p-12">
                <div className="flex items-center justify-center text-[100px] sm:text-[150px]">
                  {featuredPost.image}
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-[#C5A572]/20 text-[#C5A572] rounded-full text-xs font-outfit">
                      Featured
                    </span>
                    <span className="text-xs text-white/40 font-outfit">{featuredPost.category}</span>
                  </div>
                  <h2 className="font-cormorant text-2xl sm:text-3xl lg:text-4xl text-white mb-4 leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="font-outfit text-white/60 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-white/40 font-outfit">
                      <span>{featuredPost.date}</span>
                      <span>•</span>
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <button className="px-6 py-2 border border-[#C5A572] text-[#C5A572] rounded-full text-sm font-outfit hover:bg-[#C5A572] hover:text-[#0D0D0D] transition-all">
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {regularPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl border border-black/5 overflow-hidden hover:shadow-lg hover:border-[#C5A572]/30 transition-all duration-500 group cursor-pointer"
              >
                <div className="aspect-[3/2] bg-gradient-to-br from-[#C5A572]/10 to-[#C5A572]/5 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500">
                  {post.image}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-[#C5A572] font-outfit">{post.category}</span>
                    <span className="text-xs text-black/30">•</span>
                    <span className="text-xs text-black/40 font-outfit">{post.readTime}</span>
                  </div>
                  <h3 className="font-cormorant text-xl text-[#0D0D0D] mb-3 leading-snug group-hover:text-[#C5A572] transition-colors">
                    {post.title}
                  </h3>
                  <p className="font-outfit text-sm text-black/60 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-black/40 font-outfit">{post.date}</span>
                    <span className="text-[#C5A572] text-sm font-outfit group-hover:translate-x-1 transition-transform">
                      Read →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 border border-black/10 text-black/70 rounded-full font-outfit hover:border-[#C5A572] hover:text-[#C5A572] transition-all">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 sm:py-20 bg-[#0D0D0D]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-cormorant text-3xl sm:text-4xl text-white mb-4">
            Never Miss an <span className="italic text-[#C5A572]">Update</span>
          </h2>
          <p className="font-outfit text-white/60 mb-8">
            Subscribe to our newsletter for the latest industry insights and platform updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 font-outfit focus:border-[#C5A572] outline-none"
            />
            <button className="px-6 py-3 bg-[#C5A572] text-[#0D0D0D] font-outfit font-medium rounded-lg hover:bg-[#D4AF37] transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-8 bg-[#FAF9F6]">
        <div className="text-center">
          <button
            onClick={() => onNavigate('home')}
            className="font-outfit text-sm text-black/60 hover:text-[#C5A572] transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </section>
    </div>
  );
}
