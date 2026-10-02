"use client";

import { useState } from "react";

type Verse = {
  id: number;
  verse_key: string;
  text_uthmani: string;
};

function Box({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "16px",
        padding: "18px",
        marginBottom: "18px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <h2
        style={{
          margin: "0 0 16px",
          fontSize: "21px",
          fontWeight: "700",
        }}
      >
        {icon} {title}
      </h2>

      {children}
    </section>
  );
}

export default function HomePage() {
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadJuz(juzNumber: number) {
    setSelectedJuz(juzNumber);
    setVerses([]);
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.quran.com/api/v4/quran/verses/uthmani?juz_number=${juzNumber}&per_page=1000`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("خطا در دریافت قرآن");
      }

      const data = await response.json();

      setVerses(data.verses || []);
    } catch (err) {
      console.error(err);
      setError(
        "متأسفانه آیات دریافت نشد. لطفاً اتصال اینترنت را بررسی کنید."
      );
      setVerses([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#f7f7f7",
        padding: "16px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* عنوان سایت */}

        <header
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "24px 16px",
            marginBottom: "18px",
            textAlign: "center",
            border: "1px solid #ddd",
          }}
        >
          <h1
            style={{
              margin: "0 0 8px",
              fontSize: "28px",
            }}
          >
            قرآن کریم
          </h1>

          <p
            style={{
              margin: 0,
              color: "#777",
            }}
          >
            HamianQuran.com
          </p>
        </header>

        {/* ۳۰ جزء */}

        <Box title="۳۰ جزء قرآن کریم" icon="📖">
          <p
            style={{
              color: "#666",
              marginTop: 0,
              marginBottom: "16px",
            }}
          >
            برای مطالعه قرآن، یکی از ۳۰ جزء را انتخاب کنید.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(70px, 1fr))",
              gap: "8px",
            }}
          >
            {Array.from({ length: 30 }, (_, index) => {
              const number = index + 1;

              return (
                <button
                  key={number}
                  onClick={() => loadJuz(number)}
                  style={{
                    padding: "13px 6px",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                    background:
                      selectedJuz === number ? "#eee" : "#fff",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  جزء {number}
                </button>
              );
            })}
          </div>
        </Box>

        {/* نمایش آیات */}

        {selectedJuz !== null && (
          <Box
            title={`متن عربی جزء ${selectedJuz}`}
            icon="📜"
          >
            {loading && (
              <p
                style={{
                  textAlign: "center",
                  padding: "25px",
                  color: "#666",
                }}
              >
                در حال دریافت آیات جزء {selectedJuz}...
              </p>
            )}

            {error && (
              <p
                style={{
                  color: "#b00020",
                  textAlign: "center",
                }}
              >
                {error}
              </p>
            )}

            {!loading && !error && verses.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: "#777",
                }}
              >
                آیه‌ای برای نمایش پیدا نشد.
              </p>
            )}

            {!loading && verses.length > 0 && (
              <div>
                {verses.map((verse) => (
                  <div
                    key={verse.id}
                    style={{
                      padding: "18px 8px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "27px",
                        lineHeight: "2.2",
                        textAlign: "right",
                        fontFamily:
                          "Amiri, Arial, sans-serif",
                      }}
                    >
                      {verse.text_uthmani}
                    </div>

                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "13px",
                        color: "#777",
                      }}
                    >
                      ۝ {verse.verse_key}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Box>
        )}

        {/* صوت */}

        <Box title="صوت قرآن" icon="🔊">
          <p style={{ color: "#666" }}>
            پخش صوت را بعد از اینکه نمایش ۳۰ جزء را آزمایش
            کردیم، اضافه می‌کنیم.
          </p>
        </Box>

        {/* زبان */}

        <Box title="زبان" icon="🌐">
          <p style={{ color: "#666" }}>
            انتخاب زبان و ترجمه در مرحله بعد اضافه می‌شود.
          </p>
        </Box>

        {/* حمایت */}

        <Box title="حمایت از پروژه" icon="💰">
          <p style={{ color: "#666" }}>
            اطلاعات کیف پول تتر در مرحله بعد اضافه می‌شود.
          </p>
        </Box>

        <footer
          style={{
            textAlign: "center",
            padding: "25px 10px",
            color: "#777",
            fontSize: "14px",
          }}
        >
          © HamianQuran.com
        </footer>
      </div>
    </main>
  );
}
