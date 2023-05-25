import 
const { ClientBuilder } = require('@iota/client');
const { generateSeed } = require('@iota/identity-wasm/node');
const { Publisher } = require('@iota/streams-wasm/node');

// Initialize the client
const client = new ClientBuilder()
  .node('https://chrysalis-nodes.iota.org')
  .build();

// Generate a new seed
const seed = generateSeed(81);

// Create a new publisher instance
const publisher = new Publisher();

// Define the message payload
const messagePayload = {
  message: 'Hello, World!',
};

// Publish the message to Swarm using IOTA Streams
publisher.publish(messagePayload, seed).then((response) => {
  console.log('Message published:', response);
}).catch((error) => {
  console.error('Error publishing message:', error);
});
