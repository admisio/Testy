/*
  Warnings:

  - A unique constraint covering the columns `[userId,testId]` on the table `TestSubmission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TestSubmission_userId_testId_key" ON "TestSubmission"("userId", "testId");
