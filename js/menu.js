class Button {
    constructor(x, y, width, height, color, hoverColor, text, id) {
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
        this.Color = color;
        this.HoverColor = hoverColor;
        this.Text = text;
        this.ID = id;
        this.Hover = false;
    }

    Hovering(x, y) {
        return (this.X <= x && this.X + this.Width > x && this.Y <= y && this.Y + this.Height > y);
    }

    Draw() {
        GameState.Canvas.fillStyle = this.Hover ? this.HoverColor : this.Color;
        GameState.Canvas.fillRect(this.X, this.Y, this.Width, this.Height);
        GameState.Canvas.lineWidth = 4;
        GameState.Canvas.strokeRect(this.X + 2, this.Y + 2, this.Width - 4, this.Height - 4);
        GameState.Canvas.font = "20px Arial";
        GameState.Canvas.fillStyle = "#000000";
        GameState.Canvas.textAlign = "center";
        GameState.Canvas.fillText(this.Text, this.X + this.Width / 2, this.Y + this.Height / 2 + 5);
    }
}

class Box {
    constructor(x, y, width, height, color, text, center) {
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
        this.Color = color;
        this.Text = text;
        this.Center = center;
    }

    Draw() {
        GameState.Canvas.fillStyle = this.Color;
        GameState.Canvas.fillRect(this.X, this.Y, this.Width, this.Height);
        GameState.Canvas.lineWidth = 4;
        GameState.Canvas.strokeRect(this.X + 2, this.Y + 2, this.Width - 4, this.Height - 4);
        GameState.Canvas.font = "20px Arial";
        GameState.Canvas.fillStyle = "#000000";
        if (this.Center) {
            GameState.Canvas.textAlign = "center";
            GameState.Canvas.fillText(this.Text, this.X + this.Width / 2, this.Y + this.Height / 2 + 5);
        } else {
            GameState.Canvas.textAlign = "start";
            GameState.Canvas.fillText(this.Text, this.X + 30, this.Y + this.Height / 2 + 5);
        }
    }
}

class Menu {
    constructor() {
        GameState.Canvas.clearRect(0, 0, 1280, 720);
        this.Buttons = [];
        this.Boxes = [];
    }

    Click(x,y) {
        for (let i = 0; i < this.Buttons.length; i++) {
            if (this.Buttons[i].Hovering(x, y)) {
                this.ClickedButton(this.Buttons[i].ID);
                return;
            }
        }
    }

    ClickedButton(id) {

    }

    Update(x,y) {
        for (let i = 0; i < this.Buttons.length; i++) {
            this.Buttons[i].Hover = (this.Buttons[i].Hovering(x, y));
        }

        this.UpdateExtra();
    }

    UpdateExtra() {

    }

    Draw() {
        this.DrawExtra();

        for (let i = 0; i < this.Boxes.length; i++) {
            this.Boxes[i].Draw();
        }

        for (let i = 0; i < this.Buttons.length; i++) {
            this.Buttons[i].Draw();
        }
    }

    DrawExtra() {

    }

    DrawBasicMenuBackground() {
        this.DrawPartBasicMenuBackground(0,0,16,9);
    }

    DrawPartBasicMenuBackground(startX, startY, endX, endY) {
        for (let x = startX; x < endX; x++) {
            for (let y = startY; y < endY; y++) {
                if ((y + x) % 2 == 0) {
                    GameState.Canvas.fillStyle = "#dddddd";
                }
                else {
                    GameState.Canvas.fillStyle = "#ffffff";
                }
                GameState.Canvas.fillRect(x * 80, y * 80, 80, 80);
            }
        }
        GameState.Canvas.lineWidth = 4;
        GameState.Canvas.strokeRect(2, 2, GameState.RawCanvas.width - 4, GameState.RawCanvas.height - 4);
    }
}

