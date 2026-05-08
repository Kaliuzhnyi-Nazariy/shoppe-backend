-- CreateTable
CREATE TABLE "Downloads" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Downloads_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Downloads" ADD CONSTRAINT "Downloads_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
