import prisma from "../client";


async function main() {
  const result = await prisma.test.findMany();
  console.log(result);
}

main().then(() => {
    console.log('Test db seeded')
}).catch((e) => {
    console.error(e);
    process.exit(1);
});