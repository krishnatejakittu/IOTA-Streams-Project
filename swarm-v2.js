const { createKeyPair } = require('@erebos/secp256k1')
const { create } = require('@erebos/swarm')
const { fromString } = require('@erebos/keccak256')

const { Client } = require('@iota/streams')
const { iota } = require('@iota/core')

function createSeed() {
    const seed = crypto.createHash('sha256').update(crypto.randomBytes(256)).digest('hex');
  
    return seed;
  }

const SEED = createSeed()
const CHANNEL_ID = 'YOUR_CHANNEL_ID'
const MESSAGE = 'Hello World'

const swarm = create({ bzz: { url: 'http://localhost:8500' } })
const iotaClient = iota({ provider: 'https://nodes.devnet.iota.org:443' })
const streamsClient = new Client(iotaClient)

async function publishMessage() {
  const keyPair = createKeyPair(fromString(CHANNEL_ID))
  const publisher = streamsClient.publisher(keyPair)
  await publisher.publishAnnounce()
  await publisher.publishUnencrypted(MESSAGE)
  const messageIds = await publisher.getMessageIds()
  const latestMsgId = messageIds[messageIds.length - 1]
  console.log(`Published message with ID: ${latestMsgId}`)

  const swarmContentHash = await swarm.bzz.upload(Buffer.from(latestMsgId, 'utf8'))
  console.log(`Swarm content hash: ${swarmContentHash}`)
}

async function retrieveMessage(swarmContentHash) {
  const swarmData = await swarm.bzz.download(swarmContentHash)
  const msgId = swarmData.toString('utf8')
  console.log(`Retrieved message ID: ${msgId}`)

  const keyPair = createKeyPair(fromString(CHANNEL_ID))
  const subscriber = streamsClient.subscriber(keyPair)
  await subscriber.fetchAnnounce()
  await subscriber.fetchAllNextMessages()
  const message = await subscriber.fetchSingleMessage(msgId)
  const decrypted = await subscriber.decrypt(message)
  console.log(`Retrieved message: ${decrypted.payload.message}`)
}

publishMessage()
  .then(() => retrieveMessage('SWARM_CONTENT_HASH'))
  .catch(console.error)
