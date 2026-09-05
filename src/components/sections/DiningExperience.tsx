import { motion } from 'motion/react';
import { Section, FadeIn } from '../ui/Section';

export function DiningExperience() {
  const experiences = [
    {
      num: "০১",
      bengaliTitle: "এসো ক্ষুধা নিয়ে",
      englishTitle: "COME HUNGRY",
      bengaliDesc: "ভরপেট আহার আর মন ভরে যাওয়া তৃপ্তি। নিখুঁত পোলাও, চিনিগুঁড়া চালের সুবাস আর ঘিয়ে ভাজা মসলার ঘ্রাণে স্বাগত জানাই।",
      englishDesc: "Generous plates crafted for genuine cravings. Rich, slow-simmered gravies and fragrant grains."
    },
    {
      num: "০২",
      bengaliTitle: "একটু থাকো",
      englishTitle: "STAY A WHILE",
      bengaliDesc: "প্রিয়জনদের সাথে আড্ডা, ঘরোয়া গল্প আর মৃদু আলোছায়ার শান্ত কোণে কাটুক সোনালী সময়।",
      englishDesc: "A warm, atmospheric table for heartfelt conversations, quiet laughter, and evening intimacy."
    },
    {
      num: "০৩",
      bengaliTitle: "আবার এসো",
      englishTitle: "COME BACK",
      bengaliDesc: "চিরচেনা সেই মায়াবী স্বাদ ও পরম যত্ন, যা আপনাকে বারবার আমাদের দরজায় ফিরিয়ে আনবে।",
      englishDesc: "Timeless flavours, respectful hospitality, and a welcoming seat always waiting for you."
    }
  ];

  return (
    <Section id="experience" className="bg-[#12110F] text-ivory py-24 sm:py-32 md:py-40 relative overflow-hidden border-t border-ivory/10">
      {/* Warm Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-terracotta/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1920px] mx-auto relative z-10">
        
        {/* Header */}
        <FadeIn className="max-w-3xl mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-[1.5px] bg-terracotta" />
            <span className="font-sans text-xs tracking-[0.3em] text-terracotta uppercase font-medium">
              THE KANSARI RITUAL · আতিথেয়তার ধারা
            </span>
          </div>
          <h2 className="font-bengali text-3xl sm:text-5xl lg:text-6xl text-ivory font-medium tracking-tight mb-4">
            একটি নিখুঁত ভোজের অভিজ্ঞতা।
          </h2>
          <p className="font-bengali text-ivory/70 text-base sm:text-lg max-w-xl font-light">
            খাবার কেবল ক্ষুধা মেটানোর জন্য নয়—এটি তৃপ্তি, শান্তি এবং সান্নিধ্যের এক মধুর আয়োজন।
          </p>
        </FadeIn>

        {/* Editorial Vertical Flow Steps */}
        <div className="space-y-12 sm:space-y-16">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-baseline border-b border-ivory/15 pb-12 sm:pb-16 group"
            >
              {/* Step Number (Col 1-2) */}
              <div className="lg:col-span-2 flex items-center gap-3">
                <span className="font-serif text-3xl sm:text-4xl text-terracotta/80 font-light">
                  {exp.num}
                </span>
                <div className="w-8 h-[1px] bg-ivory/20 group-hover:w-16 group-hover:bg-terracotta transition-all duration-500" />
              </div>

              {/* Title Bilingual (Col 3-6) */}
              <div className="lg:col-span-4 space-y-1">
                <h3 className="font-bengali text-3xl sm:text-4xl lg:text-5xl text-ivory font-medium group-hover:text-terracotta transition-colors duration-300">
                  {exp.bengaliTitle}
                </h3>
                <span className="font-sans text-xs tracking-[0.25em] text-ivory/40 uppercase block">
                  {exp.englishTitle}
                </span>
              </div>

              {/* Narrative Content (Col 7-12) */}
              <div className="lg:col-span-6 space-y-2">
                <p className="font-bengali text-base sm:text-lg text-ivory/85 leading-relaxed font-normal">
                  {exp.bengaliDesc}
                </p>
                <p className="font-serif text-xs sm:text-sm text-ivory/50 leading-relaxed font-light italic">
                  {exp.englishDesc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </Section>
  );
}
