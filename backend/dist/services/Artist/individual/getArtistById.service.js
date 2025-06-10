"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArtistById = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getArtistById = async (id) => {
    const artist = await prisma.artist.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            fullName: true,
            mobile: true,
            storeName: true,
            businessType: true,
            businessRegistrationNumber: true,
            productCategories: true,
            gstNumber: true,
            panNumber: true,
            bankAccountName: true,
            bankName: true,
            accountNumber: true,
            ifscCode: true,
            upiId: true,
            shippingType: true,
            serviceAreas: true,
            inventoryVolume: true,
            returnPolicy: true,
            supportContact: true,
            workingHours: true,
            businessLogo: true,
            digitalSignature: true,
            termsAgreed: true,
            createdAt: true,
            updatedAt: true,
            profileProgress: true,
            isAuthenticated: true,
            // Include the related data in the response
            businessAddress: {
                select: {
                    id: true,
                    street: true,
                    city: true,
                    state: true,
                    country: true,
                    pinCode: true,
                },
            },
            warehouseAddress: {
                select: {
                    id: true,
                    street: true,
                    city: true,
                    state: true,
                    country: true,
                    pinCode: true,
                    sameAsBusiness: true,
                },
            },
            documents: {
                select: {
                    id: true,
                    gstCertificate: true,
                    panCard: true,
                    businessLicense: true,
                    canceledCheque: true,
                },
            },
            socialLinks: {
                select: {
                    id: true,
                    website: true,
                    instagram: true,
                    facebook: true,
                    twitter: true,
                },
            },
        },
    });
    if (!artist)
        throw new Error("Artist not found");
    return artist;
};
exports.getArtistById = getArtistById;
//# sourceMappingURL=getArtistById.service.js.map