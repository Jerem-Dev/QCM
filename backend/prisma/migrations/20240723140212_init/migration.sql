/*
  Warnings:

  - The primary key for the `User_answer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User_answer` table. All the data in the column will be lost.
  - You are about to drop the `_OptionToUser_answer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `optionId` to the `User_answer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_OptionToUser_answer" DROP CONSTRAINT "_OptionToUser_answer_A_fkey";

-- DropForeignKey
ALTER TABLE "_OptionToUser_answer" DROP CONSTRAINT "_OptionToUser_answer_B_fkey";

-- AlterTable
ALTER TABLE "User_answer" DROP CONSTRAINT "User_answer_pkey",
DROP COLUMN "id",
ADD COLUMN     "optionId" INTEGER NOT NULL,
ADD CONSTRAINT "User_answer_pkey" PRIMARY KEY ("userId", "optionId");

-- DropTable
DROP TABLE "_OptionToUser_answer";

-- AddForeignKey
ALTER TABLE "User_answer" ADD CONSTRAINT "User_answer_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
