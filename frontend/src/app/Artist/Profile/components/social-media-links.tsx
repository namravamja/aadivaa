"use client";

import { useState } from "react";
import { Globe, Instagram, Facebook, Twitter } from "lucide-react";

interface SocialLinks {
  website: string;
  instagram: string;
  facebook: string;
  twitter: string;
}

interface SocialMediaLinksProps {
  isEditing: boolean;
  onDataChange: (data: SocialLinks) => void;
}

export default function SocialMediaLinks({
  isEditing,
  onDataChange,
}: SocialMediaLinksProps) {
  const [data, setData] = useState<SocialLinks>({
    website: "www.smithcrafts.com",
    instagram: "@smithcrafts",
    facebook: "Smith Crafts & Collectibles",
    twitter: "@smithcrafts",
  });

  const handleInputChange = <K extends keyof SocialLinks>(
    field: K,
    value: SocialLinks[K]
  ) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onDataChange(newData);
  };

  return (
    <div className="bg-white border border-stone-200 shadow-sm">
      <div className="p-6 border-b border-stone-200">
        <h2 className="text-xl font-medium text-stone-900 flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Social Media & Website
        </h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className=" text-sm font-medium text-stone-700 mb-1 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Website
            </label>
            {isEditing ? (
              <input
                type="url"
                value={data.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                placeholder="Enter your website URL"
              />
            ) : (
              <p className="text-stone-600 py-2">{data.website}</p>
            )}
          </div>
          <div>
            <label className=" text-sm font-medium text-stone-700 mb-1 flex items-center">
              <Instagram className="w-4 h-4 mr-2" />
              Instagram
            </label>
            {isEditing ? (
              <input
                type="text"
                value={data.instagram}
                onChange={(e) => handleInputChange("instagram", e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                placeholder="Enter your Instagram handle"
              />
            ) : (
              <p className="text-stone-600 py-2">{data.instagram}</p>
            )}
          </div>
          <div>
            <label className=" text-sm font-medium text-stone-700 mb-1 flex items-center">
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </label>
            {isEditing ? (
              <input
                type="text"
                value={data.facebook}
                onChange={(e) => handleInputChange("facebook", e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                placeholder="Enter your Facebook page"
              />
            ) : (
              <p className="text-stone-600 py-2">{data.facebook}</p>
            )}
          </div>
          <div>
            <label className=" text-sm font-medium text-stone-700 mb-1 flex items-center">
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </label>
            {isEditing ? (
              <input
                type="text"
                value={data.twitter}
                onChange={(e) => handleInputChange("twitter", e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                placeholder="Enter your Twitter handle"
              />
            ) : (
              <p className="text-stone-600 py-2">{data.twitter}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
