"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBusinessAddress = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const updateBusinessAddress = async (artistId, addressData) => {
    // First, get the artist to check if they have a business address
    const artist = await prisma.artist.findUnique({
        where: { id: artistId },
        select: { businessAddressId: true },
    });
    if (!artist) {
        throw new Error("Artist not found");
    }
    let updatedAddress;
    if (artist.businessAddressId) {
        // Update existing address
        updatedAddress = await prisma.businessAddress.update({
            where: { id: artist.businessAddressId },
            data: {
                street: addressData.street || "",
                city: addressData.city,
                state: addressData.state,
                country: addressData.country,
                pinCode: addressData.pinCode,
            },
        });
    }
    else {
        // Create new address and link to artist
        updatedAddress = await prisma.businessAddress.create({
            data: {
                street: addressData.street || "",
                city: addressData.city || "",
                state: addressData.state,
                country: addressData.country,
                pinCode: addressData.pinCode,
            },
        });
        // Link the new address to the artist
        await prisma.artist.update({
            where: { id: artistId },
            data: { businessAddressId: updatedAddress.id },
        });
    }
    return updatedAddress;
};
exports.updateBusinessAddress = updateBusinessAddress;
//# sourceMappingURL=updateBusinessAddress.service.js.map