"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { useState } from "react";
import anhanguera from "@/src/assets/anhanguera.png";
import pitagoras from "@/src/assets/pitagoras.png";

interface InstitutionalBadgePreviewProps {
  name: string;
  role: string;
  photoUrl: string | null;
}

export function InstitutionalBadgePreview({
  name,
  role,
  photoUrl,
}: InstitutionalBadgePreviewProps) {
  const [imageError, setImageError] = useState(false);

  const isProfessor = role === "PROFESSOR" || role === "PROFESSORA";

  // Template 1: Professor
  if (isProfessor) {
    return (
      <div className="relative w-[360px] h-[500px] mx-auto bg-white shadow-lg border border-gray-300 overflow-hidden rounded-md flex flex-col items-center pb-0">
        {/* Logo Section */}
        <div className="pt-6 pb-2">
          <Image
            src={pitagoras}
            alt="Logo Pitágoras"
            width={140}
            height={70}
            className="object-contain"
          />
        </div>

        {/* Photo Section */}
        <div className="relative w-40 h-48 border border-gray-400 mb-4 mt-2">
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

        {/* Name & Role Section */}
        <div className="text-center w-full px-4 mb-6">
          <p className="text-black text-2xl font-bold leading-tight">
            {name || "Seu nome"}
          </p>
          <p className="text-xl text-gray-700 italic mt-1">
            {role || "Professora"}
          </p>
        </div>

        {/* Bottom Bar Gradient */}
        <div className="w-full h-6 bg-linear-to-r from-[#FFCC00] to-[#F26522] mt-auto"></div>
      </div>
    );
  }

  // Template 2: Preceptor, Administrativo, Tutor
  return (
    <div className="relative w-[360px] h-[500px] mx-auto bg-white shadow-lg border border-gray-300 overflow-hidden rounded-md">
      {/* Side Bar */}
      <div className="absolute left-0 top-0 h-full w-20 bg-[#F26522] flex items-center justify-center">
        <p
          className="text-white font-bold text-2xl tracking-widest uppercase whitespace-nowrap"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {role || "ADMINISTRATIVO"}
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

        <div className="text-center w-full px-4 mb-6">
          <p className="text-black text-2xl font-bold leading-tight">
            {name || "Seu nome"}
          </p>
          <p className="text-xl text-gray-700 italic mt-1 invisible">
            Placeholder
          </p>
        </div>
      </div>
    </div>
  );
}
