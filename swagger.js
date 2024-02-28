const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    swaggerUi,
    info: {
      title: "API",
      version: "1.0.0",
      description: "API Information",
      contact: {
        name: "Developer",
      },
      servers: ["http://localhost:8000"],
    },
  },
  // ['.routes/*.js']
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
