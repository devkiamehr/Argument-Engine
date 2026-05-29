import { prisma } from '../lib/prisma.js';

export const createUser = async (data: {
    email: string,
    name: string,
    passwordHash: string
}) => {
    return prisma.user.create({ data })
}

export const getUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email: email } })
    return user;
}

export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id: id } })
    return user;
}

export const editUser = async (data: {
    id: string,
    email: string,
    name: string,
    passwordHash: string
}) => {
    const user = await prisma.user.update({
        where: { id: data.id },
        data: {
            email: data.email,
            name: data.name,
            passwordHash: data.passwordHash
        }
    })
    return user;
}

export const deleteUser = async (email: string) => {
     await prisma.user.delete({
        where: {email: email}
    })
    return { ok: true }
}
