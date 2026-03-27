"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface Post {
  id: string
  nickname: string
  content: string
  category: string
  created_at: string
}

const CATEGORIES = [
  { label: "전체", value: "all" },
  { label: "이 가게도 올려주세요", value: "request" },
  { label: "후기/추천", value: "review" },
  { label: "기능 건의", value: "suggest" },
  { label: "자유글", value: "general" },
]

const CATEGORY_LABELS: Record<string, string> = {
  request: "이 가게도 올려주세요",
  review: "후기/추천",
  suggest: "기능 건의",
  general: "자유글",
}

function timeAgo(dateStr: string) {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return "방금 전"
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`
  return `${date.getMonth() + 1}/${date.getDate()}`
}

export default function BoardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showWrite, setShowWrite] = useState(false)
  const [nickname, setNickname] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("general")
  const [filterCat, setFilterCat] = useState("all")
  const [submitting, setSubmitting] = useState(false)

  const fetchPosts = async () => {
    setLoading(true)
    let query = supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(50)
    if (filterCat !== "all") {
      query = query.eq("category", filterCat)
    }
    const { data } = await query
    if (data) setPosts(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
  }, [filterCat])

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요!")
      return
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요!")
      return
    }
    setSubmitting(true)
    const { error } = await supabase.from("posts").insert({
      nickname: nickname.trim(),
      content: content.trim(),
      category,
    })
    setSubmitting(false)
    if (!error) {
      setContent("")
      setShowWrite(false)
      fetchPosts()
    } else {
      alert("등록 실패: " + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <a href="/" className="text-2xl">←</a>
          <div>
            <h1 className="text-xl font-bold text-gray-900">📋 게시판</h1>
            <p className="text-xs text-gray-500">가게추천 · 후기 · 자유글</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* 카테고리 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setFilterCat(c.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                filterCat === c.value
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* 글쓰기 버튼 */}
        <button
          onClick={() => setShowWrite(!showWrite)}
          className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold mb-4"
        >
          {showWrite ? "✕ 닫기" : "✏️ 글쓰기"}
        </button>

        {/* 글쓰기 폼 */}
        {showWrite && (
          <div className="bg-white rounded-2xl border p-4 mb-4 space-y-3">
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl text-black placeholder-gray-400"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl text-black bg-white"
            >
              {CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                <option key={c.value} value={c.value} className="text-black">
                  {c.label}
                </option>
              ))}
            </select>
            <textarea
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-xl text-black placeholder-gray-400 resize-none"
            />
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold disabled:bg-gray-300"
            >
              {submitting ? "등록 중..." : "등록하기"}
            </button>
          </div>
        )}

        {/* 게시글 목록 */}
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">불러오는 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-4">📝</p>
            <p className="text-gray-500">아직 게시글이 없습니다.</p>
            <p className="text-gray-400 text-sm mt-1">첫 번째 글을 작성해보세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {CATEGORY_LABELS[post.category] || post.category}
                  </span>
                  <span className="text-sm font-bold text-gray-900">{post.nickname}</span>
                  <span className="text-xs text-gray-500">{timeAgo(post.created_at)}</span>
                </div>
                <p className="text-gray-900 text-sm leading-relaxed">{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
