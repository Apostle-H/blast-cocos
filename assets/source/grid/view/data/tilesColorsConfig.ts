import {JsonAsset, SpriteFrame, resources} from "cc";


export class TilesColorsConfig {
    private _spites: Map<number, SpriteFrame> = new Map();
    
    public load(spritesDict: JsonAsset) {
        const loadPromises: Promise<void>[] = [];
        for (let spritePath of spritesDict.json.spritePaths) {
            loadPromises.push(new Promise<void>((resolve, reject) => {
                resources.load(spritePath.path, SpriteFrame, (err, sprite) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    this._spites.set(spritePath.code, sprite);
                    resolve();
                })
            }))
        } 
        
        return Promise.all(loadPromises);
    }
    
    public get(color: number) {
        return this._spites.get(color);
    }
}

export const TILES_COLORS_CONFIG = new TilesColorsConfig();