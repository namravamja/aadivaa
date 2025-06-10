"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateArtistMain = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const updateArtistMain = async (id, data) => {
    const updateData = {
        ...data,
        inventoryVolume: data.inventoryVolume !== undefined && data.inventoryVolume !== null
            ? String(data.inventoryVolume)
            : undefined,
    };
    const artist = await prisma.artist.update({
        where: { id },
        data: updateData,
        select: {
            password: false,
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
        },
    });
    return artist;
};
exports.updateArtistMain = updateArtistMain;
//# sourceMappingURL=updateArtistMain.service.js.map