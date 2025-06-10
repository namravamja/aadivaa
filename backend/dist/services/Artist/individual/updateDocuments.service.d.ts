interface DocumentsData {
    gstCertificate?: string;
    panCard?: string;
    businessLicense?: string;
    canceledCheque?: string;
}
export declare const updateDocuments: (artistId: string, documentsData: DocumentsData) => Promise<{
    id: string;
    gstCertificate: string | null;
    panCard: string | null;
    businessLicense: string | null;
    canceledCheque: string | null;
}>;
export {};
