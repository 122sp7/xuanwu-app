# Billing Module Agent Guide

## Purpose

`modules/billing` owns commercial capability concerns, including subscription and entitlement.

## Boundary Rules

- Place billing policy and commercial lifecycle here.
- Do not put storage, auth, or generic governance logic here.
- Cross-module consumers must use `modules/billing/api`.
- Preserve `interfaces -> application -> domain <- infrastructure`.

## Current subdomains

- subscription
- entitlement
