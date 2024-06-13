-- CreateTable
CREATE TABLE `customer_t` (
    `id` INTEGER NOT NULL,
    `image` VARCHAR(20) NOT NULL,
    `name` VARCHAR(45) NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `location` VARCHAR(45) NOT NULL,
    `orders` INTEGER NOT NULL,
    `lastOrder` VARCHAR(20) NOT NULL,
    `spent` VARCHAR(20) NOT NULL,
    `refunds` INTEGER NULL,
    `fav` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
