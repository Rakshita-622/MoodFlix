import React from 'react';

const AnalyticsDashboard: React.FC = () => {
  const charts = [
    {
      title: 'Genre Distribution Mapping',
      src: '/analytics/1_genres.png',
      desc: 'Visualizes the sheer volume of movies per genre strictly within the TMDB 5000 dataset. Proves that our Mood-to-Genre mapping relies on statistically heavy clusters.',
    },
    {
      title: 'Human Mood to Matrix Category Mapping',
      src: '/analytics/2_moods.png',
      desc: 'Represents the quantitative conversion between arbitrary human moods and rigorous structural dataset genres.',
    },
    {
      title: 'Cosine Similarity Distribution Curve',
      src: '/analytics/3_similarity.png',
      desc: 'Exposes the density distribution of our TF-IDF matrix. It mathematically proves the extreme rarity of high-similarity neighbors.',
    },
    {
      title: 'Vector Clustering Heatmap',
      src: '/analytics/4_heatmap.png',
      desc: 'A raw glimpse into the matrices. Highlights high-density 1.0 (True) correlation clusters across subsets to validate Euclidean mapping.',
    },
    {
      title: 'TF-IDF Heavyweight Keyword Vectors',
      src: '/analytics/5_tfidf.png',
      desc: 'Directly displays the mathematical TF-IDF term weights (Inverse Document Frequency) calculating exactly what words uniquely define a genre.',
    },
  ];

  return (
    <section className="bg-sage py-20 px-6 md:px-12 border-b-2 border-black" id="analytics">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <span
            className="inline-block px-4 py-1.5 mb-4 text-xs font-display font-bold bg-black text-yellow"
            style={{ borderRadius: '999px' }}
          >
            DATA VISUALIZATION
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-black">
            Behind the ML Engine
          </h2>
          <p className="font-body text-black/70 mt-4 max-w-2xl mx-auto">
            Directly generated via Python (Matplotlib & Seaborn) from our model's live TF-IDF prediction matrices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {charts.map((chart, idx) => (
            <div
              key={idx}
              className={`bg-white border-2 border-black p-6 flex flex-col items-center ${
                idx === 4 ? 'md:col-span-2' : ''
              }`}
              style={{
                borderRadius: '12px',
                boxShadow: '8px 8px 0px 0px #000',
              }}
            >
              <h3 className="font-display font-bold text-xl mb-4 w-full text-left">
                {idx + 1}. {chart.title}
              </h3>
              <img
                src={chart.src}
                alt={chart.title}
                className="w-full h-auto border-2 border-black mb-4 rounded bg-gray-50"
                loading="lazy"
              />
              <p className="font-body text-sm text-black/80 w-full leading-relaxed border-t-2 border-gray-100 pt-3">
                <strong>Insight:</strong> {chart.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnalyticsDashboard;
