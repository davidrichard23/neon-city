import Player from './player';
import Environment from './environment';
import Enemy from './enemy';
import UI from './ui';


export default class Game {

  constructor() {
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();

    this.titleScreenTransitionSpeed = 1;
    this.isTransitioningToTitleScreen = false;
    this.titleScreenTransitionDirection = new THREE.Vector3(0,-1,0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    this.canvas = renderer.domElement;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.canvas);
    this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.mozRequestPointerLock;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.lookAt(0, -1, 1);
    this.scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
    // this.camera.position.set(0, 1000, 0);
    // this.camera.lookAt(0, 900, -1000);
    this.scene.add(this.camera);
    
    const renderScene = new THREE.RenderPass(this.scene, this.camera);
    const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    
    bloomPass.renderToScreen = true;
    bloomPass.threshold = 0;
    bloomPass.strength = 1.2;
    bloomPass.radius = 1;
    
    this.composer = new THREE.EffectComposer(renderer);
    this.composer.setSize(window.innerWidth, window.innerHeight);
    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);
    
    
    this.ui = new UI(this);
    const environment = new Environment(this.scene);
    window.player = new Player(this);
    player.playerGroup.add(this.camera);
    player.playerGroup.position.set(0, 1000, 0);
    

    this.startGameTransition = this.startGameTransition.bind(this);
    this.startGame = this.startGame.bind(this);
    this.update = this.update.bind(this);
    this.update();
  }
  
  
  update() {
    requestAnimationFrame(this.update);
    
    stats.begin();
    
    this.updateTitleScreenTransition();
    this.composer.render(this.clock.getDelta());
    
    stats.end();
  }

  updateTitleScreenTransition() {
    if (!this.isTransitioningToTitleScreen) return;

    player.playerGroup.position.addScaledVector(this.titleScreenTransitionDirection, this.titleScreenTransitionSpeed);
    this.titleScreenTransitionSpeed += 0.1;

    if (this.titleScreenTransitionDirection.y == -1 && player.playerGroup.position.y < 15) {
      this.startGame();
    }
    if (this.titleScreenTransitionDirection.y == 1 && player.playerGroup.position.y > 1000) {
      this.endGame();
    }
  }
  

  startGameTransition() {
    this.titleScreenTransitionSpeed = 1;
    this.isTransitioningToTitleScreen = true;
    this.titleScreenTransitionDirection = new THREE.Vector3(0, -1, 0);
    
    this.canvas.requestPointerLock();
  }
  
  startGame() {
    this.isTransitioningToTitleScreen = false;
    player.playerGroup.position.y = 15;
    player.enable();
    const enemy = new Enemy(this.scene);
    
    this.ui.showHud();
  }
  
  
  gameOver() {
    this.endGameTransition();
  }
  
  endGameTransition() {
    this.titleScreenTransitionSpeed = 1;
    this.isTransitioningToTitleScreen = true;
    this.titleScreenTransitionDirection = new THREE.Vector3(0, 1, 0);
    player.disable();
    this.ui.hideHud();
  }
  
  endGame() {
    player.playerGroup.position.y = 1000;
    this.isTransitioningToTitleScreen = false;
    this.ui.showTitle();
    document.exitPointerLock();
  }
}