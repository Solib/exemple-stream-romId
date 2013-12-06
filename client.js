var Client = IgeClass.extend({
	classId: 'Client',

	init: function () {
		//ige.timeScale(0.1);
		ige.showStats(1);
		ige.globalSmoothing(true);
		
		 // Enable stats display to show on-screen
        // FPS and other useful metrics
        ige.showStats(1);
 
        // Enable input debug logging to log input
        // events like mouse clicks to the console
        ige.input.debug(true);

		// Load our textures
		var self = this;

		// Enable networking
		ige.addComponent(IgeNetIoComponent);

		// Implement our game methods
		this.implement(ClientNetworkEvents);

		// Create the HTML canvas
		ige.createFrontBuffer(true);

		// Load the textures we want to use
		this.textures = {
			grassSheet: new IgeCellSheet('../../assets/textures/tiles/grassSheet.png', 4, 1)
		};

		ige.on('texturesLoaded', function () {
			// Ask the engine to start
			ige.start(function (success) {
				// Check if the engine started successfully
                if (!success) {
                } else {
                    // Start the networking (you can do this elsewhere if it
                    // makes sense to connect to the server later on rather
                    // than before the scene etc are created... maybe you want
                    // a splash screen or a menu first? Then connect after you've
                    // got a username or something?
                    ige.network.start('http://localhost:2000', function () {
                        // Setup the network command listeners
                        ige.network.define('playerEntity', self._onPlayerEntity); // Defined in ./gameClasses/ClientNetworkEvents.js

                        // Setup the network stream handler
                        ige.network.addComponent(IgeStreamComponent)
                            .stream.renderLatency(80) // Render the simulation 160 milliseconds in the past
                            // Create a listener that will fire whenever an entity
                            // is created because of the incoming stream data
                            .stream.on('entityCreated', function (entity) {
                                self.log('Stream entity created with ID: ' + entity.id());
                                self.log('info enety +=+=+ ' + entity);
                                //self.log('entity join room: ' + entity.room);

                            });
						
						ige.network.send('playerEntity');
						
						 //ige.network.send('joinRoom');
                        ige.network.request('room', {}
                            , function (commandName, data) {
                                console.log('room response ++++++++++', data);
                                //ige.client.joinRoom(data);
                                ige.network.request(
                                    'joinRoom', data, function (cmd, result) {
                                        if (result.success) {
                                            // Success! - Here you might want to destroy any lobby UI you might have had
                                            self.log('roomId join ==== ' + data);
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
                        self.mainScene = new IgeScene2d()
                            .id('mainScene')
							.streamRoomId(data);

                        //var room = new IgeScene2d()
                         //   .streamRoomId('room1');

                       // room
					   self.mainScene
                            .streamMode(1)
                            .compositeStream(true);

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

                        self.uiScene = new IgeScene2d()
                            .id('uiScene')
                            .layer(2)
                            .ignoreCamera(true)
                            .mount(self.mainScene);

                        // Create the main viewport and set the scene
                        // it will "look" at as the new scene1 we just
                        // created above
                        self.vp1 = new IgeViewport()
                            .id('vp1')
                            .autoSize(true)
                            .scene(self.mainScene)
                            .drawBounds(false)
                            .mount(ige);

                        // Create the texture map that will work as our "tile background"
                        // Create the texture maps
                        self.textureMap1 = new IgeTextureMap()
                            .depth(0)
                            .drawGrid(0)
                            .translateTo(0, 0, 0)
                            .autoSection(0)
                            .drawBounds(false)
                            .mount(self.backgroundScene);

                        var texIndex = self.textureMap1.addTexture(self.textures.grassSheet);
						
						                     // Ask the server to send us the tile data
                        ige.network.request('gameTiles', {}, function (commandName, data) {
                            console.log('gameTiles response', data);
                            // Paint the texture map based on the data sent from the server
                            /*var x, y, tileData;
                             for (x = 0; x < data.length; x++) {
                             for (y = 0; y < data[x].length; y++) {
                             tileData = data[x][y];
                             self.textureMap1.paintTile(x, y, tileData[0], tileData[1]);
                             }
                             }
                             // Now set the texture map's cache data to dirty so it will
                             // be redrawn*/
                            self
                                .
                                textureMap1.loadMap(data);
                            self.textureMap1.
                                cacheDirty(true);
                        });
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

                                        } else {
                                            self.log('ERROR roomId join ==== ' + data);
                                        }
                                    });
                            });




                        // Ask the server to create an entity for us
                        

   
                       
                        // We don't create any entities here because in this example the entities
                        // are created server-side and then streamed to the clients. If an entity
                        // is streamed to a client and the client doesn't have the entity in
                        // memory, the entity is automatically created. Woohoo!
                        
                    });
                }
			});
		});
	}
});


function joinRoom(roomId) {
                            ige.network.request('joinRoom', {roomId: roomId}, function (cmd, result) {
                                    if (result.
                                        success) {
                                        // Success! - Here you might want to destroy any lobby UI you might have had
                                        self.
                                            log('roomId join ==== func ' + roomId);
                                    }
                                });
                        }

if (typeof(
    module) !== 'undefined' &&
    typeof(module.exports) !==
        'undefined') { module.exports = Client; }