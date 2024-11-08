
import { _decorator, Collider2D, Component, Contact2DType, find, Node } from 'cc';
import { GameManger } from './GameManger';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    // 血量
    enemyhp = 100;
    // 属性
    enemytype = null;
    

    onLoad() {
        // 注册单个碰撞体的回调函数
        let collider = this.node.getComponent(Collider2D);
        console.log(collider);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    start () {
        
    }

    onBeginContact () {
        // 只在两个碰撞体开始接触时被调用一次
        this.enemyhp = this.enemyhp - 10;
        console.log('碰到');
        // 然后延时执行碰撞销毁剑并播放碰撞以及爆炸音效
        
    }

    update(dt: number) {
        if(this.enemyhp<0){
            this.node.active = false;
        }
    }
}