/**
 * @class
 */
export class logic {
    flavorTexts = [];
    pokemons = [];
  
    firstPageUrl;
    lastpageUrl;
    pageOneUrl = "";
    previousPageUrl = "";
    nextPageUrl = "";
  
    /**
     * @constructor
     * sets correct url for fetching pokemons via PokeApi pageination.
     */
  
    constructor() {
      let offset = (this.loadPageNr() - 1) * 12;
      let lastPageOffset = (94 - 1) * 12;
  
      this.firstPageUrl = new URL("https://pokeapi.co");
      this.firstPageUrl.pathname = "/api/v2/pokemon";
      this.firstPageUrl.searchParams.set("limit", "12");
      this.firstPageUrl.searchParams.set("offset", offset);
  
      this.lastpageUrl = new URL("https://pokeapi.co");
      this.lastpageUrl.pathname = "/api/v2/pokemon";
      this.lastpageUrl.searchParams.set("limit", "12");
      this.lastpageUrl.searchParams.set("offset", lastPageOffset);
  
      this.pageOneUrl = new URL("https://pokeapi.co");
      this.pageOneUrl.pathname = "/api/v2/pokemon";
      this.pageOneUrl.searchParams.set("limit", "12");
      this.pageOneUrl.searchParams.set("offset", "0");
    }
  
    /**
     * @description sets url for fetching pokemons on asked page via PokeApi pageination.
     * @param asked page number
     * @returns url via PokeApi pageination for the pokemons on asked page.
     */
  
    getJumpToPageUrl(askedPageNr) {
      let offset = (askedPageNr - 1) * 12;
  
      this.jumpToPageUrl = new URL("https://pokeapi.co");
      this.jumpToPageUrl.pathname = "/api/v2/pokemon";
      this.jumpToPageUrl.searchParams.set("limit", "12");
      this.jumpToPageUrl.searchParams.set("offset", offset);
  
      return this.jumpToPageUrl;
    }
  
    /**
     * @description Async function fetching pokemons
     * @param {*} url of the page the pokemons should be fetched from
     * @returns array of pokemonObjekt
     */
  
    async fetchPokemons(url) {
      const promises = [];
      let pageData = await fetch(url).then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw "Something went wrong, status: " + response.status;
        }
      });
  
      this.previousPageUrl = pageData.previous;
      if (this.previousPageUrl != null)
        this.preLoadCacheMemory(this.previousPageUrl);
  
      this.nextPageUrl = pageData.next;
      if (this.nextPageUrl != null) this.preLoadCacheMemory(this.nextPageUrl);
  
      const pokemonsOnCurrentPage = pageData.results;
  
      for (let pokemonData of pokemonsOnCurrentPage) {
        const pokemon = this.fetchPokemon(pokemonData.url);
        promises.push(pokemon);
      }
  
      const resluts = await Promise.allSettled(promises);
  
      return resluts
        .filter((promises) => promises.status === "fulfilled")
        .map((promises) => promises.value);
    }
  
    /**
     * @description Async function fetching pokemons to browserCacheMemory. Encrease userExperience and pagespeed.
     * @param {*} url of the page
     */
  
    async preLoadCacheMemory(url) {
      let pageData = await fetch(url).then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw (
            "Something went wrong when preloading to cache, status: " +
            response.status
          );
        }
      });
  
      const pokemonsOnNextPage = pageData.results;
  
      for (let pokemonData of pokemonsOnNextPage) {
        const cacheMemoryPokemons = this.fetchPokemon(pokemonData.url);
      }
    }
  
    /**
     * @description Async function fetching a pokemon objekt
     * @param {*} url of the page the pokemon info can be fetched from
     * @returns a single pokemon objekt
     */
  
    async fetchPokemon(url) {
      const pokemon = await fetch(url).then((response) => response.json());
      const species = await fetch(pokemon.species.url).then((response) =>
        response.json()
      );
  
      let flavorTexts = [];
  
      species.flavor_text_entries.forEach((entry) => {
        if (entry.language.name == "en") {
          flavorTexts.push(entry.flavor_text);
        }
      });
  
      const pokemonObj = {
        id: pokemon.id,
        name: pokemon.name,
        height: pokemon.height,
        weight: pokemon.weight,
  
        sprites: pokemon.sprites.other["official-artwork"].front_default,
  
        type: pokemon.types.map((mapArr) => mapArr.type.name).join(" / "),
        abilities: pokemon.abilities
          .map((mapArr) => mapArr.ability.name)
          .join(", "),
        base_experience: pokemon.base_experience,
        flavorText: flavorTexts[0],
      };
  
      return pokemonObj;
    }
  
    /**
     * @description saves a pagenumber to local storage key: "savedPageNr"
     * @param the page number to be saved
     */
  
    savePageNr(pageNr) {
      localStorage.setItem("savedPageNr", JSON.stringify(pageNr));
    }
  
    /**
     * @description sets variable currentPage to local storage key: "savedPageNr"
     * @return currentPage
     */
  
    loadPageNr() {
      let savedPage = +localStorage.getItem("savedPageNr");
      if (savedPage >= 1) {
        this.currentPage = savedPage;
        return this.currentPage;
      } else {
        return 1;
      }
    }
  }