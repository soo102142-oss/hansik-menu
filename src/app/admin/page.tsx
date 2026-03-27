"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

const ADMIN_PASSWORD = "admin2024!"

interface Restaurant {
  id: string
  name: string
  address: string
  district: string
}

interface Post {
  id: string
  nickname: string
  content: string
  category: string
  created_at: string
}

interface DailyMenu {
  id: string
  menu_date: string
  items: string
  restaurant_id: string
  restaurants: { name: string } | null
}

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [tab, setTab] = useState<"restaurants" | "posts" | "menus">("restaurants")
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [menus, setMenus] = useState<DailyMenu[]>([])
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
    } else {
      alert("비밀번호가 틀렸습니다!")
    }
  }

  const fetchRestaurants = async () => {
    setLoading(true)
    const { data } = await supabase.from("restaurants").select("*").order("name")
    if (data) setRestaurants(data)
    setLoading(false)
  }

  const fetchPosts = async () => {
    setLoading(true)
    const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(100)
    if (data) setPosts(data)
    setLoading(false)
  }

  const fetchMenus = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("daily_menus")
      .select("id, menu_date, items, restaurant_id, restaurants (name)")
      .order("menu_date", { ascending: false })
      .limit(100)
    if (data) setMenus(data as unknown as DailyMenu[])
    setLoading(false)
  }

  useEffect(() => {
    if (!authenticated) return
    if (tab === "restaurants") fetchRestaurants()
    if (tab === "posts") fetchPosts()
    if (tab === "menus") fetchMenus()
  }, [authenticated, tab])

  const deleteRestaurant = async (id: string, name: string) => {
    if (!confirm(`"${name}" 식당을 삭제하시겠습니까?\n관련 메뉴도 모두 삭제됩니다!`)) return
    await supabase.from("daily_menus").delete().eq("restaurant_id", id)
    await supabase.from("restaurants").delete().eq("id", id)
    fetchRestaurants()
  }

  const deletePost = async (id: string) => {
    if (!confirm("이 게시글을 삭제하시겠습니까?")) return
    await supabase.from("posts").delete().eq("id", id)
    fetchPosts()
  }

  const deleteMenu = async (id: string) => {
    if (!confirm("이 메뉴를 삭제하시겠습니까?")) return
    await supabase.from("daily_menus").delete().eq("id", id)
    fetchMenus()
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-2">🔐 관리자</h1>
          <p className="text-sm text-gray-400 text-center mb-6">파워관리자 전용 페이지</p>
          <input
            type="password"
            placeholder="관리자 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full p-3 border border-gray-300 rounded-xl mb-4 text-black"
          />
          <button onClick={handleLogin} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold">
            로그인
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-red-600 text-white px-4 py-4 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-2xl">←</a>
            <h1 className="text-xl font-bold">🔐 파워관리자</h1>
          </div>
          <button onClick={() => setAuthenticated(false)} className="text-sm bg-red-800 px-3 py-1 rounded-lg">
            로그아웃
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex gap-2 mb-4">
          {(["restaurants", "posts", "menus"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm ${
                tab === t ? "bg-red-600 text-white" : "bg-white text-gray-600 border"
              }`}
            >
              {t === "restaurants" ? "🏪 식당 관리" : t === "posts" ? "📋 게시글 관리" : "📅 메뉴 관리"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">로딩 중...</div>
        ) : tab === "restaurants" ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">총 {restaurants.length}개 식당</p>
            {restaurants.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-black">{r.name}</p>
                  <p className="text-sm text-gray-500">{r.address}</p>
                  <p className="text-xs text-gray-400">{r.district}</p>
                </div>
                <button
                  onClick={() => deleteRestaurant(r.id, r.name)}
                  className="bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-200"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        ) : tab === "posts" ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">총 {posts.length}개 게시글</p>
            {posts.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border p-4 flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p.category}</span>
                    <span className="text-xs text-gray-400">{p.nickname}</span>
                  </div>
                  <p className="text-sm text-black">{p.content}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(p.created_at).toLocaleString("ko-KR")}</p>
                </div>
                <button
                  onClick={() => deletePost(p.id)}
                  className="bg-red-100 text-red-600 px-3 py-2 rounded-xl text-sm font-bold hover:bg-red-200 ml-3"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">총 {menus.length}개 메뉴</p>
            {menus.map((m) => (
              <div key={m.id} className="bg-white rounded-xl border p-4 flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{m.menu_date}</span>
                    <span className="font-bold text-sm text-black">{m.restaurants?.name || "알 수 없음"}</span>
                  </div>
                  <p className="text-sm text-gray-600">{m.items}</p>
                </div>
                <button
                  onClick={() => deleteMenu(m.id)}
                  className="bg-red-100 text-red-600 px-3 py-2 rounded-xl text-sm font-bold hover:bg-red-200 ml-3"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
