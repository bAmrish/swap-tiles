export class Timer {
  public displayTime = "";
  private time = 0;
  private interval: any = null;
  private running = false;

  private tickCallbacks: (()=>void)[] = [];


  constructor(startTime?: number) {
    this.time = startTime || 0;
    this.displayTime = this.getDisplayTime();
  }

  private static twoDigit(n: number) {
    return n.toString().length < 2 ? "0" + n : n;
  }

  public start(): Timer {
    if (!this.running) {
      this.interval = setInterval(this.tick, 1000);
      this.running = true;
    }
    return this;
  }

  public stop(): Timer {
    if (this.running && this.interval != null) {
      clearInterval(this.interval);
      this.interval = null
      this.running = false;
    }
    return this;
  }

  public getTime() {
    return this.time;
  }

  private tick = (): Timer => {
    this.time += 1;
    this.displayTime = this.getDisplayTime();

    this.tickCallbacks.forEach(f => f());

    return this;
  }

  public onTick(callback: () => void): Timer {
    this.tickCallbacks.push(callback);
    return this;
  }
  private getDisplayTime(): string {
    const t = this.time;
    const h = Math.floor(t / 3600);
    const m = Math.floor((t - h * 3600) / 60)
    const s = (t - h * 3600 - m * 60)

    return `${Timer.twoDigit(h)}:${Timer.twoDigit(m)}:${Timer.twoDigit(s)}`;
  }
}
