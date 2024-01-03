-- DropForeignKey
ALTER TABLE "ProjectMembers" DROP CONSTRAINT "ProjectMembers_projectId_fkey";

-- AddForeignKey
ALTER TABLE "ProjectMembers" ADD CONSTRAINT "ProjectMembers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
