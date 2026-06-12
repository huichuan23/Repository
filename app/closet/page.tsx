"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Home,
  ImagePlus,
  Loader2,
  Sparkles,
  Upload
} from "lucide-react";

type ClothingItem = {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
  colors: string[];
  seasons: string[];
  styles: string[];
};

export default function ClosetPage() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadItems() {
    setIsLoading(true);
    const response = await fetch("/api/clothing-items", { cache: "no-store" });
    const payload = await response.json();
    setItems(payload.items ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    loadItems().catch(() => {
      setMessage("衣柜读取失败，请检查 Vercel 环境变量。");
      setIsLoading(false);
    });
  }, []);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setMessage(null);

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(selected ? URL.createObjectURL(selected) : null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setMessage("先选择一张衣服照片。");
      return;
    }

    setIsUploading(true);
    setMessage("AI 正在识别这件衣服...");
    const body = new FormData();
    body.append("image", file);

    const response = await fetch("/api/clothing-items", {
      method: "POST",
      body
    });
    const payload = await response.json();

    if (!response.ok) {
      setMessage(payload.error ?? "上传失败，请稍后再试。");
      setIsUploading(false);
      return;
    }

    setItems((current) => [payload.item, ...current]);
    setFile(null);
    setPreview(null);
    setMessage("已加入衣柜，标签由 AI 自动生成。");
    setIsUploading(false);
  }

  return (
    <main className="app-shell closet-shell">
      <header className="topbar">
        <Link className="icon-button" href="/" aria-label="返回首页">
          <ArrowLeft />
        </Link>
        <div>
          <p className="eyebrow">AI 自动整理</p>
          <h1>我的衣柜</h1>
        </div>
        <div className="icon-button quiet" aria-hidden="true">
          <Sparkles />
        </div>
      </header>

      <form className="upload-panel" id="upload" onSubmit={handleSubmit}>
        <label className="photo-drop">
          {preview ? (
            <img src={preview} alt="待上传衣服预览" />
          ) : (
            <span>
              <ImagePlus />
              上传一张衣服照片
            </span>
          )}
          <input
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            type="file"
            onChange={handleFileChange}
          />
        </label>

        <button className="primary-action upload-action" disabled={isUploading}>
          {isUploading ? <Loader2 className="spin" /> : <Upload />}
          {isUploading ? "识别中" : "加入衣柜"}
        </button>
        {message ? <p className="status-message">{message}</p> : null}
      </form>

      <section className="panel closet-list-panel" aria-label="衣柜列表">
        <div className="section-heading">
          <div>
            <p className="eyebrow">数据库衣柜</p>
            <h3>{items.length} 件单品</h3>
          </div>
          <CheckCircle2 />
        </div>

        {isLoading ? (
          <div className="empty-state">
            <Loader2 className="spin" />
            正在读取衣柜
          </div>
        ) : items.length ? (
          <div className="wardrobe-grid">
            {items.map((item) => (
              <article className="wardrobe-card" key={item.id}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} />
                ) : (
                  <div className="image-placeholder">
                    <Camera />
                  </div>
                )}
                <div>
                  <p className="item-category">{item.category}</p>
                  <h2>{item.name}</h2>
                  <div className="tag-row">
                    {[...item.colors, ...item.styles, ...item.seasons]
                      .filter(Boolean)
                      .slice(0, 5)
                      .map((tag) => (
                        <span key={`${item.id}-${tag}`}>{tag}</span>
                      ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Camera />
            先上传第一件衣服
          </div>
        )}
      </section>

      <nav className="tabbar" aria-label="主导航">
        <Link href="/" aria-label="今日">
          <Home />
          <span>今日</span>
        </Link>
        <Link className="active" href="/closet" aria-label="衣柜">
          <Camera />
          <span>衣柜</span>
        </Link>
        <a className="scan" href="#upload" aria-label="上传衣服">
          <Camera />
        </a>
      </nav>
    </main>
  );
}
