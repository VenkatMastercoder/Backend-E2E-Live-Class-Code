-- CreateTable
CREATE TABLE "Product" (
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_price" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "Order" (
    "order_id" TEXT NOT NULL,
    "order_name" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
