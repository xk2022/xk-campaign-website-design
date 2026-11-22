import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BriefTool } from "./brief-tool";

describe("建站需求整理工具", () => {
  it("從情境入口切換時只改情境，保留所有手動草稿", () => {
    render(<BriefTool />);
    fireEvent.change(screen.getByLabelText(/品牌或專案名稱/), {
      target: { value: "手填品牌" },
    });
    fireEvent.change(screen.getByLabelText(/想給誰看/), {
      target: { value: "附近居民" },
    });
    fireEvent.change(screen.getByLabelText(/希望訪客做什麼/), {
      target: { value: "導航" },
    });
    fireEvent.click(screen.getByLabelText("Logo"));
    fireEvent.change(screen.getByLabelText(/想補充的事/), {
      target: { value: "保留我的補充" },
    });
    for (const scenario of ["local", "business", "campaign"]) {
      act(() =>
        window.dispatchEvent(
          new CustomEvent("xk:scenario", { detail: scenario }),
        ),
      );
      expect(screen.getByLabelText(/使用情境/)).toHaveValue(scenario);
      expect(screen.getByLabelText(/品牌或專案名稱/)).toHaveValue("手填品牌");
      expect(screen.getByLabelText(/想給誰看/)).toHaveValue("附近居民");
      expect(screen.getByLabelText(/希望訪客做什麼/)).toHaveValue("導航");
      expect(screen.getByLabelText("Logo")).toBeChecked();
      expect(screen.getByLabelText(/想補充的事/)).toHaveValue("保留我的補充");
      expect(screen.getByLabelText(/使用情境/)).toHaveFocus();
    }
  });

  it("尚未準備與任何已有素材互斥", () => {
    render(<BriefTool />);
    fireEvent.click(screen.getByLabelText("Logo"));
    fireEvent.click(screen.getByLabelText("照片"));
    fireEvent.click(screen.getByLabelText("尚未準備"));
    expect(screen.getByLabelText("Logo")).not.toBeChecked();
    expect(screen.getByLabelText("照片")).not.toBeChecked();
    expect(screen.getByLabelText("尚未準備")).toBeChecked();
    fireEvent.click(screen.getByLabelText("文案"));
    expect(screen.getByLabelText("尚未準備")).not.toBeChecked();
    expect(screen.getByLabelText("文案")).toBeChecked();
  });

  it("拒絕純空白並將焦點放在第一個錯誤欄位", () => {
    render(<BriefTool />);
    fireEvent.change(screen.getByLabelText(/品牌或專案名稱/), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByRole("button", { name: "產生需求摘要" }));
    expect(screen.getByLabelText(/品牌或專案名稱/)).toHaveFocus();
    expect(screen.getByText("請填品牌或專案名稱，暫名也可以。")).toBeVisible();
    expect(screen.queryByLabelText("需求摘要全文")).not.toBeInTheDocument();
  });

  it("拒絕不可見必填內容，依序聚焦第一個尚未補好的欄位", () => {
    render(<BriefTool />);
    fireEvent.change(screen.getByLabelText(/品牌或專案名稱/), {
      target: { value: " \u200b\u2060 " },
    });
    fireEvent.change(screen.getByLabelText(/想給誰看/), {
      target: { value: "\u200d\ufe0f" },
    });
    fireEvent.change(screen.getByLabelText(/希望訪客做什麼/), {
      target: { value: "其他" },
    });
    fireEvent.change(screen.getByLabelText(/其他主要動作/), {
      target: { value: "\u200b\u0000" },
    });
    fireEvent.click(screen.getByRole("button", { name: "產生需求摘要" }));
    expect(screen.getByLabelText(/品牌或專案名稱/)).toHaveFocus();
    expect(screen.getByLabelText(/品牌或專案名稱/)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(/想給誰看/)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(/其他主要動作/)).toHaveAttribute("aria-invalid", "true");

    fireEvent.change(screen.getByLabelText(/品牌或專案名稱/), {
      target: { value: "👩‍💻 工作室" },
    });
    fireEvent.click(screen.getByRole("button", { name: "產生需求摘要" }));
    expect(screen.getByLabelText(/想給誰看/)).toHaveFocus();
    fireEvent.change(screen.getByLabelText(/想給誰看/), {
      target: { value: "正在規劃網站的店主" },
    });
    fireEvent.click(screen.getByRole("button", { name: "產生需求摘要" }));
    expect(screen.getByLabelText(/其他主要動作/)).toHaveFocus();
    expect(screen.queryByLabelText("需求摘要全文")).not.toBeInTheDocument();
  });

  it("示範 → 摘要 → 返回改動作 → 再產生及複製，都使用最新資料", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<BriefTool />);
    fireEvent.click(screen.getByRole("button", { name: "帶入示範資料" }));
    fireEvent.click(screen.getByRole("button", { name: "產生需求摘要" }));
    expect(
      (screen.getByLabelText("需求摘要全文") as HTMLTextAreaElement).value,
    ).toContain("提出詢價");
    fireEvent.click(screen.getByRole("button", { name: "返回修改" }));
    fireEvent.change(screen.getByLabelText(/希望訪客做什麼/), {
      target: { value: "其他" },
    });
    fireEvent.change(screen.getByLabelText(/其他主要動作/), {
      target: { value: "下載產品型錄" },
    });
    fireEvent.click(screen.getByRole("button", { name: "產生需求摘要" }));
    const summary = (
      screen.getByLabelText("需求摘要全文") as HTMLTextAreaElement
    ).value;
    expect(summary).toContain("下載產品型錄");
    expect(summary).not.toContain("提出詢價");
    fireEvent.click(screen.getByRole("button", { name: "複製需求摘要" }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "已複製，可自行貼給 XK",
      ),
    );
    expect(writeText).toHaveBeenCalledWith(summary);
  });

  it("其他動作從短語改為完整句子後，摘要及複製保留最新原話", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<BriefTool />);
    fireEvent.click(screen.getByRole("button", { name: "帶入示範資料" }));
    fireEvent.change(screen.getByLabelText(/希望訪客做什麼/), {
      target: { value: "其他" },
    });
    fireEvent.change(screen.getByLabelText(/其他主要動作/), {
      target: { value: "下載型錄" },
    });
    fireEvent.click(screen.getByRole("button", { name: "產生需求摘要" }));
    expect((screen.getByLabelText("需求摘要全文") as HTMLTextAreaElement).value)
      .toContain("希望訪客完成的主要動作：下載型錄");
    fireEvent.click(screen.getByRole("button", { name: "返回修改" }));
    fireEvent.change(screen.getByLabelText(/其他主要動作/), {
      target: { value: "我想讓客人下載型錄。" },
    });
    fireEvent.click(screen.getByRole("button", { name: "產生需求摘要" }));
    const summary = (screen.getByLabelText("需求摘要全文") as HTMLTextAreaElement).value;
    expect(summary.split("\n")[1]).toBe("希望訪客完成的主要動作：我想讓客人下載型錄。");
    fireEvent.click(screen.getByRole("button", { name: "複製需求摘要" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(summary));
  });

  it("長摘要依全文高度展開，聚焦及重排後重新量高，拒絕複製仍可選取全文", async () => {
    const scrollHeight = vi.spyOn(Element.prototype, "scrollHeight", "get").mockReturnValue(880);
    let width = 700;
    const bounds = vi.spyOn(Element.prototype, "getBoundingClientRect")
      .mockImplementation(() => ({ width } as DOMRect));
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    try {
      render(<BriefTool />);
      fireEvent.click(screen.getByRole("button", { name: "帶入示範資料" }));
      const notes = "希望客人能先了解作品的尺寸、材質及使用方式，再整理需求來詢問。".repeat(20);
      fireEvent.change(screen.getByLabelText(/想補充的事/), { target: { value: notes } });
      fireEvent.click(screen.getByRole("button", { name: "產生需求摘要" }));
      const textarea = screen.getByLabelText("需求摘要全文") as HTMLTextAreaElement;
      expect(textarea.value).toContain(notes);
      expect(textarea.style.height).toBe("880px");
      expect(textarea.style.minHeight).toBe("880px");
      expect(textarea.style.resize).toBe("vertical");
      expect(textarea.style.overflowY).toBe("auto");

      scrollHeight.mockReturnValue(1300);
      fireEvent.focus(textarea);
      expect(textarea.style.height).toBe("1300px");
      expect(textarea.style.minHeight).toBe("1300px");

      scrollHeight.mockReturnValue(1600);
      width = 330;
      fireEvent(window, new Event("resize"));
      expect(textarea.style.height).toBe("1600px");
      expect(textarea.style.minHeight).toBe("1600px");
      fireEvent.click(screen.getByRole("button", { name: "複製需求摘要" }));
      await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("瀏覽器未允許自動複製"));
      fireEvent.click(screen.getByRole("button", { name: "選取摘要全文" }));
      expect(textarea.selectionEnd - textarea.selectionStart).toBe(textarea.value.length);
    } finally {
      scrollHeight.mockRestore();
      bounds.mockRestore();
    }
  });

  it("剪貼簿被拒後保留全文、提供手動選取且不顯示成功", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    render(<BriefTool />);
    fireEvent.click(screen.getByRole("button", { name: "帶入示範資料" }));
    fireEvent.click(screen.getByRole("button", { name: "產生需求摘要" }));
    fireEvent.click(screen.getByRole("button", { name: "複製需求摘要" }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "瀏覽器未允許自動複製",
      ),
    );
    const textarea = screen.getByLabelText(
      "需求摘要全文",
    ) as HTMLTextAreaElement;
    fireEvent.click(screen.getByRole("button", { name: "選取摘要全文" }));
    expect(textarea).toHaveFocus();
    expect(textarea.selectionEnd - textarea.selectionStart).toBe(
      textarea.value.length,
    );
    expect(screen.queryByText("已複製，可自行貼給 XK")).not.toBeInTheDocument();
  });

  it("舊版複製延遲完成時不污染新版提示，再次複製使用新版摘要", async () => {
    let resolveOldCopy!: () => void;
    const oldCopy = new Promise<void>((resolve) => {
      resolveOldCopy = resolve;
    });
    const writeText = vi
      .fn()
      .mockImplementationOnce(() => oldCopy)
      .mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<BriefTool />);
    fireEvent.click(screen.getByRole("button", { name: "帶入示範資料" }));
    fireEvent.click(screen.getByRole("button", { name: "產生需求摘要" }));
    const oldSummary = (
      screen.getByLabelText("需求摘要全文") as HTMLTextAreaElement
    ).value;
    fireEvent.click(screen.getByRole("button", { name: "複製需求摘要" }));
    expect(screen.getByRole("button", { name: "正在複製…" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "返回修改" }));
    fireEvent.change(screen.getByLabelText(/希望訪客做什麼/), {
      target: { value: "報名" },
    });
    fireEvent.click(screen.getByRole("button", { name: "產生需求摘要" }));
    const newSummary = (
      screen.getByLabelText("需求摘要全文") as HTMLTextAreaElement
    ).value;
    expect(newSummary).toContain("完成報名");
    expect(newSummary).not.toBe(oldSummary);

    await act(async () => resolveOldCopy());
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    expect(screen.queryByText("已複製，可自行貼給 XK")).not.toBeInTheDocument();
    expect(screen.queryByText(/瀏覽器未允許自動複製/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "複製需求摘要" }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "已複製，可自行貼給 XK",
      ),
    );
    expect(writeText).toHaveBeenNthCalledWith(1, oldSummary);
    expect(writeText).toHaveBeenNthCalledWith(2, newSummary);
  });

  it("重新載入元件時沒有保存草稿", () => {
    const { unmount } = render(<BriefTool />);
    fireEvent.click(screen.getByRole("button", { name: "帶入示範資料" }));
    unmount();
    render(<BriefTool />);
    expect(screen.getByLabelText(/品牌或專案名稱/)).toHaveValue("");
    expect(screen.getByLabelText(/希望訪客做什麼/)).toHaveValue("");
    expect(screen.getByLabelText("Logo")).not.toBeChecked();
  });
});
