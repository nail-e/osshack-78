// This file contains constants shared between editor front and back

import { gbToBytes, mbToBytes } from './fileSizeUtils';

// In the new file storage architecture, this limit doesn't really matter - we just set it to a high value for sanity.
// The maximum file size we can store is MAX_CACHE_ELEMS_PER_DOC * FILE_SLICE_SIZE.
export const MAX_CACHE_ELEMS_PER_DOC = 1000000;

// Controls the maximum slice size for file uploads. Files larger than this size will be split into multiple slices.
export const FILE_SLICE_SIZE = mbToBytes(5); // MB

// Number of hours of document history granted to a user on the free tier.
// If this var is updated, also update the warning text in react-client/app/components/editor/SnapshotsPanel/SnapshotsPanel.tsx
export const DOCUMENT_HISTORY_FREE_TIER_HOURS = 24;

export const MAXIMUM_STRIPE_PURCHASE_QUANTITY = 999999;

export const GLOBAL_MAX_NUM_QUICK_ALIASES = 10_000;

/** Credits */

// Number of credits (in cents) users receive for a successful referral
// $10
export const CREDIT_FOR_REFERRAL = {
  cents: 1000,
  skemailStorageBytes: 500000000, // 500MB
  editorStorageBytes: 500000000
};

// $60, 6GB
export const MAX_CREDIT_FOR_REFERRALS = {
  cents: 6000, // $60
  skemailStorageBytes: 3000000000, // 3GB
  editorStorageBytes: 3000000000
};

// $15
export const MAX_CREDIT_FOR_GOOGLE_DRIVE_IMPORTS = {
  cents: 1500, // $15
  skemailStorageBytes: 0,
  editorStorageBytes: 0
};

// $10 - One-time credit
export const CREDIT_FOR_OUTLOOK_IMPORT = {
  cents: 1000, // $10
  skemailStorageBytes: 0,
  editorStorageBytes: 0
};

// $10 - One-time credit
export const CREDIT_FOR_GMAIL_IMPORT = {
  cents: 1000, // $10
  skemailStorageBytes: 0,
  editorStorageBytes: 0
};

// 1GB - One-time credit
export const CREDIT_FOR_ENS_NAME = {
  cents: 0,
  skemailStorageBytes: gbToBytes(1),
  editorStorageBytes: 0
};

// $10
export const CREDIT_FOR_MOBILE_APP = {
  cents: 1000,
  skemailStorageBytes: 0,
  editorStorageBytes: 0
};

// $100, 10GB
export const MAX_CREDIT_FOR_USER = {
  cents: 10000, // $100
  skemailStorageBytes: 10000000000, // 10GB
  editorStorageBytes: 10000000000
};

// $100, 10GB
export const MAX_TRANSACTION_CREDIT_FOR_USER = {
  cents: 10000, // $100
  skemailStorageBytes: 10000000000,
  editorStorageBytes: 10000000000
};

// $10
export const CREDIT_FOR_DESKTOP_APP = {
  cents: 1000,
  skemailStorageBytes: 0,
  editorStorageBytes: 0
};

export const DEFAULT_FEATURE_FLAGS = {
  documentSnapshot: false, // cannot access document snapshots older than 24 hours
  contentSearch: true, // can search in document contents
  uploadLimitMegabytes: 50, // free tier users can upload 50 MB files
  storageLimitMegabytes: 10000, // free tier users can have 10 GB storage,
  embedFiles: true // cannot embed files in pages
};

export const MB_SCALE_FACTOR = 1000 ** 2; // bytes in a megabytes

// Conversion factor to convert price from GoDaddy API (in currency-micro-units) to standard decimal pricing (e.g. $10.99)
export const GODADDY_PRICE_SCALE_FACTOR = 1 / 10 ** 6;

// A fee that we add to custom domain purchases to account for possible ICANN fees, taxes and Stripe fees (numerator is denominated in dollars)
export const ONE_CLICK_CUSTOM_DOMAIN_FEE = 1 / GODADDY_PRICE_SCALE_FACTOR;

// Minimum price that we charge for the first year of a custom domain, currently only enforced for an experimental group (numerator is denominated in dollars)
export const ONE_CLICK_CUSTOM_DOMAIN_FLOOR_PRICE = 9.99 / GODADDY_PRICE_SCALE_FACTOR;

