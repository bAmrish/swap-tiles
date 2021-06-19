import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Puzzle} from '../../puzzle/models/puzzle.model';
import {PuzzleStorageService} from '../../puzzle/services/puzzle-storage.service';

@Injectable({providedIn: 'root'})
export class StatsService{

  constructor(private storageService: PuzzleStorageService) {
  }

  getAllPuzzles(): Observable<Puzzle[]> {
    return this.storageService.getAllPuzzles('numeric');
  }

}
