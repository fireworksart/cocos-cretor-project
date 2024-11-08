/**
 * 主要实现获取元素二维数组，实现判断是否可以消除
 * 有二种类型1.直线型，3~5个元素2.七字型，横竖三个
 */
import { _decorator, Component, find, instantiate, Node, tween, Vec3 } from 'cc';
import { elements } from './Elements';
import { GameManger } from './GameManger';
const { ccclass } = _decorator;

@ccclass('Eliminate')
export class Eliminate extends Component {
    start() {

    }

    // 根据某个元素位置进行横向和纵向遍历,返回匹配类型，
    // 0：直线型，1：七字型，-1：无法交换。并返回需要消除节点数组。
    // 将类型作为最后一个值放入数组，是因为ts无法返回多个参数。
    static elemTraveres(elem: Node){
        
        let elemi = elem.getComponent(elements).getElemI();  // 元素位置
        let elemj = elem.getComponent(elements).getElemJ(); 
        let elemtype = elem.getComponent(elements).getElemType();  // 元素类型
        let elemmap = find("Canvas").getComponent(GameManger).elemMap;
        let rnodes = [];  // 横向遍历数组
        let lnodes = [];  // 纵向遍历数组
        let left,right,up,down;
        
        // 横向遍历
        if(elemj == 0){
            left = 0;
        }else{
            for(let i = elemj-1; i >= 0; i--){
                // 判断元素横向向前
                if(elemmap[elemi][i].getComponent(elements).getElemType() == elemtype){
                    rnodes.push(elemmap[elemi][i]);
                }else{
                    left = elemj - i - 1;
                    break;
                }
            }
            if(left == null && elemj != 0){
                left = elemj;
            }
        }
        if(elemj == 6){
            right = 0;
        }else{
            for(let i = elemj+1; i <= 6; i++){
                // 判断元素横向向后
                if(elemmap[elemi][i].getComponent(elements).getElemType() == elemtype){
                    rnodes.push(elemmap[elemi][i]);
                }else{
                    right = i - elemj - 1;
                    break;
                }
            }
            if(right == null && elemj != 6){
                right = 6-elemj;
            }
        }

        // 纵向遍历
        if(elemi == 0){
            up = 0;
        }else{
            for(let i = elemi-1; i >= 0; i--){
                // 判断元素竖向向上
                if(elemmap[i][elemj].getComponent(elements).getElemType() == elemtype){
                    lnodes.push(elemmap[i][elemj]);
                }else{
                    up = elemi - i - 1;
                    break;
                }
            }
            if(up == null && elemi != 0){
                up = elemi;
            }
        }
        if(elemi == 4){
            down = 0;
        }else{
            for(let i = elemi+1; i <= 4; i++){
                // 判断元素竖向向下
                if(elemmap[i][elemj].getComponent(elements).getElemType() == elemtype){
                    lnodes.push(elemmap[i][elemj]);
                }else{
                    down = i - elemi - 1;
                    break;
                }
            }
            if(down == null && elemi != 4){
                down = 4-elemi;
            }
        }
        console.log(left,right,up,down);
        // 返回所需参数
        if(left + right >=2){
            if(left == 2 && up == 2){
                let count = [];
                for(let i = 0; i < left; i++){
                    count.push(rnodes[i]);
                }
                for(let i =0; i < up; i++){
                    count.push(lnodes[i]);
                }
                // 还记得将自身节点加入
                count.push(elem);
                count.push(1);
                return(count);
            }
            if(left == 2 && down == 2){
                let count = [];
                for(let i = 0; i < left; i++){
                    count.push(rnodes[i]);
                }
                for(let i = up; i < up+down; i++){
                    count.push(lnodes[i]);
                }
                // 还记得将自身节点加入
                count.push(elem);
                count.push(1);
                return(count);
            }
            if(right == 2 && up == 2){
                let count = [];
                for(let i = left; i < left+right; i++){
                    count.push(rnodes[i]);
                }
                for(let i = 0; i < up; i++){
                    count.push(lnodes[i]);
                }
                // 还记得将自身节点加入
                count.push(elem);
                count.push(1);
                return(count);
            }
            if(right ==2 && down == 2){
                let count = [];
                for(let i = left; i < left+right; i++){
                    count.push(rnodes[i]);
                }
                for(let i = up; i < up+down; i++){
                    count.push(lnodes[i]);
                }
                // 还记得将自身节点加入
                count.push(elem);
                count.push(1);
                return(count);
            }
            else{
                // 还记得将自身节点加入
                rnodes.push(elem);
                rnodes.push(0);
                return(rnodes);
            }   
        }
        else if(up + down >= 2){
            // 还记得将自身节点加入
            lnodes.push(elem);
            lnodes.push(0);
            return(lnodes);
        }
        else{
            let count = [];
            count.push(-1);
            return(count);
        }
    }
    //全局遍历，在游戏开始或者玩家移动销毁元素后调用，用于检测有能否消除元素，消除后再填充。
    static globalTraveres(){
        let elemmap = find("Canvas").getComponent(GameManger).elemMap;   
        let sum = [];
        for(let i = 0;i < 5;i++){
            for(let j = 0;j < 7;j++){
                let elem = elemmap[i][j];
                if(this.pan(elem, sum)){
                    let des = this.elemTraveres(elem);
                    console.log(des);
                    for(let i = 0; i < des.length-1; i++){
                        sum.push(des[i]);
                    }
                }
            }
        }
        return sum;    
    }
    
