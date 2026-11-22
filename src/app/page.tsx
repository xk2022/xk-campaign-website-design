import Image from "next/image";
import {
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  Store,
  Shapes,
  Ticket,
  Check,
  FileText,
  Copy,
  MessageSquare,
} from "lucide-react";
import {
  campaign,
  scenarios,
  cooperationSteps,
  serviceScope,
} from "@/config/campaign";
import { PhonePreview } from "@/components/phone-preview";
import { ScenarioStart } from "@/components/scenario-start";
import { BriefTool } from "@/components/brief-tool";
import { ScenarioExamples } from "@/components/scenario-examples";

const scenarioIcons = [Store, Shapes, Ticket];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        跳至主要內容
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <a
            href="#"
            className="brand-link"
            aria-label="Xplore Kaleidoscope（XK）頁首"
          >
            <Image
              src={campaign.brand.logo}
              alt="Xplore Kaleidoscope（XK）正式 Logo 03"
              width={850}
              height={204}
              priority
            />
          </a>
          <nav aria-label="主要導覽">
            <a className="nav-link" href="#scenarios">
              適用情境
            </a>
            <a className="nav-link" href="#process">
              合作方式
            </a>
            <a className="header-cta" href="#brief">
              整理需求
              <ArrowUpRight size={16} />
            </a>
          </nav>
        </div>
      </header>
      <main id="main">
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" />
              R01 / {campaign.service}
            </div>
            <h1 id="hero-title">
              讓客人看懂
              <br />
              你的服務，
              <br />
              <span>知道下一步</span>
              <br className="mobile-break" />
              怎麼做。
            </h1>
            <p className="hero-description">
              從看菜單、找門市，到詢價、報名，
              <br className="desktop-break" />
              把客人最常問的事，整理成手機上就能用的一頁。
            </p>
            <div className="hero-actions">
              <a href="#brief" className="button button-primary">
                整理我的建站需求
                <ArrowUpRight size={19} />
              </a>
              <a href="#scenarios" className="button button-secondary">
                看看適合我的情境
                <ArrowDown size={18} />
              </a>
            </div>
            <p className="hero-footnote">
              <Check size={14} />
              不用先懂規格，從你的生意開始說。
            </p>
          </div>
          <PhonePreview />
        </section>
        <div className="outcome-strip">
          <div className="container outcome-inner">
            <p>一頁，把重要的事說清楚。</p>
            <div>
              <span>
                <span className="strip-number">01</span>你提供什麼
              </span>
              <ArrowRight aria-hidden="true" size={14} />
              <span>
                <span className="strip-number">02</span>客人需要什麼
              </span>
              <ArrowRight aria-hidden="true" size={14} />
              <span>
                <span className="strip-number">03</span>接下來做什麼
              </span>
            </div>
          </div>
        </div>
        <section
          id="scenarios"
          className="section container"
          aria-labelledby="scenarios-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">FIND YOUR STARTING POINT</p>
              <h2 id="scenarios-title">
                你的生意，
                <br className="mobile-break" />
                適合哪一種第一頁？
              </h2>
            </div>
            <p className="section-intro">
              從客人常問的一句話開始，
              <br />
              找到網站可以幫忙的地方。
            </p>
          </div>
          <div className="scenario-grid">
            {scenarios.map((scenario, index) => {
              const Icon = scenarioIcons[index];
              return (
                <article key={scenario.id} className="scenario-card">
                  <div className="scenario-top">
                    <span className="scenario-number">{scenario.number}</span>
                    <Icon size={27} strokeWidth={1.4} />
                  </div>
                  <p className="scenario-english">{scenario.english}</p>
                  <h3>{scenario.label}</h3>
                  <blockquote>「{scenario.question}」</blockquote>
                  <div className="scenario-answer">
                    <span className="small-label">讓網站接住這個問題</span>
                    <p>{scenario.action}</p>
                  </div>
                  <ul className="scenario-tags" aria-label="可規劃的網站內容">
                    {scenario.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <ScenarioStart scenarioId={scenario.id} />
                </article>
              );
            })}
          </div>
          <ScenarioExamples />
        </section>
        <section
          id="process"
          className="process-section"
          aria-labelledby="process-title"
        >
          <div className="container process-layout">
            <div>
              <p className="eyebrow">HOW WE WORK TOGETHER</p>
              <h2 id="process-title">
                從一個想法，
                <br />
                到能實際操作的一頁。
              </h2>
              <p className="process-intro">
                先把需求說清楚，
                <br />
                再一起確認頁面該有的樣子。
              </p>
            </div>
            <ol className="process-steps">
              {cooperationSteps.map((step, index) => (
                <li key={step.title}>
                  <span className="step-number">0{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                  {index < 2 && (
                    <ArrowDown
                      className="step-arrow"
                      aria-hidden="true"
                      size={18}
                    />
                  )}
                </li>
              ))}
            </ol>
          </div>
          <div
            className="container service-scope"
            role="group"
            aria-labelledby="service-scope-title"
          >
            <div className="service-scope-heading">
              <h3 id="service-scope-title">{serviceScope.title}</h3>
              <p>{serviceScope.description}</p>
            </div>
            <div className="service-scope-grid">
              <div className="scope-group">
                <h4>{serviceScope.discussTitle}</h4>
                <ul>
                  {serviceScope.discuss.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="scope-group">
                <h4>{serviceScope.confirmTitle}</h4>
                <ul>
                  {serviceScope.confirm.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="scope-preparation">{serviceScope.preparation}</p>
            <p className="scope-note">{serviceScope.note}</p>
          </div>
        </section>
        <section
          id="brief"
          className="brief-section"
          aria-labelledby="brief-title"
        >
          <div className="container brief-layout">
            <div className="brief-intro">
              <p className="eyebrow">LET’S START WITH YOUR IDEA</p>
              <h2 id="brief-title">
                先整理
                <br />
                你的第一頁。
              </h2>
              <p>
                填完就能複製需求摘要。草稿只留在此頁，重新整理即清空。
              </p>
              <ol className="brief-roadmap">
                <li>
                  <FileText size={18} />
                  <span>用白話填寫想法</span>
                </li>
                <li>
                  <Copy size={18} />
                  <span>產生並複製需求摘要</span>
                </li>
                <li>
                  <MessageSquare size={18} />
                  <span>帶著摘要，開始討論</span>
                </li>
              </ol>
              <div className="brief-tip">
                <span className="small-label">
                  還沒有完整素材，也可以開始。
                </span>
                <p>先寫下你知道的事，還不確定的部分，之後一起釐清。</p>
              </div>
            </div>
            <BriefTool />
          </div>
        </section>
        <section className="closing container" aria-label="品牌理念">
          <Image src={campaign.brand.symbol} alt="" width={58} height={58} />
          <p>
            讓你的服務，<span>有一個清楚的開始。</span>
          </p>
          <a href="#brief" aria-label="回到需求整理工具">
            <ArrowUpRight size={30} />
          </a>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <strong>{campaign.brand.name}</strong>
              <p>Explore Possibilities. Create Digital Value.</p>
            </div>
            <nav aria-label="XK 官網連結">
              <a href={campaign.links.home}>
                XK 官網
                <ArrowUpRight size={14} />
              </a>
              <a href={campaign.links.services}>
                完整服務
                <ArrowUpRight size={14} />
              </a>
              <a href={campaign.links.portfolio}>
                技術作品集
                <ArrowUpRight size={14} />
              </a>
            </nav>
          </div>
          <div className="footer-bottom">
            <span>© 2026 {campaign.brand.name}</span>
            <span>R01 網站建置 · W01 一頁式服務推廣預覽</span>
          </div>
        </div>
      </footer>
    </>
  );
}
