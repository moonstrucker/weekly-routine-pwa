import React, { useRef, useState } from 'react';
import { Download, Upload, RotateCcw, Smartphone, ShieldCheck, Database, Check } from 'lucide-react';
import { Task } from '../types';
import { DAY_LABELS, DAYS_ORDER } from '../utils/dateUtils';

interface SettingsViewProps {
  tasks: Task[];
  lastOpenedDate: string;
  onResetToDefaults: () => void;
  onExportJSON: () => void;
  onImportJSON: (jsonString: string) => boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  tasks,
  lastOpenedDate,
  onResetToDefaults,
  onExportJSON,
  onImportJSON,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = onImportJSON(content);
        if (success) {
          setImportStatus('データの復元が完了しました！');
        } else {
          setImportStatus('ファイルの形式が正しくありません。');
        }
        setTimeout(() => setImportStatus(null), 3500);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 pb-28">
      {/* iOS Grouped Section 1: Stats */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 space-y-3 shadow-ios">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-ios-blue" />
          データ統計サマリー
        </h2>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <span className="text-2xl font-black text-ios-blue font-sans">{tasks.length}</span>
            <span className="block text-[11px] text-slate-500 font-medium mt-0.5">
              登録済ルーティン総数
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <span className="text-xs font-mono font-bold text-emerald-600">
              {lastOpenedDate || '今日'}
            </span>
            <span className="block text-[11px] text-slate-500 font-medium mt-0.5">
              最終更新日
            </span>
          </div>
        </div>

        <div className="border-t border-slate-200/80 pt-2.5">
          <div className="grid grid-cols-7 gap-1 text-center">
            {DAYS_ORDER.map((day) => {
              const count = tasks.filter((t) => t.dayOfWeek === day).length;
              return (
                <div key={day} className="bg-slate-50 py-1.5 rounded-lg border border-slate-200/60">
                  <span className="block text-[10px] text-slate-500">{DAY_LABELS[day].short}</span>
                  <span className="text-xs font-bold text-slate-800">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* iOS Grouped Section 2: PWA */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 space-y-3 shadow-ios">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-ios-blue" />
          PWA (iPhone ホーム画面追加)
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed font-sans">
          Safariなどのブラウザ共有ボタンから
          <strong className="text-ios-blue font-bold">「ホーム画面に追加」</strong>を選択すると、iPhoneネイティブアプリのようにフルスクリーン起動＆オフライン環境で動作します。
        </p>
        <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300/80 p-2.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>Service Worker ＆ LocalStorage キャッシュ動作中</span>
        </div>
      </div>

      {/* iOS Grouped Section 3: Backup */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 space-y-3 shadow-ios">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Download className="w-4 h-4 text-ios-blue" />
          バックアップ ＆ 復元 (JSON)
        </h2>

        {importStatus && (
          <div className="p-2.5 rounded-xl text-xs font-semibold bg-ios-blue/15 text-ios-blue border border-ios-blue/30 flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onExportJSON}
            className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs hover:border-ios-blue hover:bg-white transition-all active:scale-95 shadow-sm"
          >
            <Download className="w-4 h-4 text-ios-blue" />
            JSON出力 (保存)
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs hover:border-ios-blue hover:bg-white transition-all active:scale-95 shadow-sm"
          >
            <Upload className="w-4 h-4 text-ios-blue" />
            JSON復元 (読込)
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      {/* iOS Grouped Section 4: Reset */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 space-y-3 shadow-ios">
        <h2 className="text-sm font-bold text-ios-red flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          初期化
        </h2>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-2.5 px-4 rounded-xl border border-ios-red/30 text-ios-red bg-rose-50 hover:bg-rose-100 text-xs font-semibold transition-all active:scale-95"
          >
            初期サンプルデータにリセット
          </button>
        ) : (
          <div className="p-3 rounded-xl border border-rose-300 bg-rose-50 space-y-2">
            <p className="text-xs text-rose-800 font-medium">
              登録されている全タスクが初期プリセットに置き換わります。実行してよろしいですか？
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-700 hover:bg-slate-50"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  onResetToDefaults();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-1.5 rounded-lg bg-ios-red text-white font-bold text-xs shadow-ios active:scale-95"
              >
                リセット実行
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