    static pan(elem: Node, count: any){
        for(let i = 0; i < count.length; i++){
            if(elem == count[i]){
                return 0;
            }
        }
        return 1;
    }

    static destoryElem(elems: any, elemmap: any){
        if(elems == null){
            return;
        }else{
            for(let i = 0; i < elems.length; i++){
                if(elems[i] == null){
                    return;
                }
                let x = elems[i].getComponent(elements).getElemI();
                let y = elems[i].getComponent(elements).getElemJ();
                elemmap[x][y] = null;
                elems[i].getComponent(elements).destoryElem();
            }
        }
    }

    // 填充
    static elemFill(){
        let elemmap = find("Canvas").getComponent(GameManger).elemMap;
        console.log(elemmap);
        for(let j = 0;j < 7;j++){
            let start;
            let flag = true;
            let sum = [];
            for(let i = 0;i < 5;i++){
                if(elemmap[i][j] == null){
                    if(flag){
                        start = i;
                        flag = false;
                    }
                }else{
                    sum.push(i); 
                }
            }
            if(start == null){
                start = 5;
            }
            console.log(start,j,sum);
            if(sum.length != 5){
                // 移动动画
                this.elemFillStart(elemmap,start,j,sum);    
            }    
        }
    }

    static elemFillStart(elemmap: any,x: number, y: number, sum: any){
        let count = 0;
        if(x >= 0 && x <= 4){
            // 原有元素
            for(let i = x;i < 5;i++){
                if(this.padneas(i, sum)){
                    console.log('原有元素',i);
                    let down = elemmap[i][y];
                    console.log(down.position);
                    // 修改i
                    down.getComponent(elements).setElemI(x+count);
                    elemmap[i][y] = null;
                    elemmap[x+count][y] = down;
                    // 动画效果
                    let pos = new Vec3(down.position.x, down.position.y + 90*(i-x-count),0);
                    let tweenDuration: number = 0.2;
                    tween(down)
                        .to(tweenDuration, { position: pos})
                        .start(); 
                    count++;
                }
            }
        }
        
        // 需补充元素
        for(let i = x+count;i < x+count+5-sum.length;i++){
            let j = y;
            console.log('需补充元素',i,j);
            let nub = Math.floor(Math.random() * 5);  // 产生0~4之间的随机数
            let elem = instantiate(find("Canvas").getComponent(GameManger).elemLoadPrefabs(nub));
            find("Canvas").getComponent(GameManger).map.addChild(elem);
            let lastelempos = find("Canvas").getComponent(GameManger).elemPos(i,j);
            let elempos = new Vec3(lastelempos.x, lastelempos.y - 90*(5-i),0);
            elemmap[i][j] = elem;
            elem.setPosition(elempos);
            elem.getComponent(elements).setElemI(i);
            elem.getComponent(elements).setElemJ(j);
            elem.getComponent(elements).setElemType(nub);
            
            // 动画
            let tweenDuration: number = 0.2;  
            tween(elemmap[i][j])  
                .to(tweenDuration, { position: lastelempos })  
                .start(); 

        } 
        console.log(elemmap);
    }

    static padneas(x: any, sum: any){
        for(let i = 0; i < sum.length; i++){
            if(sum[i] == x){
                return 1;
            }
        }
        return 0;
    }

    update(deltaTime: number) {
        
    }
}


