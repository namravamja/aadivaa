"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listArtists = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const listArtists = async () => {
    return prisma.artist.findMany({
        select: {
            password: false,
            id: true,
            email: true,
            fullName: true,
            mobile: true,
            storeName: true,
            businessType: true,
            businessRegistrationNumber: true,
            gstNumber: true,
            panNumber: true,
            bankName: true,
            accountNumber: true,
            ifscCode: true,
            upiId: true,
            shippingType: true,
            inventoryVolume: true,
            returnPolicy: true,
            supportContact: true,
            workingHours: true,
            businessLogo: true,
            digitalSignature: true,
            termsAgreed: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
exports.listArtists = listArtists;
//# sourceMappingURL=listArtists.service.js.map