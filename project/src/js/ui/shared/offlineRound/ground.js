import chessground from 'chessground-mobile';
import gameApi from '../../../lichess/game';
import settings from '../../../settings';
import { boardOrientation } from '../../../utils';

function makeConfig(data, fen) {
  return {
    fen: fen,
    orientation: boardOrientation(data),
    turnColor: data.game.player,
    lastMove: null,
    coordinates: settings.game.coords(),
    autoCastle: data.game.variant.key === 'standard',
    highlight: {
      lastMove: settings.game.highlights(),
      check: settings.game.highlights(),
      dragOver: false
    },
    movable: {
      free: false,
      color: gameApi.isPlayerPlaying(data) ? data.player.color : null,
      showDests: settings.game.pieceDestinations()
    },
    animation: {
      enabled: settings.game.animations(),
      duration: 300
    },
    premovable: {
      enabled: false
    },
    draggable: {
      centerPiece: data.pref.centerPiece,
      distance: 3,
      squareTarget: true,
      magnified: settings.game.magnified()
    }
  };
}

function applySettings(ground) {
  ground.set({
    movable: {
      showDests: settings.game.pieceDestinations()
    },
    animation: {
      enabled: settings.game.animations()
    },
    premovable: {
      showDests: settings.game.pieceDestinations()
    }
  });
}

function make(data, fen, userMove, onMove) {
  var config = makeConfig(data, fen);
  config.movable.events = {
    after: userMove
  };
  config.events = {
    move: onMove
  };
  return new chessground.controller(config);
}

function reload(ground, data, fen) {
  ground.set(makeConfig(data, fen));
}

function promote(ground, key, role) {
  var pieces = {};
  var piece = ground.data.pieces[key];
  if (piece && piece.role === 'pawn') {
    pieces[key] = {
      color: piece.color,
      role: role
    };
    ground.setPieces(pieces);
  }
}

function end(ground) {
  ground.stop();
}

export default {
  make,
  reload,
  promote,
  end,
  applySettings
};
