'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
  /**
   * 연관을 정의하기 위한 도우미 방법.
   * 이 방법은 Sequelize 라이프사이클의 일부가 아닙니다.
   * `models/index` 파일은 이 메소드를 자동으로 호출합니다.
   */
    static associate(models) {
      // define association here
    }
  }
  Item.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};