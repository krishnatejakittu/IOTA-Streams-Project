// Import required modules
const { SingleBranchChannel, Author, Subscriber } = require('@iota/streams/node');
const { Bee } = require('@ethersphere/bee-js');
const { createSeed } = require('./helpers');
const { Client } = require('@iota/client');

// Initialize Bee instance
const bee = new Bee('https://gateway.ethswarm.org');

// Custom storage adapter for IOTA Streams using bee-js
const beeStorageAdapter = {
  get: async (key) => {
    const data = await bee.downloadData(key);
    return data.text();
  },
  set: async (key, value) => {
    const { reference } = await bee.uploadData(key, value);
    return reference;
  },
};

// Initialize IOTA client
const iotaClient = new Client({ node: 'https://chrysalis-nodes.iota.org' });

// Initialize IOTA Streams author instance
const authorSeed = createSeed(); // Replace with your own seed
const author = Author.from_client(authorSeed, iotaClient, beeStorageAdapter);

// Initialize IOTA Streams subscriber instance
const subscriberSeed = createSeed(); // Replace with your own seed
const subscriber = Subscriber.from_client(subscriberSeed, iotaClient, beeStorageAdapter);

// Create a new channel and send a dummy message
(async () => {
  // Create a new channel
  const channel = new SingleBranchChannel(author, 3);
  await channel.createChannel();

  console.log('Channel created. Channel address:', channel.channelAddress);

  // Send a dummy message
  const dummyMessage = 'Hello, this is a dummy message!';
  const message = await channel.send(dummyMessage);

  console.log('Message sent. Message ID:', message.messageId);

  // Subscribe to the channel
  await subscriber.subscribe(channel.channelAddress, channel.announceMsg.messageId);

  // Retrieve the message
  const retrievedMessage = await subscriber.receive(message.messageId);

  console.log('Retrieved message:', retrievedMessage);
})();
