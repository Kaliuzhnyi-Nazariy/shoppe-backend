/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `PasswordResetTokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetTokens_userId_key" ON "PasswordResetTokens"("userId");
