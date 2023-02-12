/*
  Warnings:

  - Made the column `assignedTestId` on table `Answer` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `evaluation` to the `TestSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_assignedTestId_fkey";

-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "evaluated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "evaluation" INTEGER,
ALTER COLUMN "assignedTestId" SET NOT NULL;

-- AlterTable
ALTER TABLE "TestSubmission" ADD COLUMN     "evaluation" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_assignedTestId_fkey" FOREIGN KEY ("assignedTestId") REFERENCES "AssignedTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
