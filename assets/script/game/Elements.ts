/**
 * 函数实现获取元素类型，位置
 * 以及元素移动。
 */
import { _decorator, AudioClip, AudioSource, Component, find, Node, tween, Vec3 } from 'cc';
import { Eliminate } from './Eliminate';
import { GameManger } from './GameManger';
import { Weapon } from './Weapon';
const { ccclass, property } = _decorator;


@ccclass('elements')
export class elements extends Component {

    private startTouchPos: Vec3 = null;
    public elemI: number; // 行坐标
    public elemJ: number; // 列坐标
    public elemType: number; // 元素类型

    @property(AudioClip)
    public clip: AudioClip;

    @property(AudioSource)
    public audioSource: AudioSource;

    public getElemI(): number{
        return this.elemI;
    }

    public getElemJ(): number{
        return this.elemJ;
    }

    public getElemType(): number{
        return this.elemType;
    }

    public setElemI(i: number){
        this.elemI = i;
    }

    public setElemJ(j: number){
        this.elemJ = j;
    }

    public setElemType(elemType: number){
        this.elemType = elemType;
    }

    onLoad() { 
        // // 根据自身坐标计算得到该元素所在行列坐标
        // this.elemI = Math.floor(this.node.position.y / 80);
        // this.elemJ = Math.floor(this.node.position.x / -80);
        this.startTouchPos = null; // 用于存储触摸开始的位置  
  
        // 监听触摸开始事件  
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);  
        // 监听触摸结束事件 
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);  
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }  
  
    onTouchStart(event) {  
        // 获取触摸开始的位置  
        let touch = event.touch;  
        this.startTouchPos = touch.getLocation();  
    } 
   
    onTouchEnd(event) {  
        // 获取当前触摸的位置  
        let touch = event.touch;  
        let currentPos = touch.getLocation();  
  
        // 计算位置变化量  
        let deltaX = currentPos.x - this.startTouchPos.x;  
        let deltaY = currentPos.y - this.startTouchPos.y;  
        console.log("执行");
        // 判断滑动方向  
        if (Math.abs(deltaX) > Math.abs(deltaY)) {  
            // 水平滑动  
            if (deltaX > 0) {  
                // console.log("向右滑动");  
                this.elemRightMove();
                this.audioSource.playOneShot(this.clip,1);
            } else {  
                //console.log("向左滑动");  
                this.elemLfetMove();
                this.audioSource.playOneShot(this.clip,1);
            }  
        } else {  
            // 垂直滑动  
            if (deltaY > 0) {  
                // console.log("向上滑动"); 
                this.elemUpMove(); 
                this.audioSource.playOneShot(this.clip,1);
            } else {  
                // console.log("向下滑动");
                this.elemDownMove();  
                this.audioSource.playOneShot(this.clip,1);
            }  
        }
        // 触摸结束时重置起始位置（如果你需要的话）  
        this.startTouchPos = null;  
        // 在这里执行其他结束时的逻辑  
    }  
  
    onDestroy() {  
        // 移除事件监听，防止内存泄漏  
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);  
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this); 
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this); 
    }  
    
    start() {
        
    }
    // 左移
    elemLfetMove(){
            // 最左边元素无法左移
            if(this.elemJ == 0){
            }
            else{
                // 移动元素
                let elemmap = find("Canvas").getComponent(GameManger).elemMap;
                let left = elemmap[this.elemI][this.elemJ-1];
                let pos1 = left.position;
                let pos2 = this.node.position;

                // 使用缓动系统实现互换动画，互换完记得将节点数据交换。
                let tweenDuration: number = 0.2;
                tween(left)
                    .to(tweenDuration, { position: pos2})
                    .start(); 

                tween(this.node)
                    .to(tweenDuration, { position: pos1})
                    .start(); 

                // 实现i，j，坐标互换和在二维数组的位置
                let leftI = left.getComponent(elements).getElemI();
                let leftJ = left.getComponent(elements).getElemJ();
                left.getComponent(elements).setElemI(this.elemI);
                left.getComponent(elements).setElemJ(this.elemJ);
                this.elemI = leftI;
                this.elemJ = leftJ;
                elemmap[this.elemI][this.elemJ+1] = left;
                elemmap[this.elemI][this.elemJ] = this.node;
                
                let des1 = Eliminate.elemTraveres(this.node);
                let des2 = Eliminate.elemTraveres(left);    
                console.log(des1,des2);   
                
                if(des1[des1.length - 1] == -1 && des2[des2.length - 1] == -1){
                    console.log('不能交换');
                    this.scheduleOnce(()=>{
                        // 由于不能交换则需再交换一次
                        let tweenDuration: number = 0.2;
                        tween(left)
                            .to(tweenDuration, { position: pos2})
                            .start(); 

                        tween(this.node)
                            .to(tweenDuration, { position: pos1})
                            .start(); 
                        // console.log(pos1,pos2);
                        // 实现i，j，坐标互换和在父节点的顺序交换
                        let leftI = left.getComponent(elements).getElemI();
                        let leftJ = left.getComponent(elements).getElemJ();
                        left.getComponent(elements).setElemI(this.elemI);
                        left.getComponent(elements).setElemJ(this.elemJ);
                        this.elemI = leftI;
                        this.elemJ = leftJ;
                        elemmap[this.elemI][this.elemJ-1] = left;
                        elemmap[this.elemI][this.elemJ] = this.node;
                    },0.5)  
                }
                else{
                    this.scheduleOnce(()=>{
                        des1[des1.length-1] = null;
                        des2[des2.length-1] = null;
                        // 能移动则销毁元素并补充
                        Eliminate.destoryElem(des1, elemmap);
                        Eliminate.destoryElem(des2, elemmap);
                        Eliminate.elemFill();

                        find("Canvas").getComponent(GameManger).booleanDestory = true;
                    },0.5)
                }       
            }
    }

    // 右移
    elemRightMove(){
        // 最右边元素无法右移
        if(this.elemJ == 6){
        }
        else{
            // 移动元素
            let elemmap = find("Canvas").getComponent(GameManger).elemMap;
            let right = elemmap[this.elemI][this.elemJ+1];
            let pos1 = right.position;
            let pos2 = this.node.position;

            // 使用缓动系统实现互换动画，互换完记得将节点数据交换。
            let tweenDuration: number = 0.2;
            tween(right)
                .to(tweenDuration, { position: pos2})
                .start(); 

            tween(this.node)
                .to(tweenDuration, { position: pos1})
                .start(); 

            // 实现i，j，坐标互换和在父节点的顺序交换
            let leftI = right.getComponent(elements).getElemI();
            let leftJ = right.getComponent(elements).getElemJ();
            right.getComponent(elements).setElemI(this.elemI);
            right.getComponent(elements).setElemJ(this.elemJ);
            this.elemI = leftI;
            this.elemJ = leftJ;
            elemmap[this.elemI][this.elemJ-1] = right;
            elemmap[this.elemI][this.elemJ] = this.node;
            
            let des1 = Eliminate.elemTraveres(this.node);
            let des2 = Eliminate.elemTraveres(right);    
            console.log(des1,des2);           
            if(des1[des1.length - 1] == -1 && des2[des2.length - 1] == -1){
                console.log('不能交换');
                // 由于不能交换则需再交换一次
                this.scheduleOnce(()=>{
                    let tweenDuration: number = 0.2;
                    tween(right)
                        .to(tweenDuration, { position: pos2})
                        .start(); 

                    tween(this.node)
                        .to(tweenDuration, { position: pos1})
                        .start(); 
                    
                    // 实现i，j，坐标互换和在父节点的顺序交换
                    let leftI = right.getComponent(elements).getElemI();
                    let leftJ = right.getComponent(elements).getElemJ();
                    right.getComponent(elements).setElemI(this.elemI);
                    right.getComponent(elements).setElemJ(this.elemJ);
                    this.elemI = leftI;
                    this.elemJ = leftJ;
                    elemmap[this.elemI][this.elemJ+1] = right;
                    elemmap[this.elemI][this.elemJ] = this.node;
                },0.5) 
            } 
            else{
                this.scheduleOnce(()=>{
                    des1[des1.length-1] = null;
                    des2[des2.length-1] = null;
                    // 能移动则销毁元素并补充
                    Eliminate.destoryElem(des1, elemmap);
                    Eliminate.destoryElem(des2, elemmap);
                    Eliminate.elemFill();

                    find("Canvas").getComponent(GameManger).booleanDestory = true;  
                },0.5) 
            }            
        }
    }
    // 上移
    elemUpMove(){
        // 最上边元素无法上移
        if(this.elemI == 0){
        }
        else{
            // 移动元素
            let elemmap = find("Canvas").getComponent(GameManger).elemMap;
            let up = elemmap[this.elemI-1][this.elemJ];
            let pos1 = up.position;
            let pos2 = this.node.position;

            // 使用缓动系统实现互换动画，互换完记得将节点数据交换。
            let tweenDuration: number = 0.2;
            tween(up)
                .to(tweenDuration, { position: pos2})
                .call(()=>{
                    console.log("上面");
                })
                .start(); 

            tween(this.node)
                .to(tweenDuration, { position: pos1})
                .call(()=>{
                    console.log("下面");
                })
                .start(); 

            // 实现i，j，坐标互换和在父节点的顺序交换
            let leftI = up.getComponent(elements).getElemI();
            let leftJ = up.getComponent(elements).getElemJ();
            up.getComponent(elements).setElemI(this.elemI);
            up.getComponent(elements).setElemJ(this.elemJ);
            this.elemI = leftI;
            this.elemJ = leftJ;
            elemmap[this.elemI+1][this.elemJ] = up;
            elemmap[this.elemI][this.elemJ] = this.node;

            let des1 = Eliminate.elemTraveres(this.node);
            let des2 = Eliminate.elemTraveres(up);    
            console.log(des1,des2);           
            if(des1[des1.length - 1] == -1 && des2[des2.length - 1] == -1){
                console.log('不能交换');
                this.scheduleOnce(()=>{
                    // 由于不能交换则需再交换一次
                    let tweenDuration: number = 0.2;
                    tween(up)
                        .to(tweenDuration, { position: pos2})
                        .start(); 

                    tween(this.node)
                        .to(tweenDuration, { position: pos1})
                        .start(); 
                    
                    // 实现i，j，坐标互换和在父节点的顺序交换
                    let leftI = up.getComponent(elements).getElemI();
                    let leftJ = up.getComponent(elements).getElemJ();
                    up.getComponent(elements).setElemI(this.elemI);
                    up.getComponent(elements).setElemJ(this.elemJ);
                    this.elemI = leftI;
                    this.elemJ = leftJ;
                    elemmap[this.elemI-1][this.elemJ] = up;
                    elemmap[this.elemI][this.elemJ] = this.node;
                },0.5);
            } 
            else{
                this.scheduleOnce(()=>{
                    des1[des1.length-1] = null;
                    des2[des2.length-1] = null;
                    // 能移动则销毁元素并补充
                    Eliminate.destoryElem(des1, elemmap);
                    Eliminate.destoryElem(des2, elemmap);
                    Eliminate.elemFill();

                    find("Canvas").getComponent(GameManger).booleanDestory = true;
                },0.5);
            }            
        }
    }
    // 下移
    elemDownMove(){
        // 最下边元素无法下移
        if(this.elemI == 4){
        }
        else{
            // 移动元素
            let elemmap = find("Canvas").getComponent(GameManger).elemMap;
            let down = elemmap[this.elemI+1][this.elemJ];
            let pos1 = down.position;
            let pos2 = this.node.position;
            // 使用缓动系统实现互换动画，互换完记得将节点数据交换。
            let tweenDuration: number = 0.2;
            tween(down)
                .to(tweenDuration, { position: pos2})
                .start(); 

            tween(this.node)
                .to(tweenDuration, { position: pos1})
                .start(); 
            
            // 实现i，j，坐标互换和在父节点的顺序交换
            let leftI = down.getComponent(elements).getElemI();
            let leftJ = down.getComponent(elements).getElemJ();
            down.getComponent(elements).setElemI(this.elemI);
            down.getComponent(elements).setElemJ(this.elemJ);
            this.elemI = leftI;
            this.elemJ = leftJ;
            elemmap[this.elemI-1][this.elemJ] = down;
            elemmap[this.elemI][this.elemJ] = this.node;

            let des1 = Eliminate.elemTraveres(this.node);
            let des2 = Eliminate.elemTraveres(down);    
            console.log(des1,des2);           
            if(des1[des1.length - 1] == -1 && des2[des2.length - 1] == -1){
                console.log('不能交换');
                this.scheduleOnce(()=>{
                    // 由于不能交换则需再交换一次
                    let tweenDuration: number = 0.2;
                    tween(down)
                        .to(tweenDuration, { position: pos2})
                        .start(); 

                    tween(this.node)
                        .to(tweenDuration, { position: pos1})
                        .start(); 
                    
                    // 实现i，j，坐标互换和在父节点的顺序交换
                    let leftI = down.getComponent(elements).getElemI();
                    let leftJ = down.getComponent(elements).getElemJ();
                    down.getComponent(elements).setElemI(this.elemI);
                    down.getComponent(elements).setElemJ(this.elemJ);
                    this.elemI = leftI;
                    this.elemJ = leftJ;
                    elemmap[this.elemI+1][this.elemJ] = down;
                    elemmap[this.elemI][this.elemJ] = this.node;
                },0.5)
            } 
            else{
                this.scheduleOnce(()=>{
                    des1[des1.length-1] = null;
                    des2[des2.length-1] = null;
                    // 能移动则销毁元素并补充
                    Eliminate.destoryElem(des1, elemmap);
                    Eliminate.destoryElem(des2, elemmap);
                    Eliminate.elemFill();

                    find("Canvas").getComponent(GameManger).booleanDestory = true;
                },0.5) 
            }            
        }
    }
    destoryElem(){
        find("Canvas").getComponent(GameManger).weaponload(this.elemType, this.node.position);
        this.node.destroy();
        if(this.node.isValid){
            console.log('销毁成功！');
        }     
    }
}