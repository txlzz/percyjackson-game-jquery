var ducks = [
  {
    'id': 1,
    'name': 'Zeus',
    'image': 'img/Zeus.png'
  },
  {
    'id': 2,
    'name': 'Demetra',
    'image': 'img/Demetra.png'
  },
  {
    'id': 3,
    'name': 'Dionysus',
    'image': 'img/Dionysus.png'
  },
  {
    'id': 4,
    'name': 'Hades',
    'image': 'img/Hades.png'
  },
  {
    'id': 5,
    'name': 'Poseidon',
    'image': 'img/Poseidon.png'
  },
  {
    'id': 6,
    'name': 'Hermes' ,
    'image': 'img/Hermes.png'
  },
  {
    'id': 7,
    'name': 'Aphrodite',
    'image': 'img/Aphrodite.png'
  },
  {
    'id': 8,
    'name': 'Apollo',
    'image': 'img/Apollo.png'
  },
  {
    'id': 9,
    'name': 'Ares',
    'image': 'img/Ares.png'
  },
  {
    'id': 10,
    'name': 'Artemis',
    'image': 'img/Artemis.png'
  },
  {
    'id': 11,
    'name': 'Athena',
    'image': 'img/Athena.png'
  },
  {
    'id': 12,
    'name': 'Artemis',
    'image': 'img/Artemis.png'
  },
  {
    'id': 13,
    'name': 'Dionysus',
    'image': 'img/Dionysus.png'
  },
  {
    'id': 14,
    'name': 'Wood Duck' ,
    'image': 'img/wood_duck2_150x150.jpg'
  },
    {
    'id': 15,
    'name': 'Zeus',
    'image': 'img/Zeus.png'
  }
];

var Tile = function(data) {
  this.id = data.id;
  this.name = ko.observable(data.name);
  this.image = ko.observable(data.image);
  this.matched = ko.observable(false);
  this.imageVisible = ko.observable(false);

  this.imageUrl = ko.computed(function() {
    if (this.imageVisible()) {
      return this.image;
    } else {
      return 'img/tile-white.png';
    }
  }, this);
};

var ViewModel = function() {
  var self = this;


  this.tileList = ko.observableArray([]);
  this.NUM_TILES = 8;
  this.matchesLeft = ko.observable(this.NUM_TILES);
  this.turnsTaken = ko.observable(0);
  this.pickedTile1 = ko.observable();
  this.pickedTile2 = ko.observable();
  this.addTiles = function(tiles) {
    tiles.forEach(function(tileItem) {
      self.tileList.push(new Tile(tileItem));
    });
};

  this.addMatchingTiles = function(tiles) {
    var validTileIds = _.pluck(self.tileList(), 'id');
    tiles.forEach(function(tileItem) {
      if (_.contains((validTileIds), tileItem.id)) {
        self.tileList.push(new Tile(tileItem));
      }
    });
  };

  this.shuffleTiles = function() {
   self.tileList(_.shuffle(self.tileList()));
  };

  this.removeExtraTiles = function() {
    self.tileList.splice(self.NUM_TILES);
  };

  this.toggleVisibility = function(tile) {
    tile.imageVisible(!tile.imageVisible());
  };

  this.pickTile = function(tile) {
     if(typeof self.pickedTile1() === 'undefined') {
      self.pickedTile1(tile);
      self.toggleVisibility(self.pickedTile1());
    } else if (tile !== self.pickedTile1() && typeof self.pickedTile2() === 'undefined') {
        self.pickedTile2(tile);
        self.turnsTaken(self.turnsTaken() + 1);
        self.toggleVisibility(self.pickedTile2());
        if (self.pickedTile1().id === self.pickedTile2().id) {
          self.matchFound();
        } else {
          self.noMatchFound();
        }
    }
  };

  // This function is called by pickTile() if player selected two matching tiles.
  // It shows the tiles for 1.5 seconds and the turn is over. It calls initializeTurn()
  // to start the next turn.
  this.matchFound = function() {
    setTimeout(function(){
    self.pickedTile1().matched(true);
    self.pickedTile2().matched(true);
    self.matchesLeft(self.matchesLeft() - 1);
      self.toggleVisibility(self.pickedTile1());
      self.toggleVisibility(self.pickedTile2());
      self.initializeTurn();
    }, 1500);
  };

  // This function is called by pickTile() if player selected two tiles that do not match.
  // The tiles will be visible for 2.2 seconds and then "turned over" which hides the image.
  this.noMatchFound = function() {
    setTimeout(function(){
      self.toggleVisibility(self.pickedTile1());
      self.toggleVisibility(self.pickedTile2());
      self.initializeTurn();
    }, 2200);

  };

  // Called by matchFound() or noMatchFound() to reset variables for the next turn.
  this.initializeTurn = function() {
    self.pickedTile1(undefined);
    self.pickedTile2(undefined);
  };

  // Initialize Game. First, instantiate tiles, then shuffle tiles before removing extra
  // tiles if the are more tiles intantiated than self.NUM_TILES. Add matching tiles for
  // the tiles to be used, then shuffle the tiles again.
  this.initializeGame = function() {
    self.addTiles(ducks);
    self.shuffleTiles();
    if (self.tileList().length > self.NUM_TILES) {
      self.removeExtraTiles();
    }
    self.addMatchingTiles(ducks);
    self.shuffleTiles();
  };

  // Reset the game. Called when player clicks the "Play Again" button.
  this.playAgain = function() {
    self.matchesLeft(self.NUM_TILES);
    self.turnsTaken(0);
    self.tileList.removeAll();
    self.initializeGame();
    self.initializeTurn();
  };

  self.initializeGame();
};

ko.applyBindings(new ViewModel());
