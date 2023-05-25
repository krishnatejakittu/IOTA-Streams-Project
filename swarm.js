const { composeAPI } = require('@iota/core');
const { createChannel, IotaStreams } = require('iota-streams-client');

// Set up IOTA client and provider
const provider = 'https://nodes.devnet.iota.org:443';
const iota = composeAPI({ provider });

// Set up IOTA Streams instance with Swarm storage
const streams = new IotaStreams(iota, { storageAdapter: 'swarm', gatewayUrl: 'https://swarm-gateways.net' });

// Define a channel
const seed = 'MYSEED';
const channel = createChannel(seed, 'public', streams);

// Define a dummy message
const message = 'This is a test message';

// Publish the message to the channel
channel.publish(message).then(() => {
  console.log(`Message published to channel with ID ${channel.id}`);

  // Retrieve messages from the channel
  channel.fetch().then((messages) => {
    console.log(`Retrieved ${messages.length} messages from channel with ID ${channel.id}:`);

    // Print the payload of each message
    messages.forEach((msg) => {
      console.log(msg.payload);
    });
  });
});
