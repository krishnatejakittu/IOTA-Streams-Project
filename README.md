# IOTA-Streams-Project
**Installation steps:**

npm install @iota/streams/node

npm install @ethersphere/bee-js

**Output from running main.js should be like below **

Step 1
Author: Create author and new channel
Author seed:  37dbae17aa6a2f732ee246ecfaa7e713816020cb1655c609b05846ec302bcf40
Channel address:  5793832cd3a3fe942c624e263705c45891c5d164f6f3c41e299f9ab411c604100000000000000000
Multi branching:  false


Step 2
Author: Send announcement
Announcement link:  5793832cd3a3fe942c624e263705c45891c5d164f6f3c41e299f9ab411c604100000000000000000:81f08c2068bcd24879dc2ba9
https://explorer.iota.org/mainnet/message/b7d8ae28fb4adc3d1def656e6d413cc293aa77860ee7952b63b74170c5d8ed81


Step 3
Subscriber: Create subscriber
Subscriber seed:  297b967e563f08bdcdff4911f89cf269146d13d6944ff451f11c6d7893bb0a64


Step 4
Subscriber: Receive announcement and subscribe to channel
Subscription link:  5793832cd3a3fe942c624e263705c45891c5d164f6f3c41e299f9ab411c604100000000000000000:22a503e891cc80e41e900574
https://explorer.iota.org/mainnet/message/bbbc13e42e9d057a4f140616a7484846ed26d12a3aa2660dc7afa575b54f2cf6


Step 5
Author: Receive subscription and send keyload message
Keyload link:  5793832cd3a3fe942c624e263705c45891c5d164f6f3c41e299f9ab411c604100000000000000000:a9e5693efc0f5bd16fdf27c5
https://explorer.iota.org/mainnet/message/12d65f200379550431ac49d548f94855b5a7b584c6a036a75015c25e64c8a2d8


Step 6
Subscriber: Synchronize channel state and send tagged packet
Tagged packet link:  5793832cd3a3fe942c624e263705c45891c5d164f6f3c41e299f9ab411c604100000000000000000:70bcd16b07b191a70ed2b2a9
https://explorer.iota.org/mainnet/message/48055aaf7e73aa517e0664d93d7e3e5796cba33b7b5f2883bc318785e176013c


**Step 7
Author: Fetch new messages from channel
Message link: 5793832cd3a3fe942c624e263705c45891c5d164f6f3c41e299f9ab411c604100000000000000000:70bcd16b07b191a70ed2b2a9
https://explorer.iota.org/mainnet/message/48055aaf7e73aa517e0664d93d7e3e5796cba33b7b5f2883bc318785e176013c
Public payload:  dateTime: 25/05/2023 17:21:42, data: 61
Masked payload:  This is masked payload**


Step 8
Subscriber: Synchronize channel state and send multiple signed packets
Signed packet #1 link:  5793832cd3a3fe942c624e263705c45891c5d164f6f3c41e299f9ab411c604100000000000000000:47b348e52bbff6221502eed2
https://explorer.iota.org/mainnet/message/001f96457ae4b9590340eddfa3e39e259f1ceadab5b7bb1b8b2e8de6136c85a6


Signed packet #2 link:  5793832cd3a3fe942c624e263705c45891c5d164f6f3c41e299f9ab411c604100000000000000000:ac273da88f3aa677d59a7813
https://explorer.iota.org/mainnet/message/f4427fef4be285a738a5311cdc0a0223c538cae166ac510cb006610944bd0c7f


Signed packet #3 link:  5793832cd3a3fe942c624e263705c45891c5d164f6f3c41e299f9ab411c604100000000000000000:ab0b1743c37661b741f26dd6
https://explorer.iota.org/mainnet/message/96a6bb90bf1b86fe2a28fb700a8f3ae5b3e9dbc4198c3a68782d1fc0ab3ad6db


**Step 9
Author: Fetch new messages from channel**
Message link: 5793832cd3a3fe942c624e263705c45891c5d164f6f3c41e299f9ab411c604100000000000000000:47b348e52bbff6221502eed2
https://explorer.iota.org/mainnet/message/001f96457ae4b9590340eddfa3e39e259f1ceadab5b7bb1b8b2e8de6136c85a6
Public payload:  This is public payload of message #1
Masked payload:  This is masked payload of message #1


Message link: 5793832cd3a3fe942c624e263705c45891c5d164f6f3c41e299f9ab411c604100000000000000000:ac273da88f3aa677d59a7813
https://explorer.iota.org/mainnet/message/f4427fef4be285a738a5311cdc0a0223c538cae166ac510cb006610944bd0c7f
Public payload:  This is public payload of message #2
Masked payload:  This is masked payload of message #2


Message link: 5793832cd3a3fe942c624e263705c45891c5d164f6f3c41e299f9ab411c604100000000000000000:ab0b1743c37661b741f26dd6
https://explorer.iota.org/mainnet/message/96a6bb90bf1b86fe2a28fb700a8f3ae5b3e9dbc4198c3a68782d1fc0ab3ad6db
Public payload:  This is public payload of message #3
Masked payload:  This is masked payload of message #3
