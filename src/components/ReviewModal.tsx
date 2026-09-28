import React, { useState } from 'react';
import { X, Star, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReviewModal: React.FC = () => {
  const { reviewModalProject, setReviewModalProject, submitReview, currentUser } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!reviewModalProject) return null;

  // Determine who is being reviewed
  const isClient = currentUser?.id === reviewModalProject.client_id;
  const targetUserId = isClient ? reviewModalProject.freelancer_id : reviewModalProject.client_id;
  const targetName = isClient ? reviewModalProject.freelancer_name : reviewModalProject.client_name;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    submitReview(reviewModalProject.id, targetUserId, rating, comment);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReviewModalProject(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
          <div className="flex items-center gap-2 text-amber-900">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            <h3 className="font-bold text-sm">Leave a 5-Star Review</h3>
          </div>
          <button
            onClick={() => setReviewModalProject(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                ⭐
              </div>
              <h4 className="font-bold text-slate-900">Review Published!</h4>
              <p className="text-xs text-slate-500">
                Thank you for helping build trust in Uganda's freelance community.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center pb-2">
                <p className="text-xs text-slate-500">How was your experience working with</p>
                <p className="text-sm font-bold text-slate-900">{targetName}?</p>
                <p className="text-[11px] text-blue-700 mt-0.5">Project: {reviewModalProject.job_title}</p>
              </div>

              {/* Star selector */}
              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-125 cursor-pointer focus:outline-hidden"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200 fill-slate-100'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-center text-xs font-bold text-amber-700">
                {rating === 5 && 'Outstanding Work (5.0)'}
                {rating === 4 && 'Very Good (4.0)'}
                {rating === 3 && 'Average (3.0)'}
                {rating === 2 && 'Below Expectations (2.0)'}
                {rating === 1 && 'Unsatisfactory (1.0)'}
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Public Feedback / Testimonial
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details on communication, code/design quality, timeliness, and professionalism..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalProject(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer shadow-xs"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
