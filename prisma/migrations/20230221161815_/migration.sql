/*
  Warnings:

  - You are about to drop the column `assignmentId` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `answers` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the `Assignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Template` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,questionId,assignmentId]` on the table `Answer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assignmentId` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_testId_fkey";

-- DropForeignKey
ALTER TABLE "Heading" DROP CONSTRAINT "Heading_testId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_testId_fkey";

-- DropForeignKey
ALTER TABLE "TestSubmission" DROP CONSTRAINT "TestSubmission_testId_fkey";

-- DropForeignKey
ALTER TABLE "TestSubmission" DROP CONSTRAINT "TestSubmission_userId_fkey";

-- DropIndex
DROP INDEX "Answer_userId_questionId_assignmentId_key";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "assignmentId",
ADD COLUMN     "assignmentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "answers",
ADD COLUMN     "templateAnswers" TEXT[];

-- DropTable
DROP TABLE "Assignment";

-- DropTable
DROP TABLE "TestSubmission";

-- DropTable
DROP TABLE "Template";

-- CreateTable
CREATE TABLE "Template" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "timeLimit" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" SERIAL NOT NULL,
    "testId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "started" BOOLEAN NOT NULL DEFAULT false,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "evaluation" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Submission_userId_assignmentId_key" ON "Submission"("userId", "assignmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_userId_questionId_assignmentId_key" ON "Answer"("userId", "questionId", "assignmentId");

-- AddForeignKey
ALTER TABLE "Heading" ADD CONSTRAINT "Heading_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
