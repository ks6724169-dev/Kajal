-- GALAXY ERP ENTERPRISE SUITE — PHASE 03.1A
-- DATABASE COMPONENT: Metadata Seeding Script
-- TARGET SYSTEM: GEOS v12.0 Core

-- 1. Seed Core System Version
INSERT INTO public.system_version (major, minor, patch, description, status)
VALUES (12, 0, 0, 'Galaxy Enterprise Operating System (GEOS v12.0) Core Engine Seed Release', 'active')
ON CONFLICT (major, minor, patch) DO NOTHING;

-- 2. Seed Default Languages
INSERT INTO public.languages (language_iso, language_name, native_name, text_direction)
VALUES 
  ('en', 'English', 'English', 'ltr'),
  ('hi', 'Hindi', 'हिन्दी', 'ltr'),
  ('ar', 'Arabic', 'العربية', 'rtl'),
  ('es', 'Spanish', 'Español', 'ltr')
ON CONFLICT (language_iso) DO NOTHING;

-- 3. Seed Default Locales
INSERT INTO public.locales (locale_code, locale_name, native_name, is_default)
VALUES 
  ('en-US', 'English (United States)', 'English (US)', TRUE),
  ('en-GB', 'English (United Kingdom)', 'English (UK)', FALSE),
  ('hi-IN', 'Hindi (India)', 'हिन्दी (भारत)', FALSE),
  ('ar-AE', 'Arabic (UAE)', 'العربية (الإمارات)', FALSE)
ON CONFLICT (locale_code) DO NOTHING;

-- 4. Seed ISO Countries
INSERT INTO public.countries (iso_alpha2, iso_alpha3, numeric_code, country_name, official_name, capital_city, top_level_domain)
VALUES 
  ('IN', 'IND', '356', 'India', 'Republic of India', 'New Delhi', '.in'),
  ('US', 'USA', '840', 'United States', 'United States of America', 'Washington, D.C.', '.us'),
  ('AE', 'ARE', '784', 'United Arab Emirates', 'United Arab Emirates', 'Abu Dhabi', '.ae'),
  ('GB', 'GBR', '826', 'United Kingdom', 'United Kingdom of Great Britain and Northern Ireland', 'London', '.uk'),
  ('SG', 'SGP', '702', 'Singapore', 'Republic of Singapore', 'Singapore', '.sg')
ON CONFLICT (iso_alpha2) DO NOTHING;

-- 5. Seed Core Currencies
INSERT INTO public.currencies (currency_code, currency_name, currency_symbol, decimal_digits, usd_exchange_rate)
VALUES 
  ('USD', 'United States Dollar', '$', 2, 1.000000),
  ('INR', 'Indian Rupee', '₹', 2, 0.012000),
  ('AED', 'UAE Dirham', 'د.إ', 2, 0.272300),
  ('GBP', 'British Pound Sterling', '£', 2, 1.270000),
  ('EUR', 'Euro', '€', 2, 1.090000)
ON CONFLICT (currency_code) DO NOTHING;

-- 6. Seed Key Timezones
INSERT INTO public.timezones (timezone_name, utc_offset_seconds, is_dst, abbreviation)
VALUES 
  ('UTC', 0, FALSE, 'UTC'),
  ('Asia/Kolkata', 19800, FALSE, 'IST'),
  ('Asia/Dubai', 14400, FALSE, 'GST'),
  ('America/New_York', -18000, FALSE, 'EST'),
  ('Europe/London', 0, FALSE, 'GMT')
ON CONFLICT (timezone_name) DO NOTHING;
