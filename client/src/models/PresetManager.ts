import { Preset, Category } from '../api';

export default class PresetManager {
  static presets?: Preset[];
  static categories?: Category[];

  static getPresets = (): Promise<[Preset[], Category[]]> => {
    if (PresetManager.presets && PresetManager.categories) {
      return new Promise((resolve, reject) => {
        if (PresetManager.presets && PresetManager.categories) {
          resolve([PresetManager.presets, PresetManager.categories]);
        } else {
          reject();
        }
      });
    }
    return PresetManager.forceUpdate();
  };

  static forceUpdate = (): Promise<[Preset[], Category[]]> => {
    delete PresetManager.presets;
    delete PresetManager.categories;
    return Promise.all([
      fetch(`${process.env.REACT_APP_HTTP_URL}/presets`, { credentials: 'include' }),
      fetch(`${process.env.REACT_APP_HTTP_URL}/categories`, { credentials: 'include' }),
    ])
      .then(([presets, categories]) => Promise.all([presets.json(), categories.json()]))
      .then(([presets, categories]) => {
        PresetManager.presets = presets;
        PresetManager.categories = categories;
        return [presets, categories];
      });
  };

  static getCachedCategories = (): Category[] => PresetManager.categories ?? [];

  static clear = () => {
    delete PresetManager.presets;
    delete PresetManager.categories;
  }
}
