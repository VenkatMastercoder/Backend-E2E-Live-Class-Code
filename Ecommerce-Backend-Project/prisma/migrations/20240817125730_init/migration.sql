/*
  Warnings:

  - Changed the type of `role` on the `CMSUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- AlterTable
ALTER TABLE "CMSUser" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL;
