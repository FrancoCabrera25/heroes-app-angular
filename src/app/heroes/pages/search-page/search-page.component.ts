import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Hero } from '../../interfaces/hero.interface';
import { HeroService } from '../../services/heroes.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit {
  public searchInput = new FormControl();
  public heroes: Hero[] = [];

  public selectedHero?: Hero;

  constructor(private heroService: HeroService) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  searchHero(): void {
    const value: string = this.searchInput.value || '';

    this.heroService
      .getSuggestions(value)
      .subscribe((heroes) => (this.heroes = heroes));
  }

  onSelectedOption(event: MatAutocompleteSelectedEvent): void {
    if (!event.option.value) {
      this.selectedHero = undefined;
      return;
    }

    this.selectedHero = event.option.value as Hero;
    this.searchInput.setValue(this.selectedHero.superhero);
  }
}
