<p align="center">
  <img src="./assets/hexley_sits.png" width="40%" height="40%">
</p>

# Hexley-Core
An Open Source, Modular Discord Bot that is written in NodeJS for Server Management and Enrichment.
<br>
<br>

# Features
</br>
</br>

| Module Name | Purpose | Commands |
| --- | --- | --- |
| autorole | Automatically assigns roles to a user upon joining the server. | None |
| customrp | Allows the user to define custom rich presence. | None |
| decode | Allows a user to decode supported encryptions. | ``/decodebase64 [base64 string]`` |
| encode | Allows a user to encode supported encryptions. | ``/encodehex 0x[0000]``, ``/encodebase64 [plain text]`` |
| help | Displays a help message displaying all supported commands. | ``/help`` |
| interactivecli | Turns the console output into an interactive shell which allows for sending commands in a pseudo terminal. | ``[Channel ID] [Message Content]``, ``stop``, ``stats`` |
| linkfinder | Allows a user to quickly link a URL to someone in a text channel. | ``/link [search]`` |
| moderation | Loads other submodules which allows for easier moderating of public servers. | ``/mute [user]``, ``/unmute [user]`` |
| pcifinder | Allows a user to gather specific information about a PCI device with its vendor/device id | ``/pci [vendor_id] [device_id]`` |
| selfassign | Spawns a dropdown menu message in a specified channel which allows for users to self assign roles. | None |
| time | Allows users to view the current time of other users in the server, specifically for knowing if one is possibly active or not. | ``/settz [City, State, or County]``, ``/time [optional: user]`` |
| verbose | Actively shows messages in ``[Time] [Channel] [User]: [Message]`` format in the console. Does not log any messages. | None |
| web | Spawns a web panel that can display information given by modules. | None |

Install dependencies with

``npm install``

run with

```bash
chmod +x run.sh
./run.sh
```

Written within a [DarwinKVM](https://github.com/royalgraphx/DarwinKVM) Virtual Machine!
Join the [discord](https://discord.gg/ryQFC8Vk7b) this bot lives in!

<img src="https://discordapp.com/api/guilds/1131552514412654683/widget.png?style=banner2" alt="Discord Banner 2"/>