-- CreateTable
CREATE TABLE "Message" (
    "text" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Language" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Translation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "messageText" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    CONSTRAINT "Translation_messageText_fkey" FOREIGN KEY ("messageText") REFERENCES "Message" ("text") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Translation_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "Language" ("code") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Message_text_key" ON "Message"("text");

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");
