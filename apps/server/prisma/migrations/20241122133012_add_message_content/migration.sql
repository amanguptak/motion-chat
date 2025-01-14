/*
  Warnings:

  - Added the required column `content` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE message_conversationid_seq;
ALTER TABLE "Message" ADD COLUMN     "content" TEXT NOT NULL,
ALTER COLUMN "conversationId" SET DEFAULT nextval('message_conversationid_seq');
ALTER SEQUENCE message_conversationid_seq OWNED BY "Message"."conversationId";
