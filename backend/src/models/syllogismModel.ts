import { prisma } from '../lib/prisma.js';

export const createSyllogism = async (data: {
    lineOne: string,
    lineTwo: string,
    conclusion: string,
    mood: string,
    figure: string,
    userId: string
}) => {
    const syllogism = await prisma.syllogism.create({ data: data });
    return syllogism;
}

export const listSyllogisms = async (userId: string) => {
    const syllogisms = await prisma.syllogism.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' }
    })
    return syllogisms;
}

export const findSyllogism = async (id: string, userId: string) => {
    const syllogism = await prisma.syllogism.findUnique({
        where: {
            id: id,
            userId: userId
        }
    })
    return syllogism;
}

export const deleteSyllogism = async (id: string, userId: string) => {
     await prisma.syllogism.delete({
        where: {
            id: id,
            userId: userId
        }
    })
    return { ok: true }
}
