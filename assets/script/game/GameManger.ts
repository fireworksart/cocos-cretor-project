import { _decorator, Button, Component, director, find, game, instantiate, Label, Node, Prefab, PrefabLink, resources, Vec3 } from 'cc';
import { elements } from './Elements';
import { Eliminate } from './Eliminate';
import { Weapon } from './Weapon';
const { ccclass, property } = _decorator;


@ccclass('GameManger')
export class GameManger extends Component {

    @property(Node)
    map = null;

    @property(Prefab)
    flash = null;
    @property(Prefab)
    wood = null;
    @property(Prefab)
    water = null;
    @property(Prefab)
    fire = null;
    @property(Prefab)
    earth = null;

    @property(Prefab)
    flashweapon = null;
    @property(Prefab)
    woodweapon = null;
    @property(Prefab)
    waterweapon = null;
    @property(Prefab)
    fireweapon = null;
    @property(Prefab)
    earthweapon = null;
    callback: () => void;

    booleanDestory = false;

    // 运行模式
    startpattern = false;

    
    // 元素地图
    public elemMap: Node[][] = [  
        [null, null, null, null, null, null, null],  
        [null, null, null, null, null, null, null],  
        [null, null, null, null, null, null, null],  
        [null, null, null, null, null, null, null],  
        [null, null, null, null, null, null, null]  
    ];

    update() {
        if(this.booleanDestory){
            this.booleanDestory = false;
            this.schedule(this.callback, 1.5);
        }
    }

    onLoad() {
        // 初始化按钮点击事件
        let buttons = find("Canvas/Button").children;
        buttons[0].on(Button.EventType.CLICK, this.introduce, this);
        buttons[1].on(Button.EventType.CLICK, this.speed, this);
        buttons[2].on(Button.EventType.CLICK, this.pattern, this);
        buttons[3].on(Button.EventType.CLICK, this.setting, this)
        // 初始化设置界面按钮
        find("Canvas/window").children[2].on(Button.EventType.CLICK, this.close, this);
    }

    introduce(){
        // 显示游戏玩法介绍
        find("Canvas/window").active = true;
        find("Canvas/window/setting").active = false;
        find("Canvas/window/introduce").active = true;
    }

    speed(button: Button){
        // 修改游戏运行速度
        let i = Number(button.getComponentInChildren(Label).string);
        if(i == 3){
            i = 1;
        }else{
            i++;
        }
        button.getComponentInChildren(Label).string = String(i);
    }

    pattern(button: Button){
        // 修改游戏运行模式
        if(this.startpattern == false){
            button.getComponentInChildren(Label).string = "手动";
            this.startpattern = true;
        }
        else{
            button.getComponentInChildren(Label).string = "自动";
            this.startpattern = false;
        }
    }

    setting(){
        find("Canvas/window/setting").children[2].on(Button.EventType.CLICK, this.exit, this);
        find("Canvas/window/setting").children[3].on(Button.EventType.CLICK, this.exitguan, this);
        find("Canvas/window").active = true;
        find("Canvas/window/setting").active = true;
        find("Canvas/window/introduce").active = false;
    }

    close(){
        let win = find("Canvas/window");
        win.active = false;
        find("Canvas/window/setting").active = false;
        find("Canvas/window/introduce").active = false;
    }

    exitguan(){
        director.loadScene("main");
    }

    exit(){
        game.end();
    }

    start () {
        // 初始化地图
        this.mapInit();
        // 初始化boss
        let str = find("Guanka").getComponent(Label).string;
        console.log(find("Guanka"),str);
        this.enemyload(str);
        // 初始判断是否销毁元素
        let des = Eliminate.globalTraveres();
        console.log(des);
        this.callback = function () {
            if (this.Fill()) {
                this.unschedule(this.callback);
            }
        }
        if(des.length != 0){
            // 延时执行，让玩家看到过程
            this.scheduleOnce(()=>{
                Eliminate.destoryElem(des, this.elemMap);
                console.log(this.elemMap);
                Eliminate.elemFill();

                this.schedule(this.callback, 1.5);
            },2); 
        }
    }

    Fill(){
        // 初始判断是否销毁元素
        let des = Eliminate.globalTraveres();
        console.log(des);
        if(des.length != 0){
            Eliminate.destoryElem(des, this.elemMap);
            console.log(this.elemMap);
            Eliminate.elemFill();
            return 0;
        }
        else{
            console.log("结束");
            return 1;
        }
    }

    mapInit(){
        for (let i = 0; i < 5; i++) {  
            for (let j = 0; j < 7; j++) { 
                let nub = Math.floor(Math.random() * 5);  // 产生0~4之间的随机数  
                let elem = instantiate(this.elemLoadPrefabs(nub));
                this.map.addChild(elem);
                let pos = this.elemPos(i,j);
                this.elemMap[i][j] = elem;
                elem.setPosition(pos);
                elem.getComponent(elements).setElemI(i);
                elem.getComponent(elements).setElemJ(j);
                elem.getComponent(elements).setElemType(nub);
            }
        }
    }

    elemLoadPrefabs(type: number){
        switch(type){
            case 0: return this.flash;
            case 1: return this.wood;
            case 2: return this.water;
            case 3: return this.fire;
            case 4: return this.earth;
        }
    }

    elemPos(i: number, j: number){
        let elempos;  
        // 计算位置  
        if (i === 0 && j === 0) {  
            elempos = new Vec3(j * 80, i * -80, 0);  
        } else if (i === 0) {  
            elempos = new Vec3(j * 90, i * -80, 0);  
        } else if (j === 0) {  
            elempos = new Vec3(j * 80, i * -90, 0);  
        } else {  
            elempos = new Vec3(j * 90, i * -90, 0);  
        }
        return elempos;  
    }

    weaponload(type: number, pos: Vec3){
        let weapon = find("Canvas/weapon");
        console.log(weapon);
        let elemweapon = instantiate(this.loadWeapon(type));
        weapon.addChild(elemweapon);
        elemweapon.setPosition(pos);
        elemweapon.getComponent(Weapon).setwaepontype(type);
        elemweapon.getComponent(Weapon).setweaponattack(10);
    }

    loadWeapon(type: number){
        let canvas = find("Canvas").getComponent(GameManger);
        switch(type){
            case 0: return canvas.flashweapon;
            case 1: return canvas.woodweapon;
            case 2: return canvas.waterweapon;
            case 3: return canvas.fireweapon;
            case 4: return canvas.earthweapon;
        }
    }

    enemyload(nub: string){
        resources.load("enemyprefabs/"+nub, Prefab, (err, prefab) => {
            const newNode = instantiate(prefab);
            find("Canvas/Enemy").addChild(newNode);
        });
    }

    victorgame(){
        find("Canvas/victor").active = true;
        find("Canvas/victor").children[2].on(Button.EventType.CLICK, this.exitguan, this);
        find("Canvas/victor").children[3].on(Button.EventType.CLICK, this.exitguan, this);
    }

    feacegame(){
        find("Canvas/feace").active = true;
        find("Canvas/feace").children[2].on(Button.EventType.CLICK, this.exitguan, this);
        find("Canvas/feace").children[3].on(Button.EventType.CLICK, this.exitguan, this);
    }
}