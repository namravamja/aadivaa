"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listArtists = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const listArtists = async () => {
    return prisma.artist.findMany({
        include: {
            socialLinks: true,
            warehouseAddress: true,
            businessAddress: true,
        },
    });
};
exports.listArtists = listArtists;
//# sourceMappingURL=listArtists.service.js.map