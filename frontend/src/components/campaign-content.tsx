import Image from "next/image";
import { ArrowDown, ArrowUpRight, Check, Mail, Plus } from "lucide-react";
import {
  brandTrust,
  campaign,
  faqItems,
  painPoints,
  showcases,
} from "@/config/campaign";
import styles from "./campaign-content.module.css";

export function PainPointsSection() {
  return (
    <section id="needs" className={`section container ${styles.needs}`} aria-labelledby="needs-title">
      <div className={styles.heading}>
        <p className="eyebrow">WHEN A PAGE CAN HELP</p>
        <h2 id="needs-title">客人一直問的事，<br />值得有一頁說清楚。</h2>
      </div>
      <div className={styles.needsGrid}>
        {painPoints.map((point, index) => (
          <article key={point.title} className={styles.need}>
            <span className={styles.number}>0{index + 1}</span>
            <h3>{point.title}</h3>
            <p>{point.description}</p>
          </article>
        ))}
      </div>
      <a href="#scenarios" className={styles.textLink}>
        找找接近你的使用情境 <ArrowDown size={16} aria-hidden="true" />
      </a>
    </section>
  );
}

export function ShowcaseSection() {
  return (
    <section id="showcases" className={styles.showcases} aria-labelledby="showcases-title">
      <div className="container">
        <div className="section-heading">
          <div className={styles.heading}>
            <p className="eyebrow">EXPLORE THE WORK</p>
            <h2 id="showcases-title">先看實際頁面，<br />再聊你的第一頁。</h2>
          </div>
          <p className={`section-intro ${styles.showcaseIntro}`}>
            以下是 XK 自主規劃、可實際開啟的展示，並非客戶委託交付實績。畫面中的產品與加工素材為示意，不代表實際商品或服務成果。
          </p>
        </div>
        <div className={styles.showcaseGrid}>
          {showcases.map((showcase) => (
            <article key={showcase.id} className={styles.showcaseCard} aria-labelledby={`showcase-${showcase.id}`}>
              <figure className={styles.preview}>
                <Image
                  src={showcase.image}
                  alt={`${showcase.name}自主展示網站的首頁畫面`}
                  width={1280}
                  height={800}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
                <figcaption>網站畫面｜自主展示</figcaption>
              </figure>
              <div className={styles.showcaseBody}>
                <div className={styles.meta}>
                  <span>{showcase.category}</span>
                  <span className={styles.badge}>自主展示</span>
                </div>
                <h3 id={`showcase-${showcase.id}`}>{showcase.name}</h3>
                <p className={styles.needLabel}>這一頁想解決的問題</p>
                <p className={styles.caseNeed}>{showcase.need}</p>
                <ul className={styles.actions} aria-label="可操作的展示功能">
                  {showcase.actions.map((action) => (
                    <li key={action}><Check size={16} aria-hidden="true" />{action}</li>
                  ))}
                </ul>
                <p className={styles.caseNote}>{showcase.note}</p>
                <a className={styles.showcaseLink} href={showcase.href} target="_blank" rel="noopener noreferrer" aria-label={`查看展示：${showcase.name}（另開分頁）`}>
                  查看展示 <ArrowUpRight size={18} aria-hidden="true" />
                  <span className="sr-only">（另開分頁）</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section id="about" className={`section container ${styles.trust}`} aria-labelledby="about-title">
      <div className={styles.trustIntro}>
        <p className="eyebrow">WHO BUILDS YOUR PAGE</p>
        <h2 id="about-title">{brandTrust.title}</h2>
        <p className={styles.description}>{brandTrust.description}</p>
        <a href={campaign.links.home} className={styles.textLink}>
          認識 Xplore Kaleidoscope <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
      <div className={styles.trustContent}>
        <div className={styles.trustPoints}>
          {brandTrust.points.map((point, index) => (
            <article key={point.title} className={styles.trustPoint}>
              <span className={styles.number}>0{index + 1}</span>
              <div><h3>{point.title}</h3><p>{point.description}</p></div>
            </article>
          ))}
        </div>
        <div className={styles.contactCard}>
          <Mail size={22} aria-hidden="true" />
          <div>
            <h3>有需求，也可以直接問。</h3>
            <p>開啟郵件程式後，自行貼上需求並確認寄出。本頁不會自動寄信。</p>
            <a href={campaign.contactChannels.email.href} className={styles.textLink}>
              {campaign.contactChannels.email.label} <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <span className={styles.emailAddress}>{campaign.contactChannels.email.address}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section id="faq" className={styles.faq} aria-labelledby="faq-title">
      <div className={`container ${styles.faqLayout}`}>
        <div className={styles.heading}>
          <p className="eyebrow">BEFORE WE START</p>
          <h2 id="faq-title">開始之前，<br />你可能想先問。</h2>
          <p className={styles.description}>費用、素材與合作範圍，先有個方向，再依你的需求確認。</p>
          <a href="#brief" className={styles.textLink}>先整理我的需求 <ArrowDown size={16} aria-hidden="true" /></a>
        </div>
        <div className={styles.faqList}>
          {faqItems.map((item) => (
            <details key={item.question} className={styles.faqItem}>
              <summary><span>{item.question}</span><Plus size={18} aria-hidden="true" /></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </section>
  );
}
