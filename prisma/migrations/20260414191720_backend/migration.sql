/*
  Warnings:

  - A unique constraint covering the columns `[restaurantName]` on the table `providerprofile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "providerprofile_restaurantName_key" ON "providerprofile"("restaurantName");
