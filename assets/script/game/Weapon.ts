/**
 * 该函数控制元素化为武器去攻击boss
 */
import { _decorator, Component, find, instantiate, Node, Vec3 } from 'cc';
import { GameManger } from './GameManger';
const { ccclass, property } = _decorator;


@ccclass('Weapon')
export class Weapon extends Component {

    // 武器移动速度
    speed = 200;
    // 武器属性类型
    weapontype = null;
    // 武器攻击力
    weaponattack = null;
    start () {
        
    }

    getweapontype(){
        return this.weapontype;
    }

    getweaponattack(){
        return this.weaponattack;
    }

    setwaepontype(type: number){
        this.weapontype = type;
    }

    setweaponattack(attack: number){
        this.weaponattack = attack;
    }

    update (deltaTime: number) {
        if(this.node != null){
            this.node.setPosition(this.node.position.x, this.node.position.y+this.speed*deltaTime,0);
        }
        if(this.node.position.y>700){
            this.destroyweapon();
        }
    }

    destroyweapon() {
        this.node.destroy();
        if(this.node.isValid){
            console.log('销毁成功！');
        }     
    }
}
