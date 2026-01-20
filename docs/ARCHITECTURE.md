# Simple Text Capture - アーキテクチャ解説

このドキュメントでは、プラグインのソースコード構造、各モジュールの役割、および開発プロセスについて解説します。

## ディレクトリ構造

プロジェクトは `obsidian-sample-plugin` に準拠した構成になっています。

```
simple-text-capture/
├── src/                # ソースコード (TypeScript)
│   ├── main.ts         # プラグインのエントリポイント
│   ├── settings.ts     # 設定画面の実装
│   ├── modal.ts        # テキスト入力モーダルの実装
│   ├── types.ts        # 型定義 (設定データ型など)
│   └── utils/          # 純粋なユーティリティ関数
│       └── index.ts    # ロジック (日付整形、テンプレート、見出し判定)
├── tests/              # テストコード
│   └── unit/           # ユニットテスト (Jest)
│       └── utils.test.ts
├── styles.css          # プラグインのスタイル定義
├── main.js             # ビルド生成物 (Obsidianが読み込むファイル)
├── manifest.json       # プラグインのメタデータ (ID, バージョン等)
├── package.json        # 依存パッケージ管理とスクリプト
├── tsconfig.json       # TypeScriptコンパイル設定
├── jest.config.js      # Jestテスト設定
└── esbuild.config.mjs  # ビルド設定 (esbuild)
```

## ソースコード詳細 (`src/`)

### 1. `main.ts` (SimpleTextCapturePlugin)
プラグインの初期化とライフサイクルを管理します。
- **`onload()`**:
    - 設定のロード (`loadSettings`)。
    - 5つのスロットに対応するコマンド (`Capture (Slot X)`) の登録。
    - 設定タブ (`SimpleTextCaptureSettingTab`) の登録。
- **役割**: Obsidianとプラグイン機能を繋ぐハブの役割を果たします。

### 2. `settings.ts` (SimpleTextCaptureSettingTab)
設定画面のUIを提供します。
- ユーザーが各スロットの「テンプレート」や「出力先見出し (Target Header)」を設定するためのフォームを生成します。
- `display()` メソッド内でDOM要素を作成し、Obsidianの設定画面に描画します。
- 変更内容は即座に `saveSettings()` で永続化されます。

### 3. `modal.ts` (SimpleTextCaptureModal)
テキスト入力用のポップアップウィンドウを制御します。
- **UI構築**: `textarea` を配置し、スタイル (`styles.css`) を適用。
- **イベントハンドリング**:
    - `keydown`: `Cmd/Ctrl + Enter` で保存処理 (`saveNote`) を呼び出し。
    - IMEイベント: 日本語入力中のEnterキーで誤って保存されないように制御 (`isComposing` フラグ)。
- **保存ロジック (`saveNote`)**:
    - 入力内容を受け取り、`utils` の関数で整形します。
    - アクティブなMarkdownファイルを開き、追記します。
    - **下書き機能**: ウィンドウを保存せずに閉じた場合 (`onClose`)、入力内容を一時保存します。次回開いたとき (`onOpen`) に復元します。

### 4. `utils/index.ts`
Obsidian APIに依存しない、純粋なロジック関数群です。
- **`getFormattedDate(date)`**: 日付オブジェクトを `yy/mm/dd HH:MM` 形式の文字列に変換します。
- **`applyTemplate(template, input, dateStr)`**: テンプレート内のプレースホルダー `{$input}`, `{{date}}` を置換します。
- **`normalizeHeader(header)`**: 見出し文字列から先頭のハッシュ記号 (`#`) やスペースを除去し、検索しやすい形式にします。
- **`calculateInsertPosition(lines, headings, targetHeader)`**: 
    - ファイルの行データと見出しリストを受け取り、ターゲットとなる見出しの「次のセクションの開始行」を計算します。
    - 見出しが見つからない場合はファイルの末尾を返します。

### 5. `types.ts`
プラグイン全体で使用する型定義です。
- `CaptureSlot`: テンプレートやターゲット見出しなど、スロットごとの設定。
- `SimpleTextCaptureSettings`: プラグイン全体の設定オブジェクト。

## テストコード (`tests/`)

### `unit/utils.test.ts`
`src/utils/index.ts` に対する単体テストです。**Jest** フレームワークを使用しています。

#### テスト項目
1.  **Date Formatting**:
    - 日付が正しく指定フォーマットに変換されるか。
    - 1桁の月日が0埋めされるか。
2.  **Template Application**:
    - プレースホルダーが正しく置換されるか。
3.  **Header Normalization**:
    - `## Header` が `Header` に正規化されるか。
    - `Header` (修飾なし) はそのまま返されるか。
4.  **Insert Position Calculation**:
    - ターゲット見出しが見つかった場合、正しい行番号（次の見出しの前）が返るか。
    - 見出しが見つからない場合、末尾を示す値が返るか。
    - レベルの異なる見出し（h1の下のh2など）が正しく考慮されているか。

## 設定ファイル

### `package.json`
- **scripts**:
    - `dev`: `node esbuild.config.mjs` (開発用ウォッチビルド)
    - `build`: 本番用ビルド。TypeScriptのコンパイルチェック後、バンドルし、プラグインフォルダへコピーします。
    - `test`: `jest` を実行します。

### `esbuild.config.mjs`
- **esbuild** の設定ファイルです。
- エントリポイント: `src/main.ts`
- 出力ファイル: `main.js`
- `obsidian` モジュールをバンドルに含めないように `external` 設定を行っています。

### `jest.config.js`
- **Jest** の設定ファイルです。
- TypeScript (`ts-jest`) を使用して `.ts` ファイルを直接テストできるように設定されています。
- テストファイルの場所: `**/tests/**/*.test.ts`
