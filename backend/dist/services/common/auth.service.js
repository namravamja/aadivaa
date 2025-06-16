"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginArtist = exports.signupArtist = exports.loginBuyer = exports.signupBuyer = void 0;
const client_1 = require("@prisma/client");
const jwt_1 = require("../../utils/jwt");
const mailer_1 = require("../../helpers/mailer");
const prisma = new client_1.PrismaClient();
const signupBuyer = async (data) => {
    const existing = await prisma.buyer.findUnique({
        where: { email: data.email },
    });
    if (existing)
        throw new Error("Email already registered");
    const hashed = await (0, jwt_1.hashPassword)(data.password);
    const buyer = await prisma.buyer.create({
        data: { ...data, password: hashed },
    });
    const verifyToken = (0, jwt_1.generateVerificationToken)({
        id: buyer.id,
        role: "BUYER",
    });
    // Save token & expiry (1 day expiry)
    await prisma.buyer.update({
        where: { id: buyer.id },
        data: {
            verifyToken,
            verifyExpires: new Date(Date.now() + 5 * 60 * 1000),
        },
    });
    // Send verification email
    await (0, mailer_1.sendVerificationEmail)(buyer.email, verifyToken);
    setTimeout(async () => {
        const freshBuyer = await prisma.buyer.findUnique({
            where: { id: buyer.id },
        });
        if (freshBuyer && !freshBuyer.isVerified) {
            await prisma.buyer.delete({ where: { id: buyer.id } });
        }
    }, 7 * 60 * 1000); // 7 minutes delay
    return {
        message: "Buyer created, Please check your email to verify your account.",
        id: buyer.id,
    };
};
exports.signupBuyer = signupBuyer;
const loginBuyer = async ({ email, password, }) => {
    const buyer = await prisma.buyer.findUnique({ where: { email } });
    if (!buyer || !(await (0, jwt_1.comparePassword)(password, buyer.password))) {
        throw new Error("Invalid credentials");
    }
    if (!buyer.isVerified) {
        throw new Error("Please verify your email before logging in");
    }
    const token = (0, jwt_1.generateToken)({ id: buyer.id, role: "BUYER" });
    await prisma.buyer.update({
        where: { id: buyer.id },
        data: { isAuthenticated: true },
    });
    return { token, buyer };
};
exports.loginBuyer = loginBuyer;
const signupArtist = async (data) => {
    const existing = await prisma.artist.findUnique({
        where: { email: data.email },
    });
    if (existing)
        throw new Error("Email already registered");
    const hashed = await (0, jwt_1.hashPassword)(data.password);
    const artist = await prisma.artist.create({
        data: { ...data, password: hashed },
    });
    // Generate verification token
    const verifyToken = (0, jwt_1.generateVerificationToken)({
        id: artist.id,
        role: "ARTIST",
    });
    // Save token & expiry
    await prisma.artist.update({
        where: { id: artist.id },
        data: {
            verifyToken,
            verifyExpires: new Date(Date.now() + 5 * 60 * 1000),
        },
    });
    // Send verification email
    await (0, mailer_1.sendVerificationEmail)(artist.email, verifyToken);
    setTimeout(async () => {
        const freshArtist = await prisma.artist.findUnique({
            where: { id: artist.id },
        });
        if (freshArtist && !freshArtist.isVerified) {
            await prisma.artist.delete({ where: { id: artist.id } });
            console.log(`Deleted unverified artist with id ${artist.id} after 5 minutes`);
        }
    }, 7 * 60 * 1000);
    return {
        message: "Artist created, Please check your email to verify your account.",
        id: artist.id,
    };
};
exports.signupArtist = signupArtist;
const loginArtist = async ({ email, password, }) => {
    const artist = await prisma.artist.findUnique({ where: { email } });
    if (!artist || !(await (0, jwt_1.comparePassword)(password, artist.password))) {
        throw new Error("Invalid credentials");
    }
    if (!artist.isVerified) {
        throw new Error("Please verify your email before logging in");
    }
    const token = (0, jwt_1.generateToken)({ id: artist.id, role: "ARTIST" });
    await prisma.artist.update({
        where: { id: artist.id },
        data: { isAuthenticated: true },
    });
    return { token, artist };
};
exports.loginArtist = loginArtist;
//# sourceMappingURL=auth.service.js.map