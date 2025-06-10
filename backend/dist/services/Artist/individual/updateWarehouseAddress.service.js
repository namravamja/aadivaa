"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWarehouseAddress = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const updateWarehouseAddress = async (artistId, addressData) => {
    const artist = await prisma.artist.findUnique({
        where: { id: artistId },
        select: {
            warehouseAddressId: true,
            businessAddress: true,
        },
    });
    if (!artist) {
        throw new Error("Artist not found");
    }
    // If sameAsBusiness is true, copy from business address
    let finalAddressData = { ...addressData };
    if (addressData.sameAsBusiness && artist.businessAddress) {
        finalAddressData = {
            ...finalAddressData,
            street: artist.businessAddress.street ?? undefined,
            city: artist.businessAddress.city ?? undefined,
            state: artist.businessAddress.state ?? undefined,
            country: artist.businessAddress.country ?? undefined,
            pinCode: artist.businessAddress.pinCode ?? undefined,
        };
    }
    let updatedAddress;
    if (artist.warehouseAddressId) {
        // Update existing address
        updatedAddress = await prisma.warehouseAddress.update({
            where: { id: artist.warehouseAddressId },
            data: {
                street: finalAddressData.street || "",
                city: finalAddressData.city,
                state: finalAddressData.state,
                country: finalAddressData.country,
                pinCode: finalAddressData.pinCode,
                sameAsBusiness: finalAddressData.sameAsBusiness || false,
            },
        });
    }
    else {
        // Create new address and link to artist
        updatedAddress = await prisma.warehouseAddress.create({
            data: {
                street: finalAddressData.street || "",
                city: finalAddressData.city || "",
                state: finalAddressData.state,
                country: finalAddressData.country,
                pinCode: finalAddressData.pinCode,
                sameAsBusiness: finalAddressData.sameAsBusiness || false,
            },
        });
        // Link the new address to the artist
        await prisma.artist.update({
            where: { id: artistId },
            data: { warehouseAddressId: updatedAddress.id },
        });
    }
    return updatedAddress;
};
exports.updateWarehouseAddress = updateWarehouseAddress;
//# sourceMappingURL=updateWarehouseAddress.service.js.map