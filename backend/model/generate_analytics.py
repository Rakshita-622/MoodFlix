import os
import pickle
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.feature_extraction.text import TfidfVectorizer

# Ensure directories
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
FRONTEND_DIR = os.path.join(os.path.dirname(BASE_DIR), "frontend", "public", "analytics")
os.makedirs(FRONTEND_DIR, exist_ok=True)

# Pre-set Seaborn aesthetic
sns.set_theme(style="whitegrid", palette="muted")

def load_data():
    with open(os.path.join(DATA_DIR, "movies.pkl"), "rb") as f:
        movies = pickle.load(f)
    with open(os.path.join(DATA_DIR, "similarity.pkl"), "rb") as f:
        similarity = pickle.load(f)
    return movies, similarity

print("Loading ML models for analytics generation...")
df, sim = load_data()

# 1. Top 15 Genres
print("Generating 1. Top 15 Genres...")
plt.figure(figsize=(10, 6))
all_genres = pd.Series(" ".join(df['genres_parsed'].dropna()).split()).value_counts()
sns.barplot(x=all_genres.values[:15], y=all_genres.index[:15], palette="viridis")
plt.title("Top 15 Most Frequent Genres in TMDB 5000", fontweight="bold", fontsize=14)
plt.xlabel("Number of Movies")
plt.ylabel("Genre")
plt.tight_layout()
plt.savefig(os.path.join(FRONTEND_DIR, "1_genres.png"), dpi=150)
plt.close()

# 2. Mood to Genre Mapping
print("Generating 2. Mood to Genre Matrix...")
MOOD_GENRE_MAP = {
    "happy": "comedy", "sad": "drama", "excited": "action",
    "bored": "adventure", "romantic": "romance", "scared": "horror",
    "curious": "science fiction", "anxious": "thriller", "nostalgic": "animation"
}
mood_counts = {mood: df['genres_parsed'].str.lower().str.contains(genre, na=False).sum() 
               for mood, genre in MOOD_GENRE_MAP.items()}
plt.figure(figsize=(10, 5))
sns.barplot(x=list(mood_counts.values()), y=list(mood_counts.keys()), palette="magma")
plt.title("MoodFlix Dataset Mapping Coverage", fontweight="bold", fontsize=14)
plt.xlabel("Available Titles")
plt.ylabel("Human Mood")
plt.tight_layout()
plt.savefig(os.path.join(FRONTEND_DIR, "2_moods.png"), dpi=150)
plt.close()

# 3. Similarity Score Distribution
print("Generating 3. Similarity Score Density...")
plt.figure(figsize=(10, 5))
# Sample density to avoid memory explode
sample_sim = sim[:1000].ravel()
sns.histplot(sample_sim[sample_sim > 0.05], bins=50, kde=True, color="teal")
plt.title("Cosine Similarity Score Distribution Curve", fontweight="bold", fontsize=14)
plt.xlabel("Similarity Score")
plt.ylabel("Frequency")
plt.tight_layout()
plt.savefig(os.path.join(FRONTEND_DIR, "3_similarity.png"), dpi=150)
plt.close()

# 4. Heatmap Density
print("Generating 4. Cluster Heatmap...")
plt.figure(figsize=(10, 8))
# Grab a subset of Action and Comedy to show clustering natively
subset1 = df[df['genres_parsed'].str.contains("Action", na=False)].head(15).index
subset2 = df[df['genres_parsed'].str.contains("Comedy", na=False)].head(15).index
subset_idx = list(subset1) + list(subset2)
labels = df.loc[subset_idx, 'title'].str[:15].tolist()
sub_sim = sim[np.ix_(subset_idx, subset_idx)]

sns.heatmap(sub_sim, xticklabels=labels, yticklabels=labels, cmap="rocket_r", 
            linewidths=0.5, cbar_kws={"shrink": .8})
plt.title("Cosine Correlation Matrix (Action vs Comedy clusters)", fontweight="bold")
plt.tight_layout()
plt.savefig(os.path.join(FRONTEND_DIR, "4_heatmap.png"), dpi=150)
plt.close()

# 5. TF-IDF
print("Generating 5. TF-IDF Heavyweight Terms...")
tfidf = TfidfVectorizer(stop_words='english', max_features=1000)
tfidf_matrix = tfidf.fit_transform(df['content'])
feature_names = np.array(tfidf.get_feature_names_out())

genres = ["Action", "Comedy", "Drama", "Horror"]
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
axes = axes.flatten()

for i, g in enumerate(genres):
    mask = df['genres_parsed'].str.contains(g, na=False).values
    # Mean TFIDF score for this genre
    mean_scores = np.asarray(tfidf_matrix[mask].mean(axis=0)).flatten()
    top_indices = mean_scores.argsort()[-10:][::-1]
    
    sns.barplot(x=mean_scores[top_indices], y=feature_names[top_indices], ax=axes[i], palette="cubehelix")
    axes[i].set_title(f"TF-IDF Vectors: {g}", fontweight="bold")
    axes[i].set_xlabel("Term Weight")

plt.tight_layout()
plt.savefig(os.path.join(FRONTEND_DIR, "5_tfidf.png"), dpi=150)
plt.close()

print("SUCCESS! All 5 high-resolution native PNGs exported to frontend/public/analytics")
