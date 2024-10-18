/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Document` table. All the data in the column will be lost.
  - The `deltaState` column on the `Document` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_Collaborators` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Document_ownerId_idx";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "ownerId",
DROP COLUMN "deltaState",
ADD COLUMN     "deltaState" BYTEA;

-- DropTable
DROP TABLE "_Collaborators";

-- CreateTable
CREATE TABLE "DocumentAccess" (
    "userId" INTEGER NOT NULL,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "DocumentAccess_pkey" PRIMARY KEY ("userId","documentId")
);

-- AddForeignKey
ALTER TABLE "DocumentAccess" ADD CONSTRAINT "DocumentAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentAccess" ADD CONSTRAINT "DocumentAccess_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
