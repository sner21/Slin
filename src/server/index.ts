import { Ref } from "vue"
const UPSTASH_URL = import.meta.env.VITE_UPSTASH_URL
const UPSTASH_TOKEN = import.meta.env.VITE_UPSTASH_TOKEN

/**
 * 检查环境变量是否正确配置
 */
function checkEnvironmentVars() {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
        throw new Error('环境变量未正确配置：缺少 UPSTASH_URL 或 UPSTASH_TOKEN');
    }
}

checkEnvironmentVars()

/**
 * 更新角色数据
 */
export async function update_char(cur: Ref) {
    try {
        return await fetch(`${UPSTASH_URL}/lset/characters/${cur.value[0].index}/${encodeURIComponent(JSON.stringify(cur.value[0].char))}`, {
            headers: {
                'Authorization': `Bearer ${UPSTASH_TOKEN}`
            }
        });
    } catch (error) {
        console.error('更新角色数据失败:', error);
        throw error;
    }
}

/**
 * 减少Boss血量
 */
export async function update_boss_hp(damage: number) {
    try {
        return await fetch(`${UPSTASH_URL}/DECRBY/boss:zs/${damage}`, {
            headers: {
                'Authorization': `Bearer ${UPSTASH_TOKEN}`
            }
        });
    } catch (error) {
        console.error('更新Boss血量失败:', error);
        throw error;
    }
}

/**
 * 设置Boss血量
 */
export async function set_boss_hp(hp: number) {
    try {
        return await fetch(`${UPSTASH_URL}/set/boss:zs/${hp}`, {
            headers: {
                'Authorization': `Bearer ${UPSTASH_TOKEN}`
            }
        });
    } catch (error) {
        console.error('设置Boss血量失败:', error);
        throw error;
    }
}

/**
 * 获取Boss当前血量
 */
export async function get_boss_hp() {
    try {
        return await (await fetch(`${UPSTASH_URL}/get/boss:zs`, {
            headers: {
                'Authorization': `Bearer ${UPSTASH_TOKEN}`
            }
        })).json();
    } catch (error) {
        console.error('获取Boss血量失败:', error);
        return 0;  // 出错时返回默认值
    }
}

/**
 * 重置角色数据（复活）
 */
export async function revive_char() {
    try {
        return await fetch(`${UPSTASH_URL}/del/characters/`, {
            headers: {
                'Authorization': `Bearer ${UPSTASH_TOKEN}`
            }
        }).then(() => {
            window.location.reload();
        });
    } catch (error) {
        console.error('重置角色数据失败:', error);
        throw error;
    }
}

/**
 * 获取所有角色数据
 */
export async function get_char() {
    try {
        return await (await fetch(`${UPSTASH_URL}/lrange/characters/0/-1`, {
            headers: {
                'Authorization': `Bearer ${UPSTASH_TOKEN}`
            }
        })).json();
    } catch (error) {
        console.error('获取角色数据失败:', error);
        return [];  // 出错时返回空数组
    }
}