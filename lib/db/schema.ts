import { boolean, integer, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  titleFr: text('title_fr').notNull(),
  titleEn: text('title_en').notNull(),
  descriptionFr: text('description_fr').notNull(),
  descriptionEn: text('description_en').notNull(),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
  place: text('place').notNull(),
  imageUrl: text('image_url'),
  scene: text('scene'),
  subtitleFr: text('subtitle_fr'),
  subtitleEn: text('subtitle_en'),
  tagsFr: text('tags_fr'),
  tagsEn: text('tags_en'),
  hidden: boolean('hidden').notNull().default(false),
  capacity: integer('capacity').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash'),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  googleSub: text('google_sub').unique(),
  role: text('role').notNull().default('user'),
  cguAcceptedAt: timestamp('cgu_accepted_at', { withTimezone: true }),
  cguVersion: text('cgu_version'),
  pendingEmail: text('pending_email'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const emailTokens = pgTable('email_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  kind: text('kind').notNull().default('signup'),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

export const registrations = pgTable(
  'registrations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    email: text('email').notNull(),
    inviteId: uuid('invite_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [unique('registrations_event_email').on(table.eventId, table.email)]
);

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  locale: text('locale').notNull().default('fr'),
  kind: text('kind').notNull(),
  status: text('status').notNull().default('received'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull(),
  nameFr: text('name_fr').notNull(),
  nameEn: text('name_en').notNull(),
  color: text('color'),
  quantity: integer('quantity').notNull().default(1),
  priceLabel: text('price_label').notNull(),
  detail: text('detail'),
});

export const rateLimits = pgTable('rate_limits', {
  key: text('key').primaryKey(),
  hits: integer('hits').notNull(),
  windowStart: timestamp('window_start', { withTimezone: true }).notNull(),
});

export const invites = pgTable('invites', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  sent: boolean('sent').notNull().default(false),
  usedAt: timestamp('used_at', { withTimezone: true }),
  name: text('name'),
  email: text('email'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
