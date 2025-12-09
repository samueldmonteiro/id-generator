'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import { useState } from 'react';
import anhanguera from "@/src/assets/anhanguera.png"

interface BadgePreviewProps {
  name: string;
  course: string;
  photoUrl: string | null;
}

export function BadgePreview({ name, course, photoUrl }: BadgePreviewProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-[360px] mx-auto bg-white shadow-lg border border-gray-300 overflow-hidden rounded-md">

      <div className="absolute left-0 top-0 h-full w-20 bg-[#F26522] flex items-center justify-center">
        <p
          className="text-white font-bold text-3xl tracking-widest"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          ESTAGIÁRIO
        </p>
      </div>

      <div className="ml-20 py-6 flex flex-col items-center">

        <Image
          src={anhanguera}
          alt="Logo Anhanguera"
          width={140}
          height={70}
          className="mb-3 object-contain"
        />

        <div className="relative w-40 h-48 border border-gray-400 mb-4">
          {photoUrl && !imageError ? (
            <Image
              src={photoUrl}
              alt="Foto"
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <User className="w-14 h-14 text-gray-400" />
            </div>
          )}
        </div>

        <p className="text-black text-xl font-bold text-center leading-tight">
          {name || 'Fernando Cardoso'}
        </p>

        <p className="text-lg text-gray-700 mt-1">
          {course || 'Odontologia'}
        </p>
      </div>
    </div>
  );
}