class MainMenu extends Menu {
    constructor() {
        super();

        this.Buttons = [new Button(480, 400, 320, 80, "#00ff00", "#aaffaa", "Play", 1), new Button(560, 560, 160, 80, "#ffff00", "#ffffaa", "Players", 2), new Button(80, 560, 160, 80, "#ff0000", "#ffaaaa", "Options", 3), new Button(1040, 560, 160, 80, "#00ffff", "#aaffff", "Help", 4)];

        this.DrawBasicMenuBackground();
    }

    ClickedButton(id) {
        switch (id) {
            case 1:
                GameState.LoadedMenu = new GameMenu();
                break;
            case 2:
                GameState.LoadedMenu = new PlayerScreen();
                break;
            case 3:
                GameState.LoadedMenu = new OptionMenu();
                break;
        }
    }
}

class PlayerScreen extends Menu {
    constructor() {
        super();

        this.SelectedPlayer = -1;
        this.SelectedButton = -1;

        this.LoadButtons();
        this.DrawBasicMenuBackground();
        this.RemvoingPlayer = false;
    }

    ClickedButton(id) {
        switch (id) {
            case 1:
                GameState.LoadedMenu = new MainMenu();
                break;
            case 2:
                if (this.SelectedPlayer == -1) {
                    this.RemvoingPlayer = !this.RemvoingPlayer;
                    this.Buttons[1].Text = this.RemvoingPlayer ? "Removing..." : "Remove Player";
                } else {
                    GameState.Players.splice(this.SelectedPlayer, 1);
                    this.DrawPartBasicMenuBackground(1, 1, 14, 6);
                    this.SelectedPlayer = -1;
                    this.SelectedButton = -1;
                    this.LoadButtons();
                }
                break;
            case 3:
                this.RemvoingPlayer = false;
                GameState.Players.push(new Player(["arrowup", "arrowleft", "arrowdown", "arrowright", " "],this.GetAddingID()));
                this.LoadButtons();
                break;
            case 4:
                this.RemvoingPlayer = false;
                GameState.Players.push(new Robot(this.GetAddingID()));
                this.LoadButtons();
                break;
            default:
                if (id >= 100) {
                    let playerLocation = id - 100;
                    if (this.RemvoingPlayer) {
                        GameState.Players.splice(playerLocation, 1);
                        this.DrawPartBasicMenuBackground(1, 1, 14, 2);
                        this.LoadButtons();
                    } else {
                        this.SelectedPlayer = playerLocation;
                        this.SelectedButton = -1;
                        this.LoadButtons();
                    }
                    break;
                }

                if (id >= 5 && id <= 10) {
                    GameState.Players[this.SelectedPlayer].ID = id - 5;
                    GameState.Players[this.SelectedPlayer].Color = GameState.GetColor(GameState.Players[this.SelectedPlayer].ID);
                    this.LoadButtons();
                    break;
                }
                if (id >= 11 && id <= 15) {
                    this.SelectedButton = id - 11;
                    this.LoadButtons();
                    break;
                }
                if (id >= 16 && id <= 20) {
                    GameState.Players[this.SelectedPlayer].Difficulty = id - 16;
                    this.LoadButtons();
                    break;
                }
                break;
        }
    }

