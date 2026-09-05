import { Section, FadeIn } from '../ui/Section';
import { useRestaurant } from '../../context/RestaurantContext';
import { Star, Quote } from 'lucide-react';

export function Reviews() {
  const { reviews: backendReviews } = useRestaurant();

  const defaultReviews = [
    {
      id: "r1",
      name: "তাহসান রহমান (Tahsan Rahman)",
      bengaliHighlight: "ছোটবেলার স্মৃতির মতো খাঁটি স্বাদ!",
      text: "A truly elevated experience of the food I grew up eating. The presentation is modern, but the flavors are authentically rooted in tradition.",
      date: "October 2025",
      rating: 5,
      published: true
    },
    {
      id: "r2",
      name: "নুসরাত জাহান (Nusrat Jahan)",
      bengaliHighlight: "কালো ভুনা আর কাচ্চি ছিল অসাধারণ।",
      text: "The Kosha Beef is extraordinary. The ambiance strikes a perfect balance between sophisticated and welcoming. A gem in Dhaka.",
      date: "September 2025",
      rating: 5,
      published: true
    },
    {
      id: "r3",
      name: "ইফতেখার আহমেদ (Iftekhar Ahmed)",
      bengaliHighlight: "বাঙালি খাবারের এমন রুচিশীল পরিবেশন খুব কম দেখেছি।",
      text: "Finally, a restaurant that treats Bangali cuisine with the editorial finesse it deserves. Every detail, from the plates to the service, is thoughtful.",
      date: "November 2025",
      rating: 5,
      published: true
    },
    {
      id: "r4",
      name: "সাবরিনা চৌধুরী (Sabrina Chowdhury)",
      bengaliHighlight: "ভাপা ইলিশের স্বাদ মনে গেঁথে থাকবে অনেকদিন।",
      text: "The Shorshe Ilish took me back home, while the dining room made me feel like I was somewhere entirely new. Beautiful concept.",
      date: "December 2025",
      rating: 5,
      published: true
    }
  ];

  const publishedReviews = (backendReviews && backendReviews.length > 0)
    ? backendReviews.filter(r => r.published !== false)
    : defaultReviews;

  const reviewsToDisplay = publishedReviews.length > 0 ? publishedReviews : defaultReviews;

  return (
    <Section id="reviews" className="bg-[#F2F1EC] py-16 md:py-24 border-t border-charcoal/5">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-10 md:mb-14">
          <span className="font-sans text-xs tracking-[0.25em] text-terracotta uppercase mb-2 block font-medium">
            GUEST STORIES · অতিথি বন্দনা
          </span>
          <h2 className="font-bengali text-3xl sm:text-4xl md:text-5xl text-charcoal font-medium mb-2 tracking-tight">
            ভালো কথাগুলো হৃদয়ে থেকে যায়।
          </h2>
          <p className="font-bengali text-xs sm:text-sm text-charcoal/60 max-w-md mx-auto">
            আমাদের টেবিলে অতিথিদের মুগ্ধতা ও আনন্দময় অভিজ্ঞতার কিছু মুহূর্ত
          </p>
          <div className="w-12 h-[1.5px] bg-terracotta mx-auto mt-4" />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {reviewsToDisplay.map((review, index) => {
            const initials = review.name
              .split(' ')
              .map(n => n[0])
              .filter(Boolean)
              .slice(0, 2)
              .join('')
              .toUpperCase() || 'K';

            const rating = review.rating || 5;

            return (
              <FadeIn 
                key={review.id} 
                delay={index * 0.1} 
                className="flex flex-col bg-ivory p-6 sm:p-7 border border-charcoal/10 shadow-2xs hover:shadow-md transition-shadow duration-300 relative group"
              >
                <div className="flex items-center justify-between mb-3">
                  {/* Star indicators */}
                  <div className="flex items-center gap-1 text-terracotta">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={13} 
                        fill={i < rating ? "currentColor" : "none"} 
                        stroke={i < rating ? "none" : "currentColor"}
                        className={i < rating ? "text-terracotta" : "text-charcoal/20"}
                      />
                    ))}
                  </div>
                  <Quote size={18} className="text-terracotta/30 group-hover:text-terracotta/60 transition-colors" />
                </div>

                {review.bengaliHighlight && (
                  <p className="font-bengali text-sm sm:text-base font-semibold text-charcoal mb-2">
                    &ldquo;{review.bengaliHighlight}&rdquo;
                  </p>
                )}

                <p className="font-serif text-sm sm:text-base text-charcoal/80 leading-relaxed mb-6 flex-1 font-light italic">
                  {review.text}
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-charcoal/10">
                  <div className="w-8 h-8 rounded-full bg-terracotta/10 text-terracotta font-sans text-xs font-semibold flex items-center justify-center tracking-wider shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="font-sans text-xs tracking-[0.15em] text-charcoal font-medium uppercase">
                      {review.name}
                    </p>
                    <p className="font-sans text-[10px] tracking-wider text-charcoal/40 font-mono">
                      {review.date}
                    </p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
