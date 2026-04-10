import {
  pgTable,
  text,
  integer,
  serial,
  timestamp,
  boolean,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import type { AdapterAccountType } from 'next-auth/adapters';

// ============ USERS / AUTH ============
export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name'),
  email: text('email').unique().notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  bio: text('bio'),
  role: text('role', { enum: ['user', 'admin', 'moderator'] })
    .default('user')
    .notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
});

export const accounts = pgTable(
  'accounts',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

export const sessions = pgTable('sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationTokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// ============ CATEGORIES ============
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  nameEn: text('nameEn'),
  description: text('description'),
  color: text('color'),
  icon: text('icon'),
  youtubeChannel: text('youtubeChannel'),
  order: integer('order').default(0).notNull(),
});

// ============ POSTS ============
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  slug: text('slug').unique().notNull(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  coverImage: text('coverImage'),
  categoryId: integer('categoryId').references(() => categories.id, {
    onDelete: 'set null',
  }),
  authorId: text('authorId').references(() => users.id, {
    onDelete: 'set null',
  }),
  youtubeVideoId: text('youtubeVideoId'),
  status: text('status', { enum: ['draft', 'published', 'archived'] })
    .default('published')
    .notNull(),
  featured: boolean('featured').default(false).notNull(),
  viewCount: integer('viewCount').default(0).notNull(),
  readingTime: integer('readingTime'),
  publishedAt: timestamp('publishedAt', { mode: 'date' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
});

// ============ TAGS ============
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
});

export const postTags = pgTable(
  'postTags',
  {
    postId: integer('postId')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    tagId: integer('tagId')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.postId, t.tagId] })]
);

// ============ COMMENTS ============
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  postId: integer('postId')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  parentId: integer('parentId'),
  content: text('content').notNull(),
  likeCount: integer('likeCount').default(0).notNull(),
  isDeleted: boolean('isDeleted').default(false).notNull(),
  isApproved: boolean('isApproved').default(true).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
});

export const commentLikes = pgTable(
  'commentLikes',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    commentId: integer('commentId')
      .notNull()
      .references(() => comments.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.commentId] })]
);

export const postLikes = pgTable(
  'postLikes',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    postId: integer('postId')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.postId] })]
);

// ============ RELATIONS ============
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  posts: many(posts),
  comments: many(comments),
  commentLikes: many(commentLikes),
  postLikes: many(postLikes),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
  postTags: many(postTags),
  postLikes: many(postLikes),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, { fields: [postTags.postId], references: [posts.id] }),
  tag: one(tags, { fields: [postTags.tagId], references: [tags.id] }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'commentReplies',
  }),
  replies: many(comments, { relationName: 'commentReplies' }),
  likes: many(commentLikes),
}));

export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  user: one(users, {
    fields: [commentLikes.userId],
    references: [users.id],
  }),
  comment: one(comments, {
    fields: [commentLikes.commentId],
    references: [comments.id],
  }),
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  user: one(users, { fields: [postLikes.userId], references: [users.id] }),
  post: one(posts, { fields: [postLikes.postId], references: [posts.id] }),
}));


// ============ NEWSLETTER ============
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  confirmedAt: timestamp('confirmed_at'),
  subscribedAt: timestamp('subscribed_at').defaultNow(),
  unsubscribeToken: text('unsubscribe_token').unique().notNull(),
});
