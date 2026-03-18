/*
  Warnings:

  - Added the required column `updated_at` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable - Make columns nullable first
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "paid_at" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "payment_error" TEXT,
ADD COLUMN IF NOT EXISTS "razorpay_order_id" TEXT,
ADD COLUMN IF NOT EXISTS "refund_amount" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "refund_id" TEXT,
ADD COLUMN IF NOT EXISTS "refund_status" TEXT,
ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "free_delivery_threshold" DOUBLE PRECISION NOT NULL DEFAULT 500.0,
ADD COLUMN     "min_order_amount" DOUBLE PRECISION NOT NULL DEFAULT 100.0,
ADD COLUMN     "msg91_auth_key" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "msg91_otp_template_id" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "msg91_sender_id" TEXT NOT NULL DEFAULT 'FDCOTP',
ADD COLUMN     "razorpay_webhook_secret" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "delivery_fee_rules" (
    "id" TEXT NOT NULL,
    "settings_id" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL DEFAULT 'Standard Delivery',
    "description" TEXT NOT NULL DEFAULT '',
    "condition_type" TEXT NOT NULL DEFAULT 'ALWAYS',
    "min_order_value" DOUBLE PRECISION,
    "max_order_value" DOUBLE PRECISION,
    "min_distance" DOUBLE PRECISION,
    "max_distance" DOUBLE PRECISION,
    "start_time" TEXT,
    "end_time" TEXT,
    "days_of_week" TEXT NOT NULL DEFAULT '[]',
    "fee_type" TEXT NOT NULL DEFAULT 'FLAT',
    "fee_value" DOUBLE PRECISION NOT NULL DEFAULT 40.0,
    "fee_percentage" DOUBLE PRECISION,
    "per_km_rate" DOUBLE PRECISION,
    "max_fee" DOUBLE PRECISION,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_fee_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "additional_fees" (
    "id" TEXT NOT NULL,
    "settings_id" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL DEFAULT 'Service Fee',
    "description" TEXT NOT NULL DEFAULT '',
    "apply_to" TEXT NOT NULL DEFAULT 'ALL_ORDERS',
    "min_order_value" DOUBLE PRECISION,
    "max_order_value" DOUBLE PRECISION,
    "fee_type" TEXT NOT NULL DEFAULT 'FLAT',
    "fee_value" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "fee_percentage" DOUBLE PRECISION,
    "max_fee" DOUBLE PRECISION,
    "min_fee" DOUBLE PRECISION,
    "is_taxable" BOOLEAN NOT NULL DEFAULT false,
    "show_in_breakdown" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "additional_fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'API Key',
    "key" TEXT NOT NULL,
    "permissions" TEXT[] DEFAULT ARRAY['read']::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "last_used" TIMESTAMP(3),
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_key" ON "api_keys"("key");

-- CreateIndex
CREATE INDEX "api_keys_key_idx" ON "api_keys"("key");

-- AddForeignKey
ALTER TABLE "delivery_fee_rules" ADD CONSTRAINT "delivery_fee_rules_settings_id_fkey" FOREIGN KEY ("settings_id") REFERENCES "settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "additional_fees" ADD CONSTRAINT "additional_fees_settings_id_fkey" FOREIGN KEY ("settings_id") REFERENCES "settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
