"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Sparkles,
} from "lucide-react";
import {
  actionOptions,
  campaign,
  materialOptions,
  scenarios,
  type ScenarioId,
} from "@/config/campaign";
import {
  changeScenario,
  emptyDraft,
  exampleDraft,
  generateSummary,
  toggleMaterial,
  validateBrief,
  type BriefDraft,
  type BriefErrors,
} from "@/lib/brief";

const subscribeToHydration = () => () => {};

export function BriefTool() {
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const [draft, setDraft] = useState<BriefDraft>({
    ...emptyDraft,
    materials: [],
  });
  const [errors, setErrors] = useState<BriefErrors>({});
  const [summary, setSummary] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<
    "idle" | "copying" | "success" | "denied"
  >("idle");
  const [exampleNotice, setExampleNotice] = useState(false);
  // A clipboard permission response may arrive after the visitor edits the brief.
  const summaryVersion = useRef(0);
  const brandRef = useRef<HTMLInputElement>(null);
  const audienceRef = useRef<HTMLInputElement>(null);
  const actionRef = useRef<HTMLSelectElement>(null);
  const otherActionRef = useRef<HTMLInputElement>(null);
  const scenarioRef = useRef<HTMLSelectElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const summaryTextRef = useRef<HTMLTextAreaElement>(null);
  const pendingFocus = useRef<
    | "brand"
    | "audience"
    | "action"
    | "otherAction"
    | "scenario"
    | "summary"
    | null
  >(null);

  useEffect(() => {
    const applyScenario = (event: Event) => {
      const scenario = (event as CustomEvent<ScenarioId>).detail;
      if (
        !scenarios.some((item) => item.id === scenario) &&
        scenario !== "other" &&
        scenario !== ""
      )
        return;
      pendingFocus.current = "scenario";
      summaryVersion.current += 1;
      setDraft((current) => changeScenario(current, scenario));
      setSummary(null);
      setCopyStatus("idle");
    };
    window.addEventListener("xk:scenario", applyScenario);
    return () => window.removeEventListener("xk:scenario", applyScenario);
  }, []);

  useEffect(() => {
    const refs = {
      brand: brandRef,
      audience: audienceRef,
      action: actionRef,
      otherAction: otherActionRef,
      scenario: scenarioRef,
      summary: summaryRef,
    };
    if (pendingFocus.current) {
      refs[pendingFocus.current].current?.focus();
      pendingFocus.current = null;
    }
  });

  useLayoutEffect(() => {
    const textarea = summaryTextRef.current;
    if (summary === null || !textarea) return;
    let disposed = false;
    let previousWidth = textarea.getBoundingClientRect().width;

    function fitSummary() {
      if (disposed || !textarea) return;
      // Reset to the responsive CSS minimum before measuring the full content.
      textarea.style.minHeight = "";
      textarea.style.height = "auto";
      const borderHeight = textarea.offsetHeight - textarea.clientHeight;
      const height = Math.ceil(textarea.scrollHeight + borderHeight);
      textarea.style.minHeight = `${height}px`;
      textarea.style.height = `${height}px`;
    }

    function fitAfterWidthChange() {
      if (!textarea) return;
      const width = textarea.getBoundingClientRect().width;
      if (width !== previousWidth) {
        previousWidth = width;
        fitSummary();
      }
    }

    fitSummary();
    // Watching only width keeps manual vertical resizing available.
    const observer = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(fitAfterWidthChange)
      : null;
    observer?.observe(textarea);
    window.addEventListener("resize", fitAfterWidthChange);
    textarea.addEventListener("focus", fitSummary);
    document.fonts?.addEventListener("loadingdone", fitSummary);
    void document.fonts?.ready.then(fitSummary);
    return () => {
      disposed = true;
      observer?.disconnect();
      window.removeEventListener("resize", fitAfterWidthChange);
      textarea.removeEventListener("focus", fitSummary);
      document.fonts?.removeEventListener("loadingdone", fitSummary);
    };
  }, [summary]);

  function update<K extends keyof BriefDraft>(field: K, value: BriefDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setExampleNotice(false);
  }

  function loadExample() {
    summaryVersion.current += 1;
    pendingFocus.current = "brand";
    setDraft({ ...exampleDraft, materials: [...exampleDraft.materials] });
    setErrors({});
    setSummary(null);
    setCopyStatus("idle");
    setExampleNotice(true);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateBrief(draft);
    setErrors(nextErrors);
    const firstError = (
      ["brand", "audience", "action", "otherAction"] as const
    ).find((field) => nextErrors[field]);
    if (firstError) {
      pendingFocus.current = firstError;
      return;
    }
    pendingFocus.current = "summary";
    summaryVersion.current += 1;
    setSummary(generateSummary(draft));
    setCopyStatus("idle");
  }

  async function copySummary() {
    if (!summary) return;
    const version = summaryVersion.current;
    setCopyStatus("copying");
    try {
      await navigator.clipboard.writeText(summary);
      if (version === summaryVersion.current) setCopyStatus("success");
    } catch {
      if (version === summaryVersion.current) setCopyStatus("denied");
    }
  }

  function returnToEdit() {
    summaryVersion.current += 1;
    pendingFocus.current = "action";
    setSummary(null);
    setCopyStatus("idle");
  }

  if (summary !== null) {
    return (
      <div className="brief-tool summary-view">
        <div className="form-toolbar">
          <span className="form-step">
            <Check size={16} aria-hidden="true" /> 已整理完成
          </span>
          <button type="button" className="text-button" onClick={returnToEdit}>
            <ArrowLeft size={16} aria-hidden="true" /> 返回修改
          </button>
        </div>
        <h3 ref={summaryRef} tabIndex={-1} className="summary-title">
          你的建站需求摘要
        </h3>
        <p className="field-help">
          這段文字可以直接轉貼，作為和 XK 討論的起點。全文會自動展開，也可以手動選取。
        </p>
        <label className="sr-only" htmlFor="summary-text">
          需求摘要全文
        </label>
        <textarea
          ref={summaryTextRef}
          id="summary-text"
          className="summary-text"
          readOnly
          value={summary}
          rows={10}
          style={{ overflowY: "auto", resize: "vertical" }}
        />
        <div className="summary-actions">
          <button
            type="button"
            className="button button-primary"
            onClick={copySummary}
            disabled={copyStatus === "copying"}
          >
            {copyStatus === "success" ? (
              <Check size={18} aria-hidden="true" />
            ) : (
              <Copy size={18} aria-hidden="true" />
            )}
            {copyStatus === "copying" ? "正在複製…" : "複製需求摘要"}
          </button>
          <a className="button button-secondary" href={campaign.links.contact}>
            查看 XK 聯絡資訊 <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div
          className={`copy-feedback ${copyStatus === "denied" ? "copy-denied" : ""}`}
          role="status"
          aria-live="polite"
        >
          {copyStatus === "success" && campaign.contactHandoff.copySuccess}
          {copyStatus === "denied" && (
            <>
              <p>瀏覽器未允許自動複製。全文已保留，請選取後手動複製。</p>
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  summaryTextRef.current?.focus();
                  summaryTextRef.current?.select();
                }}
              >
                選取摘要全文
              </button>
            </>
          )}
        </div>
        <p className="form-notice">
          {campaign.contactHandoff.copyHint}
        </p>
        <aside className="contact-handoff" aria-labelledby="contact-handoff-title">
          <h4 id="contact-handoff-title">{campaign.contactHandoff.title}</h4>
          <p>{campaign.contactHandoff.description}</p>
          <div className="summary-actions">
            <a
              className="button button-secondary"
              href={campaign.contactChannels.email.href}
            >
              {campaign.contactChannels.email.label}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
          <p>{campaign.contactChannels.email.address}</p>
          <p>
            會開啟你的郵件程式，請自行貼上摘要並確認寄出。本頁不會自動寄信。
          </p>
        </aside>
      </div>
    );
  }

  return (
    <div className="brief-tool">
      <form className="brief-form" onSubmit={submit} noValidate>
        <noscript>
          <p className="form-notice">
            請啟用 JavaScript，才能在本頁整理與複製需求。內容不會自動送出。
          </p>
        </noscript>
        <fieldset disabled={!hydrated}>
          <div className="form-toolbar">
            <span className="form-step">你的建站起點</span>
            <button
              type="button"
              className="text-button example-button"
              onClick={loadExample}
            >
              <Sparkles size={16} aria-hidden="true" /> 帶入示範資料
            </button>
          </div>
          <p className="form-required-note">
            標示「必填」的欄位填好，就可以產生摘要。
          </p>
          <p className="sr-only" role="status">
            {exampleNotice
              ? "已帶入虛構品牌的完整示範資料，原草稿已替換。"
              : ""}
          </p>
          <div className="form-grid">
            <div className="form-field">
              <label className="field-label" htmlFor="brief-brand">
                品牌或專案名稱 <span className="field-meta">必填</span>
              </label>
              <input
                type="text"
                ref={brandRef}
                id="brief-brand"
                value={draft.brand}
                onChange={(event) => update("brand", event.target.value)}
                placeholder="例如：山角木作工作室"
                required
                aria-invalid={!!errors.brand}
                aria-describedby={`brand-help${errors.brand ? " brand-error" : ""}`}
                autoComplete="off"
              />
              <p className="field-help" id="brand-help">
                還沒取名？先填暫名也可以。
              </p>
              {errors.brand && (
                <p className="field-error" id="brand-error">
                  {errors.brand}
                </p>
              )}
            </div>
            <div className="form-field">
              <label className="field-label" htmlFor="brief-scenario">
                使用情境 <span className="field-meta">選填</span>
              </label>
              <select
                ref={scenarioRef}
                id="brief-scenario"
                value={draft.scenario}
                onChange={(event) =>
                  update("scenario", event.target.value as ScenarioId)
                }
              >
                <option value="">先不選，也可以</option>
                {scenarios.map((scenario) => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenario.label}
                  </option>
                ))}
                <option value="other">其他</option>
              </select>
            </div>
            <div className="form-field full-width">
              <label className="field-label" htmlFor="brief-audience">
                想給誰看 <span className="field-meta">必填</span>
              </label>
              <input
                type="text"
                ref={audienceRef}
                id="brief-audience"
                value={draft.audience}
                onChange={(event) => update("audience", event.target.value)}
                placeholder="例如：正在比較加工廠的採購"
                required
                aria-invalid={!!errors.audience}
                aria-describedby={`audience-help${errors.audience ? " audience-error" : ""}`}
                autoComplete="off"
              />
              <p className="field-help" id="audience-help">
                用你平常介紹客人的方式描述就好。
              </p>
              {errors.audience && (
                <p className="field-error" id="audience-error">
                  {errors.audience}
                </p>
              )}
            </div>
            <div className="form-field full-width">
              <label className="field-label" htmlFor="brief-action">
                希望訪客做什麼 <span className="field-meta">必填</span>
              </label>
              <select
                ref={actionRef}
                id="brief-action"
                value={draft.action}
                onChange={(event) => update("action", event.target.value)}
                required
                aria-invalid={!!errors.action}
                aria-describedby={`action-help${errors.action ? " action-error" : ""}`}
              >
                <option value="">選一個主要動作</option>
                {actionOptions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
              <p className="field-help" id="action-help">
                先選最重要的一件事，讓這一頁有清楚的方向。
              </p>
              {errors.action && (
                <p className="field-error" id="action-error">
                  {errors.action}
                </p>
              )}
            </div>
            {draft.action === "其他" && (
              <div className="form-field full-width">
                <label className="field-label" htmlFor="brief-other-action">
                  其他主要動作 <span className="field-meta">必填</span>
                </label>
                <input
                  type="text"
                  ref={otherActionRef}
                  id="brief-other-action"
                  value={draft.otherAction}
                  onChange={(event) =>
                    update("otherAction", event.target.value)
                  }
                  placeholder="例如：下載產品型錄"
                  required
                  aria-invalid={!!errors.otherAction}
                  aria-describedby={`other-action-help${errors.otherAction ? " other-action-error" : ""}`}
                  autoComplete="off"
                />
                <p className="field-help" id="other-action-help">
                  短語或完整句子都可以，摘要會保留你的原話。
                </p>
                {errors.otherAction && (
                  <p className="field-error" id="other-action-error">
                    {errors.otherAction}
                  </p>
                )}
              </div>
            )}
            <fieldset className="form-field full-width materials-field">
              <legend className="field-label">
                已有素材 <span className="field-meta">可複選</span>
              </legend>
              <p className="field-help" id="materials-help">
                還沒有素材也沒關係，可以一起討論準備方向。
              </p>
              <div
                className="material-options"
                aria-describedby="materials-help"
              >
                {materialOptions.map((material) => (
                  <label key={material} className="material-option">
                    <input
                      type="checkbox"
                      value={material}
                      checked={draft.materials.includes(material)}
                      onChange={() =>
                        update(
                          "materials",
                          toggleMaterial(draft.materials, material),
                        )
                      }
                    />
                    <span>{material}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="form-field full-width">
              <label className="field-label" htmlFor="brief-notes">
                想補充的事 <span className="field-meta">選填</span>
              </label>
              <textarea
                id="brief-notes"
                value={draft.notes}
                onChange={(event) => update("notes", event.target.value)}
                placeholder="例如：既有頁面最常被客人問到的問題，或這次想調整的地方。"
                rows={3}
              />
            </div>
          </div>
          <div className="form-bottom">
            <p className="form-notice">
              不用留下聯絡資料。
              <br />
              重新整理頁面後，內容就會清空。
            </p>
            <button type="submit" className="button button-primary">
              產生需求摘要 <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