export enum CustomDomainPriceExperimentGroup {
  TREATMENT = 'has-floor-price',
  CONTROL = 'no-floor-price'
}

export const SUPPORT_EMAIL = 'support@skiff.org';
// email domains from which support comms may originate
export const SKIFF_SUPPORT_DOMAINS = ['skiff.org', 'skiff.zendesk.com'];

export enum EmailType {
  SHARE = 'SHARE',
  COMMENT = 'COMMENT',
  ACCESS = 'ACCESS',
  RECOVERY = 'RECOVERY',
  VERIFY = 'VERIFY',
  REFER_PAGES = 'REFER_PAGES',
  REFER_EMAIL = 'REFER_EMAIL',
  SUGGESTION = 'SUGGESTION',
  ADD_EMAIL = 'ADD_EMAIL',
  DELETE_RECOVERY_EMAIL = 'DELETE_RECOVERY_EMAIL',
  MENTION = 'MENTION',
  PROVISION_USER = 'PROVISION_USER',
  SHARE_WORKSPACE = 'SHARE_WORKSPACE',
  SUGGEST_WORKSPACE = 'SUGGEST_WORKSPACE'
}

export const POLL_INTERVAL_IN_MS = 20000; // 20 seconds

// Header name for auth link
export const SKIFF_USERID_HEADER_NAME = 'x-skiff-userid';

// Header name for device id
export const SKIFF_DEVICEID_HEADER_NAME = 'x-skiff-deviceid';

// Header name for product
export const SKIFF_PRODUCT_HEADER_NAME = 'x-skeader-product';

// Admin API Token
export const ADMIN_API_TOKEN_HEADER = 'x-skiff-admin-api-token';

// Human-readable prefix for challenge to clarify to users what they're signing
export const CHALLENGE_TOKEN_PREFIX = 'skiff_signup_';

export enum CustomDomainStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  FAILED_REVERIFICATION = 'FAILED_REVERIFICATION'
}

// Human-readable prefix (HRP) for Cosmos Hub zone
export const COSMOS_HUB_PREFIX = 'cosmos';

// Human-readable prefix (HRP) for Juno zone
export const JUNO_PREFIX = 'juno';

// Equal to Tier.name in database, which corresponds to Stripe product names, via SyncWithStripe
export enum TierName {
  Free = 'Free',
  Essential = 'Essential',
  Pro = 'Pro',
  Business = 'Business'
}

export enum SkiffCreditEligibleTier {
  Pro = 'Pro',
  Business = 'Business'
}

export enum PurchaseType {
  NewCheckout = 'New Checkout',
  Renewal = 'Renewal',
  PlanChange = 'PlanChange'
}

// Costs for different plans in dollars
export enum PlanPrices {
  EssentialMonthly = 4,
  EssentialYearly = 36,
  ProMonthly = 10,
  ProYearly = 96,
  BusinessMonthly = 15,
  BusinessYearly = 144
}

export enum PlanRelation {
  CURRENT = 'CURRENT',
  UPGRADE = 'UPGRADE',
  DOWNGRADE = 'DOWNGRADE'
}

// unique identifiers for free trials; used e.g. to control how past trial participation affects future trial eligibility
// MUST be limited to 40 CHARS to conform to key-length limits for Stripe metadata;
// If you change an identifier for a given trial, you need to do a stripe migration to mark all of the subscriptions that have participated
// with the new name; otherwise, name change would invalidate record of past participation
export enum FreeTrialIdentifier {
  CUSTOM_DOMAIN_PURCHASE_TRIAL = 'CUSTOM_DOMAIN_PURCHASE_TRIAL',
  ESSENTIAL_ON_FULL_ACTIVATION = 'ESSENTIAL_ON_FULL_ACTIVATION'
}

export interface PerIntervalPrice {
  monthly: number;
  yearly: number;
}

export type PaidTier = TierName.Essential | TierName.Pro | TierName.Business;

