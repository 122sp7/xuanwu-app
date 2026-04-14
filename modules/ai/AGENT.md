# AI Module Agent Guide

## Purpose

This bounded context is reserved for shared AI capability orchestration and policy.

## Boundary Rules

- Keep provider routing, model policy, safety, and AI orchestration concerns here.
- Do not place workspace UI composition, billing policy, or identity governance here.
- Cross-module consumers must use the public API boundary.
- Preserve the dependency direction of interfaces to application to domain, with infrastructure depending inward.

## Delivery Style

- Keep this module minimal until concrete AI capabilities are promoted here.
