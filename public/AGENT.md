# public — Agent Guide

## Purpose

`public/` 是 Next.js 靜態資產目錄，直接對外可訪問。

## Contents

- SVG 圖示（file.svg、globe.svg、next.svg、vercel.svg、window.svg）
- `localized-files/` — 多語系靜態檔案

## Rules

- 只放靜態資產（圖片、SVG、字型、多語系靜態檔案）。
- 不放業務邏輯、元件或模組代碼。
- 路徑以 `/` 開頭在瀏覽器中直接可訪問（例如 `/file.svg`）。
