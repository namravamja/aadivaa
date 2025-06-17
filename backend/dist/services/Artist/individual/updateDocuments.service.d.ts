interface DocumentsData {
    gstCertificate?: string;
    panCard?: string;
    businessLicense?: string;
    canceledCheque?: string;
}
export declare const updateDocuments: (artistId: string, documentsData: DocumentsData) => Promise<any>;
export {};
