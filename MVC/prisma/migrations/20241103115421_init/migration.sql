-- CreateTable
CREATE TABLE "Product" (
    "product_id" TEXT NOT NULL,
    "product_img" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_rating" TEXT NOT NULL,
    "product_prize" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "ProductDescription" (
    "productdescription_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "asset_required" TEXT NOT NULL,
    "delivery" TEXT NOT NULL,
    "product_include" TEXT NOT NULL,
    "product_highlights" JSONB NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "ProductDescription_pkey" PRIMARY KEY ("productdescription_id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "categories_id" TEXT NOT NULL,
    "categories_name" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("categories_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_product_id_key" ON "Product"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDescription_productdescription_id_key" ON "ProductDescription"("productdescription_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDescription_product_id_key" ON "ProductDescription"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_categories_id_key" ON "Categories"("categories_id");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_product_id_key" ON "Categories"("product_id");

-- AddForeignKey
ALTER TABLE "ProductDescription" ADD CONSTRAINT "ProductDescription_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
