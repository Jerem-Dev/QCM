/*
  Warnings:

  - You are about to drop the column `user_answerId` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `optionId` on the `User_answer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_user_answerId_fkey";

-- AlterTable
ALTER TABLE "Option" DROP COLUMN "user_answerId";

-- AlterTable
ALTER TABLE "User_answer" DROP COLUMN "optionId";

-- CreateTable
CREATE TABLE "_OptionToUser_answer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OptionToUser_answer_AB_unique" ON "_OptionToUser_answer"("A", "B");

-- CreateIndex
CREATE INDEX "_OptionToUser_answer_B_index" ON "_OptionToUser_answer"("B");

-- AddForeignKey
ALTER TABLE "_OptionToUser_answer" ADD CONSTRAINT "_OptionToUser_answer_A_fkey" FOREIGN KEY ("A") REFERENCES "Option"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OptionToUser_answer" ADD CONSTRAINT "_OptionToUser_answer_B_fkey" FOREIGN KEY ("B") REFERENCES "User_answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
