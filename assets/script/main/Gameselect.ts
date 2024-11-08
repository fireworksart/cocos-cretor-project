
import { _decorator, AudioSource, Button, Component, director, find, game, Label, Slider, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

 
@ccclass('gameselect')
export class gameselect extends Component {

    @property(SpriteFrame)
    vidoplay = null;
    @property(SpriteFrame)
    vidopause = null;

    musicflag = true;
    soundflag = true;

    start () {
        let guanka = find("Guanka");
        game.addPersistRootNode(guanka);
        
        // 关卡选择按钮
        let buttonarray = find("Canvas/select").children;
        for(let i = 0; i < buttonarray.length; i++){
            let x = i+1;
            let str = x+"-1";
            buttonarray[i].children[0].on(Button.EventType.CLICK,this.onClick(str),this);
        }
        // 主界面按钮
        let setting = find("Canvas/setting");
        setting.on(Button.EventType.CLICK,this.set,this);
        // 设置界面按钮
        let setwindow = find("Canvas/window").children;
        setwindow[1].children[1].on("slide", this.callback, this);
        setwindow[2].children[1].on('slide', this.callback, this);
        setwindow[3].on(Button.EventType.CLICK,this.exit,this);
        setwindow[4].on(Button.EventType.CLICK,this.close,this);
        setwindow[1].children[2].on(Button.EventType.CLICK,this.musicvido,this);
        setwindow[2].children[2].on(Button.EventType.CLICK,this.soundvido,this);
    }

    onClick = (param1) => () => {  
        this.click(param1);  
    };

    click(str: string){
        find("Guanka").getComponent(Label).string = str;
        director.loadScene("game");
    }

    callback(slider: Slider){;
        if(slider.progress > 0){
            slider.node.parent.children[2].getComponent(Sprite).spriteFrame = this.vidoplay;
            console.log(slider.progress)
            find("Canvas").getComponent(AudioSource).volume = slider.progress;
        }else{
            // 图标变成静音
            slider.node.parent.children[2].getComponent(Sprite).spriteFrame = this.vidopause;
        }
    }

    set(){
        let win = find("Canvas/window");
        win.active = true;
    }

    close(){
        let win = find("Canvas/window");
        win.active = false;
    }

    exit(){
        game.end();
    }

    musicvido(button: Button){
        if(this.musicflag == true){
            this.musicflag = false;
            button.getComponent(Sprite).spriteFrame = this.vidopause;
        }
        if(this.musicflag == false){
            this.musicflag = true;
            button.getComponent(Sprite).spriteFrame = this.vidoplay;
        }
    }

    soundvido(button: Button){
        console.log(button.getComponent(Sprite).spriteFrame );
        if(this.soundflag == true){
            this.soundflag = false;
            button.getComponent(Sprite).spriteFrame = this.vidopause;
        }
        if(this.soundflag == false){
            this.soundflag = true;
            button.getComponent(Sprite).spriteFrame = this.vidoplay;
        }
    }
}
