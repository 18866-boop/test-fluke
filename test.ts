import { prisma } from './src/lib/prisma'; prisma.product.count().then(console.log).catch(console.error);
