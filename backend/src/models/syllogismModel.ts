import { prisma } from '../lib/prisma.js';

export const createSyllogism = async (data: {
    lineOne: string,
    lineTwo: string,
    conclusion: string,
    mood?: string,
    figure?: string,
    validity?: boolean,
    userId: string
}) => {
    const syllogism = await prisma.syllogism.create({ data: data });
    return syllogism;
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
