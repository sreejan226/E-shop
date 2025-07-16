const swaggerAutogen = require('swagger-autogen')();
const path = require('path');

const doc = {
    info: {
        title: "Auth Service API",
        description: "Automatically generated Swagger docs",
        version: "1.0.0"
    },
    host: "localhost:6001",
    schemes: ["http"],
    basePath: "/api",
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
        {
            name: "Auth",
            description: "Authentication endpoints"
        }
    ]
};

// Use the compiled JavaScript file
const outputFile = path.join(__dirname, 'swagger-output.json');
const endpointsFiles = [path.join(__dirname, '..', 'dist', 'apps', 'auth-services', 'src', 'routes', 'auth.router.js')];

console.log('Generating swagger documentation...');
console.log('Output file:', outputFile);
console.log('Endpoints files:', endpointsFiles);

// Generate swagger documentation
swaggerAutogen(outputFile, endpointsFiles, doc)
    .then(() => {
        console.log('Swagger documentation generated successfully');
    })
    .catch((err) => {
        console.error('Error generating swagger documentation:', err);
    }); 