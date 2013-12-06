var config = {
	include: [
		{name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
		{name: 'Character', path: './gameClasses/Character'},
		{name: 'CharacterContainer', path: './gameClasses/CharacterContainer'},
		{name: 'PlayerComponent', path: './gameClasses/PlayerComponent'},
		{name: 'room1', path: 'maps/room1/BackgroundLayer1'},
		{name: 'room2', path: 'maps/room2/BackgroundLayer1'}
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }