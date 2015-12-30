'use strict';
module.exports = (sequelize, DataTypes) => {
  var Demos = sequelize.define('Demos',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      url: {
        type: DataTypes.STRING(1024),
        allowNull: false
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: true
        }
      }
    },
    {
      tableName: 'demo_table',
      paranoid: false,
      underscored: true
      // classMethods: {
        // associate: (models) => {
          // Demo.hasMany(models.OtherDemo, {foreignKey: 'other_demo_id', onDelete: 'cascade'});
        // }
      // }
    });
  return Demos;
};
