/*
  Warnings:

  - A unique constraint covering the columns `[userId,questionId,assignmentId]` on the table `Answer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Answer_userId_questionId_assignmentId_key" ON "Answer"("userId", "questionId", "assignmentId");
