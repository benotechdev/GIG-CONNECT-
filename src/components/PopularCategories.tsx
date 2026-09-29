import React from 'react';
import {
  Mic2,
  Sparkles,
  Flame,
  Compass,
  Trophy,
  GraduationCap,
  Smile,
  Lightbulb,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { formatCompactUGX } from '../utils/formatters';
import { useApp } from '../context/AppContext';

interface PopularCategoriesProps {
  onSelectCategory?: (categoryName: string) => void;
}

export const PopularCategories: React.FC<PopularCategoriesProps> = ({ onSelectCategory }) => {
  const { setCurrentView } = useApp();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mic2':
        return <Mic2 className="w-5 h-5 text-amber-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-red-500" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-emerald-500" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-blue-500" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-indigo-500" />;
      case 'Smile':
        return <Smile className="w-5 h-5 text-yellow-500" />;
      case 'Lightbulb':
        return <Lightbulb className="w-5 h-5 text-amber-500" />;
      case 'Layers':
      default:
        return <Layers className="w-5 h-5 text-teal-500" />;
    }
  };

  const handleClickCategory = (name: string) => {
    if (onSelectCategory) {
      onSelectCategory(name);
    }
    setCurrentView('events');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs font-bold uppercase tracking-wider mb-2.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Browse by Vibe & Interest</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Popular Categories
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-xl">
              From high-energy stadium concerts and lakeside trips to university galas and stand-up comedy.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCurrentView('events');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900 cursor-pointer self-start md:self-auto group"
          >
            <span>All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleClickCategory(cat.name)}
              className="group relative rounded-2xl p-5 border border-slate-200 hover:border-amber-400 bg-white hover:bg-slate-50/50 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="p-3 rounded-xl bg-slate-100 group-hover:bg-amber-100/60 transition-colors">
                  {getIcon(cat.iconName)}
                </div>

                <span className="text-xs font-bold text-slate-500 bg-slate-100 group-hover:bg-slate-200 px-2.5 py-1 rounded-full">
                  {cat.eventCount} Events
                </span>
              </div>

              <div className="mt-4">
                <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-blue-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  From{' '}
                  <span className="font-mono font-bold text-slate-800">
                    {cat.startingUgx === 0 ? 'Free' : formatCompactUGX(cat.startingUgx)}
                  </span>
                </span>

                <span className="font-bold text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
