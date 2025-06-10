"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArtist = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const deleteArtist = async (id) => {
    await prisma.artist.delete({ where: { id } });
    return { message: "Artist deleted" };
};
exports.deleteArtist = deleteArtist;
//# sourceMappingURL=deleteArtist.service.js.map