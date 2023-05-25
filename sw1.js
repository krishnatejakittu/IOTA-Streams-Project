const { ClientBuilder } = require('@iota/client');
const { createClient } = require('@erebos/swarm-node');
const { channelRoot, createChannel, createMessage, parseMessage } = require('@iota/streams');

// Set up the IOTA client and the Swarm client
const iota_node = 'https://nodes.devnet.iota.org:443';
const iota_client = new ClientBuilder().node(iota_node).build();
const swarm_client = createClient({ gateway: 'https://swarm-gateways.net' });

// Define the message to be sent
const messageToSend = 'Hello, world!';

// Define the sender and receiver endpoints
const SENDER_ENDPOINT = 'https://swarm-gateways.net';
const RECEIVER_ENDPOINT = 'https://swarm-gateways.net';

// Create the channel
const seed = channelRoot();
const channel_password = createChannel();
const channel = createMessage(seed, channel_password);

// Create the message bundle

const message_bundle = channel.create({
    payload: messageToSend
});

// Write the message to the Swarm network
swarm_client.bzz.uploadChannelMessages(channel.getChannelAddress(), [message_bundle]).then(() => {
    console.log('Message uploaded to Swarm network');
}).catch((error) => {
    console.log('Error uploading message:', error);
});

// Retrieve the message from the Swarm network
function retrieveMessage(callback) {
    const channel_address = channel.getChannelAddress();
    swarm_client.bzz.getChannelLinks(channel_address).then((message_links) => {
        channel.fetch(message_links[0].link).then((retrieved_message_bundle) => {
            const retrieved_message = parseMessage(retrieved_message_bundle.payload);
            callback(retrieved_message);
        }).catch((error) => {
            console.log('Error retrieving message:', error);
        });
    }).catch((error) => {
        console.log('Error retrieving message links:', error);
    });
}

// Display the retrieved message
retrieveMessage((message) => {
    console.log('Retrieved message:', message);
});
