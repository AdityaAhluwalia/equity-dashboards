#!/usr/bin/env node

/**
 * Database Schema Verification Script
 * Verifies Phase 1 schema creation and functionality
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabase() {
  console.log('🔍 Verifying Phase 1 Database Schema...\n');
  
  let totalChecks = 0;
  let passedChecks = 0;
  
  const checkItem = (name, success, details = '') => {
    totalChecks++;
    if (success) {
      passedChecks++;
      console.log(`✅ ${name}`);
      if (details) console.log(`   ${details}`);
    } else {
      console.log(`❌ ${name}`);
      if (details) console.log(`   ${details}`);
    }
  };

  try {
    // 1. Test Companies Table
    console.log('📊 Testing Core Tables:');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, symbol, name, sector, company_type')
      .limit(5);
    
    checkItem(
      'Companies table accessible',
      !companiesError,
      companiesError ? companiesError.message : `Found ${companies?.length || 0} companies`
    );

    // 2. Test Financial Snapshots Table
    const { error: snapshotsError } = await supabase
      .from('financial_snapshots')
      .select('id')
      .limit(1);
    
    checkItem(
      'Financial snapshots table accessible',
      !snapshotsError,
      snapshotsError ? snapshotsError.message : 'Table structure OK'
    );

    // 3. Test Annual Metrics Table
    const { error: metricsError } = await supabase
      .from('annual_metrics')
      .select('id')
      .limit(1);
    
    checkItem(
      'Annual metrics table accessible',
      !metricsError,
      metricsError ? metricsError.message : 'Table structure OK'
    );

    // 4. Test Calculated Ratios Table
    const { error: ratiosError } = await supabase
      .from('calculated_ratios')
      .select('id')
      .limit(1);
    
    checkItem(
      'Calculated ratios table accessible',
      !ratiosError,
      ratiosError ? ratiosError.message : 'Table structure OK'
    );

    console.log('\n🔍 Testing Views:');

    // 5. Test Company Overview View
    const { data: overview, error: overviewError } = await supabase
      .from('company_overview')
      .select('symbol, name, sector')
      .limit(3);
    
    checkItem(
      'Company overview view accessible',
      !overviewError,
      overviewError ? overviewError.message : `Found ${overview?.length || 0} companies in view`
    );

    console.log('\n🧪 Testing Database Operations:');

    // 6. Test Insert Operation
    const testCompany = {
      symbol: `TEST_${Date.now()}`,
      name: 'Test Verification Company',
      sector: 'Technology',
      industry: 'Software',
      company_type: 'general',
      market_cap: 1000.00
    };

    const { data: insertResult, error: insertError } = await supabase
      .from('companies')
      .insert(testCompany)
      .select('id, symbol');
    
    checkItem(
      'Insert operation works',
      !insertError && insertResult?.length > 0,
      insertError ? insertError.message : `Created company with ID: ${insertResult?.[0]?.id}`
    );

    // 7. Test Update Operation
    let updateError = null;
    if (insertResult?.length > 0) {
      const { error: updateErr } = await supabase
        .from('companies')
        .update({ market_cap: 2000.00 })
        .eq('id', insertResult[0].id);
      updateError = updateErr;
    }
    
    checkItem(
      'Update operation works',
      !updateError,
      updateError ? updateError.message : 'Market cap updated successfully'
    );

    // 8. Test Delete Operation (cleanup)
    let deleteError = null;
    if (insertResult?.length > 0) {
      const { error: deleteErr } = await supabase
        .from('companies')
        .delete()
        .eq('id', insertResult[0].id);
      deleteError = deleteErr;
    }
    
    checkItem(
      'Delete operation works',
      !deleteError,
      deleteError ? deleteError.message : 'Test company cleaned up'
    );

    console.log('\n📊 Testing Specific Features:');

    // 9. Test Company Types Enum
    const { data: bankingCompanies, error: enumError } = await supabase
      .from('companies')
      .select('symbol, company_type')
      .eq('company_type', 'banking')
      .limit(1);
    
    checkItem(
      'Company type enum works',
      !enumError,
      enumError ? enumError.message : `Found ${bankingCompanies?.length || 0} banking companies`
    );

    // 10. Test Search Functionality  
    const { data: searchResults, error: searchError } = await supabase
      .from('companies')
      .select('symbol, name')
      .ilike('name', '%Ltd%')
      .limit(3);
    
    checkItem(
      'Text search works',
      !searchError,
      searchError ? searchError.message : `Found ${searchResults?.length || 0} companies with "Ltd"`
    );

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`📋 Verification Summary: ${passedChecks}/${totalChecks} checks passed`);
    
    const successRate = (passedChecks / totalChecks) * 100;
    
    if (successRate === 100) {
      console.log('🎉 Phase 1 Database Schema: FULLY OPERATIONAL!');
      console.log('✅ Ready to proceed with Task 4.0: Integration & Service Layer');
    } else if (successRate >= 80) {
      console.log('🟡 Phase 1 Database Schema: MOSTLY WORKING');
      console.log('⚠️  Some minor issues detected, but core functionality ready');
    } else {
      console.log('🔴 Phase 1 Database Schema: NEEDS ATTENTION');
      console.log('❌ Critical issues detected, please review schema creation');
    }

    console.log('\n🔗 Next Steps:');
    console.log('1. If all checks passed: Start Task 4.0 service layer');
    console.log('2. If some failed: Review setup-instructions.md');
    console.log('3. If major issues: Re-run phase1-schema.sql in Supabase SQL Editor');

  } catch (error) {
    console.error('💥 Verification failed with error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your .env.local configuration');
    console.log('2. Ensure Supabase project is accessible');
    console.log('3. Verify you have proper permissions');
  }
}

// Run verification
verifyDatabase(); 