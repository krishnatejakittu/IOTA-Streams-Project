const { Client, Publisher, Subscriber } = require('@iota/streams/node');
const { createReadStream } = require('fs');
const { createInterface } = require('readline');
const { Swarm } = require('swarm-storage');

function createSeed() {
    const seed = crypto.createHash('sha256').update(crypto.randomBytes(256)).digest('hex');
  
    return seed;
  }

const provider = 'https://nodes.devnet.iota.org';
const seed = createSeed();
const channelPassword = 'Secret';
const swarmUrl = 'https://swarm-gateways.net';

const swarm = new Swarm(swarmUrl);

async function publish() {
  const client = new Client({
    network: 'devnet',
    node: {
      url: provider,
    },
  });
  const channelState = await client.channel.create({
    mode: 'public',
    multiBranching: false,
    sideKey: channelPassword,
  });
  const channelAddress = channelState.channelAddress;
  const publisher = new Publisher({
    client,
    channelAddress,
    channelKey: channelState.channelKey,
    sideKey: channelState.sideKey,
  });
  const message = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    message: 'Hello, world!',
  };
  const messageStream = createReadStream(JSON.stringify(message));
  const contentHash = await swarm.upload(messageStream);
  const messageId = await publisher.publish({
    payload: client.utils.toAscii(contentHash),
  });
  console.log(`Message published with ID ${messageId}`);
}

async function retrieve() {
  const client = new Client({
    network: 'devnet',
    node: {
      url: provider,
    },
  });
  const channelState = await client.channel.fetch(channelPassword);
  const channelAddress = channelState.channelAddress;
  const subscriber = new Subscriber({
    client,
    channelAddress,
    announce: false,
    channelKey: channelState.channelKey,
    sideKey: channelState.sideKey,
  });
  subscriber.events.on('data', async (data) => {
    const contentHash = client.utils.fromAscii(data.message.payload);
    const stream = swarm.download(contentHash);
    const rl = createInterface({
      input: stream,
      crlfDelay: Infinity,
    });
    for await (const line of rl) {
      console.log(line);
    }
  });
  await subscriber.start();
}

async function run() {
  await publish();
  await retrieve();
}

run();
