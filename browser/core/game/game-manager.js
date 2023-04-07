import { createLogger } from '../../modules/logging.js';
import { resourceManager } from '../../modules/net.js';
import { loadGameENV } from '../../modules/env.js';
import { STRING, FUNCTION, UTIL } from '../../modules/helpers.js';
import { LayerBuilder } from '../layer/layer-builder.js';
import { PieceBuilder } from '../piece/piece-builder.js';
import { PhysicsEngine } from '../physics/physics-engine.js';
import { GameMechanics } from '../mechanics/game-mechanics.js';
import { GameRenderer } from '../render/game-renderer.js';
import { GameRunner } from './game-runner.js';
import { ofText } from '../../modules/dom.js';
import { ActionBuilder } from '../action/action-builder.js';
import { AreaBuilder } from '../area/area-builder.js';
import { ASSERT } from '../../modules/assert.js';
import { ENTITY_TYPE } from '../game.js';
import { ModelBuilder } from '../model/model-builder.js';
const log = createLogger('GameManager');

class GameManager {
    constructor() {
        this._worldDOM = null;
        this._styleDOM = null;
        this._templateDOM = null;
        this._coreControlsDOM = null;
        this._gameControlsDOM = null;
        this._coreStatusDOM = null;
        this._gameStatusDOM = null;
        this._game = null;
        this._actions = null;
        this._layers = null;
        this._areas = null;
        this._pieces = null;
        this._players = null;
        this._collisions = null;
        this._models = null;
        this._entityIdMap = null;
        this._allEntities = null;
        this._childEntities = null;
    }
    async run(name) {
        log.info(`GameAppRunning game ${name}`);
        const gameHtml = await resourceManager.getGameResource(name, 'html'); //await fetch(`/games/${name}/game.html`);
        const gameStyle = await resourceManager.getGameResource(name, 'css'); //await fetch(`/games/${name}/game.html`);

        if (STRING.isString(gameHtml)) {
            this._templateDOM = ofText(gameHtml);
        } else {
            this._templateDOM = ofText('<div></div>');
            log.warn(`game ${name} does not have html`);
        }
        if (STRING.isString(gameStyle)) {
            this._styleDOM = ofText(`<div><style>${gameStyle}</style></div>`);
        } else {
            this._styleDOM = ofText('<div></div>');

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
        await this._setup();
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
        this._entityIdMap = new Map();
        this._actions = [];
        this._layers = [];
        this._areas = [];
        this._pieces = [];
        this._players = [];
        this._collisions = [];
        this._models = [];
        this._allEntities = [];
        this._childEntities = [];
        const game = this._game;
        if (FUNCTION.hasMethod(game, 'setup')) {
            await game.setup(this, this._worldDOM);
        }

        await this._setupRules();
        await this._setupMechanics();
        await this._setupPhysics();
        await this._setupModels();
        await this._setupLayers();
        await this._setupAreas();
        await this._setupPieces();
        await this._setupCollisions();
        await this._setupActions();

    }

    _run() {
        this._findAllRelations();
        this._mechanics.setupPieces(this._actions);
        this._mechanics.setupActions(this._actions);
        this._physics.setupPieces(this._pieces);
        this._physics.setupCollisions(this._collisions);
        this._gameRenderer.setupLayers(this._worldDOM, this._layers, this._templateDOM, this._styleDOM);
        this._gameRunner = new GameRunner(this);
        this._gameRunner.start();
    }

    _findAllRelations() {
        for (const entity of this._allEntities) {
            this._findEntityRelations(entity);
        }
    }


    _findEntityRelations(entity) {
        if (!UTIL.isNullish(entity.ParentId)) {
            const parent = this._entityIdMap[entity.ParentId];
            if (UTIL.isNullish(parent) == null) {
                log.error('entity ', entity, 'has unknown ParentID ');
            } else {
                entity.Parent = parent;
                parent.addChild(entity);
            }
        }
        if (!UTIL.isNullish(entity.ModelIds)) {
            for (const modelId of entity.ModelIds) {
                const model = this._entityIdMap[modelId];
                if (UTIL.isNullish(model) == null) {
                    log.error('entity has unknown ModelID ', entity);
                } else {
                    entity.addModel(model);
                }
            }
        }
    }


    _addEntity(entity) {
        ASSERT.notNull(entity, 'addEntity requires a non-null entity');
        if (UTIL.includes(this._allEntities, entity)) {
            log.warn('entity ', entity, ' has already been added to the game');
            return;
        }
        switch (entity.EntityType) {
            case ENTITY_TYPE.LAYER:
                this._layers.push(entity);
                break;
            case ENTITY_TYPE.AREA:
                this._areas.push(entity);
                break;
            case ENTITY_TYPE.PIECE:
                this._pieces.push(entity);
                break;
            case ENTITY_TYPE.ACTION:
                this._actions.push(entity);
                break;
            case ENTITY_TYPE.MODEL:
                this._models.push(entity);
                break;

        }
        this._allEntities.push(entity);
        if (!UTIL.isNullish(entity.id)) {
            const id = entity.id;
            ASSERT.null(this._entityIdMap[id], 'addEntity requires a non-null entity ID ', id, ' alread exists');
            this._entityIdMap[id] = entity;
        }
        if (!UTIL.isNullish(entity.ParentId)) {
            this._childEntities.push(entity);
        }
    }


    getEntityById(id, expectedType = null) {
        ASSERT.notNull(id, 'getEntityById requires an id');
        const entity = this._entityIdMap[id];
        if (expectedType != null) {
            ASSERT.isEqual(expectedType, entity.Type, 'expect type ', expectedType, ' but got ', entity.Type);
        }
        return entity;
    }

    getLayer(id) {
        return this.getEntityById(id, ENTITY_TYPE.LAYER);
    }

    getPiece(id) {
        return this.getEntityById(id, ENTITY_TYPE.PIECE);
    }
    getArea(id) {
        return this.getEntityById(id, ENTITY_TYPE.AREA);
    }
    getModel(id) {
        return this.getEntityById(id, ENTITY_TYPE.MODEL);
    }

    getAction(id) {
        return this.getEntityById(id, ENTITY_TYPE.ACTION);
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


    async _setupModels() {
        const game = this._game;
        const modelBuilder = new ModelBuilder(this);

        if (FUNCTION.hasMethod(game, 'defineModels')) {
            await game.defineModels(modelBuilder);
            modelBuilder.buildAll();
        } else {
            modelBuilder._buildDefaultModels();
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
        const actionBuilder = new ActionBuilder(this);
        if (FUNCTION.hasMethod(game, 'defineActions')) {
            await game.defineActions(actionBuilder);
            actionBuilder.buildAll();
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


    setWorld(dom) {
        this._worldDOM = dom;
    }
    setCoreControls(dom) {
        this._coreControlsDOM = dom;
        this._coreControlsDOM.append('<div>JSGames</div>');
    }
    setGameControls(dom) {
        this._gameControlsDOM = dom;
    }
    setCoreStatus(dom) {
        this._coreStatusDOM = dom;
        this._coreStatusDOM.append('<div>Running</div>');
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

    createId(name) {
        return Symbol(name);
    }

}

export { GameManager };