var Server = IgeClass.extend({
	classId: 'Server',
	Server: true,

	init: function (options) {

 
        // Enable input debug logging to log input
        // events like mouse clicks to the console
        ige.input.debug(true);
	
	
		var self = this;
		ige.timeScale(1);

		// Define an object to hold references to our player entities
		this.players = {};
		
		this.countplayers = 0;
		
		this.room = '';
		//this.roomScene = '';
		
		// Define an array to hold our tile data
		this.tileData = [];

		// Add the server-side game methods / event handlers
		this.implement(ServerNetworkEvents);

		// Add the networking component
		ige.addComponent(IgeNetIoComponent)
			// Start the network server
			.network.start(2000, function () {
				// Networking has started so start the game engine
				ige.start(function (success) {
					// Check if the engine started successfully
					if (success) {
						// Create some network commands we will need
						ige.network.define('gameTiles', function (data, clientId, requestId) {
							console.log('Client gameTiles command received from client id "' + clientId + '" with data:', data);
							
							// Send the tile data back
							ige.network.response(requestId, self.tileData);
							// send room data back
							ige.network.response(requestId, self.room);
							console.log('room player data:', self.room);
						});
						
						ige.network.define('room', function (data, clientId, requestId) {
							// send room data back
							ige.network.response(requestId, self.room);


						});
						
						ige.network.define('playerEntity', self._onPlayerEntity);
						ige.network.define('playerControlToTile', self._onPlayerControlToTile);

						ige.network.on('connect', self._onPlayerConnect); // Defined in ./gameClasses/ServerNetworkEvents.js
						ige.network.on('disconnect', self._onPlayerDisconnect); // Defined in ./gameClasses/ServerNetworkEvents.js

						// Add the network stream component
						ige.network.addComponent(IgeStreamComponent)
							.stream.sendInterval(30) // Send a stream update once every 30 milliseconds
							.stream.start(); // Start the stream

						// Accept incoming network connections
						ige.network.acceptConnections(true);
						
						console.log('room start server:', self.room);
						
						//var allroom = new Array('room1','room2')

                        var room = new IgeScene2d()
                            .streamRoomId('room1');

                        room
                            .streamMode(1)
                            .compositeStream(true);



						
							// Create the scene
						self.mainScene = new IgeScene2d()
							.id('mainScene');
							//.streamRoomId('room2');
							
						


						self.backgroundScene = new IgeScene2d()
							.id('backgroundScene')
							.layer(0)
							.mount(self.mainScene);
						
						self.foregroundScene = new IgeScene2d()
							.id('foregroundScene')
							.layer(1)
							.mount(self.mainScene);
						
						self.foregroundMap = new IgeTileMap2d()
							.id('foregroundMap')
							.isometricMounts(false)
							.tileWidth(40)
							.tileHeight(40)
							.mount(self.foregroundScene);

						// Create the main viewport and set the scene
						// it will "look" at as the new scene1 we just
						// created above
						self.vp1 = new IgeViewport()
							.id('vp1')
							.autoSize(true)
							.scene(self.mainScene)
							.drawBounds(true)
							.mount(ige);
		
						// Create a tile map to use as a collision map. Basically if you set
						// a tile on this map then it will be "impassable".
						self.collisionMap = new IgeTileMap2d()
							.tileWidth(40)
							.tileHeight(40)
							.translateTo(0, 0, 0);
							//.occupyTile(1, 1, 1, 1, 1); // Mark tile area as occupied with a value of 1 (x, y, width, height, value);
						
						// Generate some random data for our background texture map
						// this data will be sent to the client when the server receives
						// a "gameTiles" network command
						//console.log('player room server.js', this.players[clientId].room);
						//self.tileData = room1;
						
						// Create a pathFinder instance that we'll use to find paths
						self.pathFinder = new IgePathFinder()
							.neighbourLimit(100);
							
						// Define a network command the client can use to request to join a room by a room id
						
						ige.network.define('joinRoom', clientWantsToJoinRoom);

						function clientWantsToJoinRoom (data, clientId, requestId) {
						console.log('clientWantsToJoinRoom data:', data);

								ige.network.clientJoinRoom(clientId, data);
								ige.network.response(requestId, {success: true});
								
						}
					}
				});
			});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Server; }