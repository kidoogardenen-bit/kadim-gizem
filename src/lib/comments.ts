import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"

export interface CommentUser {
  id: string
  name: string | null
  image: string | null
  role?: string
}

export interface CommentRecord {
  id: number
  postId: number
  userId: string
  parentId: number | null
  content: string
  likeCount: number
  isDeleted: boolean
  isApproved: boolean
  createdAt: Date | string
  updatedAt: Date | string
  user: CommentUser
  likedByMe?: boolean
}

export interface CommentNode extends CommentRecord {
  replies: CommentNode[]
}

export function buildCommentTree(comments: CommentRecord[]): CommentNode[] {
  const map = new Map<number, CommentNode>()
  const roots: CommentNode[] = []

  for (const c of comments) {
    map.set(c.id, { ...c, replies: [] })
  }

  for (const c of comments) {
    const node = map.get(c.id)!
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.replies.push(node)
    } else {
      roots.push(node)
    }
  }

  const sortByDate = (a: CommentNode, b: CommentNode) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()

  roots.sort(sortByDate)
  for (const node of map.values()) {
    node.replies.sort(sortByDate)
  }

  return roots
}

export function formatCommentDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true, locale: tr })
}
