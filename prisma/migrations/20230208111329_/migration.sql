-- CreateTable
CREATE TABLE "TestSubmission" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestSubmission" ADD CONSTRAINT "TestSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSubmission" ADD CONSTRAINT "TestSubmission_testId_fkey" FOREIGN KEY ("testId") REFERENCES "AssignedTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
