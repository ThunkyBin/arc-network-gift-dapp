import React, { useEffect, useState } from "react";
import { Gift, Send, Heart, Star, Sparkles } from "lucide-react";

type GiftItem = {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  emoji: string;
  timestamp: string;
};

const GIFT_STORAGE_KEY = "arc-network-gifts";

const createGiftId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createDemoGift = (): GiftItem => ({
  id: "demo-1",
  sender: "Ahmet",
  receiver: "Ayşe",
  message: "İyi günler!",
  emoji: "🎉",
  timestamp: new Date().toLocaleString("tr-TR"),
});

const loadGifts = (): GiftItem[] => {
  if (typeof window === "undefined") {
    return [createDemoGift()];
  }

  const storedGifts = window.localStorage.getItem(GIFT_STORAGE_KEY);
  if (!storedGifts) {
    return [createDemoGift()];
  }

  try {
    const parsedGifts = JSON.parse(storedGifts);
    if (Array.isArray(parsedGifts)) {
      return parsedGifts as GiftItem[];
    }
  } catch {
    window.localStorage.removeItem(GIFT_STORAGE_KEY);
  }

  return [createDemoGift()];
};

const App: React.FC = () => {
  const [gifts, setGifts] = useState<GiftItem[]>(loadGifts);
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🎁");

  const emojis = ["🎁", "🎉", "💝", "🌟", "✨", "🎊", "🎈", "🌺"];

  useEffect(() => {
    window.localStorage.setItem(GIFT_STORAGE_KEY, JSON.stringify(gifts));
  }, [gifts]);

  const sendGift = () => {
    if (!sender.trim() || !receiver.trim() || !message.trim()) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }
    const newGift: GiftItem = {
      id: createGiftId(),
      sender: sender.trim(),
      receiver: receiver.trim(),
      message: message.trim(),
      emoji: selectedEmoji,
      timestamp: new Date().toLocaleString("tr-TR"),
    };
    setGifts([newGift, ...gifts]);
    setSender("");
    setReceiver("");
    setMessage("");
    alert(`✅ Hediye ${newGift.receiver}'ya gönderildi!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gift className="w-12 h-12 text-pink-500" />
            <h1 className="text-4xl font-bold text-gray-800">
              Arc Hediye Gönderici
            </h1>
          </div>
          <p className="text-gray-600">
            Arc Network üzerinde çalışan basit bir dApp (demo)
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Arc Testnet Aktif</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Send className="w-6 h-6 text-purple-500" />
            Yeni Hediye Gönder
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gönderen Adı
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="Adınızı girin"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Alıcı Adı
              </label>
              <input
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="Kime göndereceksiniz?"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mesajınız
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Sevgi dolu bir mesaj yazın..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Emoji Seçin
              </label>
              <div className="flex gap-3 flex-wrap">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    aria-label={`${emoji} hediyesini seç`}
                    aria-pressed={selectedEmoji === emoji}
                    className={`text-4xl p-3 rounded-xl transition transform hover:scale-110 ${
                      selectedEmoji === emoji
                        ? "bg-purple-200 shadow-lg scale-110"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={sendGift}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:shadow-2xl transform hover:scale-105 transition flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Hediye Gönder
            </button>
          </div>
        </div>

        {/* Liste */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            Gönderilen Hediyeler ({gifts.length})
          </h2>

          <div className="space-y-4">
            {gifts.map((gift) => (
              <div
                key={gift.id}
                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 hover:shadow-xl transition transform hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{gift.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Star
                        className="w-4 h-4 text-yellow-500"
                        fill="currentColor"
                      />
                      <span className="font-bold text-purple-700">
                        {gift.sender}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="font-bold text-pink-700">
                        {gift.receiver}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2 italic">
                      "{gift.message}"
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      {gift.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-white">
          <p className="text-sm opacity-90">
            ⚡ Arc Network üzerinde çalışan örnek bir dApp
          </p>
          <p className="text-xs opacity-75 mt-2">
            Bu uygulama eğitim amaçlıdır. Gerçek blockchain işlemleri yapmaz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
