const { composeAPI } = require("@iota/core");
const { Channel } = require("@iota/streams/node");
const { createFeed, createService, SwarmClient } = require("@erebos/swarm-node");
const crypto = require("crypto");

async function run() {
  // Generate a new seed and create a key pair for the author and subscriber
  const seed = crypto.randomBytes(32).toString("hex");
  const authorAddress = Channel.deriveAddress(seed, 0, 2);
  const subscriberAddress = Channel.deriveAddress(seed, 1, 2);
  const authorKey = Channel.Key.generate();
  const subscriberKey = Channel.Key.generate();
  const authorPublicKey = authorKey.publicKey;
  const subscriberPublicKey = subscriberKey.publicKey;

  // Generate an address for the author and subscribe to it with the subscriber
  const client = new SwarmClient({ bzz: { url: "https://swarm-gateways.net" } });
  const authorFeed = createFeed({ user: authorAddress, topic: "test" });
  const subscriberService = createService({ user: subscriberAddress });
  const subscriberFeed = await subscriberService.getFeed("test", authorPublicKey);
  await subscriberFeed.download();

  // Create a channel using the author's key pair and the subscriber's public key
  const channel = new Channel({
    mode: Channel.Mode.Restricted,
    sideKey: subscriberPublicKey,
    multiBranching: true,
    client,
    defaultTimeoutSeconds: 60,
  });

  // Publish a message to the channel
  const message = "Hello, world!";
  const messageTag = await channel.publish(message, authorKey);
  console.log("Published message with tag:", messageTag);

  // Read the message from the channel
  const messageTagBytes = messageTag.toBytes();
  const fetchedMessage = await channel.fetchSingle(messageTagBytes, subscriberKey);
  console.log("Fetched message:", fetchedMessage);
}

run().catch((err) => console.error(err));
