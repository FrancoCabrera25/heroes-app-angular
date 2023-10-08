import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['./new-page.component.scss'],
})
export class NewPageComponent implements OnInit {
  public heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });
  public publishers = [
    {
      id: 'DC Comics',
      value: 'DC - Comics',
    },
    {
      id: 'Marvel Comics',
      value: 'Marvel - Comics',
    },
  ];

  constructor(
    private heroService: HeroService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroService.getHeroById(id)))
      .subscribe((hero) => {
        if (!hero) {
          return this.router.navigateByUrl('/');
        }
        return this.heroForm.reset(hero);
      });
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;

    return hero;
  }
  onSubmit(): void {
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroService.updateHero(this.currentHero).subscribe((hero) => {
        this.showSnackbar(`${hero.superhero} updated!`);
      });
    } else {
      this.heroService.addHero(this.currentHero).subscribe((hero) => {
        this.showSnackbar(`${hero.superhero} created!`);
        this.router.navigate(['/heroes/edit', hero.id]);
      });
    }
  }

  public onDeleteHero(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.currentHero,
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroService.deleteHero(this.currentHero.id)),
        filter((wasDeleted: boolean) => wasDeleted)
      )
      .subscribe(() => {
        this.showSnackbar(
          `El heroe ${this.currentHero.superhero} se elimino correctamente.`
        );
        this.router.navigate(['/heores']);
      });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (!result) return;

    //   this.heroService.getHeroById(this.currentHero.id).subscribe((result) => {
    //     if (result) {
    //       this.showSnackbar(
    //         `El heroe ${this.currentHero.superhero} se elimino correctamente.`
    //       );
    //       this.router.navigate(['/heores']);
    //     }
    //   });
    // });
  }

  private showSnackbar(message: string): void {
    this.snackbar.open(message, 'Cerrar', { duration: 2500 });
  }
}
