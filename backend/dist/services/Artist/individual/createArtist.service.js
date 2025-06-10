"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArtist = void 0;
const client_1 = require("@prisma/client");
const jwt_1 = require("../../../utils/jwt");
const prisma = new client_1.PrismaClient();
const createArtist = async (data) => {
    const existing = await prisma.artist.findUnique({
        where: { email: data.email },
    });
    if (existing)
        throw new Error("Email already registered");
    const hashedPassword = await (0, jwt_1.hashPassword)(data.password);
    const artist = await prisma.artist.create({
        data: {
            ...data,
            inventoryVolume: data.inventoryVolume !== undefined && data.inventoryVolume !== null
                ? String(data.inventoryVolume)
                : undefined,
            password: hashedPassword,
        },
    });
    return artist;
};
exports.createArtist = createArtist;
//# sourceMappingURL=createArtist.service.js.map