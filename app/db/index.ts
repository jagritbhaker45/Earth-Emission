import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllCustomers() {
  return prisma.customer_t.findMany();
}

export async function insertCustomer(customerData: any) {
  return prisma.customer_t.create({
    data: {
      ...customerData,
      orders: parseInt(customerData.orders, 10),
      refunds: customerData.refunds ? parseInt(customerData.refunds, 10) : null,
    },
  });
}

export async function disconnectPrisma() {
  await prisma.$disconnect();
}

// Automatically run the main function when this file is executed directly
async function main() {
  try {
    // Call the main function, which contains your Prisma Client queries
    const allUsers = await getAllCustomers();
    console.log(allUsers);
  } catch (error) {
    console.error(error);
    await disconnectPrisma();
    process.exit(1);
  } finally {
    await disconnectPrisma();
  }
}

// Run the main function when this file is executed directly
if (require.main === module) {
  main();
}

export default prisma;
