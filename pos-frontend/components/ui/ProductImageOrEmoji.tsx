import React, { useState } from 'react';
import Image from 'next/image';

interface ProductImageOrEmojiProps {
  imageUrl?: string | null;
  emoji: string;
  name?: string;
  className?: string;
  emojiClassName?: string;
}

export function ProductImageOrEmoji({
  imageUrl,
  emoji,
  name,
  className = 'w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-zinc-950/40',
  emojiClassName = 'text-2xl',
}: ProductImageOrEmojiProps) {
  const [error, setError] = useState(false);
  const hasValidImage = imageUrl && imageUrl.trim().length > 0;

  if (hasValidImage && !error) {
    return (
      <div className={`${className} relative flex items-center justify-center overflow-hidden`}>
        <Image
          src={imageUrl}
          alt={name || 'Product Image'}
          fill
          sizes="40px"
          className="object-cover rounded-[inherit]"
          onError={() => setError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`${className} flex items-center justify-center`}>
      <span className={`select-none ${emojiClassName}`}>
        {emoji || '🌸'}
      </span>
    </div>
  );
}
