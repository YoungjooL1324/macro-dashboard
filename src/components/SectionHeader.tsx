"use client";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  description: string;
}

export default function SectionHeader({
  title,
  subtitle,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
      <p className="text-sm italic text-gray-400 mb-2">{subtitle}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
