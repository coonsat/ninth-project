const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
class Courses extends Model {
    //Define associations
    static associate(models) {
    Courses.belongsTo(models.Users, { 
        foreignKey: {
            fieldName: 'userId',
            allowNull: false
        },
    });
    }
};
Courses.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'A course title must be provided'
            },
            notEmpty: {
                msg: 'A course title cannot be empty'
            }
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'A course description must be provided'
            },
            notEmpty: {
                msg: 'A course description cannot be empty'
            }
        }
    },
    estimatedTime: {
        type: DataTypes.STRING,
    },
    materialsNeeded: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'Courses',
});
return Courses;
};