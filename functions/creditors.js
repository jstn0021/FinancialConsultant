"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("creditors", {
    code: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    creditorsName: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    address1: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    address2: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    city: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    country: {
      type: Sequelize.STRING(10),
      allowNull: true,
      defaultValue: "PH",
    },
    creditorTin: {
      type: Sequelize.STRING(50),
      allowNull: true,
      unique: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("creditors");
}
