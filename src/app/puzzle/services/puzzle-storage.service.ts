import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Puzzle, PuzzleType} from '../models/puzzle.model';

@Injectable({providedIn: 'root'})
export class PuzzleStorageService {
  private static SWAP_TILE_DB = 'swap-tiles-db';
  private static OLD_PUZZLE_STORE = 'puzzles';
  private static NUMERIC_STORE = 'numeric';
  private static PICTURE_STORE = 'picture';
  private static DB_VERSION = 2;
  private __init__ = false;

  // @ts-ignore
  private db: IDBDatabase;
  // @ts-ignore
  private oldPuzzleStore: IDBObjectStore;
  // @ts-ignore
  private numericStore: IDBObjectStore;
  // @ts-ignore
  private pictureStore: IDBObjectStore;


  constructor() {
    //
    this.openDb();
  }

  savePuzzle(type: PuzzleType, puzzle: Puzzle) {
    let puzzleStore;
    switch (type) {
      case 'numeric':
        puzzleStore = PuzzleStorageService.NUMERIC_STORE;
        break;
      case 'picture':
        puzzleStore = PuzzleStorageService.PICTURE_STORE;
        break;
    }

    if (!this.db) {
      console.log('database not initialized');
      return;
    }
    this.db
      .transaction(puzzleStore, "readwrite")
      .objectStore(puzzleStore)
      .put(puzzle);
  }

  get(type: PuzzleType, id: string): Observable<Puzzle | null> {
    let puzzleStore;
    switch (type) {
      case 'numeric':
        puzzleStore = PuzzleStorageService.NUMERIC_STORE;
        break;
      case 'picture':
        puzzleStore = PuzzleStorageService.PICTURE_STORE;
        break;
    }

    const subject = new Subject<Puzzle | null>();

    if (!this.db) {
      console.log('database not initialized');
      subject.next(null)
      return subject;
    }
    if (!id) {
      subject.next(null);
      return subject;
    }
    let request = this.db.transaction(puzzleStore)
      .objectStore(puzzleStore)
      .get(id);

    request.onsuccess = (event) => {
      // @ts-ignore
      subject.next(event.target.result)
      subject.complete();
    }

    request.onerror = () => {
      subject.complete();
    }

    return subject;

  }

  getAllPuzzles(type: PuzzleType): Observable<Puzzle[]> {
    let puzzleStore;
    switch (type) {
      case 'numeric':
        puzzleStore = PuzzleStorageService.NUMERIC_STORE;
        break;
      case 'picture':
        puzzleStore = PuzzleStorageService.PICTURE_STORE;
        break;
    }

    const subject = new BehaviorSubject<Puzzle[]>([]);
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

  migrate(db: IDBDatabase, puzzles: Puzzle[]) {
    const puzzleStore = PuzzleStorageService.NUMERIC_STORE;

    if (!db) {
      if (!this.db) {
        console.log('database not initialized');
        return;
      }
      db = this.db;
    }

    if (puzzles && puzzles.length > 0) {
      puzzles.forEach((puzzle: Puzzle) => {
        const parts = puzzle.id.split('|');
        if (parts.length == 2) {
          puzzle.id = parts[1];
        }

        puzzle.type = 'numeric';

        db.transaction(puzzleStore, "readwrite")
          .objectStore(puzzleStore)
          .add(puzzle);
      })
    }

    // @ts-ignore
    db.transaction.oncomplete = function () {
      console.log("migration complete");
    }
  }

  private openDb = () => {
    const dbName = PuzzleStorageService.SWAP_TILE_DB;
    const version = PuzzleStorageService.DB_VERSION;
    const storeName = PuzzleStorageService.OLD_PUZZLE_STORE;
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
      // @ts-ignore
      const db: IDBDatabase = event.currentTarget.result;
      // @ts-ignore
      const transaction: IDBTransaction = event.target.transaction;

      console.log(`Upgrading database ${dbName}`);
      console.log(`from: ${event.oldVersion} to: ${event.newVersion}`);

      self.numericStore = db.createObjectStore(PuzzleStorageService.NUMERIC_STORE, {keyPath: "id"});
      self.pictureStore = db.createObjectStore(PuzzleStorageService.PICTURE_STORE, {keyPath: "id"});
      self.oldPuzzleStore = transaction.objectStore(storeName);

      const result = self.oldPuzzleStore.getAll()
      result.onsuccess = (event) => {
        transaction.oncomplete = () => {
          // @ts-ignore
          self.migrate(db, event.target.result);
        }
      }

    }
  }
}
