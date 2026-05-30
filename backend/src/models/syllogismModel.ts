import { prisma } from '../lib/prisma.js';

export const createSyllogism = async (data: {
    lineOne: string,
    lineTwo: string,
    conclusion: string,
    mood: string,
    figure: string,
    validity: boolean,
    userId: string
}) => {
    const syllogism = await prisma.syllogism.create({ data: data });
    return syllogism;
}

export const getSyllogism = async (id: string) => {
    const syllogism = await prisma.syllogism.findUnique({
        where: { id: id }
    })
    return syllogism;
}

export const deleteSyllogism = async (id: string) => {
     await prisma.syllogism.delete({
        where: { id: id }
    })
    return { ok: true }
}
