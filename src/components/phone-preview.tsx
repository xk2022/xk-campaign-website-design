import {
  ArrowUpRight,
  MapPin,
  Navigation,
  Check,
  MousePointer2,
} from "lucide-react";

export function PhonePreview() {
  return (
    <figure
      className="hero-preview"
      aria-label="一頁式網站介面示意，虛構品牌山角日常"
    >
      <div className="preview-grid" aria-hidden="true" />
      <div className="preview-topline">
        <span>ONE PAGE. CLEAR ACTION.</span>
        <span className="preview-cross" aria-hidden="true">
          ＋
        </span>
      </div>
      <div className="preview-orbit" aria-hidden="true" />
      <div className="preview-note">
        <span className="mini-check">
          <Check size={13} />
        </span>
        把服務說清楚
      </div>
      <div className="phone">
        <div className="phone-status" aria-hidden="true">
          <span>9:41</span>
          <span>● ▰</span>
        </div>
        <div className="phone-brand">
          <span className="cafe-mark" aria-hidden="true">
            山
          </span>
          <span>
            山角日常<small>DAILY AT THE CORNER</small>
          </span>
          <span className="phone-menu" aria-hidden="true">
            ☰
          </span>
        </div>
        <div className="phone-art" aria-hidden="true">
          <svg viewBox="0 0 300 200" fill="none">
            <rect width="300" height="200" fill="#DFE9F7" />
            <circle cx="235" cy="40" r="23" fill="#FFCC83" />
            <path
              d="M0 147L71 69L156 151L218 98L300 160V200H0Z"
              fill="#B6C9D9"
            />
            <path d="M52 200V82H248V200" fill="#F5F0E7" />
            <path d="M44 85L150 31L256 85Z" fill="#253E53" />
            <path d="M122 200V139a28 28 0 0 1 56 0V200" fill="#284D62" />
            <path d="M69 114H102V155H69ZM198 114H231V155H198Z" fill="#E4BB87" />
            <path
              d="M86 114V155M214 114V155"
              stroke="#F5F0E7"
              strokeWidth="4"
            />
            <rect x="115" y="88" width="70" height="11" rx="2" fill="#D3B898" />
            <path
              d="M35 200V167M28 181Q10 158 32 153Q47 158 35 177M35 186Q66 168 48 158Q31 162 35 180"
              stroke="#5F7A63"
              strokeWidth="6"
            />
            <path
              d="M267 200V167M260 181Q242 158 264 153Q279 158 267 177M267 186Q298 168 280 158Q263 162 267 180"
              stroke="#5F7A63"
              strokeWidth="6"
            />
            <path d="M0 198H300" stroke="#B6A58A" strokeWidth="4" />
          </svg>
          <span className="phone-art-label">一間小店，一份日常。</span>
        </div>
        <div className="phone-content">
          <span className="phone-eyebrow">WELCOME TO OUR CORNER</span>
          <p>
            留一點時間，
            <br />
            給日常的好味道。
          </p>
          <div className="phone-tabs">
            <span>本日餐點</span>
            <span>關於小店</span>
            <span>門市資訊</span>
          </div>
          <div className="phone-location">
            <MapPin size={14} />
            <span>找一個轉角，遇見我們。</span>
          </div>
          <div className="phone-cta">
            <Navigation size={15} />
            <span>導航到店</span>
            <ArrowUpRight size={16} />
          </div>
        </div>
        <div className="phone-home" aria-hidden="true" />
      </div>
      <div className="action-callout">
        <span className="callout-icon">
          <MousePointer2 size={20} />
        </span>
        <div>
          <small>讓每次瀏覽，都有方向</small>
          <strong>下一步，清楚可見。</strong>
        </div>
        <ArrowUpRight size={22} />
      </div>
      <figcaption>
        <span className="status-dot" />
        介面示意 · 虛構品牌，非實際客戶網站
      </figcaption>
    </figure>
  );
}
