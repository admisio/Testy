/*
  Warnings:

  - The `questionOrder` column on the `View` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "View" DROP COLUMN "questionOrder",
ADD COLUMN     "questionOrder" INTEGER[];
