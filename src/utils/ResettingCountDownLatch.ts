export class ResettingCountDownLatch {
  initialCount: number;
  currentCount: number;
  resolver?: (value: boolean | PromiseLike<boolean>) => void;
  promise?: Promise<boolean>;

  constructor(initialCount = 1) {
    if (initialCount < 1) {
      throw new Error(`Initial count must be at least 1, not ${initialCount}`);
    }
    this.initialCount = initialCount;
    this.currentCount = initialCount;
    this._reset();
  }

  _reset() {
    this.currentCount = this.initialCount;
    this.promise = new Promise<boolean>((resolve, reject) => {
      this.resolver = resolve;
    });
  }
  async waitFor() {
    await this.promise;
  }

  countDown() {
    this.currentCount -= 1;
    if (this.currentCount === 0) {
      this.resolver?.(true);
      this._reset();
    }
  }
}
