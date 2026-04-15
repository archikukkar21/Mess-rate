export default function StarRating({ value, onChange, size = 'md' }) {
  const sizeClass = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-2xl';

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          className={`${sizeClass} transition-all duration-100 ${onChange ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default'
            } ${star <= value ? 'text-brand-400' : 'text-white/15'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export function StarDisplay({ value, size = 'sm' }) {
  return <StarRating value={Math.round(value)} size={size} />;
}
