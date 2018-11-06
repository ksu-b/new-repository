'use strict';
module.exports = (sequelize, DataTypes) => {
  const entry = sequelize.define('entry', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT
  }, {});

  // return 5 last inserted entries
  entry.mostRecent = async () => {
      return await entry.findAll({
          limit: 5,
          order: [['createdAt', 'DESC']]
      });
  };
  return entry;
};