/*
  Warnings:

  - Added the required column `maxScore` to the `TestTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestTemplate" ADD COLUMN     "maxScore" INTEGER NOT NULL;
