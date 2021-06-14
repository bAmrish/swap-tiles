import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Puzzle} from '../models/puzzle.model';

@Injectable({providedIn: 'root'})
export class PuzzleStorageService {
  private static SWAP_TILE_DB = 'swap-tiles-db';
  private static PUZZLE_STORE = 'puzzles';
  private static DB_VERSION = 1;
  private __init__ = false;

  // @ts-ignore
  private db: IDBDatabase;
  // @ts-ignore
  private store: IDBObjectStore;


  constructor() {
    this.openDb();
  }

  savePuzzle(puzzle: Puzzle) {
    const puzzleStore = PuzzleStorageService.PUZZLE_STORE;
    if (!this.db) {
      console.log('database not initialized');
      return;
    }
    this.db
      .transaction(puzzleStore, "readwrite")
      .objectStore(puzzleStore)
      .put(puzzle);
  }

  getAllPuzzles(): Observable<Puzzle[]> {
    const subject = new BehaviorSubject<Puzzle[]>([]);
    const puzzleStore = PuzzleStorageService.PUZZLE_STORE;
    if (!this.db) {
      console.log('database not initialized');
      subject.complete();
      return subject;
    }
    let request = this.db.transaction(puzzleStore)
      .objectStore(puzzleStore)
      .getAll();

    request.onsuccess = (event) => {
      // @ts-ignore
      subject.next(event.target.result)
      subject.complete();
    }

    return subject;
  }

  private openDb = () => {
    const dbName = PuzzleStorageService.SWAP_TILE_DB;
    const version = PuzzleStorageService.DB_VERSION;
    const storeName = PuzzleStorageService.PUZZLE_STORE;
    const request = indexedDB.open(dbName, version);
    const self = this;
    request.onsuccess = function () {
      self.db = this.result;
      self.__init__ = true;
    }

    request.onerror = function (event) {
      console.log(`Failed to open ${dbName} database.`);
      console.log(event);
    }

    request.onupgradeneeded = function (event) {
      console.log(`Upgrading database ${dbName} to version ${version}`);
      // @ts-ignore
      const db: IDBDatabase = event.currentTarget.result;
      self.store = db.createObjectStore(storeName, {keyPath: "id"});
    }
  }
}