export const UNIT_PRICE_BY_TIER_NAME: Record<PaidTier, PerIntervalPrice> = {
  [TierName.Essential]: { monthly: PlanPrices.EssentialMonthly, yearly: PlanPrices.EssentialYearly },
  [TierName.Pro]: { monthly: PlanPrices.ProMonthly, yearly: PlanPrices.ProYearly },
  [TierName.Business]: { monthly: PlanPrices.BusinessMonthly, yearly: PlanPrices.BusinessYearly }
};

export const STRIPE_CHECKOUT_SESSION_LIFESPAN_SECONDS = 24 * 60 * 60;
// a coupon attached to a specific subscription in advance of a renewal has a one-month redemption limit
export const STRIPE_SUBSCRIPTION_RENEWAL_COUPON_REDEMPTION_PERIOD = 30 * 24 * 60 * 60;
// note that this 2-week limit after which plans are cancelled is configurable; if we change on stripe, should change here too
export const STRIPE_PAYMENT_RETRY_TIME_LIMIT = 14 * 24 * 60 * 60;
export const CUSTOMER_FACING_SKIFF_CREDIT_COUPON_NAME = 'Skiff Credit';

export enum CustomDomainTierName {
  //corresponds to Stripe product name
  ActiveCustomDomain = 'Custom Domain',
  //canonical end-of-life and pre-activation state for custom domain subscription history
  InactiveCustomDomain = 'Inactive Custom Domain'
}

// failed webhooks from Stripe will continue to retry at decreasing frequency for 3 days
export const STRIPE_WEBHOOK_RETRY_DURATION_IN_MS = 259200000;

// query string for plan checkout redirects
export enum PaymentQueryParam {
  PAYMENT_SUCCESS = 'paymentSuccess',
  DOMAIN_REGISTRATION_SUCCESS = 'domainRegistration'
}
export enum PaymentQueryParamValue {
  Succeeded = '1',
  Cancelled = '0'
}

// ApolloError codes for errors in which users hit tier limits
export enum PaywallErrorCode {
  AliasLimit = 'ALIAS_LIMIT',
  ShortAlias = 'SHORT_ALIAS',
  StorageLimit = 'STORAGE_LIMIT',
  UploadLimit = 'UPLOAD_LIMIT',
  CustomDomainLimit = 'CUSTOM_DOMAIN_LIMIT',
  MessageLimit = 'MESSAGE_LIMIT',
  UserLabelLimit = 'USER_LABEL_LIMIT',
  UserFolderLimit = 'USER_FOLDER_LIMIT',
  WorkspaceUserLimit = 'WORKSPACE_USER_LIMIT',
  SecuredBySkiffSig = 'SECURED_BY_SKIFF_SIG',
  AutoReply = 'AUTO_REPLY',
  MailFilterLimit = 'MAIL_FILTER',
  CatchallAlias = 'CATCHALL_ALIAS',
  EditAliasDisplayInfo = 'EDIT_ALIAS_DISPLAY_INFO',
  AnonymousSubdomain = 'ANONYMOUS_SUBDOMAIN'
}

// the billing cycles supported by both Stripe and Skiff
export enum StripeBillingInterval {
  MONTH = 'month',
  YEAR = 'year'
}

interface FreeTrialDetails {
  trialTier: TierName;
  trialDays: number;
  // the interval that determines the price/cycle for the subscription that will start at the end of the trial (i.e. should they start a monthly or yearly sub at end of trial?);
  // only relevant if we create the trial; if trial granted at checkout, user can change
  trialTierInterval: StripeBillingInterval;
}

export const FREE_TRIALS: Record<FreeTrialIdentifier, FreeTrialDetails> = {
  [FreeTrialIdentifier.CUSTOM_DOMAIN_PURCHASE_TRIAL]: {
    trialTier: TierName.Pro,
    trialDays: 60,
    trialTierInterval: StripeBillingInterval.MONTH
  },
  [FreeTrialIdentifier.ESSENTIAL_ON_FULL_ACTIVATION]: {
    trialTier: TierName.Essential,
    trialDays: 60,
    trialTierInterval: StripeBillingInterval.MONTH
  }
};

