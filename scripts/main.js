/**
 * Java Edition Healing System for Minecraft Bedrock Edition
 * Java版の体力回復仕様をBEで再現するアドオン
 *
 * 仕様:
 * - 満腹度20（最大）: 0.5秒ごとに1体力回復
 * - 満腹度18-19: 4秒ごとに1体力回復
 * - 満腹度17以下: 自然回復なし
 */

import { world, system } from "@minecraft/server";
import { HEALING_CONFIG } from "./config/healing_config.js";

/**
 * プレイヤーごとの回復タイマー管理
 * プレイヤーIDをキーとして、経過tick数を格納
 */
const playerHealTimers = new Map();

/**
 * ワールド初期化時にゲームルールを設定
 */
world.afterEvents.worldInitialize.subscribe(() => {
    try {
        // BEの自然回復を無効化
        const overworld = world.getDimension("overworld");
        overworld.runCommand("gamerule naturalRegeneration false");
        console.log("[Java治癒] naturalRegenerationを無効化しました");
    } catch (error) {
        console.error("[Java治癒] ゲームルールの設定に失敗:", error);
    }
});

/**
 * プレイヤーが参加した時にタイマーを初期化
 */
world.afterEvents.playerSpawn.subscribe((event) => {
    if (!event.player) return;
    playerHealTimers.set(event.player.id, 0);
    console.log(`[Java治癒] プレイヤー参加: ${event.player.name}`);
});

/**
 * メインループ: 定期的にプレイヤーの状態をチェックして回復処理を実行
 */
system.runInterval(() => {
    const players = world.getAllPlayers();

    for (const player of players) {
        try {
            // コンポーネントの取得
            const hunger = player.getComponent("minecraft:hunger");
            const health = player.getComponent("minecraft:health");

            if (!hunger || !health) continue;

            const currentHunger = hunger.currentValue;
            const currentHealth = health.currentValue;
            const maxHealth = health.maxValue;

            // 既に満タンなら回復しない
            if (currentHealth >= maxHealth) {
                playerHealTimers.set(player.id, 0);
                continue;
            }

            // 回復条件判定
            let shouldHeal = false;
            let healAmount = 0;

            if (currentHunger >= HEALING_CONFIG.HIGH_HEALING.hungerThreshold) {
                // 高速回復：0.5秒ごとに1体力
                const timer = playerHealTimers.get(player.id) || 0;
                if (timer >= HEALING_CONFIG.HIGH_HEALING.interval) {
                    shouldHeal = true;
                    healAmount = HEALING_CONFIG.HIGH_HEALING.healAmount;
                    playerHealTimers.set(player.id, 0);
                } else {
                    playerHealTimers.set(player.id, timer + HEALING_CONFIG.CHECK_INTERVAL);
                }
            } else if (currentHunger >= HEALING_CONFIG.NORMAL_HEALING.hungerThreshold) {
                // 通常回復：4秒ごとに1体力
                const timer = playerHealTimers.get(player.id) || 0;
                if (timer >= HEALING_CONFIG.NORMAL_HEALING.interval) {
                    shouldHeal = true;
                    healAmount = HEALING_CONFIG.NORMAL_HEALING.healAmount;
                    playerHealTimers.set(player.id, 0);
                } else {
                    playerHealTimers.set(player.id, timer + HEALING_CONFIG.CHECK_INTERVAL);
                }
            } else {
                // 満腹度が閾値以下：回復なし、タイマーリセット
                playerHealTimers.set(player.id, 0);
            }

            // 回復実行
            if (shouldHeal) {
                const newHealth = Math.min(currentHealth + healAmount, maxHealth);
                health.setCurrentHealth(newHealth);

                // デバッグログ（開発用）
                player.runCommand(`tellraw @a {"rawtext":[{"text":"§a[Java治癒] ${player.name}: 満腹度:${currentHunger} 回復:${healAmount} (${currentHealth}→${newHealth})"}]}`);
            }

        } catch (error) {
            console.error(`[Java治癒] プレイヤー ${player.name} の処理でエラー:`, error);
        }
    }
}, HEALING_CONFIG.CHECK_INTERVAL);

/**
 * プレイヤーが退出した時にタイマーをクリア
 */
world.afterEvents.playerLeave.subscribe((event) => {
    playerHealTimers.delete(event.playerId);
    console.log(`[Java治癒] プレイヤー退出: ${event.playerId}`);
});

console.log("[Java治癒] Java版治癒仕様アドオンが読み込まれました");
