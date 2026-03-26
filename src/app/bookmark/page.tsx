"use client"

import { useState, useEffect } from "react"

interface BookmarkItem {
  id: string
  name: string
  address: string
  price: string
}

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("bookmarks")
    if (saved) {
      setBookmarks(JSON.parse(saved))
    }
  }, [])

  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter((b) => b.id !== id)
    setBookmarks(updated)
    localStorage.setItem("bookmarks", JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <a href="/" className="text-2xl">←</a>
          <div>
            <h1 className="text-xl font-bold text-orange-700">⭐ 즐겨찾기</h1>
            <p className="text-xs text-gray-400">자주 가는 한식뷔페를 저장하세요</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">⭐</p>
            <p className="text-gray-500 font-medium">즐겨찾기한 가게가 없습니다</p>
            <p className="text-gray-400 text-sm mt-1">
              메인 페이지에서 가게 카드의 별 버튼을 눌러 추가하세요!
            </p>
            <a href="/" className="inline-block mt-4 bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-700 transition">
              메인으로 가기
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{b.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{b.address}</p>
                    {b.price && (
                      <span className="text-sm text-orange-600 font-medium">{b.price}원</span>
                    )}
                  </div>
                  <button
                    onClick={() => removeBookmark(b.id)}
                    className="text-yellow-500 text-2xl hover:text-gray-300 transition"
                  >
                    ⭐
                  </button>
                </div>
                <div className="flex gap-2 mt-3">
                  <a
                    href={"https://map.kakao.com/link/search/" + encodeURIComponent(b.name)}
                    target="_blank"
                    className="flex-1 text-center bg-yellow-400 text-yellow-900 py-2 rounded-xl text-sm font-medium"
                  >
                    카카오맵
                  </a>
                  <a
                    href={"https://map.naver.com/v5/search/" + encodeURIComponent(b.name)}
                    target="_blank"
                    className="flex-1 text-center bg-green-500 text-white py-2 rounded-xl text-sm font-medium"
                  >
                    네이버지도
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
