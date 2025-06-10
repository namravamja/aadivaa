"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsByArtist = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProductsByArtist = async (artistId) => {
    const artist = await prisma.artist.findUnique({
        where: { id: artistId },
    });
    if (!artist)
        throw new Error("Artist not found");
    const products = await prisma.product.findMany({
        where: { artistId: artistId },
        include: {
            artist: {
                select: {
                    id: true,
                    fullName: true,
                    storeName: true,
                    email: true,
                },
            },
        },
    });
    return products;
};
exports.getProductsByArtist = getProductsByArtist;
//# sourceMappingURL=getProductByArtist.service.js.map