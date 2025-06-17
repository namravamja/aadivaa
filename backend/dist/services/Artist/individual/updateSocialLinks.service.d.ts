interface SocialLinksData {
    website?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
}
export declare const updateSocialLinks: (artistId: string, socialLinksData: SocialLinksData) => Promise<{
    id: string;
    website: string | null;
    instagram: string | null;
    facebook: string | null;
    twitter: string | null;
}>;
export {};
