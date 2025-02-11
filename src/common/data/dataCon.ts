import { Ref } from 'vue';
import { Character, CharacterSaveSchema, CharacterSchema } from '../char/types';
import { get_boss_hp, get_char, set_boss_hp } from '../../server';
import { char_damage_total } from '../tatakai';
import keyBy from 'lodash-es/keyBy';
import cloneDeep from 'lodash-es/cloneDeep';
import { bb, initialData } from '../char';

const UPSTASH_URL = 'https://evident-whale-25926.upstash.io';
const UPSTASH_TOKEN = 'AWVGAAIjcDFjMjFiZmY1MWRlYWY0NTYyYTViYjNjM2Y1MmU1ZDdhZHAxMA';

export class DataCon {
    characters = initialData
    enemy = bb
    roles = [...this.characters, ...this.enemy]
    roles_group = keyBy(this.roles, "id")
    battle_data: any = {
        cur_time: 0,
        pause: false,
        round: 0,
        time: 5000,
    };
    battle_data_info: any
    globalConfig = {
        autosave: true,
        autoload: 'auto',
    };
    init_data = {}
    save_data = {}
    battleManagerGourp: Record<string, any> = {}
    constructor() {
        const globalConfig = localStorage.getItem("globalConfig")
        try {
            if (globalConfig) {
                this.globalConfig = JSON.parse(globalConfig)
            } else {
                this.save_global_config()
            }
        } catch { }
        this.get_save_data()
        !localStorage.getItem('default') && this.setPlugin('default')

        const battleManagerGroup: Record<string, any> = {}
        Object.keys(this.battleManagerGourp).map(k =>
            battleManagerGroup[k] = {
                battle_data: this.battleManagerGourp['init'].battle_data,
                cooldowns: Object.fromEntries(this.battleManagerGourp['init'].cooldownManager.cooldowns),
            })
        this.init_data = {
            characters: this.characters.map(i => CharacterSaveSchema.parse(i)),
            enemy: this.enemy.map(i => CharacterSaveSchema.parse(i)),
            roles: this.roles.map(i => CharacterSaveSchema.parse(i)),
            battle_data_info: battleManagerGroup,
            time: Date.now()
        }
        return this
    }
    setPlugin(device: string, data = '{}') {
        localStorage.setItem('plugin-' + device, data)
    }
    newData() {
        const globalConfig = localStorage.getItem("globalConfig")
        try {
            if (globalConfig) {
                this.globalConfig = JSON.parse(globalConfig)
            } else {
                this.save_global_config()
            }
        } catch { }
        this.get_save_data()
    }
    get_save_data() {
        Object.keys(localStorage).forEach(k => {
            if (k.endsWith(":save")) {
                try {
                    this.save_data[k] = JSON.parse(localStorage[k])
                } catch { }
            }
        })
    }
    save_global_config(config: Record<keyof typeof this.globalConfig, any> | null = null) {
        if (config) {
            this.globalConfig = Object.assign(this.globalConfig, config)
        }
        localStorage.setItem("globalConfig", JSON.stringify(this.globalConfig))
    }
    async save(device = this.globalConfig.autoload) {
        const battleManagerGroup: Record<string, any> = {}
        Object.keys(this.battleManagerGourp).map(k =>
            battleManagerGroup[k] = {
                battle_data: this.battleManagerGourp['init'].battle_data,
                cooldowns: Object.fromEntries(this.battleManagerGourp['init'].cooldownManager.cooldowns),
            })
        const data = JSON.stringify({
            characters: this.characters.map(i => CharacterSaveSchema.parse(i)),
            enemy: this.enemy.map(i => CharacterSaveSchema.parse(i)),
            roles: this.roles.map(i => CharacterSaveSchema.parse(i)),
            battle_data_info: battleManagerGroup,
            time: Date.now()
        })
        localStorage.setItem(`${device}:save`, data)
        this.get_save_data()
    }
    async load(device = this.globalConfig.autoload, newData = false) {
        let save = localStorage.getItem(`${device}:save`) || ""
        this.save_global_config({
            autoload: device,
        });
        if (!save || newData) {
            this.newData()
            save = this.init_data
        }else{
            save = JSON.parse(save)
        }
      
        this.characters = save.characters.map(i => CharacterSchema.parse(i))
        this.enemy = save.enemy.map(i => CharacterSchema.parse(i))
        this.roles = [...this.characters, ...this.enemy]
        this.roles_group = keyBy(this.roles, "id")
        const battleManagerGroup: Record<string, any> = {}
        Object.keys(save.battle_data_info).map(k =>
            battleManagerGroup[k] = {
                battle_data: save.battle_data_info[k].battle_data,
                cooldowns: new Map(Object.entries(save.battle_data_info[k].cooldowns)),
            })
        this.battle_data_info = battleManagerGroup
        // this.data.current.cooldownManager.updateCooldowns();
        // this.data.current.roles.forEach(i => {
        //     this.data.current.calculateFinalStats(i)
        // })
    }
}
