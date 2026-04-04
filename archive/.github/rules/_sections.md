# Sections

This file defines all sections, their ordering, impact levels, and descriptions.
The section ID (in parentheses) is the filename prefix used to group rules.

---

## 1. Architecture (architecture)

**Impact:** CRITICAL
**Description:** Module-Driven Domain Design (MDDD) patterns — module structure, layer dependencies, boundaries, and hexagonal ports.

## 2. Code Quality (quality)

**Impact:** CRITICAL
**Description:** Import conventions, code review standards, error handling with `CommandResult` / `DomainError`, and PR practices.

## 3. Data Layer (data)

**Impact:** HIGH
**Description:** Repository pattern (interface in `domain/`, implementation in `infrastructure/`), DTOs, and Firebase Firestore conventions.

## 4. API Design (api)

**Impact:** HIGH
**Description:** Module API surface via domain `api/` boundaries and `@api-contracts` route registry patterns.

## 5. Performance (performance)

**Impact:** HIGH
**Description:** Algorithm complexity and data structure choices for enterprise scale.

## 6. Testing (testing)

**Impact:** MEDIUM-HIGH
**Description:** Test coverage requirements and mocking strategies.

## 7. Design Patterns (patterns)

**Impact:** MEDIUM
**Description:** Use-case pattern, domain events, domain services, and constructor-based dependency injection.

## 8. Team Culture (culture)

**Impact:** MEDIUM
**Description:** Engineering accountability and AI-assisted development practices.

## 9. CI/CD (ci)

**Impact:** HIGH
**Description:** Type checking priorities and git workflow standards.

## 10. Reference (reference)

**Impact:** LOW
**Description:** Key file locations and local development setup.
