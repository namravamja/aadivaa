"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArtistById = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getArtistById = async (id) => {
    const artist = await prisma.artist.findUnique({
        where: { id },
    });
    if (!artist)
        throw new Error("Artist not found");
    return artist;
};
exports.getArtistById = getArtistById;
//# sourceMappingURL=getArtistById.service.js.map