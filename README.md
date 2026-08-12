# 📅 Weekly Routine PWA

曜日ごとに繰り返し行うルーティンタスクを直感的に設定・管理できる、モバイルファーストな Progressive Web App (PWA) です。

[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-orange.svg?logo=pwa)](https://developer.mozilla.org/ja/docs/Web/Progressive_web_apps)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ 主な機能

- 🗓️ **曜日別タスク管理**: 月曜日から日曜日まで、曜日ごとに繰り返し行うルーティンを個別に登録・編集・削除
- ✅ **今日のタスク画面（メイン）**: アプリを開いた「今日」の曜日に該当するタスクを自動抽出。ワンクリックで完了トグル＆完了時エフェクト（🎉 紙吹雪アニメーション）
- 🔄 **日替わり自動リセット**: 日付が変わると自動的に「今日のタスク」の完了ステータスがリセットされ、新たな一日の未完了状態からスタート
- 🔀 **ドラッグ＆ドロップ順序並び替え**: 直感的なドラッグ操作でタスクの優先度・表示順を自由にカスタマイズ（スマートフォンでのタッチ操作にも対応）
- 📱 **PWA 完全対応**: オフライン動作、モバイル機器のホーム画面追加（A2HS）、ネイティブアプリのような打感
- 💾 **プライバシー重視＆完全ローカル保存**: すべてのデータはブラウザの `LocalStorage` に保存。外部サーバー通信なしで安心利用
- 🌙 **モダンUI & ダークモード対応**: 目に優しいカラーパレット、洗練されたダークモード、iOSステータスバー表示風デザイン

---

## 🛠️ 技術スタック

| カテゴリ | 技術 / ライブラリ |
| :--- | :--- |
| **フロントエンド** | [React 18](https://react.dev/) / [TypeScript](https://www.typescriptlang.org/) / [Vite](https://vitejs.dev/) |
| **スタイリング** | [Tailwind CSS](https://tailwindcss.com/) / [Lucide Icons](https://lucide.dev/) |
| **PWA** | Service Worker (`service-worker.js`) / Web App Manifest (`manifest.json`) |
| **演出・ユーティリティ** | `canvas-confetti` / `clsx` / `tailwind-merge` |
| **ビルド / ツール** | Node.js / Vite / ESLint / PostCSS |

---

## 🚀 クイックスタート

### 動作要件
- Node.js (v18.0.0 以上推奨)
- npm / yarn / pnpm

### インストール＆起動手順

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/your-username/weekly-routine-pwa.git
   cd weekly-routine-pwa
   ```

2. **依存パッケージのインストール**
   ```bash
   npm install
   ```

3. **開発サーバーの起動**
   ```bash
   npm run dev
   ```
   ブラウザで `http://localhost:5173` にアクセスして動作を確認できます。

4. **プロダクション用ビルド**
   ```bash
   npm run build
   ```

5. **プレビュー**
   ```bash
   npm run preview
   ```

---

## 📁 ディレクトリ構造

```text
weekly-routine-pwa/
├── public/                # PWAマニフェスト、アイコン、Service Worker
│   ├── manifest.json
│   ├── service-worker.js
│   ├── icon-192.svg
│   └── icon-512.svg
├── src/
│   ├── components/        # UIコンポーネント
│   │   ├── TodayView.tsx        # 今日のタスク表示画面
│   │   ├── RoutineManager.tsx   # 曜日別設定・並び替え画面
│   │   ├── TaskItem.tsx         # タスク単体コンポーネント
│   │   ├── Header.tsx           # ヘッダーコンポーネント
│   │   ├── Navigation.tsx       # ボトムナビゲーション
│   │   ├── SettingsView.tsx     # 設定画面
│   │   └── IPhoneStatusBar.tsx # iOS風ステータスバー
│   ├── hooks/             # カスタムフック (LocalStorage連携, PWA等)
│   ├── types/             # TypeScript型定義
│   ├── utils/             # ユーティリティ関数
│   ├── App.tsx            # メインアプリケーション
│   ├── main.tsx           # エントリーポイント
│   └── index.css          # グローバルスタイル / Tailwind CSS
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 📄 ライセンス

[MIT License](LICENSE)
