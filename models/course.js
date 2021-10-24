const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
class Course extends Model {
    //Define associations
    static associate(models) {
    Course.belongsTo(models.User, { 
        foreignKey: {
            fieldName: 'userId',
            allowNull: false
        },
    });
    }
};
Course.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.STRING
}, {
    sequelize,
    modelName: 'Course',
});
return Course;
};