export const SHORT_ALIAS_MIN_LENGTH = 4;
export const SKIFF_ALIAS_MIN_LENGTH = 6;
export const SKIFF_ALIAS_MAX_LENGTH = 30;
// Custom domains rules
export const CUSTOM_DOMAINS_ALIAS_MIN_LENGTH = 1;
export const CUSTOM_DOMAINS_ALIAS_MAX_LENGTH = 64;

// example string to parse: "urn:sk:USER_FEATURES:STORAGE_LIMIT_BYTES=100000000"
export const USER_TAG_RE = /^urn:sk:USER_FEATURES:(\S+)=(\S+)$/;

export const CUSTOM_DOMAIN_RECORD_ERRORS = {
  RECORD_MISMATCH: 'RecordMismatch',
  DNS_RETRIEVAL_ERROR: 'DNSRetrievalError'
};

export const CALENDAR_SYNC_ERROR_MESSAGE = 'Sync failed to save events';

// The following values are determined based on behavior types
// specified here: https://docs.hcaptcha.com/enterprise#behavior_type
export enum CaptchaBehaviorTypes {
  SIGNUP = 'signup',
  LOGIN = 'login',
  PASSWORD_RESET = 'password_reset',
  SEND_MESSAGE = 'user_post',
  REPLY_MESSAGE = 'user_comment',
  DELETE_ALIAS = 'delete_alias',
  DELETE_QUICK_ALIAS = 'delete_quick_alias',
  PROVISION_USER = 'provision_user'
}

export const SUPPORTED_ICNS_PREFIXES = ['cosmos', 'juno'];

/**
 * The states that a Stripe subscription can be in. Includes both terminal and processing states.
 * Source: https://stripe.com/docs/api/subscriptions/object#subscription_object-status
 * WARNING: IF YOU UPDATE THE ENUM, YOU MUST UPDATE THE DATABASE BY PERFORMING A MIGRATION!
 */
export enum SubscriptionStates {
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
  CANCELLED = 'canceled', // Yes, this is spelled 'wrong'. Fight me.
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing'
}

export const TerminalStates = [
  SubscriptionStates.CANCELLED,
  SubscriptionStates.INCOMPLETE_EXPIRED,
  SubscriptionStates.UNPAID
];
export const ProcessingStates = [
  SubscriptionStates.ACTIVE,
  SubscriptionStates.PAST_DUE,
  SubscriptionStates.INCOMPLETE,
  SubscriptionStates.TRIALING
];
export const ActiveSubscriptionStates = [
  SubscriptionStates.ACTIVE,
  SubscriptionStates.PAST_DUE,
  SubscriptionStates.TRIALING
];
export const ActiveGoodStandingStates = [SubscriptionStates.ACTIVE, SubscriptionStates.TRIALING];

// Size of content snippet to be displayed in the email list.
export const CONTENT_SNIPPET_SIZE = 100; // chars

export const ALERTS_EMAIL_ALIAS = 'alerts@notifications.skiff.org';
export const SUPPORT_EMAIL_ALIAS = 'support@skiff.org';
export const SUPPORT_COM_EMAIL_ALIAS = 'support@skiff.com';
export const UPDATES_EMAIL_ALIAS = 'updates@marketing.skiff.org';
export const WELCOME_EMAIL_ALIAS = 'hello@skiff.com';
export const ONBOARDING_ALIAS = 'onboarding@marketing.skiff.org';
export const SUBSCRIPTION_UPDATE_ALIAS = 'subscriptions-noreply@skiff.com';

export const VERIFIED_SKIFF_EMAILS = [
  ALERTS_EMAIL_ALIAS,
  SUPPORT_EMAIL_ALIAS,
  SUPPORT_COM_EMAIL_ALIAS,
  ONBOARDING_ALIAS,
  UPDATES_EMAIL_ALIAS,
  WELCOME_EMAIL_ALIAS,
  SUBSCRIPTION_UPDATE_ALIAS
];

// the distance away from the quick alias limit within which we warn the user on alias creation;
// i.e. if limit is 10, we start warning at the creation of the (10 - BUFFER)th alias
export const QUICK_ALIAS_LIMIT_WARNING_BUFFER = 2;

// proportions of storage allowance usage at which we warn users
export const STORAGE_WARNING_THRESHOLDS = [
  0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.92, 0.95, 0.96, 0.97, 0.98, 0.99
];
