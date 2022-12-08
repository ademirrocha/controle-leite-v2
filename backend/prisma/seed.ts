import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    
    const user = await prisma.user.create({
        data: {
            name: 'Ademir Rocha',
            email: 'tiademir.rocha93@gmail.com',
            avatarUrl: 'https://github.com/ademirrocha.png'
        }
    });

}

main();