import { SceneHost } from '@/core/rendering/sceneHost';
import { useAppStore } from './store';
import { renderWelcomeScreen } from '@/ui/screens/welcomeScreen';
import { renderHomeScreen } from '@/ui/screens/homeScreen';
import { renderGameSelectScreen } from '@/ui/screens/gameSelectScreen';
import { renderResultScreen } from '@/ui/screens/resultScreen';
import type { PlayResult } from '@/features/gameplay/types';
import { getGameRenderer } from '@/games/registry';
import { loadSettings } from '@/data/storage/settingsStore';
import { bindUiClickSounds } from '@/features/audio/uiClick';

export class App {
  private sceneHost: SceneHost | null = null;
  private uiRoot: HTMLElement;
  private cleanupGame: (() => void) | null = null;
  private lastResult: PlayResult | null = null;

  constructor(mount: HTMLElement) {
    mount.innerHTML = `
      <div class="clay-backdrop" aria-hidden="true">
        <span class="clay-blob clay-blob--violet"></span>
        <span class="clay-blob clay-blob--pink"></span>
        <span class="clay-blob clay-blob--sky"></span>
      </div>
      <div class="scene-layer" id="scene-layer"></div>
      <div class="ui-layer" id="ui-layer"></div>
    `;
    this.uiRoot = mount.querySelector('#ui-layer')!;
    const sceneLayer = mount.querySelector<HTMLElement>('#scene-layer')!;
    this.sceneHost = new SceneHost(sceneLayer);

    useAppStore.subscribe(() => this.render());

    void this.bootstrap();
  }

  private async bootstrap(): Promise<void> {
    const settings = loadSettings();
    if (settings.largeText) {
      document.documentElement.classList.add('large-text');
    }
    this.render();
  }

  private onGameComplete = (result: PlayResult): void => {
    this.lastResult = result;
    useAppStore.setScreen(result.score >= 9 ? 'celebration' : 'result');
  };

  private render(): void {
    if (this.cleanupGame) {
      this.cleanupGame();
      this.cleanupGame = null;
    }

    const { screen, selectedGameId } = useAppStore.getState();
    this.uiRoot.innerHTML = '';
    bindUiClickSounds(this.uiRoot);

    switch (screen) {
      case 'welcome':
        renderWelcomeScreen(this.uiRoot);
        break;
      case 'home':
        renderHomeScreen(this.uiRoot);
        break;
      case 'game-select':
        if (selectedGameId) renderGameSelectScreen(this.uiRoot, selectedGameId);
        break;
      case 'game-play': {
        const renderer = selectedGameId ? getGameRenderer(selectedGameId) : undefined;
        if (renderer && this.sceneHost) {
          this.cleanupGame = renderer(this.uiRoot, this.sceneHost, this.onGameComplete);
        } else {
          this.uiRoot.innerHTML = `<section class="screen screen--clay screen--fallback">
            <h1>Đang xây dựng</h1>
            <p class="subtitle">Trò chơi này sẽ sớm có mặt.</p>
            <button type="button" class="btn btn-primary" id="back">Về trang chủ</button></section>`;
          this.uiRoot.querySelector('#back')!.addEventListener('click', () => {
            useAppStore.setScreen('home');
          });
        }
        break;
      }
      case 'result':
        if (this.lastResult) renderResultScreen(this.uiRoot, this.lastResult);
        break;
      case 'celebration':
        if (this.lastResult) renderResultScreen(this.uiRoot, this.lastResult, { celebration: true });
        break;
      default:
        renderWelcomeScreen(this.uiRoot);
    }
  }

  dispose(): void {
    this.sceneHost?.dispose();
  }
}
