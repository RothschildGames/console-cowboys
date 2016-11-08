import Phaser from 'phaser'

let borderSize = 5;
let size = 35 + borderSize;
export default class extends Phaser.Graphics {

  constructor ({ game, x, y, logic, clickSignal  }) {
    super(game, x, y);

    this.game = game;
    this.logic = logic;
    this.anchor.setTo(0.5);

    this.beginFill(0x000000);
    this.drawCircle(0, 0, size);
    this.endFill();
    this.color();
    this.inputEnabled = true;
    this.input.useHandCursor = true;

    const textStyle = { font: "16px Arial", fill: "#000000", align: "center" }
    this.packetsCountText = this.game.add.text(0, size, "", textStyle);
    this.packetsCountText.anchor.set(0.5)
    this.addChild(this.packetsCountText)

    this.events.onInputOver.add((game, pointer) => {
      this.tint = 0xCCCCCC;
    });

    this.events.onInputOut.add((game, pointer) => {
      this.tint = 0xFFFFFF;
    });

    this.events.onInputDown.add(() => {
      clickSignal.dispatch(this);
    });
  }

  update () {
    const dt = this.game.time.elapsed
    this.logic.updateTimers(dt)
    if (this.logic.isPacketCreator()) {
      const additionalPackets = this.logic.getPacketsToBeCreated()
      this.logic.addPackets(additionalPackets)
    }

    if (this.logic.packets > 0 || this.logic.isPacketCreator()) {
      this.packetsCountText.text = this.logic.packets
    } else {
      this.packetsCountText.text = ""
    }
  }

  hit() {
    this.logic.hit();
    this.color()
  }

  color() {
    this.beginFill(this.logic.color());
    this.drawCircle(0, 0, size - borderSize);
    this.endFill();
  }

  canSendPacket() {
    return this.logic.canSendPacket();
  }

}
