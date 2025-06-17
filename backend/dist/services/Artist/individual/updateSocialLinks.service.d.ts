interface SocialLinksData {
    website?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
}
export declare const updateSocialLinks: (artistId: string, socialLinksData: SocialLinksData) => Promise<any>;
export {};
