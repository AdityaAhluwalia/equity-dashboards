# 🚀 Phase 1 Database Setup Instructions

## Quick Setup (5 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project: `kzyfzdmjobtgpjlwutzc`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Execute Phase 1 Schema
1. Copy the entire contents of `Cursor Rules/phase1-schema.sql`
2. Paste it into the SQL Editor
3. Click **Run** (or press Cmd/Ctrl + Enter)
4. Wait for completion (should take ~30 seconds)

### Step 3: Verify Success
You should see messages like:
```
NOTICE: Phase 1 schema validation: ALL PASSED ✅
NOTICE: Phase 1 Core Schema Successfully Created! 🚀
NOTICE: Tables: companies, financial_snapshots, annual_metrics, calculated_ratios
NOTICE: Views: latest_annual_metrics, company_overview
NOTICE: Ready for Task 4.0 Integration & Service Layer
```

### Step 4: Quick Test
Run this query to verify tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('companies', 'financial_snapshots', 'annual_metrics', 'calculated_ratios');
```

Should return 4 rows.

---

## Alternative: Command Line Setup

If you prefer psql:

```bash
# Install PostgreSQL client (if not installed)
brew install postgresql

# Run schema directly
psql "postgresql://postgres:[password]@db.kzyfzdmjobtgpjlwutzc.supabase.co:5432/postgres" \
  -f "Cursor Rules/phase1-schema.sql"
```

---

## What Gets Created

### 📊 **Core Tables**
- `companies` - Master company data (3 sample companies included)
- `financial_snapshots` - Raw JSON storage from Screener.in
- `annual_metrics` - Denormalized annual financial data
- `calculated_ratios` - All 30+ financial ratios from Task 3.0

### 🔍 **Views**
- `latest_annual_metrics` - Most recent metrics per company
- `company_overview` - Dashboard summary with ratios

### 📈 **Indexes**
- Performance indexes for charts and searches
- GIN indexes for JSON queries
- Composite indexes for ratio analysis

### ⚙️ **Functions**
- `get_company_time_series()` - For chart data
- `update_updated_at()` - Timestamp triggers

---

## Next Steps After Setup

1. ✅ **Verify Schema** - Run test queries
2. 🔧 **Update Cursor Rules** - Mark Phase 1 complete
3. 🚀 **Start Task 4.0** - Integration & Service Layer
4. 📊 **Test Integration** - Connect calculation engine

---

## Troubleshooting

### Issue: Permission Denied
- Make sure you're using the correct project
- Check if you have Owner/Admin access

### Issue: Extension Not Found  
- `uuid-ossp` and `pg_trgm` should be available by default
- If not, enable them in Database > Extensions

### Issue: Function Creation Failed
- Some advanced functions might need SUPERUSER
- Skip them if they fail - they're not critical for MVP

---

## Success Checklist

- [ ] 4 core tables created
- [ ] 2 views accessible  
- [ ] Sample companies inserted
- [ ] No critical errors in execution
- [ ] Ready to proceed with Task 4.0

🎯 **Goal**: Have a working database foundation for the equity dashboard! 