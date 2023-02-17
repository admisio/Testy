/*
  Warnings:

  - Added the required column `questionRangeEnd` to the `Heading` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionRangeStart` to the `Heading` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Heading" ADD COLUMN     "questionRangeEnd" INTEGER NOT NULL,
ADD COLUMN     "questionRangeStart" INTEGER NOT NULL;
