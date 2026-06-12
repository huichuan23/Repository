import Link from "next/link";
import {
  Archive,
  Briefcase,
  Camera,
  Heart,
  Home,
  Menu,
  MoveDown,
  Palette,
  Pencil,
  Repeat2,
  Shirt,
  Smile,
  Sparkles,
  ThumbsDown,
  UserRound,
  WandSparkles
} from "lucide-react";

const closetItems = [
  {
    name: "黄色短上衣",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "同色运动裤",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "白色运动鞋",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80"
  }
];

export default function HomePage() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="icon-button" aria-label="打开菜单">
          <Menu />
        </button>
        <div>
          <p className="eyebrow">上海 · 26°C</p>
          <h1>今日穿搭</h1>
        </div>
        <button className="avatar-button" aria-label="个人风格档案">
          <img
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=160&q=80"
            alt=""
          />
        </button>
      </header>

      <section className="recommendation" aria-label="AI 推荐穿搭">
        <div className="look-visual">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85"
            alt="黄色休闲穿搭"
          />
          <div className="look-score">
            <span>92</span>
            <small>适配</small>
          </div>
        </div>
        <div className="look-copy">
          <div>
            <p className="eyebrow">OpenAI 推荐</p>
            <h2>明亮休闲，适合轻松日程</h2>
          </div>
          <p>
            高饱和黄色提升精神感，短上衣和同色长裤拉高比例，适合周末出门或轻运动。
          </p>
        </div>
        <div className="look-actions">
          <button className="primary-action">
            <Sparkles />
            换一套
          </button>
          <button className="icon-button" aria-label="收藏这套穿搭">
            <Heart />
          </button>
          <button className="icon-button" aria-label="不喜欢这套穿搭">
            <ThumbsDown />
          </button>
        </div>
      </section>

      <section className="quick-context" aria-label="穿搭场景">
        <button className="context-pill">上班</button>
        <button className="context-pill">约会</button>
        <button className="context-pill active">周末</button>
        <button className="context-pill">正式</button>
      </section>

      <section className="panel" aria-label="今日衣柜">
        <div className="section-heading">
          <div>
            <p className="eyebrow">已选单品</p>
            <h3>3 件搭配</h3>
          </div>
          <Link className="icon-button small" href="/closet" aria-label="编辑衣柜">
            <Pencil />
          </Link>
        </div>
        <div className="item-row">
          {closetItems.map((item) => (
            <article className="closet-item" key={item.name}>
              <img src={item.image} alt={item.name} />
              <span>{item.name}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="insight-grid" aria-label="穿搭洞察">
        <article className="metric">
          <Shirt />
          <span>128</span>
          <p>衣柜单品</p>
        </article>
        <article className="metric">
          <Repeat2 />
          <span>73%</span>
          <p>复穿率</p>
        </article>
        <article className="metric">
          <Palette />
          <span>明黄</span>
          <p>今日主色</p>
        </article>
      </section>

      <section className="panel feedback-panel" aria-label="反馈">
        <div className="section-heading">
          <div>
            <p className="eyebrow">快速反馈</p>
            <h3>这套感觉怎么样？</h3>
          </div>
        </div>
        <div className="feedback-options">
          <button aria-label="喜欢">
            <Smile />
            <span>喜欢</span>
          </button>
          <button aria-label="太正式">
            <Briefcase />
            <span>太正式</span>
          </button>
          <button aria-label="显矮">
            <MoveDown />
            <span>显矮</span>
          </button>
        </div>
      </section>

      <nav className="tabbar" aria-label="主导航">
        <button className="active" aria-label="今日">
          <Home />
          <span>今日</span>
        </button>
        <Link href="/closet" aria-label="衣柜">
          <Archive />
          <span>衣柜</span>
        </Link>
        <Link className="scan" href="/closet" aria-label="上传衣服">
          <Camera />
        </Link>
        <button aria-label="灵感">
          <WandSparkles />
          <span>灵感</span>
        </button>
        <button aria-label="我的">
          <UserRound />
          <span>我的</span>
        </button>
      </nav>
    </main>
  );
}
