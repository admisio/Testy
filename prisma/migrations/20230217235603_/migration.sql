/*
  Warnings:

  - You are about to drop the column `index` on the `Heading` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Heading` table. All the data in the column will be lost.
  - Added the required column `title` to the `Heading` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Heading" DROP COLUMN "index",
DROP COLUMN "text",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
