# Graph Report - D:\Justin\LOMBA\BERAKSI UPNVYK\Tuloong  (2026-07-14)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 20 nodes · 15 edges · 7 communities (4 shown, 3 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.9)
- Token cost: 181 input · 21 output

## Graph Freshness
- Built from commit: `c8e5353e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Partner Transaction Management
- User and Profile Administration
- Laravel Backend
- Posts Table
- Cloudinary Storage
- Donation Flow
- Tuloong Platform Jasa Suruh

## God Nodes (most connected - your core abstractions)
1. `Claims Table` - 5 edges
2. `Laravel Backend` - 3 edges
3. `Mitra Profiles Table` - 3 edges
4. `Posts Table` - 3 edges
5. `Pelanggan (Customer)` - 2 edges
6. `Users Table` - 2 edges
7. `Transactions Table` - 2 edges
8. `Mitra (Partner)` - 1 edges
9. `Admin` - 1 edges
10. `Next.js Frontend` - 1 edges

## Surprising Connections (you probably didn't know these)
- `Posts Table` --references--> `Users Table`  [EXTRACTED]
  PRD.md → PRD.md  _Bridges community 1 → community 3_
- `Claims Table` --references--> `Posts Table`  [EXTRACTED]
  PRD.md → PRD.md  _Bridges community 3 → community 0_

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Core Transaction Flow** — prd_posts_table, prd_claims_table, prd_transactions_table, prd_reviews_table [EXTRACTED 1.00]
- **Platform User Roles** — prd_pelanggan, prd_mitra, prd_admin [EXTRACTED 1.00]
- **Technology Stack** — prd_laravel, prd_nextjs, prd_supabase, prd_midtrans, prd_cloudinary [EXTRACTED 1.00]

## Communities (7 total, 3 thin omitted)

### Community 0 - "Partner Transaction Management"
Cohesion: 0.33
Nodes (6): Claims Table, Messages Table, Mitra (Partner), Reports Table, Reviews Table, Transactions Table

### Community 1 - "User and Profile Administration"
Cohesion: 0.50
Nodes (4): Admin, Mitra Badge System, Mitra Profiles Table, Users Table

### Community 2 - "Laravel Backend"
Cohesion: 0.50
Nodes (4): Laravel Backend, Next.js Frontend, Laravel Reverb, Supabase PostgreSQL

### Community 3 - "Posts Table"
Cohesion: 0.67
Nodes (3): Midtrans Payment Gateway, Pelanggan (Customer), Posts Table

## Knowledge Gaps
- **13 isolated node(s):** `Tuloong Platform Jasa Suruh`, `Mitra (Partner)`, `Admin`, `Next.js Frontend`, `Supabase PostgreSQL` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Posts Table` connect `Posts Table` to `Partner Transaction Management`, `User and Profile Administration`?**
  _High betweenness centrality (0.257) - this node is a cross-community bridge._
- **Why does `Claims Table` connect `Partner Transaction Management` to `Posts Table`?**
  _High betweenness centrality (0.257) - this node is a cross-community bridge._
- **Why does `Users Table` connect `User and Profile Administration` to `Posts Table`?**
  _High betweenness centrality (0.158) - this node is a cross-community bridge._
- **What connects `Tuloong Platform Jasa Suruh`, `Mitra (Partner)`, `Admin` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._