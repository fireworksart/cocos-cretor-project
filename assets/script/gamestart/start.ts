
import { _decorator, AudioClip, AudioSource, Button, Component, director, find, Node } from 'cc';
const { ccclass, property } = _decorator;

 
@ccclass('start')
export class start extends Component {
    
    @property(AudioClip)
    public clip: AudioClip = null!;   

    @property(AudioSource)
    public audioSource: AudioSource = null!;


    start () {
        let startbutton = find("Canvas/enter");
        console.log(startbutton);
        startbutton.on(Button.EventType.CLICK,this.click,this);
    }

    click(){
        this.audioSource.playOneShot(this.clip, 1);
        director.loadScene("main");
    }
    
}