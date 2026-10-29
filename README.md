# AI 應用的攻擊與防護

資安課程分享簡報：LLM Agent 的攻擊面、九種攻擊手法，以及模型層／偵測層／系統層的防護架構。

## 📽️ 簡報

**👉 https://foylaou.github.io/ai-secops/**

- 共 38 頁，用 [Slidev](https://sli.dev/) 製作，直接在瀏覽器開啟即可。
- 操作：`←` `→` 或空白鍵翻頁；`o` 看總覽；`f` 全螢幕。
- 第 11 頁（Demo A，逐步播放）與第 15 頁（Demo B，可互動）有示範，建議親手點點看。
- 封面背景圖為外部連結，需連網才會顯示。

### 內容地圖

| 章節 | 內容 |
|---|---|
| 開場（1–7） | 為什麼 Agent 帶來新風險、六層攻擊面地圖、威脅模型、四大安全屬性 |
| 攻擊手法（8–20） | 9 種攻擊，每種都用 Mermaid 圖標出打在哪一層 |
| 防護架構（21–32） | 設計原則、三層防禦、CaMeL／IsolateGPT／PFI／SEAgent／CSAgent、RBAC／ABAC／ScopeGate |
| 收尾（33–38） | 延伸與專題、開放挑戰、結論、落地檢查清單、參考資料 |

## 📚 補充資料

簡報中提到的防禦框架與存取控制概念，我另外整理成筆記，放在 [`docs/first/補充`](docs/first/補充)，內有流程圖與比較，方便課後查閱：

| 筆記 | 層級 | 一句話 |
|---|---|---|
| [CaMeL](docs/first/補充/CaMeL.md) | 系統層 | 特權／隔離雙 LLM + 自訂直譯器，控制流與資料流分離 |
| [IsolateGPT](docs/first/補充/IsolateGPT.md) | 系統層 | Hub／Spoke 架構，借鏡作業系統的執行隔離 |
| [LlamaFirewall](docs/first/補充/LlamaFirewall.md) | 偵測層 | Meta 開源的分層 guardrail，Agent 世界的 Snort |
| [PromptArmor](docs/first/補充/PromptArmor.md) | 偵測層 | 用現成 LLM 當哨兵，偵測並移除注入內容 |
| [SecAlign](docs/first/補充/SecAlign.md) | 模型層 | 用偏好最佳化訓練模型抵抗提示注入 |
| [Instruction Hierarchy](docs/first/補充/Instruction%20Hierarchy.md) | 模型層 | 訓練模型遵守「系統 > 使用者 > 第三方內容」優先序 |
| [屬性型存取控制（ABAC）](docs/first/補充/屬性型存取控制（ABAC）.md) | 存取控制 | 以主體／資源／動作／環境屬性動態決策，對照 RBAC |

> 筆記中的 `[[名稱]]` 是 Obsidian 風格的內部連結，在 GitHub 上會顯示成原樣文字，對應到上表同名的筆記即可。

## 📖 延伸閱讀（論文）

論文原文請到各自的出處閱讀，本 repo **不附原文**：

- Taming Various Privilege Escalation in LLM-Based Agent Systems（SEAgent）— arXiv:2601.11893
- Capability Gates Are Not Authorization（ScopeGate）— arXiv:2606.28679
- Prompt Flow Integrity to Prevent Privilege Escalation in LLM Agents — arXiv:2503.15547
- A Framework for Formalizing LLM Agent Security — arXiv:2603.19469
- LLM Agents Should Employ Security Principles — arXiv:2505.24019
- Secure and Efficient Access Control Framework for Computer-Use Agents via Context Space（CSAgent）— arXiv:2509.22256
- Defeating Prompt Injections by Design（CaMeL）— arXiv:2503.18813
- IsolateGPT — arXiv:2403.04960
- LlamaFirewall — arXiv:2505.03574
- PromptArmor — arXiv:2507.15219
- SecAlign — arXiv:2410.05451
- The Instruction Hierarchy — arXiv:2404.13208

入門建議：先讀 *A Framework for Formalizing LLM Agent Security* 的四個安全屬性，再看 SEAgent 與 CaMeL。

## 🛠️ 本機執行

```bash
npm install
npm run dev      # 開啟 http://localhost:3030
npm run deploy   # 建置並發佈到 GitHub Pages（gh-pages 分支）
```

## 備註

補充筆記為個人學習整理，內容以各論文與官方文件為準，若有出入請以原文為主，歡迎指正。
