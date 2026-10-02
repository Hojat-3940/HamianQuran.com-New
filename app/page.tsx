"use client";

import { useEffect, useMemo, useState } from "react";

type Ayah = {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
  };
};

type ApiResponse = {
  code: number;
  status: string;
  data: {
    ayahs: Ayah[];
  };
};

const ARABIC_API =
  "https://api.alquran.cloud/v1/quran/quran-uthmani";

const PERSIAN_API =
  "https://api.alquran.cloud/v1/quran/fa.ansarian";

export default function Page() {
  const [arabic, setArabic] = useState<Ayah[]>([]);
  const [persian, setPersian] = useState<Ayah[]>([]);
  const [juz, setJuz] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuran() {
      try {
        setLoading(true);
        setError("");

        const [arabicResponse, persianResponse] =
          await Promise.all([
            fetch(ARABIC_API),
            fetch(PERSIAN_API),
          ]);

        if (!arabicResponse.ok || !persianResponse.ok) {
          throw new Error("خطا در دریافت قرآن");
        }

        const arabicData: ApiResponse =
          await arabicResponse.json();

        const persianData: ApiResponse =
          await persianResponse.json();

        setArabic(arabicData.data.ayahs);
        setPersian(persianData.data.ayahs);
      } catch {
        setError(
          "متأسفانه دریافت قرآن انجام نشد. لطفاً دوباره تلاش کنید."
        );
      } finally {
        setLoading(false);
      }
    }

    loadQuran();
  }, []);

  const verses = useMemo(() => {
    return arabic.filter((ayah) => ayah.juz === juz);
  }, [arabic, juz]);

  function getTranslation(number: number) {
    const item = persian.find(
      (ayah) => ayah.number === number
    );

    return item?.text || "";
  }

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#fafafa",
        color: "#222",
        padding: "16px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          maxWidth: "900px",
          margin: "0 auto 20px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            marginBottom: "8px",
          }}
        >
          قرآن کریم
        </h1>

        <p style={{ margin: 0 }}>
          ۳۰ جزء قرآن کریم با ترجمه فارسی
        </p>
      </header>

      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto 20px",
        }}
      >
        <label
          htmlFor="juz"
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
          }}
        >
          انتخاب جزء
        </label>

        <select
          id="juz"
          value={juz}
          onChange={(e) => setJuz(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            background: "#fff",
            fontSize: "16px",
          }}
        >
          {Array.from({ length: 30 }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              جزء {index + 1}
            </option>
          ))}
        </select>
      </section>

      {loading && (
        <div
          style={{
            maxWidth: "900px",
            margin: "40px auto",
            textAlign: "center",
          }}
        >
          در حال دریافت متن قرآن...
        </div>
      )}

      {error && (
        <div
          style={{
            maxWidth: "900px",
            margin: "30px auto",
            padding: "16px",
            background: "#fff",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <p>{error}</p>

          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            تلاش دوباره
          </button>
        </div>
      )}

      {!loading && !error && (
        <section
          style={{
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            جزء {juz}
          </h2>

          {verses.map((ayah, index) => {
            const translation = getTranslation(ayah.number);

            const previous =
              index > 0 ? verses[index - 1] : null;

            const newSurah =
              !previous ||
              previous.surah.number !== ayah.surah.number;

            return (
              <div key={ayah.number}>
                {newSurah && (
                  <div
                    style={{
                      marginTop: "28px",
                      marginBottom: "16px",
                      padding: "12px",
                      background: "#eee",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                  >
                    <strong>
                      سوره {ayah.surah.name}
                    </strong>

                    <div
                      style={{
                        marginTop: "4px",
                        fontSize: "13px",
                      }}
                    >
                      {ayah.surah.englishName}
                    </div>
                  </div>
                )}

                <article
                  style={{
                    background: "#fff",
                    borderRadius: "14px",
                    padding: "18px",
                    marginBottom: "14px",
                    boxShadow:
                      "0 1px 5px rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "27px",
                      lineHeight: 2.2,
                      textAlign: "right",
                      fontFamily:
                        "Amiri, Noto Naskh Arabic, serif",
                    }}
                  >
                    {ayah.text}

                    <span
                      style={{
                        fontSize: "18px",
                        marginRight: "10px",
                      }}
                    >
                      ﴿{ayah.numberInSurah}﴾
                    </span>
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid #eee",
                      marginTop: "14px",
                      paddingTop: "12px",
                      fontSize: "17px",
                      lineHeight: 2,
                      color: "#555",
                    }}
                  >
                    {translation}
                  </div>
                </article>
              </div>
            );
          })}

          {verses.length === 0 && (
            <p style={{ textAlign: "center" }}>
              آیه‌ای برای این جزء پیدا نشد.
            </p>
          )}
        </section>
      )}
    </main>
  );
}
