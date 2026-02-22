# Minecraft BE - Java版治癒仕様アドオン

Minecraft Bedrock EditionでJava版の体力回復仕様を再現するビヘイビアーパックです。

## 仕様

Java版の治癒システムを再現します：

- **満腹度20（最大）**: 0.5秒ごとに1体力回復（高速回復）
- **満腹度18-19**: 4秒ごとに1体力回復（通常回復）
- **満腹度17以下**: 自然回復なし

## インストール方法

### Windows版 Minecraft の場合

1. このリポジトリをクローンまたはダウンロード
2. 以下のフォルダーに `java-hp-system` フォルダーを配置：

```
C:\Users\[ユーザー名]\AppData\Local\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_behavior_packs\
```

3. Minecraftを起動
4. ワールドを作成または編集
5. 「ビヘイビアーパック」から「Java版治癒仕様」を選択

### その他の方法

- **MC>Addons** などのツールを使用してインポート
- コンソール版の場合は、外部ツールでパックを適用

## 使い方

1. アドオンを有効にしたワールドを起動
2. 自動的に以下の設定が適用されます：
   - `naturalRegeneration` ゲームルールが `false` に設定
   - Java版仕様の回復システムが有効化
3. 回復時にチャットにデバッグメッセージが表示されます

## 動作確認

- 満腹度20で高速回復を確認（0.5秒ごとに半ハート）
- 満腹度18-19で通常回復を確認（4秒ごとに半ハート）
- 満腹度17以下で回復しないことを確認

## 技術情報

- **Script API**: 1.11.0
- **最小エンジンバージョン**: 1.20.0
- **実装方法**: `system.runInterval` で1秒ごとにプレイヤーの満腹度をチェック

## ファイル構成

```
java-hp-system/
├── manifest.json              # マニフェストファイル
├── README.md                  # このファイル
└── scripts/
    ├── main.js               # メインスクリプト
    └── config/
        └── healing_config.js # 治癒設定
```

## 開発

### 治癒設定の変更

`scripts/config/healing_config.js` を編集することで、回復速度や閾値を変更できます。

```javascript
export const HEALING_CONFIG = {
    HIGH_HEALING: {
        hungerThreshold: 20,  // 高速回復の満腹度閾値
        interval: 10,         // 回復間隔（ticks）
        healAmount: 1         // 回復量
    },
    // ...
};
```

## ライセンス

MIT License

## リンク

- [Minecraft Wiki - 治癒](https://ja.minecraft.wiki/w/%E6%B2%BB%E7%99%92)
- [Minecraft Creator Documentation](https://learn.microsoft.com/en-us/minecraft/creator/)
