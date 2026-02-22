/**
 * Java Edition Healing Configuration
 * Java版の治癒仕様を再現するための設定ファイル
 */

export const HEALING_CONFIG = {
    /**
     * 高速回復設定
     * 満腹度が最大（20）の時に適用
     */
    HIGH_HEALING: {
        hungerThreshold: 20,  // 満腹度20で高速回復
        interval: 10,         // 0.5秒（10 ticks）
        healAmount: 1         // 1体力回復（半ハート）
    },

    /**
     * 通常回復設定
     * 満腹度が18-19の時に適用
     */
    NORMAL_HEALING: {
        hungerThreshold: 18,  // 満腹度18以上で通常回復
        interval: 80,         // 4秒（80 ticks）
        healAmount: 1         // 1体力回復（半ハート）
    },

    /**
     * 回復なしの閾値
     * 満腹度がこれ以下の場合、自然回復しない
     */
    NO_HEALING_THRESHOLD: 17,

    /**
     * メインループの実行間隔
     * パフォーマンス対策として1秒ごとにチェック
     */
    CHECK_INTERVAL: 20  // 20 ticks = 1秒
};
