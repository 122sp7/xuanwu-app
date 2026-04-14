# Analytics Module Agent Guide

## Purpose

`modules/analytics` owns reporting, metrics, and read-model analytics surfaces.

## Boundary Rules

- Keep analytics read-oriented by default.
- Do not place billing, entitlement, or subscription policy here.
- Cross-module collaboration must go through public `api/` boundaries.
- Preserve `interfaces -> application -> domain <- infrastructure`.

## Delivery Style

- Prefer small query-oriented increments.
- Add subdomains only when a real analytics capability emerges.
