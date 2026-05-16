ALTER TABLE "Bill" ADD COLUMN "lastReminderSentAt" TIMESTAMP(3);
ALTER TABLE "Bill" ADD COLUMN "applianceId" TEXT;
ALTER TABLE "Payment" ADD COLUMN "notes" TEXT;

CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "data" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
