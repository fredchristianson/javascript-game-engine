import { createLogger } from '../../modules/logging.js';
import { resourceManager } from '../../modules/net.js';
import { loadGameENV } from '../../modules/env.js';
import { STRING, FUNCTION } from '../../modules/helpers.js';
import { DOMWorld } from '../world.js';
import { LayerBuilder } from '../layer/layer-builder.js';
import { PieceBuilder } from '../piece/piece-builder.js';
import { RendererBuilder } from '../render/renderer-builder.js';
import { PhysicsEngine } from '../physics/physics-engine.js';
import { GameMechanics } from '../mechanics/game-mechanics.js';
import { GameRenderer } from '../render/game-renderer.js';
import { GameRunner } from './game-runner.js';
import { ofText } from '../../modules/dom.js';
const log = createLogger('GameManager');

class GameManager {
    constructor() {
        this._worldDOM = null;
        this._styleDOM = null;
        this._templateDOM = null;
        this._world = null;
        this._coreControlsDOM = null;
        this._gameControlsDOM = null;
        this._coreStatusDOM = null;
        this._gameStatusDOM = null;
        this._game = null;
        this._actions = [];
        this._layers = [];
        this._areas = [];
        this._pieces = [];
        this._players = [];
        this._collisions = [];
    }
    async run(name) {
        log.info(`GameAppRunning game ${name}`);
        const gameHtml = await resourceManager.getGameResource(name, 'html'); //await fetch(`/games/${name}/game.html`);
        const gameStyle = await resourceManager.getGameResource(name, 'css'); //await fetch(`/games/${name}/game.html`);
        if (STRING.isString(gameHtml)) {
            this._templateDOM = ofText(gameHtml);
        } else {
            log.warn(`game ${name} does not have html`);
        }
        if (STRING.isString(gameStyle)) {
            this._styleDOM = ofText(gameStyle);
        } else {
            log.warn(`game ${name} does not have style`);
        }

        const gameModule = await resourceManager.getGameModule(name);//  await import(`/games/${name}/js/game.js`);
        await loadGameENV(name);
        const game = gameModule.game ?? gameModule.test ?? gameModule.launcher ?? gameModule.default;
        this._game = game;
        this._physics = new PhysicsEngine(this);
        this._mechanics = new GameMechanics(this);
        this._gameRenderer = new GameRenderer(this);
        this._gameRunner = null;
        this._setup();
        this._run();
    }

    get Mechanics() {
        return this._mechanics;
    }
    get Physics() {
        return this._physics;
    }
    get GameRenderer() {
        return this._gameRenderer;
    }

    async _setup() {
        this._actions = [];
        this._layers = [];
        this._areas = [];
        this._pieces = [];
        this._players = [];
        this._collisions = [];
        const game = this._game;
        if (FUNCTION.hasMethod(game, 'setup')) {
            await game.setup(this, this._world);
        }

        await this._setupRules();
        await this._setupMechanics();
        await this._setupPhysics();
        await this._setupRenderers();
        await this._setupActions();
        await this._setupLayers();
        await this._setupPieces();
        await this._setupCollisions();

    }
    _run() {
        this._mechanics.setupPieces(this._actions);
        this._mechanics.setupActions(this._actions);
        this._physics.setupPieces(this._pieces);
        this._physics.setupCollisions(this._collisions);
        this._gameRenderer.setupLayers(this._worldDOM, this._layers, this._templateDOM, this._styleDOM);
        this._gameRunner = new GameRunner(this);
        this._gameRunner.start();
    }

    async _setupLayers() {
        const game = this._game;
        const layerBuilder = new LayerBuilder(this);

        if (FUNCTION.hasMethod(game, 'defineLayers')) {
            await game.defineLayers(layerBuilder);
            layerBuilder.buildAll();
        } else {
            layerBuilder._buildDefaultLayers();
        }
    }

    async _setupAreas() {
        const game = this._game;
        const areaBuilder = new AreaBuilder(this);

        if (FUNCTION.hasMethod(game, 'defineAreas')) {
            await game.defineAreas(areaBuilder);
            areaBuilder.buildAll();
        } else {
            areaBuilder._buildDefaultAreas();
        }
    }

    async _setupPieces() {
        const game = this._game;
        const pieceBuilder = new PieceBuilder(this);

        if (FUNCTION.hasMethod(game, 'definePieces')) {
            await game.definePieces(pieceBuilder);
            pieceBuilder.buildAll();
        }
    }


    async _setupPlayers() {
        const game = this._game;
        if (FUNCTION.hasMethod(game, 'definePlayers')) {

        } else {

        }
    }

    async _setupActions() {
        const game = this._game;
        if (FUNCTION.hasMethod(game, 'defineActions')) {

        } else {

        }
    }
    async _setupCollisions() {
        const game = this._game;
        if (FUNCTION.hasMethod(game, 'defineCollisions')) {

        } else {

        }
    }
    async _setupRules() {
        const game = this._game;
        if (FUNCTION.hasMethod(game, 'defineRules')) {

        } else {

        }
    }
    async _setupMechanics() {
        const game = this._game;
        if (FUNCTION.hasMethod(game, 'defineMechanics')) {

        } else {

        }
    }
    async _setupPhysics() {
        const game = this._game;
        if (FUNCTION.hasMethod(game, 'definePhysics')) {

        } else {

        }
    }
    async _setupRenderers() {
        const game = this._game;
        const rendererBuilder = new RendererBuilder(this);

        if (FUNCTION.hasMethod(game, 'defineRenderers')) {
            await game.defineRenderers(rendererBuilder);
            rendererBuilder.buildAll();
        }
    }

    setWorld(dom) {
        this._worldDOM = dom;
        this._world = new DOMWorld(dom);
    }
    setCoreControls(dom) {
        this._coreControlsDOM = dom;
    }
    setGameControls(dom) {
        this._gameControlsDOM = dom;
    }
    setCoreStatus(dom) {
        this._coreStatusDOM = dom;
    }
    setGameStatus(dom) {
        this._gameStatusDOM = dom;
    }

    get Actions() {
        return this._actions;
    }
    get Layers() {
        return this._layers;
    }
    get Areas() {
        return this._areas;
    }
    get Pieces() {
        return this._pieces;
    }
    get Players() {
        return this._players;
    }

    addAction(...action) {
        this._actions.push(...action);
    }
    addLayer(...layer) {
        this._layers.push(...layer);
    }
    addArea(...area) {
        this._areas.push(...area);
    }
    addPiece(...piece) {
        this._pieces.push(...piece);
    }
    addPlayer(...player) {
        this._players.push(...player);
    }

}

export { GameManager };