    LoadButtons() {
        this.Buttons = [new Button(80, 560, 160, 80, "#00ff00", "#aaffaa", "Menu", 1)];

        if (GameState.Players.length > 1) {
            this.Buttons.push(new Button(320, 560, 160, 80, "#ff0000", "#ffaaaa", this.RemvoingPlayer ? "Removing..." : "Remove Player", 2));
        } else {
            this.DrawPartBasicMenuBackground(4, 7, 6, 8);
            this.RemvoingPlayer = false;
        }

        if (GameState.Players.length < 6) {
            this.Buttons.push(new Button(800, 560, 160, 80, "#ffff00", "#ffffaa", "Add Player", 3));
            this.Buttons.push(new Button(1040, 560, 160, 80, "#ff00ff", "#ffaaff", "Add Robot", 4));
        } else {
            this.DrawPartBasicMenuBackground(10,7,15,8);
        }

        for (let i = 0; i < GameState.Players.length; i++) {
            let color = GameState.CreateColorString(GameState.GetColor(GameState.Players[i].ID));
            let hoverColor = GameState.WhitenColor(GameState.GetColor(GameState.Players[i].ID), 0.7);
            this.Buttons.push(new Button(160 + i * 160 + Math.floor(i / 3) * 80, 80, 80, 80, color, hoverColor, (GameState.Players[i] instanceof Robot) ? "[*_*]" : "(o_o)", 100 + i));
        }

        if (this.SelectedPlayer != -1) {
            this.Boxes = [new Box(320, 240, 640, 240, GameState.CreateColorString(GameState.GetColor(GameState.Players[this.SelectedPlayer].ID)), "", false)];

            for (let i = 0; i < 6; i++) {
                let color = GameState.CreateColorString(GameState.GetColor(i));
                let hoverColor = GameState.WhitenColor(GameState.GetColor(i), 0.7);
                this.Buttons.push(new Button(330 + (i % 2) * 80, 250 + Math.floor(i / 2) * 80, 60, 60, color, hoverColor, "", 5 + i));
            }
            let player = GameState.Players[this.SelectedPlayer];

            if (!(player instanceof Robot)) {
                this.Buttons.push(new Button(800, 330, 60, 60, this.SelectedButton == 0 ? "#cccccc" : "#909090", "#dddddd", this.KeyText(player.Keys[0]), 11));
                for (let i = 0; i < 3; i++) {
                    this.Buttons.push(new Button(720 + i * 80, 410, 60, 60, this.SelectedButton == 1 + i ? "#cccccc" : "#909090", "#dddddd", this.KeyText(player.Keys[i + 1]), 12 + i));
                }
                this.Buttons.push(new Button(560, 410, 140, 60, this.SelectedButton == 4 ? "#cccccc" : "#909090", "#dddddd", this.KeyText(player.Keys[4]), 15));
            } else {
                for (let i = 0; i < 5; i++) {
                    this.Buttons.push(new Button(560 + i * 80, 330, 70, 60, player.Difficulty == i ? GameState.CreateColorString(GameState.GetColor(i)) : "#909090", player.Difficulty == i ? GameState.WhitenColor(GameState.GetColor(i),0.7) : "#dddddd", (i + 1), 16 + i));
                }
            }
        }
    }

    GetAddingID() {
        let foundNumber = false;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < GameState.Players.length; j++) {
                if (GameState.Players[j].ID == i) {
                    foundNumber = false;
                    break;
                }
                foundNumber = true;
            }

            if (foundNumber) {
                return i;
            }
        }
        return 6;
    }

    KeyText(text) {
        text = text.toUpperCase();
        switch (text) {
            case "ARROWUP":
                return "^"
                break;
            case "ARROWRIGHT":
                return ">"
                break;
            case "ARROWLEFT":
                return "<"
                break;
            case "ARROWDOWN":
                return "V"
                break;
            case " ":
                return "[S]"
                break;
            case "ENTER":
                return "[E]"
                break;
            case "BACKSPACE":
                return "[B]"
                break;
            case "CONTROL":
                return "[C]"
                break;
            case "CAPSLOCK":
                return "[CL]"
                break;
            case "CAPSLOCK":
                return "[CL]"
                break;
            case "ESCAPE":
                return "[E]"
                break;
            case "META":
                return "[M]"
                break;
            case "CONTEXTMENU":
                return "[CM]"
                break;
            case "DELETE":
                return "[D]"
                break;
            case "INSERT":
                return "[I]"
                break;
            case "PAGEUP":
                return "[PU]"
                break;
            case "PAGEDOWN":
                return "[PD]"
                break;
            case "NUMLOCK":
                return "[NL]"
                break;
            case "SCROLLLOCK":
                return "[SL]"
                break;
            case "PAUSE":
                return "[P]"
                break;
        }
        return text;
    }

    UpdateExtra() {
        if (this.SelectedButton != -1) {
            let size = 0;
            let key;
            for (key in GameState.KeyStates) {
                if (GameState.KeyStates.hasOwnProperty(key)) {
                    if (GameState.KeyStates[key]) {
                        GameState.Players[this.SelectedPlayer].Keys[this.SelectedButton] = key;
                        this.SelectedButton = -1;
                        this.LoadButtons();
                        return;
                    }
                }
            }
        }
    }
}

