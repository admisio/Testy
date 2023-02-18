-- CreateTable
CREATE TABLE "Heading" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "testId" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "Heading_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Heading" ADD CONSTRAINT "Heading_testId_fkey" FOREIGN KEY ("testId") REFERENCES "TestTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
