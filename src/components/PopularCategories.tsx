import React from 'react';
import {
  Code,
  Palette,
  TrendingUp,
  PenTool,
  Calculator,
  ShieldCheck,
  Headphones,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { formatCompactUGX } from '../utils/formatters';
import { useApp } from '../context/AppContext';

interface PopularCategoriesProps {
  onSelectCategory: (categoryName: string) => void;
}

export const PopularCategories: React.FC<PopularCategoriesProps> = ({ onSelectCategory }) => {
  const { setCurrentView } = useApp();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return <Code className="w-6 h-6 text-blue-600" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-pink-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-emerald-600" />;
      case 'PenTool':
        return <PenTool className="w-6 h-6 text-amber-600" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6 text-purple-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-cyan-600" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6 text-orange-600" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-indigo-600" />;
      default:
        return <Code className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
              <span>EXPLORE EXPERTISE</span>
              <span className="w-6 h-0.5 bg-blue-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Categories
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Browse top-tier talent across high-demand Ugandan commercial sectors.
            </p>
          </div>

          <button
            onClick={() => {
              onSelectCategory('');
              setCurrentView('jobs');
            }}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-800 transition-colors cursor-pointer group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.name);
                setCurrentView('jobs');
              }}
              className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-4">
                  {getIcon(cat.iconName)}
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-slate-900">{cat.jobCount} open gigs</span>
                <span className="text-slate-500">
                  from <strong className="text-blue-700 font-bold">{formatCompactUGX(cat.startingUgx)}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