class GameMenu extends Menu {
    constructor() {
        super();

        this.Map = null;
        this.Particles = [];
        this.MapOffsetX = 0;
        this.MapOffsetY = 0;
        this.ResetTimer = 0;
        this.Buttons = [new Button(1180, 30, 70, 70, "#ff0000", "#ffaaaa", "Menu", 1)];
        this.StartGame();
    }

    ClickedButton(id) {
        switch (id) {
            case 1:
                GameState.LoadedMenu = new MainMenu();
                break;
        }
    }

    StartGame() {
        GameState.Canvas.clearRect(0, 0, 1280, 720);
        let totalSize = GameState.Players.length * (GameState.MazeSizeOption + 1) * 7;
        let around = Math.round(Math.sqrt(totalSize));
        let randomness = Math.floor(around / 3);
        let width = around + Math.floor(Math.random() * randomness - randomness / 2);
        let height = Math.round(totalSize / width);
        let tileSize = Math.floor((720 - 4) / Math.max(width, height));

        this.Particles = [];

        this.Map = new Map(width, height, tileSize);
        this.MapOffsetX = Math.floor((1280 - this.Map.Width * this.Map.TileSize - 4) / 2);
        this.MapOffsetY = Math.floor((720 - this.Map.Height * this.Map.TileSize - 4) / 2);
        for (let i = 0; i < GameState.Players.length; i++) {
            GameState.Players[i].X = Math.floor(Math.random() * width) * 1000;
            GameState.Players[i].Y = Math.floor(Math.random() * height) * 1000;
            GameState.Players[i].Reset();
            this.Map.ColorTile(GameState.Players[i].X / 1000, GameState.Players[i].Y / 1000, GameState.Players[i].ID);
            if (GameState.Players[i] instanceof Robot) {
                GameState.Players[i].RememberedTraps = [];
                for (let x = 0; x < width; x++) {
                    GameState.Players[i].RememberedTraps.push([]);
                    for (let y = 0; y < height; y++) {
                        GameState.Players[i].RememberedTraps[x].push(null);
                    }
                }
            }
        }
    }

    UpdateExtra() {
        for (let i = 0; i < this.Particles.length; i++) {
            if (this.Particles[i].Update()) {
                this.Particles.splice(i, 1);
                i--;
            }
        }

        let teamsAlive = 0;
        let teams = [];
        let realPlayers = 0;
        for (let i = 0; i < GameState.Players.length; i++) {
            if (!GameState.Players[i].Dead) {
                GameState.Players[i].Update();
                if (!teams.includes(GameState.Players[i].ID)) {
                    teamsAlive++;
                    teams.push(GameState.Players[i].ID);
                }
                if (!(GameState.Players[i] instanceof Robot)) {
                    realPlayers++;
                }
            }
        }

        if (teamsAlive <= 1 || (realPlayers == 0 && GameState.RobotOption)) {
            if (this.ResetTimer == 0) {
                if (!GameState.TrapOption) {
                    for (let x = 0; x < this.Map.Width; x++) {
                        for (let y = 0; y < this.Map.Height; y++) {
                            if (this.Map.Tiles[x][y].State == 1) {
                                this.Particles.push(new TrapParticle(x, y, true));
                            }
                        }
                    }
                }
            }
            this.ResetTimer += 40;
            if (this.ResetTimer >= 2500) {
                this.StartGame();
                this.ResetTimer = 0;
            }
        }
    }

