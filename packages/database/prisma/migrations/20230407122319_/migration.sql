/*
  Warnings:

  - You are about to drop the column `questionRangeEnd` on the `Heading` table. All the data in the column will be lost.
  - You are about to drop the column `questionRangeStart` on the `Heading` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Heading" DROP COLUMN "questionRangeEnd",
DROP COLUMN "questionRangeStart";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "headingId" INTEGER;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_headingId_fkey" FOREIGN KEY ("headingId") REFERENCES "Heading"("id") ON DELETE SET NULL ON UPDATE CASCADE;
