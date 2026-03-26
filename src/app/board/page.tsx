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
  { value: "all", label: "전체" },
  { value: "request", label: "🏪 이 가게도 올려주세요" },
  { value: "review", label: "⭐ 후기/추천" },
  { value: "suggest", label: "💡 기능 건의" },
  { value: "general", label: "💬 자유글" },
]

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
    let query = supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
    if (filterCat !== "all") {
      query = query.eq("category", filterCat)
    }
    const { data } = await query
    if (data) setPosts(data as Post[])
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
  }, [filterCat])

  const handleSubmit = async () => {
    if (!nickname.trim() || !content.trim()) {
      alert("닉네임과 내용을 입력해주세요!")
      return
    }
    setSubmitting(true)
    const { error } = await supabase.from("posts").insert({
      nickname: nickname.trim(),
      content: content.trim(),
      category,
    })
    if (error) {
      alert("등록 실패: " + error.message)
    } else {
      setNickname("")
      setContent("")
      setCategory("general")
      setShowWrite(false)
      fetchPosts()
    }
    setSubmitting(false)
  }

  const getCategoryLabel = (val: string) => {
    return CATEGORIES.find((c) => c.value === val)?.label || val
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "방금 전"
    if (mins < 60) return `${mins}분 전`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}시간 전`
    const days = Math.floor(hours / 24)
    return `${days}일 전`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <a href="/" className="text-2xl">←</a>
          <div>
            <h1 className="text-xl font-bold text-orange-700">📋 방문자 게시판</h1>
            <p className="text-xs text-gray-400">후기, 가게 요청, 건의사항을 남겨주세요!</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* 카테고리 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilterCat(cat.value)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition ${
                filterCat === cat.value
                  ? "bg-orange-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-orange-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 글쓰기 버튼 */}
        <button
          onClick={() => setShowWrite(!showWrite)}
          className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-orange-700 transition mb-4"
        >
          {showWrite ? "✕ 닫기" : "✏️ 글 작성하기"}
        </button>

        {/* 글쓰기 폼 */}
        {showWrite && (
          <div className="bg-white rounded-2xl border border-orange-200 p-4 mb-4 space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="예: 여의도직장인"
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                maxLength={20}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">분류</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {CATEGORIES.filter((c) => c.value !== "all").map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      category === cat.value
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-orange-100"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">내용</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={"자유롭게 작성해주세요!\n예: 여의도 ○○뷔페도 추가해주세요!"}
                rows={4}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-400 text-right">{content.length}/500</p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-orange-700 transition disabled:bg-gray-300"
            >
              {submitting ? "등록 중..." : "등록하기"}
            </button>
          </div>
        )}

        {/* 게시글 목록 */}
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-400 animate-pulse">불러오는 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📝</p>
            <p className="text-gray-500">아직 작성된 글이 없습니다.</p>
            <p className="text-gray-400 text-sm mt-1">첫 번째 글을 작성해보세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {getCategoryLabel(post.category)}
                    </span>
                    <span className="text-sm font-bold text-gray-800">{post.nickname}</span>
                  </div>
                  <span className="text-xs text-gray-400">{timeAgo(post.created_at)}</span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
