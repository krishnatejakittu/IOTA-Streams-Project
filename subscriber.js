// Copyright 2020-2021 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

const streams = require("@iota/streams/node");
const { createSeed, to_bytes, getExplorerUrl } = require('./helpers');
const { readFileSync, writeFileSync } = require('fs');
const { Bee } = require('@ethersphere/bee-js');


streams.set_panic_hook();

// Node settings
let node = "https://chrysalis-nodes.iota.org/";
let options = new streams.SendOptions(node, 9, true, 1);

// Initialize Bee instance
const bee = new Bee('https://gateway.ethswarm.org');
const beeStorageAdapter = {
  get: async (key) => {
    const data = await bee.downloadData(key);
    return data.text();
  },
  set: async (key, value) => {
    const { reference } = await bee.uploadData(key, value);
    //console.log("Swarm hash:", reference);
    return reference;
  },
};

async function createSubscriber() {
    console.log('\x1b[36m%s\x1b[0m', 'Subscriber: Create subscriber');

    // Create subscriber with new seed
    let subscriberSeed = createSeed();
    let subscriber = new streams.Subscriber(subscriberSeed, options.clone(), beeStorageAdapter);
    console.log("Subscriber seed: ", subscriberSeed);
    
    return(subscriber.clone())
    }


async function subscribeChannel(subscriber) {
    console.log('\x1b[36m%s\x1b[0m', 'Subscriber: Receive announcement and subscribe to channel');

    // Receive announcement
    let announcementLinkString = readFileSync('./offTangleComs/1_announcement.txt', 'utf8');
    let announcementLink = streams.Address.parse(announcementLinkString);
    await subscriber.clone().receive_announcement(announcementLink.copy());
    
    // Send subscription
    let response = await subscriber.clone().send_subscribe(announcementLink);
    let subscriptionLink = response.link;
    console.log("Subscription link: ", subscriptionLink.toString());

    //Fetch message details
    let subscriptionMessageDetails = await subscriber.clone().get_client().get_link_details(subscriptionLink.copy());
    console.log('\x1b[34m%s\x1b[0m', getExplorerUrl("mainnet", subscriptionMessageDetails.get_metadata().message_id));

    // Write subscription link to off-Tangle link exchange
    writeFileSync('./offTangleComs/2_subscription.txt', subscriptionLink.toString());
}


async function sendTaggedPacket(subscriber) {
    console.log('\x1b[36m%s\x1b[0m', 'Subscriber: Synchronize channel state and send tagged packet');

    // Syncronize channel state
    await subscriber.clone().sync_state();

    function getDateAndTime(){
      let a = new Date();
      let year = a.getUTCFullYear();
      let month = (a.getUTCMonth()+1) < 10 ? '0' + (a.getUTCMonth()+1) : (a.getUTCMonth()+1);
      let date = a.getUTCDate() < 10 ? '0' + a.getUTCDate() : a.getUTCDate();
      let hour = a.getUTCHours() < 10 ? '0' + a.getUTCHours() : a.getUTCHours();
      let min = a.getUTCMinutes() < 10 ? '0' + a.getUTCMinutes() : a.getUTCMinutes();
      let sec = a.getUTCSeconds() < 10 ? '0' + a.getUTCSeconds() : a.getUTCSeconds();
      let time = date + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec ;
      return time;
     }
     const generateDummyJSON = function(){
      let randomNumber = Math.floor((Math.random()*89)+10);
      let dateTime = getDateAndTime();
      let json = {"data": randomNumber, "dateTime":dateTime};
      return json;
     }
    // Define content
    let json = generateDummyJSON();
    let display = "dateTime: "+json.dateTime+", "+"data: "+json.data
    let publicPayload = to_bytes(display);
    //let publicPayload = to_bytes("This is public payload");
    let maskedPayload = to_bytes("This is masked payload");

    // Read announcement message
    let keyloadLinkString = readFileSync('./offTangleComs/3_keyload.txt', 'utf8');
    let keyloadLink = streams.Address.parse(keyloadLinkString);

    // Send tagged packet
    response = await subscriber
      .clone()
      .send_tagged_packet(keyloadLink, publicPayload, maskedPayload);
    let taggedPacketLink = response.link;
    console.log("Tagged packet link: ", taggedPacketLink.toString());

    //Fetch message details
    let taggedPacketMessageDetails = await subscriber.clone().get_client().get_link_details(taggedPacketLink.copy());
    //console.log('\x1b[34m%s\x1b[0m', getExplorerUrl("mainnet", taggedPacketMessageDetails.get_metadata().message_id));
    let messageId = taggedPacketMessageDetails.get_metadata().message_id;
    console.log('\x1b[34m%s\x1b[0m', getExplorerUrl("mainnet", messageId));

    /* Convert publicPayload to string
    let publicPayloadString = new TextDecoder().decode(new Uint8Array(publicPayload));

    // Store public payload on Swarm
    let { reference } = await beeStorageAdapter.set(messageId, publicPayloadString);
    console.log("Swarm hash:", reference);*/

    // Write last message link to off-Tangle link exchange
    writeFileSync('./offTangleComs/4_lastLink.txt', taggedPacketLink.toString());
}


async function sendMultipleSignedPackets(subscriber) {
    console.log('\x1b[36m%s\x1b[0m', 'Subscriber: Synchronize channel state and send multiple signed packets');

    // Syncronize channel state
    await subscriber.clone().sync_state();

    // Read last link message
    let lastLinkString = readFileSync('./offTangleComs/4_lastLink.txt', 'utf8');
    let lastLink = streams.Address.parse(lastLinkString);

    for (var x = 1; x <= 3; x++) {
      
      // Define content
      let publicPayload = to_bytes(`This is public payload of message #${x}`);
      let maskedPayload = to_bytes(`This is masked payload of message #${x}`);
      
      // Send signed packet
      response = await subscriber
        .clone()
        .send_signed_packet(lastLink, publicPayload, maskedPayload);
        lastLink = response.link;
      console.log(`Signed packet #${x} link: `, lastLink.toString());

      //Fetch message details
      let signedPacketMessageDetails = await subscriber.clone().get_client().get_link_details(lastLink.copy());
      console.log('\x1b[34m%s\x1b[0m', getExplorerUrl("mainnet", signedPacketMessageDetails.get_metadata().message_id));
      console.log("\n");
    }

    // Write last message link to off-Tangle link exchange
    writeFileSync('./offTangleComs/4_lastLink.txt', lastLink.toString());
}


exports.createSubscriber = createSubscriber;
exports.subscribeChannel = subscribeChannel;
exports.sendTaggedPacket = sendTaggedPacket;
exports.sendMultipleSignedPackets = sendMultipleSignedPackets;