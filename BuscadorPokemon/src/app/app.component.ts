import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService, Pokemon } from './pokemon.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="page">
      <section class="card">
        <header class="card__header">
          <h1 class="card__title">Buscador de Pokémon</h1>
          <p class="card__subtitle">
            Escribe el nombre de un Pokémon (ej. <span>ditto</span>, <span>pikachu</span>)
          </p>
        </header>

        <form class="search" (ngSubmit)="buscar()">
          <input
            class="search__input"
            type="text"
            name="query"
            [(ngModel)]="query"
            placeholder="Nombre del Pokémon"
            autocomplete="off"
            aria-label="Nombre del Pokémon"
          />
          <button class="search__button" type="submit" [disabled]="loading">
            {{ loading ? 'Buscando...' : 'Buscar' }}
          </button>
        </form>

        <div class="result" *ngIf="pokemon">
          <div class="result__image-wrap">
            <img
              *ngIf="pokemon.image"
              class="result__image"
              [src]="pokemon.image"
              [alt]="pokemon.name"
            />
          </div>
          <p class="result__name">{{ pokemon.name }}</p>
        </div>

        <p class="error" *ngIf="error">{{ error }}</p>
      </section>
    </main>
  `,
  styles: [
    `
      .page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
      }

      .card {
        width: 100%;
        max-width: 420px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.4);
      }

      .card__title {
        margin: 0;
        font-size: 1.6rem;
        font-weight: 700;
        color: var(--text);
      }

      .card__subtitle {
        margin: 0.5rem 0 0;
        font-size: 0.9rem;
        color: var(--muted);
      }

      .card__subtitle span {
        color: var(--accent);
        font-weight: 600;
      }

      .search {
        display: flex;
        gap: 0.6rem;
        margin: 1.5rem 0;
      }

      .search__input {
        flex: 1;
        padding: 0.75rem 1rem;
        border-radius: 12px;
        border: 1px solid var(--border);
        background: var(--input-bg);
        color: var(--text);
        font-size: 1rem;
        font-family: inherit;
        outline: none;
        transition: border-color 0.15s ease;
      }

      .search__input:focus {
        border-color: var(--accent);
      }

      .search__button {
        padding: 0.75rem 1.25rem;
        border: none;
        border-radius: 12px;
        background: var(--accent);
        color: var(--accent-foreground);
        font-size: 1rem;
        font-weight: 600;
        font-family: inherit;
        cursor: pointer;
        transition: filter 0.15s ease;
      }

      .search__button:hover:not(:disabled) {
        filter: brightness(1.05);
      }

      .search__button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .result {
        text-align: center;
        padding-top: 0.5rem;
      }

      .result__image-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--input-bg);
        border-radius: 16px;
        padding: 1rem;
        min-height: 200px;
      }

      .result__image {
        width: 180px;
        height: 180px;
        object-fit: contain;
        image-rendering: pixelated;
      }

      .result__name {
        margin: 1rem 0 0;
        font-size: 1.4rem;
        font-weight: 700;
        text-transform: capitalize;
        color: var(--text);
      }

      .error {
        margin: 0;
        text-align: center;
        color: var(--danger);
        font-weight: 500;
      }
    `,
  ],
})
export class AppComponent {
  query = 'ditto';
  pokemon: Pokemon | null = null;
  loading = false;
  error = '';

  constructor(private pokemonService: PokemonService) {}

  buscar(): void {
    const name = this.query.trim();
    if (!name) {
      this.error = 'Escribe el nombre de un Pokémon.';
      this.pokemon = null;
      return;
    }

    this.loading = true;
    this.error = '';

    this.pokemonService.getPokemon(name).subscribe({
      next: (data) => {
        this.pokemon = data;
        this.loading = false;
      },
      error: () => {
        this.pokemon = null;
        this.error = `No se encontró ningún Pokémon llamado "${name}".`;
        this.loading = false;
      },
    });
  }
}
