import { DROP_ZONE_LAYOUTS } from './mapDropZones';
import type { MapRegionId } from './challengeTypes';
import { MAP_IMAGE_URL } from './mapDropZones';

export interface VietnamMapViewOptions {
  mount: HTMLElement;
  /** Vùng được phép thả ở lượt này */
  activeRegions: Set<MapRegionId>;
  onDrop: (region: MapRegionId) => void;
}

/** Bản đồ SGK + vùng thả — kéo thả bằng pointer */
export class VietnamMapView {
  private readonly mount: HTMLElement;
  private readonly zones = new Map<MapRegionId, HTMLElement>();
  private activeRegions = new Set<MapRegionId>();
  private onDrop: ((region: MapRegionId) => void) | null = null;

  private cardEl: HTMLElement | null = null;
  private dragging = false;
  private pointerId = -1;
  private offsetX = 0;
  private offsetY = 0;

  private readonly onPointerMove = (e: PointerEvent) => this.handlePointerMove(e);
  private readonly onPointerUp = (e: PointerEvent) => this.handlePointerUp(e);

  constructor(opts: VietnamMapViewOptions) {
    this.mount = opts.mount;
    this.activeRegions = opts.activeRegions;
    this.onDrop = opts.onDrop;
    this.render();
  }

  setActiveRegions(regions: Set<MapRegionId>): void {
    this.activeRegions = regions;
    for (const [id, el] of this.zones) {
      const on = regions.has(id);
      el.classList.toggle('su-dia-zone--off', !on);
      el.setAttribute('aria-hidden', on ? 'false' : 'true');
    }
  }

  attachCard(cardEl: HTMLElement): void {
    this.cardEl = cardEl;
    cardEl.addEventListener('pointerdown', this.onCardPointerDown);
  }

  detachCard(): void {
    if (this.cardEl) {
      this.cardEl.removeEventListener('pointerdown', this.onCardPointerDown);
      this.cardEl = null;
    }
    this.endDrag();
  }

  highlightRegion(region: MapRegionId | null, state: 'ok' | 'bad' | null): void {
    for (const el of this.zones.values()) {
      el.classList.remove('su-dia-zone--flash-ok', 'su-dia-zone--flash-bad');
    }
    if (!region || !state) return;
    const el = this.zones.get(region);
    if (el) el.classList.add(state === 'ok' ? 'su-dia-zone--flash-ok' : 'su-dia-zone--flash-bad');
  }

  dispose(): void {
    this.detachCard();
    this.endDrag();
    this.mount.replaceChildren();
    this.zones.clear();
  }

  private render(): void {
    this.mount.className = 'su-dia-map';
    this.mount.innerHTML = `
      <img class="su-dia-map__img" src="${MAP_IMAGE_URL}" alt="Bản đồ hành chính Việt Nam theo SGK lớp 4" draggable="false" />
      <div class="su-dia-map__zones" aria-label="Vùng thả trên bản đồ"></div>
    `;
    const layer = this.mount.querySelector<HTMLElement>('.su-dia-map__zones')!;
    for (const z of DROP_ZONE_LAYOUTS) {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'su-dia-zone';
      el.dataset.region = z.id;
      el.style.left = `${z.left}%`;
      el.style.top = `${z.top}%`;
      el.style.width = `${z.width}%`;
      el.style.height = `${z.height}%`;
      el.title = z.label;
      el.setAttribute('aria-label', `Vùng ${z.label}`);
      const label = document.createElement('span');
      label.className = 'su-dia-zone__label';
      label.textContent = z.label;
      el.appendChild(label);
      const on = this.activeRegions.has(z.id);
      el.classList.toggle('su-dia-zone--off', !on);
      el.addEventListener('click', () => {
        if (this.dragging || !on || !this.onDrop) return;
        this.onDrop(z.id);
      });
      layer.appendChild(el);
      this.zones.set(z.id, el);
    }
  }

  private readonly onCardPointerDown = (e: PointerEvent) => {
    if (!this.cardEl || e.button !== 0) return;
    e.preventDefault();
    const rect = this.cardEl.getBoundingClientRect();
    this.dragging = true;
    this.pointerId = e.pointerId;
    this.offsetX = e.clientX - rect.left;
    this.offsetY = e.clientY - rect.top;
    this.cardEl.setPointerCapture(e.pointerId);
    this.cardEl.classList.add('su-dia-card--dragging');
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
  };

  private handlePointerMove(e: PointerEvent): void {
    if (!this.dragging || e.pointerId !== this.pointerId || !this.cardEl) return;
    const parent = this.cardEl.offsetParent as HTMLElement | null;
    const base = parent?.getBoundingClientRect();
    if (!base) return;
    const x = e.clientX - base.left - this.offsetX;
    const y = e.clientY - base.top - this.offsetY;
    this.cardEl.style.left = `${x}px`;
    this.cardEl.style.top = `${y}px`;

    const hit = document.elementFromPoint(e.clientX, e.clientY);
    const zone = hit?.closest<HTMLElement>('.su-dia-zone');
    for (const el of this.zones.values()) {
      el.classList.remove('su-dia-zone--hover');
    }
    if (zone && !zone.classList.contains('su-dia-zone--off')) {
      zone.classList.add('su-dia-zone--hover');
    }
  }

  private handlePointerUp(e: PointerEvent): void {
    if (!this.dragging || e.pointerId !== this.pointerId) return;
    const hit = document.elementFromPoint(e.clientX, e.clientY);
    const zone = hit?.closest<HTMLElement>('.su-dia-zone');
    const region = zone?.dataset.region as MapRegionId | undefined;
    if (region && this.activeRegions.has(region) && this.onDrop) {
      this.onDrop(region);
    }
    this.endDrag();
  };

  private endDrag(): void {
    if (!this.dragging) return;
    this.dragging = false;
    if (this.cardEl) {
      try {
        this.cardEl.releasePointerCapture(this.pointerId);
      } catch {
        /* already released */
      }
      this.cardEl.classList.remove('su-dia-card--dragging');
      this.cardEl.style.left = '';
      this.cardEl.style.top = '';
    }
    for (const el of this.zones.values()) {
      el.classList.remove('su-dia-zone--hover');
    }
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
  }
}
