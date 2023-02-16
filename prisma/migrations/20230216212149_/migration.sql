/*
  Warnings:

  - Added the required column `timeLimit` to the `TestTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestTemplate" ADD COLUMN     "timeLimit" INTEGER NOT NULL;
