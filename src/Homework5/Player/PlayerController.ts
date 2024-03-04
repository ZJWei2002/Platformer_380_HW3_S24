import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import GameNode, { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import Level1 from "../Scenes/Level1";
import { HW5_Color } from "../hw5_color";
import { HW5_Events } from "../hw5_enums";
import Fall from "./PlayerStates/Fall";
import Idle from "./PlayerStates/Idle";
import InAir from "./PlayerStates/InAir";
import Jump from "./PlayerStates/Jump";
import Run from "./PlayerStates/Run";
import Walk from "./PlayerStates/Walk";

export enum PlayerType {
    PLATFORMER = "platformer",
    TOPDOWN = "topdown"
}

export enum PlayerStates {
    IDLE = "idle",
    WALK = "walk",
	RUN = "run",
	JUMP = "jump",
    FALL = "fall",
	PREVIOUS = "previous"
}

export default class PlayerController extends StateMachineAI {
    protected owner: GameNode;
    velocity: Vec2 = Vec2.ZERO;
	speed: number = 200;
	MIN_SPEED: number = 200;
    MAX_SPEED: number = 300;
    tilemap: OrthogonalTilemap;
    suitColor: HW5_Color;
    level1_button1_pressed: boolean = false;
    level1_button2_pressed: boolean = false;
    level1_button3_pressed: boolean = false;
    level1_button4_pressed: boolean = false;
    level2_button1_pressed: boolean = false;
    level2_button2_pressed: boolean = false;
    level2_button3_pressed: boolean = false;
    level2_button4_pressed: boolean = false;
    level2_button5_pressed: boolean = false;
    level2_button6_pressed: boolean = false;
    level2_button7_pressed: boolean = false;

    // HOMEWORK 5 - TODO
    /**
     * Implement a death animation for the player using tweens. The animation rotate the player around itself multiple times
     * over the tween duration, as well as fading out the alpha value of the player. The tween should also make use of the
     * onEnd field to send out a PLAYER_KILLED event.
     * 
     * Tweens MUST be used to create this new animation, although you can add to the spritesheet if you want to add some more detail.
     * 
     * Look at incPlayerLife() in GameLevel to see where this animation would be called.
     */
    initializeAI(owner: GameNode, options: Record<string, any>){
        this.owner = owner;

        this.initializePlatformer();

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;

        this.suitColor = options.color;

        this.receiver.subscribe(HW5_Events.SUIT_COLOR_CHANGE);

        owner.tweens.add("flip", {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 2*Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });

    }

    initializePlatformer(): void {
        this.speed = 400;

        let idle = new Idle(this, this.owner);
		this.addState(PlayerStates.IDLE, idle);
		let walk = new Walk(this, this.owner);
		this.addState(PlayerStates.WALK, walk);
		let run = new Run(this, this.owner);
		this.addState(PlayerStates.RUN, run);
		let jump = new Jump(this, this.owner);
        this.addState(PlayerStates.JUMP, jump);
        let fall = new Fall(this, this.owner);
        this.addState(PlayerStates.FALL, fall);
        
        this.initialize(PlayerStates.IDLE);
    }

    changeState(stateName: string): void {
        // If we jump or fall, push the state so we can go back to our current state later
        // unless we're going from jump to fall or something
        if((stateName === PlayerStates.JUMP || stateName === PlayerStates.FALL) && !(this.stack.peek() instanceof InAir)){
            this.stack.push(this.stateMap.get(stateName));
        }

        super.changeState(stateName);
    }

    // HOMEWORK 5 - TODO
    /**
     * We want to detect when our player is moving over one of the switches in the world, and along with the sound
     * and label changes, we also visually want to change the tile.
     * 
     * You'll have to figure out when the player is over a tile, and then change that tile to the ON tile that you see in
     * tileset.png in tilemaps. You also need to send the PLAYER_HIT_SWITCH event so elements can be handled in GameLevel.ts
     * 
     * Make use of the tilemap field in the PlayerController and the methods at it's disposal.
     * 
     */
    update(deltaT: number): void {
		super.update(deltaT);
		if(this.currentState instanceof Jump){
			Debug.log("playerstate", "Player State: Jump");
		} else if (this.currentState instanceof Walk){
			Debug.log("playerstate", "Player State: Walk");
		} else if (this.currentState instanceof Run){
			Debug.log("playerstate", "Player State: Run");
		} else if (this.currentState instanceof Idle){
			Debug.log("playerstate", "Player State: Idle");
		} else if(this.currentState instanceof Fall){
            Debug.log("playerstate", "Player State: Fall");
        }

        // switch detector for level1
        if(this.tilemap.getScene() instanceof Level1) {
            // first button
            if(this.owner.position.x >= 6 * 32 && this.owner.position.x <= 7 * 32 
                && this.owner.position.y == 15.5 * 32 && !this.level1_button1_pressed) {
                console.log("Button 1 pressed");
                this.emitter.fireEvent(HW5_Events.PLAYER_HIT_SWITCH);
                this.level1_button1_pressed = true;
                // change off to on
            }
            // second button
            if(this.owner.position.x >= 23 * 32 && this.owner.position.x <= 24 * 32 
                && this.owner.position.y == 12.5 * 32 && !this.level1_button2_pressed) {
                console.log("Button 2 pressed");
                this.emitter.fireEvent(HW5_Events.PLAYER_HIT_SWITCH);
                this.level1_button2_pressed = true;
                // change off to on
            }
            // Third button
            if(this.owner.position.x >= 35 * 32 && this.owner.position.x <= 36 * 32 
                && this.owner.position.y == 18.5 * 32 && !this.level1_button3_pressed) {
                console.log("Button 3 pressed");
                this.emitter.fireEvent(HW5_Events.PLAYER_HIT_SWITCH);
                this.level1_button3_pressed = true;
                // change off to on
            }
            // last button
            if(this.owner.position.x >= 49 * 32 && this.owner.position.x <= 50 * 32 
                && this.owner.position.y == 15.5 * 32 && !this.level1_button4_pressed) {
                console.log("Button 4 pressed");
                this.emitter.fireEvent(HW5_Events.PLAYER_HIT_SWITCH);
                this.level1_button4_pressed = true;
                // change off to on
            }
        }
	}
}