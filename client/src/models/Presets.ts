import { Preset, Category } from "../api";

export default class Presets {
  static presets?: Preset[];
  static categories?: Category[];

  static getPresets = (): Promise<[Preset[], Category[]]> => {
    if(Presets.presets && Presets.categories) {
      return new Promise((resolutor, _) => resolutor([Presets.presets!, Presets.categories!]));
    } else {
      return Presets.forceUpdate();
    }
  }

  static forceUpdate = (): Promise<[Preset[], Category[]]> => {
    delete Presets.presets;
    delete Presets.categories;
    return Promise.all([
      fetch(`${process.env.REACT_APP_HTTP_URL}/presets`),
      fetch(`${process.env.REACT_APP_HTTP_URL}/categories`),
    ])
      .then(([presets, categories]) => Promise.all([presets.json(), categories.json()]))
      .then(([presets, categories]) => {
        Presets.presets = presets;
        Presets.categories = categories;
        return [presets, categories];
      });
  }
} 
