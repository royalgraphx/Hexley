<p align="center">
  <img src="./assets/hexley_sits.png" width="75%" height="75%">
</p>

# Hexley
An Open Source, Modular Discord Bot that is written in NodeJS for Server Management and Enrichment.

Features:

| Module Name | Purpose | Commands |
| --- | --- | --- |
| autorole | Automatically assigns roles to a user upon joining the server. | None |
| interactivecli | Turns the console output into an interactive shell which allows for sending messages as the bot. | ``[Channel ID] [Message Content]``, [stop] |
| linkfinder | Allows a user to quickly link a URL to someone in a text channel. | ``/link [search]`` |
| moderation | Loads other submodules which allows for easier moderating of public servers. | ``/mute [user]``, ``/unmute [user]`` |
| selfassign | Spawns a dropdown menu message in a specified channel which allows for users to self assign roles. | None |
| time | Allows users to view the current time of other users in the server, specifically for knowing if one is possibly active or not. | ``/settz [City, State, or County]``, ``/time [user]`` |
| verbose | Actively shows messages in ``[Time] [Channel] [User]: [Message]`` format in the console. Does not log any messages. | None |

Requirements:

main.js vars
```
discord_token=
guildId=
memberRoleId=
```

/modules/selfassign/selfassign.js
```
channelId=
amdRoleId=
intelRoleId=
```

/modules/moderation/moderation.js
```
moderatorRoleId=
mutedRoleId=
```

/modules/time/time.js and /modules/time/tzSetter.js
```
geonamesUsername=
username=

You can register for a free geonames account at https://www.geonames.org/login and don't forget to enable API features.
```

Install dependencies with

``npm install``

run with

```
chmod +x run.sh
./run.sh
```

Written within a [DarwinKVM](https://github.com/royalgraphx/DarwinKVM) Virtual Machine!

Join the discord this server lives in!