    DrawExtra() {
        this.Map.Draw();
        for (let i = 0; i < this.Particles.length; i++) {
            this.Particles[i].Draw();
        }
        for (let i = 0; i < GameState.Players.length; i++) {
            if (!GameState.Players[i].Dead) {
                GameState.Players[i].Draw();
            }
        }
    }
}

class OptionMenu extends Menu {
    constructor() {
        super();

        this.LoadButtons();
        this.DrawBasicMenuBackground();
        this.Boxes = [new Box(480, 80, 720, 80, "#ff8000", "Map size:", false), new Box(480, 240, 720, 80, "#ff0000", "Wall display size:", false), new Box(480, 400, 720, 80, "#ffff00", "End if only robots are left:", false), new Box(480, 560, 720, 80, "#00ffff", "Traps visible for forever:", false)];
    }

    LoadButtons() {
        this.Buttons = [new Button(80, 240, 240, 240, "#00ff00", "#aaffaa", "Menu", 1), new Button(80, 560, 240, 80, "#ff00ff", "#ffaaff", "Default", 2)];

        for (let i = 0; i < 5; i++) {
            this.Buttons.push(new Button(810 + i * 80, 90, 60, 60, GameState.MazeSizeOption == i ? GameState.CreateColorString(GameState.GetColor(i)) : "#909090", GameState.MazeSizeOption == i ? GameState.WhitenColor(GameState.GetColor(i), 0.7) : "#dddddd", i + 1, 3 + i));
            this.Buttons.push(new Button(810 + i * 80, 250, 60, 60, GameState.WallSizeOption == i ? GameState.CreateColorString(GameState.GetColor(i)) : "#909090", GameState.WallSizeOption == i ? GameState.WhitenColor(GameState.GetColor(i), 0.7) : "#dddddd", i + 1, 8 + i));
        }
        this.Buttons.push(new Button(810, 410, 140, 60, GameState.RobotOption ?  "#00ff00" : "#909090", GameState.RobotOption ? "#aaffaa" : "#dddddd", "ON", 13));
        this.Buttons.push(new Button(1050, 410, 140, 60, !GameState.RobotOption ?  "#ff0000" : "#909090", !GameState.RobotOption ? "#ffaaaa" : "#dddddd", "OFF", 14));
        this.Buttons.push(new Button(810, 570, 140, 60, GameState.TrapOption ? "#00ff00" : "#909090", GameState.TrapOption ? "#aaffaa" : "#dddddd", "ON", 15));
        this.Buttons.push(new Button(1050, 570, 140, 60, !GameState.TrapOption ?  "#ff0000" : "#909090", !GameState.TrapOption ? "#ffaaaa" : "#dddddd", "OFF", 16));
    }

    ClickedButton(id) {
        switch (id) {
            case 1:
                GameState.LoadedMenu = new MainMenu();
                break;
            case 2:
                GameState.MazeSizeOption = 2;
                GameState.WallSizeOption = 1;
                GameState.RobotOption = false;
                GameState.TrapOption = false;
                this.LoadButtons();
                break;
            case 13:
                this.ChangeRobotOption(true);
                break;
            case 14:
                this.ChangeRobotOption(false);
                break;
            case 15:
                this.ChangeTrapOption(true);
                break;
            case 16:
                this.ChangeTrapOption(false);
                break;
            default:
                if (id >= 3 && id <= 7) {
                    this.ChangeMazeSizeOption(id - 3);
                } else if (id >= 8 && id <= 14) {
                    this.ChangeWallSizeOption(id - 8);
                }
                break;
       }
    }

    ChangeRobotOption(newState) {
        GameState.RobotOption = newState;
        this.LoadButtons();
    }

    ChangeTrapOption(newState) {
        GameState.TrapOption = newState;
        this.LoadButtons();
    }

    ChangeMazeSizeOption(newState) {
        GameState.MazeSizeOption = newState;
        this.LoadButtons();
    }

    ChangeWallSizeOption(newState) {
        GameState.WallSizeOption = newState;
        this.LoadButtons();
    }
}