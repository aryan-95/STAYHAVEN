import { FiStar } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

export default function ReviewCard({ review }) {
  const guest = review.guest;
  const stars = review.ratings?.overall || 5;

  return (
    <div className="border-b border-gray-100 pb-6 last:border-0">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-brand flex-shrink-0 flex items-center justify-center">
          {guest?.avatar ? (
            <img src={guest.avatar} alt={guest.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white font-bold text-sm">{guest?.name?.[0]?.toUpperCase()}</span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 text-sm">{guest?.name}</p>
              <p className="text-gray-400 text-xs">
                {review.createdAt ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true }) : ''}
              </p>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <FiStar key={i} className={`w-3.5 h-3.5 ${i <= stars ? 'fill-gray-900 stroke-gray-900' : 'fill-gray-200 stroke-gray-200'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
      {review.hostResponse?.comment && (
        <div className="mt-3 bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-700 mb-1">Response from host</p>
          <p className="text-sm text-gray-600">{review.hostResponse.comment}</p>
        </div>
      )}
    </div>
  );
}
