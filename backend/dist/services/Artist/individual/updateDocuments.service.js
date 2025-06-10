"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDocuments = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const updateDocuments = async (artistId, documentsData) => {
    try {
        // First, check if artist exists
        const artist = await prisma.artist.findUnique({
            where: { id: artistId },
            select: {
                id: true,
                documentsId: true,
            },
        });
        if (!artist) {
            throw new Error("Artist not found");
        }
        // console.log("Artist found:", artist);
        // console.log("Documents data:", documentsData);
        let updatedDocuments;
        if (artist.documentsId) {
            // Update existing documents
            // console.log("Updating existing documents with ID:", artist.documentsId);
            updatedDocuments = await prisma.documents.update({
                where: { id: artist.documentsId },
                data: {
                    ...documentsData,
                },
            });
        }
        else {
            // Create new documents and link to artist
            // console.log("Creating new documents for artist:", artistId);
            updatedDocuments = await prisma.documents.create({
                data: {
                    ...documentsData,
                },
            });
            // console.log("Created documents:", updatedDocuments);
            // Link the new documents to the artist
            await prisma.artist.update({
                where: { id: artistId },
                data: { documentsId: updatedDocuments.id },
            });
            // console.log("Linked documents to artist");
        }
        return updatedDocuments;
    }
    catch (error) {
        console.error("Service error in updateDocuments:", error);
        throw error; // Re-throw to be handled by controller
    }
};
exports.updateDocuments = updateDocuments;
//# sourceMappingURL=updateDocuments.service.js.map